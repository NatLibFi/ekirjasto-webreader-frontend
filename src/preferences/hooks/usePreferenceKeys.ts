"use client";

import { ThSpacingPresetKeys } from "@/preferences/models/enums";

import { usePreferences } from "./usePreferences";

export const usePreferenceKeys = () => {
  const { preferences } = usePreferences();

  const reflowActionKeys = preferences.actions.reflowOrder;
  const fxlActionKeys = preferences.actions.fxlOrder;

  const reflowThemeKeys = preferences.theming.themes.reflowOrder;
  const fxlThemeKeys = preferences.theming.themes.fxlOrder;

  const reflowSettingsKeys = preferences.settings.reflowOrder;
  const fxlSettingsKeys = preferences.settings.fxlOrder;

  const mainTextSettingsKeys = preferences.settings.text?.main ?? [];
  const subPanelTextSettingsKeys = preferences.settings.text?.subPanel ?? [];
  const mainSpacingSettingsKeys = preferences.settings.spacing?.main ?? [];
  const subPanelSpacingSettingsKeys = preferences.settings.spacing?.subPanel ?? [];

  const reflowSpacingPresetKeys = preferences.settings.spacing?.presets?.reflowOrder ?? [];
  const fxlSpacingPresetKeys: ThSpacingPresetKeys[] = [];

  return {
    reflowActionKeys,
    fxlActionKeys,
    reflowThemeKeys,
    fxlThemeKeys,
    reflowSettingsKeys,
    fxlSettingsKeys,
    mainTextSettingsKeys,
    subPanelTextSettingsKeys,
    mainSpacingSettingsKeys,
    subPanelSpacingSettingsKeys,
    reflowSpacingPresetKeys,
    fxlSpacingPresetKeys
  };
}