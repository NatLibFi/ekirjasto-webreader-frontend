import { useCallback } from "react";

import {
  ThSpacingKeys,
  ThSettingsContainerKeys,
  ThMarginOptions,
  ThSettingsKeys
} from "@/preferences/models/enums";

import BookIcon from "../assets/icons/book.svg";
import SmallIcon from "./assets/icons/density_small.svg";
import MediumIcon from "./assets/icons/density_medium.svg";
import LargeIcon from "./assets/icons/density_large.svg";
import AccessibleIcon from "./assets/icons/accessibility.svg";
import TuneIcon from "./assets/icons/tune.svg";

import { StatefulSettingsItemProps } from "@/components/Settings";

import { StatefulRadioGroup } from "../../../Settings/StatefulRadioGroup";

import { useI18n } from "@/i18n/useI18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useMargin } from "../hooks/useMargin";

import { useAppSelector, useAppDispatch } from "@/lib";
import { setSpacingPreset, setPublisherStyles } from "@/lib/settingsReducer";
import { setSettingsContainer } from "@/lib/readerReducer";

export const StatefulSpacingPresets = ({ standalone }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const { preferences } = usePreferences();
  const spacing = useAppSelector(state => state.settings.spacing);
  const settingsContainer = useAppSelector(state => state.reader.settingsContainer)

  const dispatch = useAppDispatch();

  const { submitPreferencesWithMargin } = useMargin();

  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: string) => {
    // Set publisherStyles to false for all presets
    dispatch(setPublisherStyles(false));

    // Handle different preset types
    if (value === "custom" && settingsContainer === ThSettingsContainerKeys.initial) {
      // Custom preset: set container and preset, no theming logic
      dispatch(setSettingsContainer(ThSettingsContainerKeys.spacing));
      dispatch(setSpacingPreset(value));
    } else {
      // All other presets: do theming lookup and submission logic
      const spacingKey = value as ThSpacingKeys;

      // Handle theming spacing based on preset type
      let themingSpacing: any = {};

      // Type guard to check if preset has theming definition
      const hasThemingDefinition = (preset: ThSpacingKeys): preset is ThSpacingKeys.tight | ThSpacingKeys.balanced | ThSpacingKeys.loose | ThSpacingKeys.accessible => {
        return [ThSpacingKeys.tight, ThSpacingKeys.balanced, ThSpacingKeys.loose, ThSpacingKeys.accessible].includes(preset);
      };

      if (hasThemingDefinition(spacingKey)) {
        // Regular presets have theming definitions - now TypeScript knows spacingKey is a valid key
        themingSpacing = preferences.theming.spacing?.keys?.[spacingKey] || {};
      }
      // For publisher and custom, themingSpacing remains {} (empty object)

      const settingsOverrides = spacing?.overrides?.[spacingKey] || {};

      // Merge the preferences - settings overrides take precedence over theming
      const mergedSpacing = {
        ...themingSpacing,
        ...settingsOverrides
      };

      // Submit the merged values to the navigator
      const preferencesToSubmit: any = {};

      // Always include all spacing properties, even if undefined in preset
      preferencesToSubmit.letterSpacing = mergedSpacing.letterSpacing ?? null;
      preferencesToSubmit.lineHeight = mergedSpacing.lineHeight ?? null;
      preferencesToSubmit.paragraphIndent = mergedSpacing.paragraphIndent ?? null;
      preferencesToSubmit.paragraphSpacing = mergedSpacing.paragraphSpacing ?? null;
      preferencesToSubmit.wordSpacing = mergedSpacing.wordSpacing ?? null;

      // Handle margin - convert ThMarginOptions to number, default to 1 if not found
      const marginValue = mergedSpacing.margin as ThMarginOptions;
      const marginNumber = preferences.settings.keys[ThSettingsKeys.margin]?.[marginValue] ?? 1;

      await submitPreferencesWithMargin(submitPreferences, marginNumber, preferencesToSubmit);

      // Always set the spacing preset
      dispatch(setSpacingPreset(value));
    }
  }, [dispatch, preferences, spacing, submitPreferences, submitPreferencesWithMargin, settingsContainer]);

  return (
    <>
    <StatefulRadioGroup
      standalone={ standalone }
      label={ t("reader.settings.spacing.presets.title") }
      orientation="horizontal"
      value={ spacing?.preset || ThSpacingKeys.publisher }
      onChange={ async (val: string) => await updatePreference(val) }
      items={[
        {
          icon: BookIcon,
          value: ThSpacingKeys.publisher,
          label: t("reader.settings.spacing.presets.publisher")
        },
        {
          icon: AccessibleIcon,
          value: ThSpacingKeys.accessible,
          label: t("reader.settings.spacing.presets.accessible")
        },
        {
          icon: TuneIcon,
          value: ThSpacingKeys.custom,
          label: t("reader.settings.spacing.presets.custom")
        },
        {
          icon: SmallIcon,
          value: ThSpacingKeys.tight,
          label: t("reader.settings.spacing.presets.tight")
        },
        {
          icon: MediumIcon,
          value: ThSpacingKeys.balanced,
          label: t("reader.settings.spacing.presets.balanced")
        },
        {
          icon: LargeIcon,
          value: ThSpacingKeys.loose,
          label: t("reader.settings.spacing.presets.loose")
        },
      ]}
    />
    </>
  )
}