import { useCallback } from "react";
import { useAppSelector } from "@/lib";
import { usePreferences } from "@/preferences/hooks/usePreferences";

/**
 * Hook to handle margin calculations and preference submissions
 * This ensures consistent behavior between spacing presets and direct margin changes
 */
export const useMargin = () => {
  const { preferences } = usePreferences();
  const lineLength = useAppSelector(state => state.settings.lineLength);

  const getLineLengthValue = useCallback((
    setting: { chars?: number | null, isDisabled?: boolean } | number | null | undefined,
    fallback: number | null | undefined,
    def: number,
    multiplier: number
  ) => {
    if (setting === null || setting === undefined) return (fallback ?? def) * multiplier;
    if (typeof setting === "object") {
      if (setting.isDisabled) return null;
      return (setting.chars ?? fallback ?? def) * multiplier;
    }
    return (setting ?? fallback ?? def) * multiplier;
  }, []);

  const submitPreferencesWithMargin = useCallback(async (
    submitPreferences: (preferences: any) => Promise<void>,
    marginValue: number,
    additionalPreferences: any = {}
  ) => {
    await submitPreferences({
      minimalLineLength: getLineLengthValue(lineLength?.min, preferences.typography.minimalLineLength, 35, marginValue),
      optimalLineLength: getLineLengthValue(lineLength?.optimal, preferences.typography.optimalLineLength, 60, marginValue),
      maximalLineLength: getLineLengthValue(lineLength?.max, preferences.typography.maximalLineLength, 70, marginValue),
      pageGutter: preferences.typography.pageGutter / marginValue,
      ...additionalPreferences
    });
  }, [getLineLengthValue, lineLength, preferences.typography]);

  return {
    getLineLengthValue,
    submitPreferencesWithMargin
  };
};
