import { useCallback, useMemo } from "react";

import {
  ThSpacingKeys,
  ThSettingsContainerKeys,
  ThMarginOptions,
  ThSettingsKeys,
  ThLineHeightOptions
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
import { usePreferenceKeys } from "@/preferences/hooks/usePreferenceKeys";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useLineHeight } from "./hooks/useLineHeight";
import { useMargin } from "./hooks/useMargin";

import { useAppSelector, useAppDispatch } from "@/lib";
import { setSpacingPreset, setPublisherStyles } from "@/lib/settingsReducer";
import { setSettingsContainer } from "@/lib/readerReducer";

const iconMap = {
  [ThSpacingKeys.publisher]: BookIcon,
  [ThSpacingKeys.accessible]: AccessibleIcon,
  [ThSpacingKeys.custom]: TuneIcon,
  [ThSpacingKeys.tight]: SmallIcon,
  [ThSpacingKeys.balanced]: MediumIcon,
  [ThSpacingKeys.loose]: LargeIcon,
};

export const StatefulSpacingPresets = ({ standalone }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const { preferences } = usePreferences();
  const { reflowSpacingKeys, fxlSpacingKeys } = usePreferenceKeys();
  const spacing = useAppSelector(state => state.settings.spacing);
  const settingsContainer = useAppSelector(state => state.reader.settingsContainer);
  const isFXL = useAppSelector(state => state.publication.isFXL);

  const dispatch = useAppDispatch();

  const { submitPreferencesWithMargin } = useMargin();

  const { submitPreferences } = useEpubNavigator();

  const lineHeightOptions = useLineHeight();

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
        themingSpacing = preferences.theming.spacing?.keys[spacingKey] || {};
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

      // Handle lineHeight - convert enum to actual numeric value
      const lineHeightEnum = mergedSpacing.lineHeight as ThLineHeightOptions;
      preferencesToSubmit.lineHeight = lineHeightEnum === ThLineHeightOptions.publisher
        ? null
        : lineHeightOptions[lineHeightEnum];

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
  }, [dispatch, preferences, spacing, submitPreferences, submitPreferencesWithMargin, settingsContainer, lineHeightOptions]);

  // Use appropriate spacing keys based on layout
  const spacingKeys = useMemo(() => {
    return isFXL ? fxlSpacingKeys : reflowSpacingKeys;
  }, [isFXL, fxlSpacingKeys, reflowSpacingKeys]);

  // Create dynamic items array based on spacing keys
  const items = useMemo(() => {
    return spacingKeys.map((key: ThSpacingKeys) => ({
      icon: iconMap[key],
      value: key,
      label: t(`reader.settings.spacing.presets.${ key }`)
    }));
  }, [spacingKeys, t]);

  // Return null if no items to display
  if (items.length === 0) {
    return null;
  }

  return (
    <>
    <StatefulRadioGroup
      standalone={ standalone }
      label={ t("reader.settings.spacing.presets.title") }
      orientation="horizontal"
      value={ spacing?.preset || ThSpacingKeys.publisher }
      onChange={ async (val: string) => await updatePreference(val) }
      items={ items }
    />
    </>
  )
}