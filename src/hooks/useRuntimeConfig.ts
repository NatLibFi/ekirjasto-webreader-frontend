"use client";

import { useEffect, useState } from "react";

export const useRuntimeConfig = () => {
  const [config, setConfig] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/runtime-config")
      .then((res) => res.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  return config;
};