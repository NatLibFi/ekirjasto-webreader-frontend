"use client";

import { useContext } from "react";
import { ThPreferencesContext } from "../ThPreferencesContext";

import type { PreferencesContextValue } from "../ThPreferencesContext";

export const usePreferences = (): PreferencesContextValue => {
  const context = useContext(ThPreferencesContext);
  
  if (!context) {
    throw new Error("usePreferences must be used within a ThPreferencesProvider");
  }
  
  return context;
}