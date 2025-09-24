"use client";

import { useCallback } from "react";

import { StatefulSettingsItemProps } from "../../../Settings/models/settings";
import { ThTextAlignOptions } from "@/preferences/models/enums";

import { StatefulSwitch } from "../../../Settings/StatefulSwitch";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setHyphens } from "@/lib/settingsReducer";

// TMP Component that is not meant to be implemented AS-IS, for testing purposes
export const StatefulHyphens = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const hyphens = useAppSelector(state => state.settings.hyphens);
  const textAlign = useAppSelector(state => state.settings.textAlign);

  const dispatch = useAppDispatch();
  
  const { getSetting, submitPreferences } = useEpubNavigator();
  
  const updatePreference = useCallback(async (value: boolean) => {
    await submitPreferences({ 
      hyphens: value 
    });
  
    dispatch(setHyphens(getSetting("hyphens")));
  }, [submitPreferences, getSetting, dispatch]);

  return(
    <>
    <StatefulSwitch 
      standalone={ standalone }
      heading={ t("reader.settings.hyphens.title") }
      label={ t("reader.settings.hyphens.label") }
      onChange={ async (isSelected: boolean) => await updatePreference(isSelected) }
      isSelected={ hyphens ?? false }
      isDisabled={ textAlign === ThTextAlignOptions.publisher }
    />
    </>
  )
}