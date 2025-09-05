"use client";

import { useMemo, useState } from "react";
import { defaultPreferences } from "./defaultPreferences";

import { ThPreferences, CustomizableKeys } from "./preferences";
import { ThDirectionSetter } from "./ThDirectionSetter";
import { ThPreferencesContext } from "./ThPreferencesContext";

export function ThPreferencesProvider<T extends Partial<CustomizableKeys>>({
  value,
  children,
}: {
  value?: ThPreferences<T>;
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<ThPreferences<T>>(
    () => value || { ...defaultPreferences } as ThPreferences<T>
  );

  const contextValue = useMemo(() => ({
    preferences,
    update: (updater: (prev: ThPreferences<T>) => ThPreferences<T>) => {
      setPreferences(prev => updater({ ...prev }));
    },
  }), [preferences]);

  return (    
    <ThPreferencesContext.Provider value={ contextValue }>
      <ThDirectionSetter direction={ preferences.direction }>
        { children }
      </ThDirectionSetter>
    </ThPreferencesContext.Provider>
  );
}