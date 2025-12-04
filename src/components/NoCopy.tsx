"use client";

import { useEffect } from "react";

export const  NoCopy = () => {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();

    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);

    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
    };
  }, []);

  return null; // renders nothing
}