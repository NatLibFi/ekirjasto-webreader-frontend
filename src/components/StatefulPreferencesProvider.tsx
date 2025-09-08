"use client";

import { ReactNode, useMemo } from "react";
import { useStore } from "react-redux";

import { DefaultKeys, ThPreferences } from "@/preferences/preferences";
import { defaultPreferences } from "@/preferences/defaultPreferences";

import { ThPreferencesProvider } from "@/preferences/ThPreferencesProvider";
import { ReduxPreferencesAdapter } from "@/lib/ReduxPreferencesAdapter";

import { RootState } from "@/lib/store";

export const StatefulPreferencesProvider = ({ 
  children,
  initialPrefs = defaultPreferences as ThPreferences<DefaultKeys>
}: { 
  children: ReactNode;
  initialPrefs?: ThPreferences<DefaultKeys>;
}) => {
  const store = useStore<RootState>();
  
  const adapter = useMemo(() => {
    return new ReduxPreferencesAdapter<DefaultKeys>(store, initialPrefs);
  }, [store, initialPrefs]);
  
  return (
    <ThPreferencesProvider adapter={ adapter }>
      { children }
    </ThPreferencesProvider>
  );
}
