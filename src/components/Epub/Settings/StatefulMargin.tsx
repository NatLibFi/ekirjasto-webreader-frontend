"use client";

import { useCallback, useRef } from "react";

import SmallMarginIcon from "./assets/icons/format_letter_spacing_standard.svg";
import NormalMarginIcon from "./assets/icons/format_letter_spacing_wide.svg";
import LargeMarginIcon from "./assets/icons/format_letter_spacing_wider.svg";

import { ThMarginOptions, ThSettingsKeys, ThSpacingSettingsKeys } from "@/preferences";

import { StatefulRadioGroup, StatefulSettingsItemProps } from "@/components/Settings";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useSpacingPresets } from "./hooks/useSpacingPresets";

import { useAppSelector } from "@/lib/hooks";

// ReadiumCSS v2 does not provide a margin setting per se,
// and we are relying on the line-length setting to achieve similar effects.
// In other words, we are applying a factor to the line-length setting since
// ts-toolkit takes the pageGutter into account when computing the number of characters.
export const StatefulMargin = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const lineLength = useAppSelector(state => state.settings.lineLength);

  const { submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setLineLengthMultiplier } = useSpacingPresets();

  const multiplier = getEffectiveSpacingValue(ThSpacingSettingsKeys.margin);

  // TODO: column count? In auto/null this does not work well because the logic will add columns based on the number of characters it can effectively fit in the container…
  // TODO: this is highly-dependent on the size of the container, because it may actually fit less characters than what we submit, with the setting having no visual effect at all…
  // On the opposite side, pageGutter may not have any effect if the container can fit way more than what we request…

  const updatePreference = useCallback(async (value: string) => {
    const numValue = preferences.settings.keys[ThSettingsKeys.margin][value];

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
      maximalLineLength: getLineLengthValue(lineLength?.max, preferences.typography.maximalLineLength, 70, numValue),
      pageGutter: preferences.typography.pageGutter / numValue
    });

    setLineLengthMultiplier(value as ThMarginOptions);
  }, [submitPreferences, lineLength, preferences.typography, setLineLengthMultiplier]);

  return (
    <>
    <StatefulRadioGroup
      standalone={ standalone }
      isDisabled={ !preferences.typography.pageGutter }
      label={ t("reader.settings.margin.title") }
      orientation="horizontal"
      value={ multiplier }
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        { 
          icon: SmallMarginIcon,
          label: t("reader.settings.margin.small"), 
          value: ThMarginOptions.small 
        },
        { 
          icon: NormalMarginIcon,
          label: t("reader.settings.margin.normal"), 
          value: ThMarginOptions.medium 
        },
        { 
          icon: LargeMarginIcon,
          label: t("reader.settings.margin.large"), 
          value: ThMarginOptions.large
        }
      ]}
    />
    </>
  );
};