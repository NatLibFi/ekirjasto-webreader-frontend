"use client";

import { useCallback } from "react";

import { ThLineHeightOptions, ThSpacingSettingsKeys } from "@/preferences";

import { StatefulSettingsItemProps } from "../../Settings/models/settings";

import { StatefulSwitch } from "../../Settings/StatefulSwitch";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";
import { useSpacingPresets } from "./Spacing/hooks/useSpacingPresets";
import { useLineHeight } from "./Spacing/hooks/useLineHeight";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPublisherStyles } from "@/lib/settingsReducer";

export const StatefulPublisherStyles = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);

  const { getEffectiveSpacingValue } = useSpacingPresets();

  const lineHeight = getEffectiveSpacingValue(ThSpacingSettingsKeys.lineHeight);
  const paragraphIndent = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphIndent);
  const paragraphSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphSpacing);
  const letterSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.letterSpacing);
  const wordSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.wordSpacing);

  const dispatch = useAppDispatch();

  const lineHeightOptions = useLineHeight();

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
        : lineHeightOptions[lineHeight as keyof typeof ThLineHeightOptions],
      paragraphIndent: paragraphIndent || 0,
      paragraphSpacing: paragraphSpacing || 0,
      letterSpacing: letterSpacing || 0,
      wordSpacing: wordSpacing || 0
    };
    await submitPreferences(values);

    dispatch(setPublisherStyles(isSelected ? true : false));
  }, [submitPreferences, dispatch, lineHeight, paragraphIndent, paragraphSpacing, letterSpacing, wordSpacing, lineHeightOptions]);

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