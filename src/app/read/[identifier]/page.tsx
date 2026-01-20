"use client";

import { use, useEffect, useState, useRef } from "react";
import { StatefulReader } from "@/components/Epub";
import { StatefulLoader } from "@/components/StatefulLoader";
import { usePublication } from "@/hooks/usePublication";
import { useAppSelector } from "@/lib/hooks";
import { useRuntimeConfig } from "@/hooks/useRuntimeConfig";
import { jwtDecode } from "jwt-decode";
import { loadToken, clearToken, saveToken } from "@/helpers/storageHelper";

import "@/app/app.css";
import { promises } from "dns";

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
  const [authError, setAuthError] = useState<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const jwt2 = use(params).identifier;
  const isLoading = useAppSelector(state => state.reader.isLoading);
  const config = useRuntimeConfig();

  const validateToken = async (jwt2: string): Promise<Boolean> => {
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
    saveToken("session", { payload: "active", loanId: payload.loan_id, expiresAt: payload.expires * 1000});
    return true;
  };

  const createReadiumJwt = async (loanId: string): Promise<Boolean> => {
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

    saveToken("jwt3", {
      payload: jwt3,
      loanId: loanId,
      expiresAt: payload.exp * 1000,
    });
    setJwt3(jwt3);
    scheduleTokenRefresh();
    return true;
  };

  const checkSession = (): boolean => {
    const storageTokenSession = loadToken("session");
    if (storageTokenSession?.loanId && storageTokenSession?.payload === 'active') {
      return true;
    }
      return false;
  }

  const refreshToken = async () => {
    const loanId = loadToken("jwt3")?.loanId;


    if (!loanId || !(await createReadiumJwt(loanId))) {
      logout();
    }
  };

  const scheduleTokenRefresh = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    let expiresAtTime = loadToken("jwt3")?.expiresAt;

    if (!expiresAtTime) {
      return;
    }
    const timeUntilRefresh = Math.max(
      expiresAtTime - Date.now() - 5000,
      0
    );
    // Refresh immediately if expiring soon
    if (timeUntilRefresh <= 2000) {
      refreshToken();
      return;
    }

    refreshTimerRef.current = setTimeout(refreshToken, timeUntilRefresh);
  };

  const handleAuthError = (err: unknown) => {
    console.error("JWT verification failed:", err);
    setAuthError(err instanceof Error ? err.message : "Invalid or expired token");
    logout();

    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
  };

  const logout = () => {
    //do only when refresh fails
    clearToken("session");
    clearToken("jwt3");
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    console.log("logged out");
  };

  useEffect(() => {
    return () => {
      logout();
    };
  }, []);

  useEffect(() => {
    const auth = async (jwt2: string) => {
      if (!checkSession()) {      
        try {
          const validateResult = await validateToken(jwt2);
          if (!validateResult) return;
        } catch (err) {
          handleAuthError(err);
          return;
        }
      }
      const loanId = loadToken("session")?.loanId;
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
    const routeManifest = async () => {
      if (!config || !checkSession() || !jwt3) {
        return;
      }
      setManifestUrl(`${config.readiumProtocol}://${config.readiumServerUrl}:${config.readiumServerPort}/webpub/${jwt3}/manifest.json`);
    }
    routeManifest();
  }, [jwt3, config]);

  const { error, manifest, selfLink } = usePublication({
    url: (manifestUrl || ""),
    onError: (error) => {
      setAuthError(error);
      console.error("Publication loading error:", error);
    }
  });

  if (authError) {
    return (
      <div className="container">
        <h1>Authentication Error</h1>
        <p>{authError}</p>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="container">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      ) : checkSession() ? (
        <StatefulLoader isLoading={isLoading}>
          {manifest && selfLink && <StatefulReader rawManifest={manifest} selfHref={selfLink} />}
        </StatefulLoader>
      ) : null}
    </>
  );
}
