"use client";

import { useCallback } from "react";

import settingsStyles from "../../../Settings/assets/styles/settings.module.css";

import { Button } from "react-aria-components";

import { useI18n } from "@/i18n/useI18n";
import { useSpacingPresets } from "./hooks/useSpacingPresets";
import { useEpubNavigator } from "@/core/Hooks";
import { useMargin } from "./hooks/useMargin";

export const StatefulSpacingReset = () => {
  const { t } = useI18n();
  const { resetSpacingSettings, canGetReset } = useSpacingPresets();
  const { submitPreferences } = useEpubNavigator();
  const { submitPreferencesWithMargin } = useMargin();

  const updatePreference = useCallback(async () => {
    await submitPreferencesWithMargin(submitPreferences, 1, {
      lineHeight: null,
      paragraphIndent: null,
      paragraphSpacing: null,
      letterSpacing: null,
      wordSpacing: null
    });
    resetSpacingSettings();
  }, [resetSpacingSettings, submitPreferencesWithMargin, submitPreferences]);

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