"use client";

import { use, useEffect, useCallback, useState, useRef } from "react";
import { ErrorDisplay } from "@/components/Misc";
import { PUBLICATION_MANIFESTS } from "@/config/publications";
import { usePublication } from "@/hooks/usePublication";
import { useAppSelector } from "@/lib/hooks";
import { verifyManifestUrl } from "@/app/api/verify-manifest/verifyDomain";
import { StatefulReaderWrapper } from "@/components/Reader/StatefulReaderWrapper";
import { ErrorHandler, ProcessedError } from "@/helpers/errorHandler";
import { useRuntimeConfig } from "@/hooks/useRuntimeConfig";
import { jwtDecode } from "jwt-decode";
import { loadToken, clearToken, saveToken } from "@/helpers/storageHelper";

type Params = { identifier: string };

type Props = {
  params: Promise<Params>;
};

type jwt2Payload = {
  loan_id: string;
  isbn: string;
  nonce: string;
  expires: number;
}

type jwt3Payload = {
  loan_id: string;
  exp: number;
  iat: number;
  jti: string;
  sub: string;
}

export default function BookPage({ params }: Props) {
  const [jwt3, setJwt3] = useState<string | null>(null);
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const [authError, setAuthError] = useState<ProcessedError | null>(null);
  const [domainError, setDomainError] = useState<ProcessedError | null>(null);

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleTokenRefreshRef = useRef<(() => void) | null>(null);
  const {identifier} = use(params);
  const jwt2 = identifier;

  const isLoading = useAppSelector(state => state.reader.isLoading);
  const config = useRuntimeConfig();

  const validateToken = useCallback(async (jwt2: string): Promise<Boolean> => {
    if (!config) return false;
    const validateResponse = await fetch(config.linkServerUrl + "/validate.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: jwt2,
      }),
    });

    if (!validateResponse || validateResponse.status !== 200) {
      throw new Error(`HTTP validate ${validateResponse.status}`);
    }
    const payload = jwtDecode<jwt2Payload>(jwt2);
    saveToken(jwt2, { payload: "active", loanId: payload.loan_id, expiresAt: payload.expires * 1000 });
    return true;
  }, [config]);

  const logout = useCallback(() => {
    clearToken(jwt2);
    clearToken("jwt3" + jwt2);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    const processedAuthError = ErrorHandler.process(
      new Error("Session expired"),
      "Authentication"
    );
    setAuthError(processedAuthError);
  }, [jwt2]);

  const handleAuthError = useCallback((err: unknown) => {
    const processedAuthError = ErrorHandler.process(
      new Error(err instanceof Error ? err.message : "Invalid or expired token"),
      "Authentication"
    );
    setAuthError(processedAuthError);
    logout();

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
  }, [logout]);

  const checkSession = useCallback((): boolean => {
    const storageTokenSession = loadToken(jwt2);
    if (storageTokenSession?.loanId && storageTokenSession?.payload === 'active') {
      return true;
    }
    return false;
  }, [jwt2]);

  const createReadiumJwt = useCallback(async (loanId: string): Promise<Boolean> => {
    if (!config) return false;
    const createJwt3 = await fetch(config.linkServerUrl + "/create.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loan: loanId,
        type: "readium",
      }),
    });

    if (!createJwt3.ok) {
      throw new Error(`Failed to create JWT: ${createJwt3.statusText}`);
    }
    const data = await createJwt3.json();
    const jwt3 = data.token;

    if (!jwt3) {
      throw new Error("No token returned from server");
    }
    const payload = jwtDecode<jwt3Payload>(jwt3);

    saveToken("jwt3"+jwt2, {
      payload: jwt3,
      loanId: loanId,
      expiresAt: payload.exp * 1000,
    });
    setJwt3(jwt3);
    scheduleTokenRefreshRef.current?.();
    return true;
  }, [config, jwt2]);

  const refreshToken = useCallback(async () => {
    const loanId = loadToken("jwt3"+jwt2)?.loanId;
    if (!loanId || !(await createReadiumJwt(loanId))) {
      handleAuthError(new Error("Failed to refresh jwt"));
    }
  }, [createReadiumJwt, handleAuthError, jwt2]);

  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    let expiresAtTime = loadToken("jwt3"+jwt2)?.expiresAt;

    if (!expiresAtTime) {
      handleAuthError(new Error("No expiration time found for session token"));
      return;
    }
    const timeUntilRefresh = Math.max(
      expiresAtTime - Date.now() - 5000,
      0
    );
    if (timeUntilRefresh <= 2000) {
      refreshToken();
      return;
    }

    refreshTimerRef.current = setTimeout(refreshToken, timeUntilRefresh);
  }, [refreshToken, handleAuthError,jwt2]);
  
  useEffect(() => {
    console.log('Schedule token refresh effect triggered');
    scheduleTokenRefreshRef.current = scheduleTokenRefresh;
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    console.log('Auth effect triggered');
    const auth = async (jwt2: string) => {
      let session = checkSession();
      if (!session) {
        try {
          const validateResult = await validateToken(jwt2);
          if (!validateResult) return;
          session = checkSession();
        } catch (err) {
          handleAuthError(err);
          return;
        }
      }
      if (session) {
        const storedJwt3 = loadToken("jwt3"+jwt2);
        if (storedJwt3) {
          setJwt3(storedJwt3.payload as string);
          scheduleTokenRefreshRef.current?.();
          return;
        }
      }
      const loanId = loadToken(jwt2)?.loanId;
      if (!loanId) {
        handleAuthError(new Error("No loan ID found in session token"));
        return;
      }
      try {
        const createResult = await createReadiumJwt(loanId);
        if (!createResult) return;
      } catch (err) {
        handleAuthError(err);
        return;
      }
    };
    auth(jwt2);
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [jwt2, config, createReadiumJwt, handleAuthError, validateToken]);

  useEffect(() => {
    console.log('Manifest routing effect triggered');
    const routeManifest = async () => {
      if (!config || !checkSession() || !jwt3) {
        return;
      }
      setManifestUrl(`${config.readiumProtocol}://${config.readiumServerUrl}:${config.readiumServerPort}/webpub/${jwt3}/manifest.json`);
    }
    routeManifest();
  }, [jwt3, config]);

  // useEffect(() => {
  //   if (manifestUrl) {
  //     verifyManifestUrl(manifestUrl).then(allowed => {
  //       if (!allowed) {
  //         const processedDomainError = ErrorHandler.process(
  //           new Error("Domain not allowed"), 
  //           "Domain Validation"
  //         );
  //         setDomainError(processedDomainError);
  //       }
  //     });
  //   }
  // }, [manifestUrl]);

  const {isbn, loan_id} = jwtDecode<jwt2Payload>(jwt2);

  const { 
    isLoading: publicationLoading, 
    error, 
    publication, 
    profile,
    localDataKey
  } = usePublication({
    isbn : isbn,
    loan_id: loan_id,
    url: manifestUrl,
    onError: (error) => {
      const processedAuthError = ErrorHandler.process(
        new Error(error.original instanceof Error ? error.original.message : "Failed to load publication"),
        "Authentication"
      );
      setAuthError(processedAuthError);
      console.error("Publication loading error:", error);
    }
  });

  if (domainError) {
    return (
      <ErrorDisplay 
        error={ domainError }
      />
    );
  }

  if (authError) {
    return (
      <ErrorDisplay 
        error={ authError }
      />
    );
  }

  return (
    <>
      { error ? (
        <ErrorDisplay error={ error } />
      ) : publication ? (
        <StatefulReaderWrapper
          profile={ profile }
          publication={ publication }
          localDataKey={ localDataKey }
          isLoading={ isLoading || publicationLoading }
        />
      ) : null }
    </>
  );
}