"use client";

import { useContext } from "react";
import { ThPreferencesContext } from "../ThPreferencesContext";
import { CustomizableKeys, DefaultKeys, ThPreferences } from "../preferences";

export function usePreferences<K extends CustomizableKeys = DefaultKeys>() {
  const context = useContext(ThPreferencesContext);
  
  if (!context) {
    throw new Error("usePreferences must be used within a ThPreferencesProvider");
  }
  
  return {
    preferences: context.preferences as ThPreferences<K>,
    updatePreferences: context.updatePreferences as (prefs: ThPreferences<K>) => void,
  };
}