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

import { useAppSelector, useAppDispatch } from "@/lib";
import {
  SpacingStateKey,
  setLetterSpacing,
  setLineHeight,
  setParagraphIndent,
  setParagraphSpacing,
  setPublisherStyles,
  setSpacingPreset,
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
  const spacing = useAppSelector(state => state.settings?.spacing) || { preset: ThSpacingPresetKeys.publisher, custom: {}, baseline: {} };

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
      case ThSpacingSettingsKeys.letterSpacing:
      case ThSpacingSettingsKeys.paragraphIndent:
      case ThSpacingSettingsKeys.paragraphSpacing:
      case ThSpacingSettingsKeys.wordSpacing:
        return null;
      default:
        return null;
    }
  };

  // Helper function to get preset value for a setting key
  const getPresetValue = useCallback((presetKey: ThSpacingPresetKeys, settingKey: ThSpacingSettingsKeys): any => {
    if (presetKey === ThSpacingPresetKeys.custom) {
      return spacing.custom?.[settingKey as SpacingStateKey];
    }

    // Only try to get from config for presets that have defined values
    if (presetKey !== ThSpacingPresetKeys.publisher) {
      const spacingConfig = preferences.settings.spacing?.presets;
      if (spacingConfig?.keys) {
        const presetValues = spacingConfig.keys[presetKey as ThSpacingPresetKeys.tight | ThSpacingPresetKeys.balanced | ThSpacingPresetKeys.loose | ThSpacingPresetKeys.accessible];
        const presetValue = presetValues?.[settingKey as unknown as keyof typeof presetValues];
        if (presetValue !== undefined) {
          return presetValue;
        }
      }
    }

    return getDefaultValue(settingKey);
  }, [preferences.settings.spacing?.presets, spacing.custom]);

  const getPresetValuesCallback = useCallback((presetKey: ThSpacingPresetKeys) => {
    return {
      [ThSpacingSettingsKeys.letterSpacing]: getPresetValue(presetKey, ThSpacingSettingsKeys.letterSpacing),
      [ThSpacingSettingsKeys.lineHeight]: getPresetValue(presetKey, ThSpacingSettingsKeys.lineHeight),
      [ThSpacingSettingsKeys.paragraphIndent]: getPresetValue(presetKey, ThSpacingSettingsKeys.paragraphIndent),
      [ThSpacingSettingsKeys.paragraphSpacing]: getPresetValue(presetKey, ThSpacingSettingsKeys.paragraphSpacing),
      [ThSpacingSettingsKeys.wordSpacing]: getPresetValue(presetKey, ThSpacingSettingsKeys.wordSpacing),
    };
  }, [getPresetValue]);

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

    if (spacing.preset === ThSpacingPresetKeys.custom) {
      const customValue = spacing.custom[key as SpacingStateKey];
      if (customValue !== undefined) {
        return customValue;
      }
      return getDefaultValue(key);
    }

    return getPresetValue(spacing.preset, key);
  };

  // Helper function to get reset spacing value (pure preset values, ignoring customizations)
  // Function overloads for proper typing
  function getSpacingResetValue(key: ThSpacingSettingsKeys.letterSpacing): number | null;
  function getSpacingResetValue(key: ThSpacingSettingsKeys.lineHeight): ThLineHeightOptions | null;
  function getSpacingResetValue(key: ThSpacingSettingsKeys.paragraphIndent): number | null;
  function getSpacingResetValue(key: ThSpacingSettingsKeys.paragraphSpacing): number | null;
  function getSpacingResetValue(key: ThSpacingSettingsKeys.wordSpacing): number | null;
  function getSpacingResetValue(key: ThSpacingSettingsKeys): any {
    if (!shouldApplyPresets) {
      return getDefaultValue(key);
    }

    if (spacing.preset) {
      if (spacing.preset !== ThSpacingPresetKeys.publisher && 
          spacing.preset !== ThSpacingPresetKeys.custom) {
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

    // For publisher or custom preset or when no preset is selected, return the default value
    return getDefaultValue(key);
  }

  const getEffectiveSpacingValueCallback = useCallback(getEffectiveSpacingValue, [
    getEffectiveSpacingValue,
    shouldApplyPresets,
    spacing.preset,
    spacing.custom,
    spacing.baseline,
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
    getSpacingResetValue,
    spacing.preset,
    preferences.settings?.spacing?.presets
  ]);

  const allowResetCallback = useCallback((): boolean => {
    return !shouldApplyPresets || spacing.preset === ThSpacingPresetKeys.custom;
  }, [shouldApplyPresets, spacing.preset]);

  const canBeResetCallback = useCallback((key: ThSpacingSettingsKeys): boolean => {
    // For custom preset, can reset if current value is not null/undefined (has any value to reset)
    if (!shouldApplyPresets || !spacing.preset || spacing.preset === ThSpacingPresetKeys.custom) {
      const effectiveValue = getEffectiveSpacingValueCallback(key as any);
      return effectiveValue !== null && effectiveValue !== undefined;
    }

    // For other presets, can reset if current value differs from preset value
    const effectiveValue = getEffectiveSpacingValueCallback(key as any);
    const resetValue = getSpacingResetValueCallback(key as any);

    // Compare values - if different, can be reset
    if (effectiveValue === null && resetValue === null) return false;
    if (effectiveValue === undefined && resetValue === undefined) return false;

    return effectiveValue !== resetValue;
  }, [shouldApplyPresets, spacing.preset, getEffectiveSpacingValueCallback, getSpacingResetValueCallback]);

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

  const setPublisherStylesAction = useCallback((value: boolean) => {
    if (shouldApplyPresets && value) {
      dispatch(setSpacingPreset({ preset: ThSpacingPresetKeys.publisher, values: {} }));
    }
    dispatch(setPublisherStyles(value));
  }, [dispatch, shouldApplyPresets]);

  return {
    currentPreset: spacing.preset,
    getPresetValues: getPresetValuesCallback,
    getEffectiveSpacingValue: getEffectiveSpacingValueCallback,
    getSpacingResetValue: getSpacingResetValueCallback,
    allowReset: allowResetCallback,
    canBeReset: canBeResetCallback,
    setLetterSpacing: setLetterSpacingAction,
    setLineHeight: setLineHeightAction,
    setParagraphIndent: setParagraphIndentAction,
    setParagraphSpacing: setParagraphSpacingAction,
    setWordSpacing: setWordSpacingAction,
    setPublisherStyles: setPublisherStylesAction
  };
};
