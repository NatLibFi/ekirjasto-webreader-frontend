"use client";

import { useCallback } from "react";

import settingsStyles from "../../../Settings/assets/styles/settings.module.css";

import { Button } from "react-aria-components";

import { useI18n } from "@/i18n/useI18n";
import { useSpacingPresets } from "./hooks/useSpacingPresets";
import { useEpubNavigator } from "@/core/Hooks";
import { useLineHeight } from "./hooks/useLineHeight";
import { usePreferenceKeys } from "@/preferences/hooks/usePreferenceKeys";

import { hasCustomizableSpacingSettings } from "./helpers/spacingSettings";

export const StatefulSpacingReset = () => {
  const { t } = useI18n();
  const { subPanelSpacingSettingsKeys } = usePreferenceKeys();

  const { resetSpacingSettings, canGetReset, getResetValues } = useSpacingPresets();
  const { submitPreferences } = useEpubNavigator();

  const lineHeightOptions = useLineHeight();

  const updatePreference = useCallback(async () => {
    const resetValues = getResetValues();

    const lineHeightValue = resetValues.lineHeight === "publisher" 
      ? null 
      : lineHeightOptions[resetValues.lineHeight as keyof typeof lineHeightOptions];

    await submitPreferences({
      lineHeight: lineHeightValue,
      paragraphIndent: resetValues.paragraphIndent,
      paragraphSpacing: resetValues.paragraphSpacing,
      letterSpacing: resetValues.letterSpacing,
      wordSpacing: resetValues.wordSpacing
    });

    resetSpacingSettings();    
  }, [resetSpacingSettings, submitPreferences, getResetValues, lineHeightOptions]);

  // Check if there are spacing settings available for customization
  const subPanelKeys = subPanelSpacingSettingsKeys || [];
  const hasCustomizableSettings = hasCustomizableSpacingSettings(subPanelKeys);
  
  // Return null if no spacing settings are available for customization
  if (!hasCustomizableSettings) {
    return null;
  }

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