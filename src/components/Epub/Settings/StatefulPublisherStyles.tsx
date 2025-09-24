"use client";

import { useCallback, useRef } from "react";

import { ThLineHeightOptions, ThSettingsKeys, ThSpacingSettingsKeys } from "@/preferences";

import { StatefulSettingsItemProps } from "../../Settings/models/settings";

import { StatefulSwitch } from "../../Settings/StatefulSwitch";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";
import { useSpacingPresets } from "./Spacing/hooks/useSpacingPresets";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPublisherStyles } from "@/lib/settingsReducer";

export const StatefulPublisherStyles = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);

  const { getEffectiveSpacingValue } = useSpacingPresets();

  const lineHeight = getEffectiveSpacingValue(ThSpacingSettingsKeys.lineHeight);
  const paragraphIndent = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphIndent);
  const paragraphSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphSpacing);
  const letterSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.letterSpacing);
  const wordSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.wordSpacing);

  const dispatch = useAppDispatch();

  const lineHeightOptions = useRef({
    [ThLineHeightOptions.publisher]: null,
    [ThLineHeightOptions.small]: preferences.settings.keys[ThSettingsKeys.lineHeight][ThLineHeightOptions.small],
    [ThLineHeightOptions.medium]: preferences.settings.keys[ThSettingsKeys.lineHeight][ThLineHeightOptions.medium],
    [ThLineHeightOptions.large]: preferences.settings.keys[ThSettingsKeys.lineHeight][ThLineHeightOptions.large],
  });

  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (isSelected: boolean) => {
    const values = isSelected ? 
    {
      lineHeight: null,
      paragraphIndent: null,
      paragraphSpacing: null,
      letterSpacing: null,
      wordSpacing: null
    } : 
    {
      lineHeight: lineHeight === ThLineHeightOptions.publisher 
        ? null 
        : lineHeightOptions.current[lineHeight as keyof typeof ThLineHeightOptions],
      paragraphIndent: paragraphIndent || 0,
      paragraphSpacing: paragraphSpacing || 0,
      letterSpacing: letterSpacing || 0,
      wordSpacing: wordSpacing || 0
    };
    await submitPreferences(values);

    dispatch(setPublisherStyles(isSelected ? true : false));
  }, [submitPreferences, dispatch, lineHeight, paragraphIndent, paragraphSpacing, letterSpacing, wordSpacing]);

  return(
    <>
    <StatefulSwitch 
      standalone={ standalone }
      label={ t("reader.settings.publisherStyles.label") }
      onChange={ async (isSelected: boolean) => await updatePreference(isSelected) }
      isSelected={ publisherStyles }
    />
    </>
  )
}