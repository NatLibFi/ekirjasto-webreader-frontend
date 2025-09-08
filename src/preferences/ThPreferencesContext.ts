"use client";

import { createContext } from "react";
import { defaultPreferences } from "./defaultPreferences";
import { ThPreferences, CustomizableKeys, DefaultKeys } from "./preferences";

export type ExtendedKeys = CustomizableKeys & DefaultKeys;

export interface PreferencesContextValue {
  preferences: ThPreferences<ExtendedKeys>;
  updatePreferences: (prefs: ThPreferences<ExtendedKeys>) => void;
}

const defaultValue: PreferencesContextValue = {
  preferences: defaultPreferences as ThPreferences<ExtendedKeys>,
  updatePreferences: () => {
    throw new Error('updatePreferences must be used within a ThPreferencesProvider with an adapter');
  },
};

export const ThPreferencesContext = createContext<PreferencesContextValue>(defaultValue);