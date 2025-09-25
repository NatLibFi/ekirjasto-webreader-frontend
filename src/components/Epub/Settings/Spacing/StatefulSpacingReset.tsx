"use client";

import { useCallback } from "react";

import { ThMarginOptions, ThSettingsKeys } from "@/preferences/models/enums";

import settingsStyles from "../../../Settings/assets/styles/settings.module.css";

import { Button } from "react-aria-components";

import { useI18n } from "@/i18n/useI18n";
import { useSpacingPresets } from "./hooks/useSpacingPresets";
import { useEpubNavigator } from "@/core/Hooks";
import { useMargin } from "./hooks/useMargin";
import { useLineHeight } from "./hooks/useLineHeight";
import { usePreferences } from "@/preferences/hooks/usePreferences";

export const StatefulSpacingReset = () => {
  const { preferences } = usePreferences();
  const { t } = useI18n();

  const { resetSpacingSettings, canGetReset, getResetValues } = useSpacingPresets();
  const { submitPreferences } = useEpubNavigator();
  const { submitPreferencesWithMargin } = useMargin();

  const lineHeightOptions = useLineHeight();

  const updatePreference = useCallback(async () => {
    const resetValues = getResetValues();

    // Convert enum values to actual numeric values using existing logic
    const marginValue = resetValues.margin as ThMarginOptions;
    const marginNumber = preferences.settings.keys[ThSettingsKeys.margin][marginValue] ?? 1;

    const lineHeightValue = resetValues.lineHeight === "publisher" 
      ? null 
      : lineHeightOptions[resetValues.lineHeight as keyof typeof lineHeightOptions];

    await submitPreferencesWithMargin(submitPreferences, marginNumber, {
      lineHeight: lineHeightValue,
      paragraphIndent: resetValues.paragraphIndent,
      paragraphSpacing: resetValues.paragraphSpacing,
      letterSpacing: resetValues.letterSpacing,
      wordSpacing: resetValues.wordSpacing
    });

    resetSpacingSettings();    
  }, [resetSpacingSettings, submitPreferencesWithMargin, submitPreferences, getResetValues, lineHeightOptions, preferences.settings.keys]);

  return (
    <>
    <Button
      className={ settingsStyles.readerSettingsResetButton }
      isDisabled={ !canGetReset() }
      onPress={ async () => await updatePreference() }
    >
      { t("reader.settings.reset") }
    </Button>
    </>
  )
}