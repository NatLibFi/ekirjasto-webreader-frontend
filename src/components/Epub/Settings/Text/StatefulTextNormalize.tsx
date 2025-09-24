"use client";

import { useCallback } from "react";

import { StatefulSettingsItemProps } from "../../../Settings/models/settings";

import { StatefulSwitch } from "../../../Settings/StatefulSwitch";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setTextNormalization } from "@/lib/settingsReducer";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const StatefulTextNormalize = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const textNormalization = useAppSelector(state => state.settings.textNormalization);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: boolean) => {
    await submitPreferences({ textNormalization: value });

    dispatch(setTextNormalization(getSetting("textNormalization")));
  }, [submitPreferences, getSetting, dispatch]);

  return(
    <>
    <StatefulSwitch 
      standalone={ standalone }
      heading={ t("reader.settings.normalizeText.title") }
      label={ t("reader.settings.normalizeText.label") }
      onChange={ async (isSelected: boolean) => await updatePreference(isSelected) }
      isSelected={ textNormalization ?? false }
    />
    </>
  )
}