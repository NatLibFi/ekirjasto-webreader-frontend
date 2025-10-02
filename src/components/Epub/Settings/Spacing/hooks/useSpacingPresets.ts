import { useCallback, useMemo } from "react";

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
  setWordSpacing
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

    // When preset system is active, check for custom overrides first
    const customValue = spacing.custom?.[key as SpacingStateKey];
    if (customValue !== undefined) {
      return customValue;
    }

    // Get preset values if preset system is active
    if (spacing.preset) {
      const spacingConfig = preferences.settings?.spacing?.presets;
      if (spacingConfig?.keys) {
        // Preferences spacing presets exclude publisher and custom so we know we won’t find them
        if (spacing.preset !== ThSpacingPresetKeys.publisher && spacing.preset !== ThSpacingPresetKeys.custom) {
          const presetValues = spacingConfig.keys[spacing.preset as ThSpacingPresetKeys.tight | ThSpacingPresetKeys.balanced | ThSpacingPresetKeys.loose | ThSpacingPresetKeys.accessible];
          const presetValue = presetValues?.[key as unknown as keyof typeof presetValues];

          if (presetValue !== undefined) {
            return presetValue;
          }
        }
      }

      // Property not defined in preset - return appropriate default
      return getDefaultValue(key);
    }

    // Fallback to Redux state if no preset or custom value
    return getBaseReduxValue(key);
  }

  // Helper function to get reset spacing value (pure preset values, ignoring customizations)
  function getSpacingResetValue(key: ThSpacingSettingsKeys): any {
    if (!shouldApplyPresets) {
      return key === ThSpacingSettingsKeys.lineHeight ? ThLineHeightOptions.publisher : null;
    }

    if (spacing.preset) {
      const spacingConfig = preferences.settings?.spacing?.presets;
      if (spacingConfig?.keys && spacing.preset !== ThSpacingPresetKeys.publisher && spacing.preset !== ThSpacingPresetKeys.custom) {
        const presetValues = spacingConfig.keys[spacing.preset as ThSpacingPresetKeys.tight | ThSpacingPresetKeys.balanced | ThSpacingPresetKeys.loose | ThSpacingPresetKeys.accessible];
        const presetValue = presetValues?.[key as unknown as keyof typeof presetValues];
        if (presetValue !== undefined) {
          return presetValue;
        }
      }
      return getDefaultValue(key);
    }
    return getDefaultValue(key);
  }

  const getEffectiveSpacingValueCallback = useCallback(getEffectiveSpacingValue, [
    getEffectiveSpacingValue,
    shouldApplyPresets, 
    spacing.preset, 
    spacing.custom, 
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
    setLetterSpacing: setLetterSpacingAction,
    setLineHeight: setLineHeightAction,
    setParagraphIndent: setParagraphIndentAction,
    setParagraphSpacing: setParagraphSpacingAction,
    setWordSpacing: setWordSpacingAction,
    resetSpacingSettings: resetSpacingSettingsAction
  };
};
