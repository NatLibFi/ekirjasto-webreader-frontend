"use client";

import { useCallback, useEffect, useRef } from "react";

import SmallMarginIcon from "./assets/icons/format_letter_spacing_standard.svg";
import NormalMarginIcon from "./assets/icons/format_letter_spacing_wide.svg";
import LargeMarginIcon from "./assets/icons/format_letter_spacing_wider.svg";

import { defaultMargins, ThMarginOptions, ThSettingsKeys } from "@/preferences";

import { StatefulRadioGroup, StatefulSettingsItemProps } from "@/components/Settings";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";

import { setLineLengthMultiplier, useAppDispatch, useAppSelector } from "@/lib";

// ReadiumCSS v2 does not provide a margin setting per se,
// and we are relying on the line-length setting to achieve similar effects.
// In other words, we are applying a factor to the line-length setting since
// ts-toolkit takes the pageGutter into account when computing the number of characters.
export const StatefulMargin = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const lineLength = useAppSelector(state => state.settings.lineLength);
  const dispatch = useAppDispatch();

  const { submitPreferences } = useEpubNavigator();

  // TODO: column count? In auto/null this does not work well because the logic will add columns based on the number of characters it can effectively fit in the container…
  // TODO: this is highly-dependent on the size of the container, because it may actually fit less characters than what we submit, with the setting having no visual effect at all…
  // On the opposite side, pageGutter may not have any effect if the container can fit way more than what we request…

  const marginOptions = useRef({
    [ThMarginOptions.small]: (preferences.settings.keys?.[ThSettingsKeys.margin]?.[ThMarginOptions.small] ?? defaultMargins[ThMarginOptions.small]).toString(),
    [ThMarginOptions.medium]: (preferences.settings.keys?.[ThSettingsKeys.margin]?.[ThMarginOptions.medium] ?? defaultMargins[ThMarginOptions.medium]).toString(),
    [ThMarginOptions.large]: (preferences.settings.keys?.[ThSettingsKeys.margin]?.[ThMarginOptions.large] ?? defaultMargins[ThMarginOptions.large]).toString()
  });

  const updatePreference = useCallback(async (value: string) => {
    const numValue = Number(value);

    const getLineLengthValue = (
      setting: { chars?: number | null, isDisabled?: boolean } | number | null | undefined,
      fallback: number | null | undefined,
      def: number,
      multiplier: number
    ) => {
      if (setting === null || setting === undefined) return (fallback ?? def) * multiplier;
      if (typeof setting === "object") {
        if (setting.isDisabled) return null;
        return (setting.chars ?? fallback ?? def) * multiplier;
      }
      return (setting ?? fallback ?? def) * multiplier;
    };

    await submitPreferences({
      minimalLineLength: getLineLengthValue(lineLength?.min, preferences.typography.minimalLineLength, 35, numValue),
      optimalLineLength: getLineLengthValue(lineLength?.optimal, preferences.typography.optimalLineLength, 60, numValue),
      maximalLineLength: getLineLengthValue(lineLength?.max, preferences.typography.maximalLineLength, 70, numValue)
    });

    dispatch(setLineLengthMultiplier(value));
  }, [submitPreferences, dispatch, lineLength, preferences]);

  return (
    <>
    <StatefulRadioGroup
      standalone={ standalone }
      label={ t("reader.settings.margin.title") }
      orientation="horizontal"
      value={ lineLength?.multiplier?.toString() || "1" }
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        { 
          icon: SmallMarginIcon,
          label: t("reader.settings.margin.small"), 
          value: marginOptions.current[ThMarginOptions.small] 
        },
        { 
          icon: NormalMarginIcon,
          label: t("reader.settings.margin.normal"), 
          value: marginOptions.current[ThMarginOptions.medium] 
        },
        { 
          icon: LargeMarginIcon,
          label: t("reader.settings.margin.large"), 
          value: marginOptions.current[ThMarginOptions.large] 
        }
      ]}
    />
    </>
  );
};