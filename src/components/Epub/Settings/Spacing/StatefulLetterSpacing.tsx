"use client";

import { useCallback } from "react";

import { ThSettingsKeys, ThSettingsRangeVariant, ThSpacingSettingsKeys } from "@/preferences";

import { StatefulSettingsItemProps } from "../../../Settings/models/settings";

import { StatefulNumberField } from "../../../Settings/StatefulNumberField";
import { StatefulSlider } from "../../../Settings/StatefulSlider";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";
import { useSpacingPresets } from "./hooks/useSpacingPresets";
import { usePlaceholder } from "../hooks/usePlaceholder";

import { useAppDispatch } from "@/lib/hooks";
import { setPublisherStyles } from "@/lib/settingsReducer";

export const StatefulLetterSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const letterSpacingRangeConfig = {
    variant: preferences.settings.keys[ThSettingsKeys.letterSpacing].variant,
    placeholder: preferences.settings.keys[ThSettingsKeys.letterSpacing].placeholder,
    range: preferences.settings.keys[ThSettingsKeys.letterSpacing].range,
    step: preferences.settings.keys[ThSettingsKeys.letterSpacing].step
  };

  const placeholderText = usePlaceholder(letterSpacingRangeConfig.placeholder, letterSpacingRangeConfig.range);
  
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setLetterSpacing } = useSpacingPresets();

  const letterSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.letterSpacing);

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      letterSpacing: value
    });

    setLetterSpacing(getSetting("letterSpacing"));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch, setLetterSpacing]);

  return (
    <>
    { letterSpacingRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ t("reader.settings.letterSpacing.title") }
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ letterSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value) } 
        range={ letterSpacingRangeConfig.range }
        step={ letterSpacingRangeConfig.step }
        steppers={{
          decrementLabel: t("reader.settings.letterSpacing.decrease"),
          incrementLabel: t("reader.settings.letterSpacing.increase")
        }}
        formatOptions={{ style: "percent" }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
      />
      : <StatefulSlider
        standalone={ standalone }
        displayTicks={ letterSpacingRangeConfig.variant === ThSettingsRangeVariant.incrementedSlider }
        label={ t("reader.settings.letterSpacing.title") }
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ letterSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ letterSpacingRangeConfig.range }
        step={ letterSpacingRangeConfig.step }
        formatOptions={ { style: "percent" } }
      />
    } 
    </>
  )
}