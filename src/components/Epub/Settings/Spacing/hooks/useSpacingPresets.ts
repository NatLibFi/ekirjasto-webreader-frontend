import { useCallback, useMemo } from "react";
import { ThSettingsKeys, ThSpacingSettingsKeys, ThSpacingKeys, ThLineHeightOptions, ThMarginOptions } from "@/preferences/models/enums";
import { defaultSpacingSettingsMain, defaultSpacingSettingsSubpanel } from "@/preferences/models/const";
import { defaultPreferences } from "@/preferences/defaultPreferences";

import { usePlugins } from "@/components/Plugins/PluginProvider";
import { usePreferences } from "@/preferences/hooks/usePreferences";
import { usePreferenceKeys } from "@/preferences/hooks/usePreferenceKeys";

import { initialSettingsState } from "@/lib/settingsReducer";
import { useAppSelector, useAppDispatch } from "@/lib";
import {
  resetSpacingSettings,
  setLetterSpacing,
  setLineHeight,
  setLineLengthMultiplier,
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
  const { reflowSpacingKeys, fxlSpacingKeys } = usePreferenceKeys();

  const { preferences } = usePreferences();

  const dispatch = useAppDispatch();

  const spacingKeys = useMemo(() => {
    return isFXL ? fxlSpacingKeys : reflowSpacingKeys;
  }, [isFXL, fxlSpacingKeys, reflowSpacingKeys]);

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

  // Helper function to get effective spacing value with proper return types
  // Function overloads for proper typing
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.letterSpacing): number | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.lineHeight): ThLineHeightOptions | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.margin): ThMarginOptions | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.paragraphIndent): number | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.paragraphSpacing): number | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys.wordSpacing): number | null;
  function getEffectiveSpacingValue(key: ThSpacingSettingsKeys): any {
    // Check for override values first
    const overrideValue = spacing.overrides?.[spacing.preset]?.[key];
    if (overrideValue !== undefined) {
      return overrideValue;
    }

    // Get preset values if preset system is active
    if (shouldApplyPresets && spacing.preset) {
      const spacingConfig = preferences.theming?.spacing || defaultPreferences.theming?.spacing;
      if (spacingConfig?.keys) {
        // Preferences spacing presets exclude publisher and custom so we know we won’t find them
        if (spacing.preset !== ThSpacingKeys.publisher && spacing.preset !== ThSpacingKeys.custom) {
          const presetValues = spacingConfig.keys[spacing.preset as ThSpacingKeys.tight | ThSpacingKeys.balanced | ThSpacingKeys.loose | ThSpacingKeys.accessible];
          const presetValue = presetValues?.[key as unknown as keyof typeof presetValues];

          if (presetValue !== undefined) {
            return presetValue;
          }
        }
      }

      // Property not defined in preset - return appropriate default based on key
      switch (key) {
        case ThSpacingSettingsKeys.lineHeight:
          return ThLineHeightOptions.publisher;
        case ThSpacingSettingsKeys.margin:
          return ThMarginOptions.medium;
        case ThSpacingSettingsKeys.letterSpacing:
        case ThSpacingSettingsKeys.paragraphIndent:
        case ThSpacingSettingsKeys.paragraphSpacing:
        case ThSpacingSettingsKeys.wordSpacing:
          return null;
        default:
          return null;
      }
    }

    // Return the root state if we are not using presets
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
      case ThSpacingSettingsKeys.margin:
        return lineLength?.multiplier || ThMarginOptions.medium;
      default:
        return undefined;
    }
  }

  const getEffectiveSpacingValueCallback = useCallback(getEffectiveSpacingValue, [
    getEffectiveSpacingValue,
    shouldApplyPresets, 
    spacing.preset, 
    spacing.overrides, 
    preferences.theming?.spacing, 
    letterSpacing, 
    lineHeight, 
    lineLength, 
    paragraphIndent, 
    paragraphSpacing, 
    wordSpacing
  ]);

  const canGetReset = useCallback(() => {
    if (shouldApplyPresets && spacing.preset) {
      // Check if the preset has overrides that is not an empty object
      const presetOverrides = spacing.overrides?.[spacing.preset];
      return !!presetOverrides && Object.keys(presetOverrides).length > 0;
    } else {
      // Check if the state.settings.properties differ from the value in initialState of settingsReducer
      const currentLetterSpacing = letterSpacing ?? null;
      const currentLineHeight = lineHeight ?? initialSettingsState.lineHeight;
      const currentLineLength = lineLength?.multiplier ?? null;
      const currentParagraphIndent = paragraphIndent ?? null;
      const currentParagraphSpacing = paragraphSpacing ?? null;
      const currentWordSpacing = wordSpacing ?? null;

      return (
        currentLetterSpacing !== initialSettingsState.letterSpacing ||
        currentLineHeight !== initialSettingsState.lineHeight ||
        currentLineLength !== initialSettingsState.lineLength ||
        currentParagraphIndent !== initialSettingsState.paragraphIndent ||
        currentParagraphSpacing !== initialSettingsState.paragraphSpacing ||
        currentWordSpacing !== initialSettingsState.wordSpacing
      );
    }
  }, [shouldApplyPresets, spacing.preset, spacing.overrides, letterSpacing, lineHeight, lineLength?.multiplier, paragraphIndent, paragraphSpacing, wordSpacing]);

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

  const setLineLengthMultiplierAction = useCallback((value: ThMarginOptions | null | undefined) => {
    const payload: any = { value };
    if (shouldApplyPresets && spacing.preset) {
      payload.preset = spacing.preset;
    }
    dispatch(setLineLengthMultiplier(payload));
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

  const getResetValues = useCallback(() => {
    // Default reset values when no preset is active
    const defaultResetValues = {
      lineHeight: ThLineHeightOptions.publisher,
      paragraphIndent: null,
      paragraphSpacing: null,
      letterSpacing: null,
      wordSpacing: null,
      margin: ThMarginOptions.medium,
      publisherStyles: !shouldApplyPresets || (spacing.preset === ThSpacingKeys.publisher || spacing.preset === ThSpacingKeys.custom)
    };

    // If no preset or should not apply presets, return default values
    if (!shouldApplyPresets || !spacing.preset) {
      return defaultResetValues;
    }

    // Get preset values if preset system is active
    const spacingConfig = preferences.theming?.spacing || defaultPreferences.theming?.spacing;
    if (!spacingConfig?.keys) {
      return defaultResetValues;
    }

    // Preferences spacing presets exclude publisher and custom so we know we won't find them
    if (spacing.preset === ThSpacingKeys.publisher || spacing.preset === ThSpacingKeys.custom) {
      return defaultResetValues;
    }

    const presetValues = spacingConfig.keys[spacing.preset as ThSpacingKeys.tight | ThSpacingKeys.balanced | ThSpacingKeys.loose | ThSpacingKeys.accessible];

    return {
      lineHeight: presetValues?.lineHeight ?? ThLineHeightOptions.publisher,
      paragraphIndent: presetValues?.paragraphIndent ?? null,
      paragraphSpacing: presetValues?.paragraphSpacing ?? null,
      letterSpacing: presetValues?.letterSpacing ?? null,
      wordSpacing: presetValues?.wordSpacing ?? null,
      margin: presetValues?.margin ?? ThMarginOptions.medium,
      publisherStyles: false
    };
  }, [shouldApplyPresets, spacing.preset, preferences.theming?.spacing]);

  return {
    currentPreset: spacing.preset,
    getEffectiveSpacingValue: getEffectiveSpacingValueCallback,
    canGetReset: canGetReset,
    getResetValues: getResetValues,
    setLetterSpacing: setLetterSpacingAction,
    setLineHeight: setLineHeightAction,
    setLineLengthMultiplier: setLineLengthMultiplierAction,
    setParagraphIndent: setParagraphIndentAction,
    setParagraphSpacing: setParagraphSpacingAction,
    setWordSpacing: setWordSpacingAction,
    resetSpacingSettings: resetSpacingSettingsAction
  };
};
