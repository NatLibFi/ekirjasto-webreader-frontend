"use client";

import { RuntimeConfig } from "@/app/api/runtime-config/route";
import { useEffect, useState, useMemo } from "react";

export const useRuntimeConfig = () => {
  const [config, setConfig] = useState<RuntimeConfig | null>(null);

  useEffect(() => {
    fetch("/api/runtime-config")
      .then((res) => res.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  return useMemo(() => config, [config]);
};