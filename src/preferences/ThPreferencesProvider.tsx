"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ThPreferences, CustomizableKeys, DefaultKeys } from "./preferences";
import { ThPreferencesContext, defaultPreferencesContextValue } from "./ThPreferencesContext";

import { ThPreferencesAdapter } from "./adapters/ThPreferencesAdapter";
import { ThMemoryPreferencesAdapter } from "./adapters/ThMemoryPreferencesAdapter";
import { ThDirectionSetter } from "./ThDirectionSetter";

type Props<K extends CustomizableKeys = DefaultKeys> = {
  adapter?: ThPreferencesAdapter<K>;
  initialPreferences?: ThPreferences<K>;
  children: React.ReactNode;
};

export function ThPreferencesProvider<K extends CustomizableKeys = DefaultKeys>({ 
  adapter,
  initialPreferences,
  children, 
}: Props<K>) {
  // Create a default in-memory adapter if none is provided
  const effectiveAdapter = useMemo(() => {
    return adapter || new ThMemoryPreferencesAdapter<K>(
      (initialPreferences as ThPreferences<K>) || (defaultPreferencesContextValue.preferences as ThPreferences<K>)
    );
  }, [adapter, initialPreferences]);
  
  const [preferences, setPreferences] = useState<ThPreferences<K>>(
    (initialPreferences || defaultPreferencesContextValue.preferences) as ThPreferences<K>
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
    preferences,
    updatePreferences: (newPrefs: ThPreferences<K>) => {
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