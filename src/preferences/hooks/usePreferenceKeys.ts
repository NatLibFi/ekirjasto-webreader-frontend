"use client";

import { CustomizableKeys, CustomKeyType } from "@/preferences/preferences";
import { usePreferences } from "./usePreferences";
import { 
  ThActionsKeys, 
  ThThemeKeys, 
  ThSettingsKeys, 
  ThTextSettingsKeys, 
  ThSpacingSettingsKeys 
} from "../models/enums";

/**
 * Hook to safely access and use preference keys with proper type inference
 * This allows components to use the keys as indexes without type errors
 */
export function usePreferenceKeys<T extends Partial<CustomizableKeys>>() {
  const { preferences } = usePreferences();
  
  // Return an object with typed keys for each customizable section
  return {
    reflowActionKeys: preferences.actions.reflowOrder as Array<T["actionKeys"] extends CustomKeyType ? T["actionKeys"] : ThActionsKeys>,
    fxlActionKeys: preferences.actions.fxlOrder as Array<T["actionKeys"] extends CustomKeyType ? T["actionKeys"] : ThActionsKeys>,
    reflowThemeKeys: preferences.theming.themes.reflowOrder as Array<T["themeKeys"] extends CustomKeyType ? T["themeKeys"] | "auto" : ThThemeKeys | "auto">,
    fxlThemeKeys: preferences.theming.themes.fxlOrder as Array<T["themeKeys"] extends CustomKeyType ? T["themeKeys"] | "auto" : ThThemeKeys | "auto">,
    reflowSettingsKeys: preferences.settings.reflowOrder as Array<T["settingsKeys"] extends CustomKeyType ? T["settingsKeys"] : ThSettingsKeys>,
    fxlSettingsKeys: preferences.settings.fxlOrder as Array<T["settingsKeys"] extends CustomKeyType ? T["settingsKeys"] : ThSettingsKeys>,
    mainTextSettingsKeys: preferences.settings.text?.main as Array<T["textSettingsKeys"] extends CustomKeyType ? T["textSettingsKeys"] : ThTextSettingsKeys> || [],
    subPanelTextSettingsKeys: preferences.settings.text?.subPanel as Array<T["textSettingsKeys"] extends CustomKeyType ? T["textSettingsKeys"] : ThTextSettingsKeys> || [],
    mainSpacingSettingsKeys: preferences.settings.spacing?.main as Array<T["spacingSettingsKeys"] extends CustomKeyType ? T["spacingSettingsKeys"] : ThSpacingSettingsKeys> || [],
    subPanelSpacingSettingsKeys: preferences.settings.spacing?.subPanel as Array<T["spacingSettingsKeys"] extends CustomKeyType ? T["spacingSettingsKeys"] : ThSpacingSettingsKeys> || [],
    
    // Helper functions that use type assertion with unknown as intermediate step
    asReflowActionKey: <K extends string>(key: K): T["actionKeys"] extends CustomKeyType ? T["actionKeys"] : ThActionsKeys => key as unknown as T["actionKeys"] extends CustomKeyType ? T["actionKeys"] : ThActionsKeys,
    asFxlActionKey: <K extends string>(key: K): T["actionKeys"] extends CustomKeyType ? T["actionKeys"] : ThActionsKeys => key as unknown as T["actionKeys"] extends CustomKeyType ? T["actionKeys"] : ThActionsKeys,
    asReflowThemeKey: <K extends string>(key: K): T["themeKeys"] extends CustomKeyType ? T["themeKeys"] | "auto" : ThThemeKeys | "auto" => key as unknown as T["themeKeys"] extends CustomKeyType ? T["themeKeys"] | "auto" : ThThemeKeys | "auto",
    asFxlThemeKey: <K extends string>(key: K): T["themeKeys"] extends CustomKeyType ? T["themeKeys"] | "auto" : ThThemeKeys | "auto" => key as unknown as T["themeKeys"] extends CustomKeyType ? T["themeKeys"] | "auto" : ThThemeKeys | "auto",
    asReflowSettingsKey: <K extends string>(key: K): T["settingsKeys"] extends CustomKeyType ? T["settingsKeys"] : ThSettingsKeys => key as unknown as T["settingsKeys"] extends CustomKeyType ? T["settingsKeys"] : ThSettingsKeys,
    asFxlSettingsKey: <K extends string>(key: K): T["settingsKeys"] extends CustomKeyType ? T["settingsKeys"] : ThSettingsKeys => key as unknown as T["settingsKeys"] extends CustomKeyType ? T["settingsKeys"] : ThSettingsKeys,
    asMainTextSettingsKey: <K extends string>(key: K): T["textSettingsKeys"] extends CustomKeyType ? T["textSettingsKeys"] : ThTextSettingsKeys => key as unknown as T["textSettingsKeys"] extends CustomKeyType ? T["textSettingsKeys"] : ThTextSettingsKeys,
    asSubPanelTextSettingsKey: <K extends string>(key: K): T["textSettingsKeys"] extends CustomKeyType ? T["textSettingsKeys"] : ThTextSettingsKeys => key as unknown as T["textSettingsKeys"] extends CustomKeyType ? T["textSettingsKeys"] : ThTextSettingsKeys,
    asMainSpacingSettingsKey: <K extends string>(key: K): T["spacingSettingsKeys"] extends CustomKeyType ? T["spacingSettingsKeys"] : ThSpacingSettingsKeys => key as unknown as T["spacingSettingsKeys"] extends CustomKeyType ? T["spacingSettingsKeys"] : ThSpacingSettingsKeys,
    asSubPanelSpacingSettingsKey: <K extends string>(key: K): T["spacingSettingsKeys"] extends CustomKeyType ? T["spacingSettingsKeys"] : ThSpacingSettingsKeys => key as unknown as T["spacingSettingsKeys"] extends CustomKeyType ? T["spacingSettingsKeys"] : ThSpacingSettingsKeys,
  };
}