"use client";

import { useContext } from "react";
import { ThPreferencesContext } from "../ThPreferencesContext";

export const usePreferences = () => {
  const context = useContext(ThPreferencesContext);
  
  if (!context) {
    throw new Error("usePreferences must be used within a ThPreferencesProvider");
  }
  
  return context;
}