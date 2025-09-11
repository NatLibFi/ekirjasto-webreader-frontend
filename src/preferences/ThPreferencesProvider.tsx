"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ThPreferences, CustomizableKeys } from "./preferences";

import { defaultPreferences } from "./defaultPreferences";

import { ThDirectionSetter } from "./ThDirectionSetter";
import { ThPreferencesContext } from "./ThPreferencesContext";

import { ThPreferencesAdapter } from "./adapters/ThPreferencesAdapter";
import { ThMemoryPreferencesAdapter } from "./adapters/ThMemoryPreferencesAdapter";
import type { ExtendedKeys } from "./ThPreferencesContext";

type Props<K extends CustomizableKeys> = {
  adapter?: ThPreferencesAdapter<K>;
  initialPrefs?: ThPreferences<K>;
  children: React.ReactNode;
};

export const ThPreferencesProvider = <K extends CustomizableKeys = ExtendedKeys>({ 
  adapter,
  initialPrefs,
  children, 
}: Props<K>) => {
  // Create a default in-memory adapter if none is provided
  const effectiveAdapter = useMemo(() => {
    return adapter || new ThMemoryPreferencesAdapter<K>(
      (initialPrefs as ThPreferences<K>) ?? (defaultPreferences as ThPreferences<K>)
    );
  }, [adapter, initialPrefs]);
  
  const [preferences, setPreferences] = useState<ThPreferences<K>>(() => 
    effectiveAdapter.getPreferences()
  );

  // Handle preference changes
  const handlePreferenceChange = useCallback((newPrefs: ThPreferences<K>) => {
    setPreferences(prev => {
      // Only update if preferences actually changed
      return JSON.stringify(prev) === JSON.stringify(newPrefs) ? prev : newPrefs;
    });
  }, []);

  // Set up and clean up subscription to preference changes
  useEffect(() => {
    // Set up the subscription
    effectiveAdapter.subscribe(handlePreferenceChange);
    
    // Clean up the subscription when the component unmounts or dependencies change
    return () => {
      effectiveAdapter.unsubscribe(handlePreferenceChange);
    };
  }, [effectiveAdapter, handlePreferenceChange]);

  // Provide current app context typing
  const contextValue = useMemo(() => ({
    preferences: preferences as ThPreferences<ExtendedKeys>,
    updatePreferences: (newPrefs: ThPreferences<ExtendedKeys>) => {
      effectiveAdapter.setPreferences(newPrefs as ThPreferences<K>);
    },
  }), [preferences, effectiveAdapter]);

  return (
    <ThPreferencesContext.Provider value={ contextValue }>
      <ThDirectionSetter direction={ preferences.direction }>
        { children }
      </ThDirectionSetter>
    </ThPreferencesContext.Provider>
  );
}