"use client";

import { useContext } from "react";
import { ThPreferencesContext } from "../ThPreferencesContext";
import { ThPreferences, DefaultKeys, CustomizableKeys } from "../preferences";

type ThPreferencesContextType<T extends Partial<CustomizableKeys>> = {
  preferences: ThPreferences<T>;
  update: (updater: (prev: ThPreferences<T>) => ThPreferences<T>) => void;
};

export const usePreferences = <T extends Partial<CustomizableKeys> = DefaultKeys>(): ThPreferencesContextType<T> => {
  const context = useContext(ThPreferencesContext);
  
  if (!context) {
    throw new Error("usePreferences must be used within a ThPreferencesProvider");
  }
  
  return context;
};