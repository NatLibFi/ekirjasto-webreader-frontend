"use client";

import { useCallback, useMemo, useRef } from "react";

import { ThLineHeightOptions, ThSpacingSettingsKeys, ThSettingsKeys } from "@/preferences";

import { StatefulSettingsItemProps } from "../../../Settings/models/settings";

import BookIcon from "../assets/icons/book.svg";
import SmallIcon from "./assets/icons/density_small.svg";
import MediumIcon from "./assets/icons/density_medium.svg";
import LargeIcon from "./assets/icons/density_large.svg";

import { StatefulRadioGroup } from "../../../Settings/StatefulRadioGroup";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";

import { useAppSelector } from "@/lib/hooks";
import { useLineHeight } from "./hooks/useLineHeight";
import { useSpacingPresets } from "./hooks/useSpacingPresets";

export const StatefulLineHeight = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const { preferences } = usePreferences();

  const publisherStyles = useAppSelector(state => state.settings.publisherStyles);

  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setLineHeight } = useSpacingPresets();

  const lineHeight = getEffectiveSpacingValue(ThSpacingSettingsKeys.lineHeight);

  const lineHeightOptions = useLineHeight();

  // Dynamically build items array based on allowUnset preference
  const items = useMemo(() => {
    const baseItems = [
      {
        id: ThLineHeightOptions.small,
        icon: SmallIcon,
        label: t("reader.settings.lineHeight.small"),
        value: ThLineHeightOptions.small
      },
      {
        id: ThLineHeightOptions.medium,
        icon: MediumIcon,
        label: t("reader.settings.lineHeight.medium"),
        value: ThLineHeightOptions.medium
      },
      {
        id: ThLineHeightOptions.large,
        icon: LargeIcon,
        label: t("reader.settings.lineHeight.large"),
        value: ThLineHeightOptions.large
      },
    ];

    // Only add publisher option if allowUnset is true
    if (preferences.settings.keys[ThSettingsKeys.lineHeight].allowUnset !== false) {
      baseItems.unshift({
        id: ThLineHeightOptions.publisher,
        icon: BookIcon,
        label: t("reader.settings.lineHeight.publisher"),
        value: ThLineHeightOptions.publisher
      });
    }

    return baseItems;
  }, [preferences.settings.keys, t]);

  const itemsRef = useRef(items);

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
  }, [submitPreferences, getSetting, setLineHeight, lineHeightOptions]);

  return (
    <>
    <StatefulRadioGroup
      standalone={ standalone }
      label={ t("reader.settings.lineHeight.title") }
      orientation="horizontal"
      value={ publisherStyles ? ThLineHeightOptions.publisher : lineHeight }
      onChange={ async (val: string) => await updatePreference(val) }
      items={ items }
      gridNavigation={{
        items: itemsRef,
        currentValue: publisherStyles ? ThLineHeightOptions.publisher : lineHeight,
        onChange: async (val: string) => await updatePreference(val),
      }}
    />
    </>
  );
}