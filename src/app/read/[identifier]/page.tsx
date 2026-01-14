"use client";

import { use, useEffect, useState } from "react";
import { StatefulReader } from "@/components/Epub";
import { StatefulLoader } from "@/components/StatefulLoader";
import { usePublication } from "@/hooks/usePublication";
import { useAppSelector } from "@/lib/hooks";
import { useRuntimeConfig } from "@/hooks/useRuntimeConfig";
import { jwtDecode } from "jwt-decode";


import "@/app/app.css";

type Params = { identifier: string };

type Props = {
  params: Promise<Params>;
};

export default function BookPage({ params }: Props) {
  const [jwt3, setJwt3] = useState<string | null>(null);
  const [session, setSession] = useState<boolean | null>(null);
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const identifier = use(params).identifier;
  const isLoading = useAppSelector(state => state.reader.isLoading);
  const config = useRuntimeConfig();

  const jwt2 = identifier;

  useEffect(() => {
    if (!jwt2 || !config) return;

    const verifyJwt = async (jwt2: string) => {
      try {
        const validateResponse = await fetch(config.linkServerUrl +"/validate.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: jwt2,
          }),

        });

        if (!validateResponse || validateResponse.status !== 200) {
          throw new Error(`HTTP validate ${validateResponse.status}`);
        }

        const payload = jwtDecode<{ loan_id: string }>(jwt2);
        const loanId = payload.loan_id;

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
          setAuthError(`Failed to create JWT: ${createJwt3.statusText}`);
          throw new Error(`HTTP create ${createJwt3.status}`);
        }

        const data = await createJwt3.json();
        const token = data.token;

        if (token) {
            setSession(true);
            setJwt3(token);
          } else {
            setAuthError("No token returned from server");
            console.error("No token received");
            setJwt3(null);
          }
        
        //response.status === 200, success nothing to do 
      } catch (err) {
        console.error("JWT verification failed:", err);
        setAuthError("Invalid or expired token");
        setJwt3(null);
      
      }
    }
    verifyJwt(jwt2);
    return () => {
      setSession(false);
    };
  }, [jwt2, config]);

  useEffect(() => {
    const routeManifest = async () => {
      if (!jwt3 || !config || !session) {
        setSession(false);
        return;
      }
      setManifestUrl(`${config.readiumProtocol}://${config.readiumServerUrl}:${config.readiumServerPort}/webpub/${jwt3}/manifest.json`);
    }
    routeManifest();
    return () => {
      setSession(false);
    };
  }, [jwt3, config, session]);



  const { error, manifest, selfLink } = usePublication({
    url: encodeURIComponent(manifestUrl || ""),
    onError: (error) => {
      //I wonder what goes here
      setAuthError(error);
      console.error("Publication loading error:", error);
    }
  });

  if (authError) {
    return (
      <div className="container">
        <h1>Authentication Error</h1>
        <p>{ authError }</p>
      </div>
    );
  }

  return (
    <>
      { error ? (
        <div className="container">
          <h1>Error</h1>
          <p>{ error }</p>
        </div>
      ) : (
        <StatefulLoader isLoading={ isLoading }>
          { manifest && selfLink && <StatefulReader rawManifest={ manifest } selfHref={ selfLink } /> }
        </StatefulLoader>
      )}
    </>
  );
}
