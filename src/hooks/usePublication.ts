"use client";

import { useEffect, useState } from "react";
import { Link } from "@readium/shared";
import { HttpFetcher } from "@readium/shared";

export interface UsePublicationOptions {
  url: string;
  onError?: (error: string) => void;
}

export const usePublication = ({ 
  url, 
  onError = () => {} 
}: UsePublicationOptions) => {
  const [error, setError] = useState("");
  const [manifest, setManifest] = useState<object | undefined>(undefined);
  const [selfLink, setSelfLink] = useState<string | undefined>(undefined);

  // Basic URL validation and loading
  useEffect(() => {
    if (!url) {
      //setError("Manifest URL is required");
      console.log("manifest URL is required (usePublication)");
      return;
    }
    
    const manifestLink = new Link({ href: url });
    const fetcher = new HttpFetcher(undefined);

    try {
      const fetched = fetcher.get(manifestLink);
      
      // Get self-link first
      fetched.link().then((link) => {
        setSelfLink(link.toURL(url));
      });

      // Then get manifest data
      fetched.readAsJSON().then((manifestData) => {
        setManifest(manifestData as object);
      }).catch((error: unknown) => {
        console.error("Error loading manifest:", error);
        setError(`Failed loading manifest ${ url }: ${ error instanceof Error ? error.message : "Unknown error" }`);
      });
    } catch (error: unknown) {
      console.error("Error loading manifest:", error);
      setError(`Failed loading manifest ${ url }: ${ error instanceof Error ? error.message : "Unknown error" }`);
    }
  }, [url]);

  // Call onError callback when error changes
  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  return {
    error,
    manifest,
    selfLink
  };
}
