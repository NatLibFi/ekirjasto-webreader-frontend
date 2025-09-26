import { useCallback, useMemo } from "react";

import {
  ThSpacingPresetKeys,
  ThMarginOptions,
  ThSettingsKeys,
  ThLineHeightOptions,
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
import { setSpacingPreset } from "@/lib/settingsReducer";

import { hasCustomizableSpacingSettings } from "./helpers/spacingSettings";

const iconMap = {
  [ThSpacingPresetKeys.publisher]: BookIcon,
  [ThSpacingPresetKeys.accessible]: AccessibleIcon,
  [ThSpacingPresetKeys.custom]: TuneIcon,
  [ThSpacingPresetKeys.tight]: SmallIcon,
  [ThSpacingPresetKeys.balanced]: MediumIcon,
  [ThSpacingPresetKeys.loose]: LargeIcon,
};

export const StatefulSpacingPresets = ({ standalone }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const { preferences } = usePreferences();
  const { reflowSpacingPresetKeys, fxlSpacingPresetKeys, subPanelSpacingSettingsKeys } = usePreferenceKeys();
  const spacing = useAppSelector(state => state.settings.spacing);
  const settingsContainer = useAppSelector(state => state.reader.settingsContainer);
  const isFXL = useAppSelector(state => state.publication.isFXL);

  const dispatch = useAppDispatch();

  const { submitPreferencesWithMargin } = useMargin();

  const { submitPreferences } = useEpubNavigator();

  const lineHeightOptions = useLineHeight();

  const updatePreference = useCallback(async (value: string) => {
    const spacingKey = value as ThSpacingPresetKeys;

    // Handle theming spacing based on preset type
    let themingSpacing: any = {};

    // Type guard to check if preset has theming definition
    const hasThemingDefinition = (preset: ThSpacingPresetKeys): preset is ThSpacingPresetKeys.tight | ThSpacingPresetKeys.balanced | ThSpacingPresetKeys.loose | ThSpacingPresetKeys.accessible => {
      return [ThSpacingPresetKeys.tight, ThSpacingPresetKeys.balanced, ThSpacingPresetKeys.loose, ThSpacingPresetKeys.accessible].includes(preset);
    };

    if (hasThemingDefinition(spacingKey)) {
      // Regular presets have theming definitions - now TypeScript knows spacingKey is a valid key
      themingSpacing = preferences.settings.spacing?.presets?.keys[spacingKey] || {};
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
    dispatch(setSpacingPreset(value as ThSpacingPresetKeys));
  }, [dispatch, preferences, spacing, submitPreferences, submitPreferencesWithMargin, lineHeightOptions]);

  // Use appropriate spacing keys based on layout
  const spacingKeys = useMemo(() => {
    const baseKeys = isFXL ? fxlSpacingPresetKeys : reflowSpacingPresetKeys;
    const subPanelKeys = subPanelSpacingSettingsKeys || [];

    const hasCustomizableSettings = hasCustomizableSpacingSettings(subPanelKeys);

    if (hasCustomizableSettings) {
      return baseKeys;
    } else {
      // Exclude "custom" if no spacing settings are available for customization
      return baseKeys.filter(key => key !== ThSpacingPresetKeys.custom);
    }
  }, [isFXL, fxlSpacingPresetKeys, reflowSpacingPresetKeys, subPanelSpacingSettingsKeys]);

  // Create dynamic items array based on spacing keys
  const items = useMemo(() => {
    return spacingKeys.map((key: ThSpacingPresetKeys) => ({
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
      value={ spacing?.preset || ThSpacingPresetKeys.publisher }
      onChange={ async (val: string) => await updatePreference(val as ThSpacingPresetKeys) }
      items={ items }
    />
    </>
  )
}