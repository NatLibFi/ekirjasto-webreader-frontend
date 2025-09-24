"use client";

import { useCallback } from "react";

import { ThLineHeightOptions, ThSettingsKeys, ThSpacingSettingsKeys } from "@/preferences";

import { StatefulSettingsItemProps } from "../../../Settings/models/settings";

import BookIcon from "../assets/icons/book.svg";
import SmallIcon from "./assets/icons/density_small.svg";
import MediumIcon from "./assets/icons/density_medium.svg";
import LargeIcon from "./assets/icons/density_large.svg";

import { StatefulRadioGroup } from "../../../Settings/StatefulRadioGroup";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPublisherStyles } from "@/lib/settingsReducer";
import { useLineHeight } from "./hooks/useLineHeight";
import { useSpacingPresets } from "./hooks/useSpacingPresets";

export const StatefulLineHeight = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setLineHeight } = useSpacingPresets();

  const lineHeight = getEffectiveSpacingValue(ThSpacingSettingsKeys.lineHeight);

  const lineHeightOptions = useLineHeight();

  const updatePreference = useCallback(async (value: string) => {
    const computedValue = value === ThLineHeightOptions.publisher
      ? null 
      : lineHeightOptions[value as keyof typeof ThLineHeightOptions];
    
    await submitPreferences({
      lineHeight: computedValue
    });

    const currentLineHeight = getSetting("lineHeight");
    const currentDisplayLineHeightOption = Object.entries(lineHeightOptions).find(([key, value]) => value === currentLineHeight)?.[0] as ThLineHeightOptions;

    setLineHeight(currentDisplayLineHeightOption);
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch, setLineHeight, lineHeightOptions]);

  return (
    <>
    <StatefulRadioGroup 
      standalone={ standalone }
      label={ t("reader.settings.lineHeight.title") }
      orientation="horizontal"
      value={ publisherStyles ? ThLineHeightOptions.publisher : lineHeight } 
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: BookIcon,
          label: t("reader.settings.lineHeight.publisher"), 
          value: ThLineHeightOptions.publisher 
        },
        {
          icon: SmallIcon,
          label: t("reader.settings.lineHeight.small"), 
          value: ThLineHeightOptions.small 
        },
        {
          icon: MediumIcon,
          label: t("reader.settings.lineHeight.medium"), 
          value: ThLineHeightOptions.medium 
        },
        {
          icon: LargeIcon,
          label: t("reader.settings.lineHeight.large"), 
          value: ThLineHeightOptions.large 
        },
      ]}
    />
    </>
  );
}