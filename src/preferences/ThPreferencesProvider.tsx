"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ThPreferences } from "./preferences";

import { defaultPreferences } from "./defaultPreferences";

import { ThDirectionSetter } from "./ThDirectionSetter";
import { ThPreferencesContext } from "./ThPreferencesContext";

import { ThPreferencesAdapter } from "./adapters/ThPreferencesAdapter";
import { ThMemoryPreferencesAdapter } from "./adapters/ThMemoryPreferencesAdapter";
import type { ExtendedKeys } from "./ThPreferencesContext";

interface Props {
  adapter?: ThPreferencesAdapter<ExtendedKeys>;
  children: React.ReactNode;
}

export const ThPreferencesProvider = ({ 
  adapter,
  children, 
}: Props) => {
  // Create a default in-memory adapter if none is provided
  const effectiveAdapter = useMemo(() => {
    return adapter || new ThMemoryPreferencesAdapter<ExtendedKeys>(
      defaultPreferences as ThPreferences<ExtendedKeys>
    );
  }, [adapter]);
  
  const [preferences, setPreferences] = useState<ThPreferences<ExtendedKeys>>(() => 
    effectiveAdapter.getPreferences() as ThPreferences<ExtendedKeys>
  );

  // Handle preference changes
  const handlePreferenceChange = useCallback((newPrefs: ThPreferences<ExtendedKeys>) => {
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

  const contextValue = useMemo(() => ({
    preferences,
    updatePreferences: (newPrefs: ThPreferences<ExtendedKeys>) => {
      effectiveAdapter.setPreferences(newPrefs);
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