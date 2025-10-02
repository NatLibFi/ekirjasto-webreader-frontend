import { useCallback, useMemo } from "react";

import { 
  ThSpacingPresetKeys,
  ThLineHeightOptions,
  ThSpacingSettingsKeys,
} from "@/preferences/models/enums";

import BookIcon from "../assets/icons/book.svg";
import SmallIcon from "./assets/icons/density_small.svg";
import MediumIcon from "./assets/icons/density_medium.svg";
import LargeIcon from "./assets/icons/density_large.svg";
import AccessibleIcon from "./assets/icons/accessibility.svg";
import TuneIcon from "./assets/icons/tune.svg";

import { StatefulSettingsItemProps } from "@/components/Settings";

import { StatefulRadioGroup } from "../../../Settings/StatefulRadioGroup";

import { useSpacingPresets } from "./hooks/useSpacingPresets";

import { useI18n } from "@/i18n/useI18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";
import { usePreferenceKeys } from "@/preferences/hooks/usePreferenceKeys";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useLineHeight } from "./hooks/useLineHeight";

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
  const isFXL = useAppSelector(state => state.publication.isFXL);

  const dispatch = useAppDispatch();

  const { submitPreferences } = useEpubNavigator();

  const lineHeightOptions = useLineHeight();

  const { getEffectiveSpacingValue } = useSpacingPresets();

  // Get current Redux spacing values
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const lineHeight = useAppSelector(state => state.settings.lineHeight);
  const paragraphIndent = useAppSelector(state => state.settings.paragraphIndent);
  const paragraphSpacing = useAppSelector(state => state.settings.paragraphSpacing);
  const wordSpacing = useAppSelector(state => state.settings.wordSpacing);

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

    // Submit the correct values to preferences:
    // - User overrides if they exist for the setting
    // - NEW preset values if no user override exists
    const preferencesToSubmit: any = {};

    // Get current preset values (for non-overridden settings)
    const getCurrentPresetValue = (key: ThSpacingSettingsKeys): any => {
      if (spacingKey !== ThSpacingPresetKeys.publisher && spacingKey !== ThSpacingPresetKeys.custom) {
        const spacingConfig = preferences.settings.spacing?.presets;
        if (spacingConfig?.keys) {
          const presetValues = spacingConfig.keys[spacingKey as ThSpacingPresetKeys.tight | ThSpacingPresetKeys.balanced | ThSpacingPresetKeys.loose | ThSpacingPresetKeys.accessible];
          const presetValue = presetValues?.[key as unknown as keyof typeof presetValues];
          if (presetValue !== undefined) {
            return presetValue;
          }
        }
      }

      // Return appropriate default for publisher/custom presets
      switch (key) {
        case ThSpacingSettingsKeys.lineHeight:
          return ThLineHeightOptions.publisher;
        case ThSpacingSettingsKeys.paragraphIndent:
        case ThSpacingSettingsKeys.paragraphSpacing:
        case ThSpacingSettingsKeys.wordSpacing:
          return null;
        default:
          return null;
      }
    };

    // Check each setting for user overrides vs preset values
    const userOverrideLetterSpacing = (spacing?.userOverrides as any)?.[ThSpacingSettingsKeys.letterSpacing];
    preferencesToSubmit.letterSpacing = userOverrideLetterSpacing ?? getCurrentPresetValue(ThSpacingSettingsKeys.letterSpacing);

    const userOverrideLineHeight = (spacing?.userOverrides as any)?.[ThSpacingSettingsKeys.lineHeight];
    const lineHeightValue = userOverrideLineHeight ?? getCurrentPresetValue(ThSpacingSettingsKeys.lineHeight);
    preferencesToSubmit.lineHeight = !lineHeightValue || lineHeightValue === ThLineHeightOptions.publisher
      ? null
      : typeof lineHeightValue === "number"
        ? lineHeightValue
        : lineHeightOptions[lineHeightValue as ThLineHeightOptions];

    const userOverrideParagraphIndent = (spacing?.userOverrides as any)?.[ThSpacingSettingsKeys.paragraphIndent];
    preferencesToSubmit.paragraphIndent = userOverrideParagraphIndent ?? getCurrentPresetValue(ThSpacingSettingsKeys.paragraphIndent);

    const userOverrideParagraphSpacing = (spacing?.userOverrides as any)?.[ThSpacingSettingsKeys.paragraphSpacing];
    preferencesToSubmit.paragraphSpacing = userOverrideParagraphSpacing ?? getCurrentPresetValue(ThSpacingSettingsKeys.paragraphSpacing);

    const userOverrideWordSpacing = (spacing?.userOverrides as any)?.[ThSpacingSettingsKeys.wordSpacing];
    preferencesToSubmit.wordSpacing = userOverrideWordSpacing ?? getCurrentPresetValue(ThSpacingSettingsKeys.wordSpacing);

    await submitPreferences(preferencesToSubmit);

    // Always set the spacing preset
    dispatch(setSpacingPreset(value as ThSpacingPresetKeys));
  }, [dispatch, preferences, submitPreferences, lineHeightOptions, getEffectiveSpacingValue]);

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