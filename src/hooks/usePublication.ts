"use client";

import { useEffect, useState } from "react";
import { Link } from "@readium/shared";
import { HttpFetcher } from "@readium/shared";

export interface UsePublicationOptions {
  url: string;
  allowedDomains?: string[];
  onError?: (error: string) => void;
}

export const usePublication = ({ 
  url, 
  allowedDomains, 
  onError = () => {} 
}: UsePublicationOptions) => {
  const [error, setError] = useState("");
  const [manifest, setManifest] = useState<object | undefined>(undefined);
  const [selfLink, setSelfLink] = useState<string | undefined>(undefined);

  // Basic URL validation and loading
  useEffect(() => {
    if (!url) {
      setError("Manifest URL is required");
      return;
    }

    // Decode URL if needed
    const decodedUrl = decodeURIComponent(url);
    
    const urlObj = new URL(decodedUrl);
    const domain = urlObj.hostname;
      
    if (allowedDomains?.length && !allowedDomains.includes(domain)) {
      const errorMsg = `Manifest from domain ${ domain } is not allowed`;
      setError(errorMsg);
      return;
    }
    
    const manifestLink = new Link({ href: decodedUrl });
    const fetcher = new HttpFetcher(undefined);

    try {
      const fetched = fetcher.get(manifestLink);
      
      // Get self-link first
      fetched.link().then((link) => {
        setSelfLink(link.toURL(decodedUrl));
      });

      // Then get manifest data
      fetched.readAsJSON().then((manifestData) => {
        setManifest(manifestData as object);
      }).catch((error) => {
        console.error("Error loading manifest:", error);
        setError(`Failed loading manifest ${ decodedUrl }: ${ error instanceof Error ? error.message : "Unknown error" }`);
      });
    } catch (error: unknown) {
      console.error("Error loading manifest:", error);
      setError(`Failed loading manifest ${ decodedUrl }: ${ error instanceof Error ? error.message : "Unknown error" }`);
    }
  }, [url, allowedDomains]);

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
