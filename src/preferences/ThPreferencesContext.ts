"use client";

import { createContext } from "react";
import { defaultPreferences } from "./defaultPreferences";
import { ThPreferences, CustomizableKeys } from "./preferences";

type ThPreferencesContextType<T extends Partial<CustomizableKeys>> = {
  preferences: ThPreferences<T>;
  update: (updater: (prev: ThPreferences<T>) => ThPreferences<T>) => void;
};

// Create a singleton context instance
export const ThPreferencesContext = createContext<ThPreferencesContextType<any>>({
  preferences: defaultPreferences,
  update: () => {},
});