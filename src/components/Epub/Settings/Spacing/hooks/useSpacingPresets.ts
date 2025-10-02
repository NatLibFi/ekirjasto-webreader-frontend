import { useCallback, useMemo, useEffect } from "react";

import { 
  ThSettingsKeys, 
  ThSpacingSettingsKeys, 
  ThSpacingPresetKeys, 
  ThLineHeightOptions, 
} from "@/preferences/models/enums";

import { defaultSpacingSettingsMain, defaultSpacingSettingsSubpanel } from "@/preferences/models/const";

import { usePlugins } from "@/components/Plugins/PluginProvider";
import { usePreferences } from "@/preferences/hooks/usePreferences";
import { usePreferenceKeys } from "@/preferences/hooks/usePreferenceKeys";

import { SpacingStateKey } from "@/lib/settingsReducer";
import { useAppSelector, useAppDispatch } from "@/lib";
import {
  resetSpacingSettings,
  setLetterSpacing,
  setLineHeight,
  setParagraphIndent,
  setParagraphSpacing,
  setWordSpacing,
  updateBaseValues
} from "@/lib/settingsReducer";

/**
 * Hook to determine if preset system should be active
 * Only active when component is both registered AND displayed
 * This allows us to correctly handle overrides for presets,
 * and states for spacing components
 */
export const useSpacingPresets = () => {
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const spacing = useAppSelector(state => state.settings?.spacing) || {};

  const { spacingSettingsComponentsMap } = usePlugins();
  const { reflowSpacingPresetKeys, fxlSpacingPresetKeys } = usePreferenceKeys();

  const { preferences } = usePreferences();

  const dispatch = useAppDispatch();

  const spacingKeys = useMemo(() => {
    return isFXL ? fxlSpacingPresetKeys : reflowSpacingPresetKeys;
  }, [isFXL, fxlSpacingPresetKeys, reflowSpacingPresetKeys]);

  // 1. Check if preset component is registered
  const isComponentRegistered = !!spacingSettingsComponentsMap?.[ThSettingsKeys.spacingPresets];

  // 2. Check if preset component is in display order
  const mainDisplayOrder = preferences.settings?.spacing?.main || defaultSpacingSettingsMain;
  const subPanelDisplayOrder = preferences.settings?.spacing?.subPanel || defaultSpacingSettingsSubpanel;

  const isInMainPanel = mainDisplayOrder.includes(ThSpacingSettingsKeys.spacingPresets);
  const isInSubPanel = subPanelDisplayOrder.includes(ThSpacingSettingsKeys.spacingPresets);
  const isDisplayed = (isInMainPanel || isInSubPanel) && spacingKeys.length > 0;

  // 3. Only apply presets if component is both registered AND displayed
  const shouldApplyPresets = isComponentRegistered && isDisplayed;

  // Populate baseValues when preset changes
  useEffect(() => {
    if (shouldApplyPresets && spacing.preset && spacing.preset !== ThSpacingPresetKeys.publisher && spacing.preset !== ThSpacingPresetKeys.custom) {
      const spacingConfig = preferences.settings?.spacing?.presets;
      if (spacingConfig?.keys) {
        const presetValues = spacingConfig.keys[spacing.preset as ThSpacingPresetKeys.tight | ThSpacingPresetKeys.balanced | ThSpacingPresetKeys.loose | ThSpacingPresetKeys.accessible];

        if (presetValues) {
          // Update baseValues for all keys in the preset
          Object.entries(presetValues).forEach(([key, value]) => {
            if (value !== undefined) {
              dispatch(updateBaseValues({ key: key as SpacingStateKey, value }));
            }
          });
        }
      }
    }
  }, [shouldApplyPresets, spacing.preset, preferences.settings?.spacing?.presets, dispatch]);

  // Get current state values at the hook level
  const letterSpacing = useAppSelector(state => state.settings?.letterSpacing);
  const lineHeight = useAppSelector(state => state.settings?.lineHeight);
  const lineLength = useAppSelector(state => state.settings?.lineLength);
  const paragraphIndent = useAppSelector(state => state.settings?.paragraphIndent);
  const paragraphSpacing = useAppSelector(state => state.settings?.paragraphSpacing);
  const wordSpacing = useAppSelector(state => state.settings?.wordSpacing);

  // Helper function to get base Redux state value for a setting key
  const getBaseReduxValue = (key: ThSpacingSettingsKeys): any => {
    switch (key) {
      case ThSpacingSettingsKeys.letterSpacing:
        return letterSpacing;
      case ThSpacingSettingsKeys.lineHeight:
        return lineHeight;
      case ThSpacingSettingsKeys.paragraphIndent:
        return paragraphIndent;
      case ThSpacingSettingsKeys.paragraphSpacing:
        return paragraphSpacing;
      case ThSpacingSettingsKeys.wordSpacing:
        return wordSpacing;
      default:
        return undefined;
    }
  };

  // Helper function to get default value for a setting key when no preset/custom value exists
  const getDefaultValue = (key: ThSpacingSettingsKeys): any => {
    switch (key) {
      case ThSpacingSettingsKeys.lineHeight:
        return ThLineHeightOptions.publisher;
      case ThSpacingSettingsKeys.paragraphIndent:
      case ThSpacingSettingsKeys.paragraphSpacing:
      case ThSpacingSettingsKeys.wordSpacing:
        return null;
      default:
        return null;
    }
  };

  // Helper function to get effective spacing value with proper return types
  // Function overloads for proper typing
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.letterSpacing): number | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.lineHeight): ThLineHeightOptions | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.paragraphIndent): number | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.paragraphSpacing): number | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.wordSpacing): number | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys): any {
    // If preset system is not active, return Redux state directly
    if (!shouldApplyPresets) {
      return getBaseReduxValue(key);
    }

    // Get current value using base + override logic
    const userOverride = spacing.userOverrides?.[key as SpacingStateKey];
    if (userOverride !== undefined) {
      return userOverride;
    }

    // Check if we have a base value for this key
    const baseValue = spacing.baseValues?.[key as SpacingStateKey];
    if (baseValue !== undefined) {
      return baseValue;
    }

    // If no base value exists, fetch from current preset
    if (spacing.preset && spacing.preset !== ThSpacingPresetKeys.publisher && spacing.preset !== ThSpacingPresetKeys.custom) {
      const spacingConfig = preferences.settings?.spacing?.presets;
      if (spacingConfig?.keys) {
        const presetValues = spacingConfig.keys[spacing.preset as ThSpacingPresetKeys.tight | ThSpacingPresetKeys.balanced | ThSpacingPresetKeys.loose | ThSpacingPresetKeys.accessible];
        const presetValue = presetValues?.[key as unknown as keyof typeof presetValues];

        if (presetValue !== undefined) {
          // Return preset value without dispatching during render
          // The baseValues will be populated later via useEffect
          return presetValue;
        }
      }
    }

    // Property not defined in preset - return appropriate default
    return getDefaultValue(key);
  }

  // Helper function to get reset spacing value (pure preset values, ignoring customizations)
  function getSpacingResetValue(key: ThSpacingSettingsKeys): any {
    if (!shouldApplyPresets) {
      return key === ThSpacingSettingsKeys.lineHeight ? ThLineHeightOptions.publisher : null;
    }

    if (spacing.preset) {
      // For custom preset, we want to clear any overrides and return the base value
      if (spacing.preset === ThSpacingPresetKeys.custom) {
        // Return the base value if it exists, otherwise return the default
        return spacing.baseValues?.[key as SpacingStateKey] ?? getDefaultValue(key);

        // For regular presets, return the preset value
      } else if (spacing.preset !== ThSpacingPresetKeys.publisher) {
        const spacingConfig = preferences.settings?.spacing?.presets;
        if (spacingConfig?.keys) {
        const presetValues = spacingConfig.keys[spacing.preset as ThSpacingPresetKeys.tight | ThSpacingPresetKeys.balanced | ThSpacingPresetKeys.loose | ThSpacingPresetKeys.accessible];
          const presetValue = presetValues?.[key as unknown as keyof typeof presetValues];
          if (presetValue !== undefined) {
            return presetValue;
          }
        }
      }
    }

    // For publisher preset or when no preset is selected, return the default value
    return getDefaultValue(key);
  }

  const getEffectiveSpacingValueCallback = useCallback(getEffectiveSpacingValue, [
    getEffectiveSpacingValue,
    shouldApplyPresets,
    spacing.preset,
    spacing.userOverrides,
    spacing.baseValues,
    preferences.settings?.spacing?.presets,
    letterSpacing,
    lineHeight,
    lineLength,
    paragraphIndent,
    paragraphSpacing,
    wordSpacing
  ]);

  const getSpacingResetValueCallback = useCallback(getSpacingResetValue, [
    shouldApplyPresets,
    spacing.preset,
    preferences.settings?.spacing?.presets
  ]);

  const canBeResetCallback = useCallback((key: ThSpacingSettingsKeys): boolean => {
    if (!shouldApplyPresets || !spacing.preset) return false;

    // For custom preset, can reset if current value is not null/undefined (has any value to reset)
    if (spacing.preset === ThSpacingPresetKeys.custom) {
      const effectiveValue = getEffectiveSpacingValue(key as any);
      return effectiveValue !== null && effectiveValue !== undefined;
    }

    // For other presets, can reset if current value differs from preset value
    const effectiveValue = getEffectiveSpacingValue(key as any);
    const resetValue = getSpacingResetValue(key);

    // Compare values - if different, can be reset
    if (effectiveValue === null && resetValue === null) return false;
    if (effectiveValue === undefined && resetValue === undefined) return false;

    return effectiveValue !== resetValue;
  }, [shouldApplyPresets, spacing.preset, spacing.userOverrides, getEffectiveSpacingValue, getSpacingResetValue]);

  // Spacing actions (automatically handle preset logic)

  const setLetterSpacingAction = useCallback((value: number | null) => {
    const payload: any = { value };
    if (shouldApplyPresets && spacing.preset) {
      payload.preset = spacing.preset;
    }
    dispatch(setLetterSpacing(payload));
  }, [dispatch, shouldApplyPresets, spacing.preset]);

  const setLineHeightAction = useCallback((value: ThLineHeightOptions) => {
    const payload: any = { value };
    if (shouldApplyPresets && spacing.preset) {
      payload.preset = spacing.preset;
    }
    dispatch(setLineHeight(payload));
  }, [dispatch, shouldApplyPresets, spacing.preset]);

  const setParagraphIndentAction = useCallback((value: number | null) => {
    const payload: any = { value };
    if (shouldApplyPresets && spacing.preset) {
      payload.preset = spacing.preset;
    }
    dispatch(setParagraphIndent(payload));
  }, [dispatch, shouldApplyPresets, spacing.preset]);

  const setParagraphSpacingAction = useCallback((value: number | null) => {
    const payload: any = { value };
    if (shouldApplyPresets && spacing.preset) {
      payload.preset = spacing.preset;
    }
    dispatch(setParagraphSpacing(payload));
  }, [dispatch, shouldApplyPresets, spacing.preset]);

  const setWordSpacingAction = useCallback((value: number | null) => {
    const payload: any = { value };
    if (shouldApplyPresets && spacing.preset) {
      payload.preset = spacing.preset;
    }
    dispatch(setWordSpacing(payload));
  }, [dispatch, shouldApplyPresets, spacing.preset]);

  const resetSpacingSettingsAction = useCallback(() => {    
    const payload: any = { value: null };
    if (shouldApplyPresets && spacing.preset) {
      payload.preset = spacing.preset;
    }
    dispatch(resetSpacingSettings(payload));
  }, [dispatch, shouldApplyPresets, spacing.preset]);

  return {
    currentPreset: spacing.preset,
    getEffectiveSpacingValue: getEffectiveSpacingValueCallback,
    getSpacingResetValue: getSpacingResetValueCallback,
    canBeReset: canBeResetCallback,
    setLetterSpacing: setLetterSpacingAction,
    setLineHeight: setLineHeightAction,
    setParagraphIndent: setParagraphIndentAction,
    setParagraphSpacing: setParagraphSpacingAction,
    setWordSpacing: setWordSpacingAction,
    resetSpacingSettings: resetSpacingSettingsAction
  };
};
