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

export const StatefulWordSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const wordSpacingRangeConfig = {
    variant: preferences.settings.keys[ThSettingsKeys.wordSpacing].variant,
    placeholder: preferences.settings.keys[ThSettingsKeys.wordSpacing].placeholder,
    range: preferences.settings.keys[ThSettingsKeys.wordSpacing].range,
    step: preferences.settings.keys[ThSettingsKeys.wordSpacing].step
  };

  const placeholderText = usePlaceholder(wordSpacingRangeConfig.placeholder, wordSpacingRangeConfig.range, "percent");
  
  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setWordSpacing, canBeReset } = useSpacingPresets();

  const wordSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.wordSpacing);
  
  const updatePreference = useCallback(async (value: number | number[] | null) => {
    await submitPreferences({
      wordSpacing: Array.isArray(value) ? value[0] : value
    });
    
    setWordSpacing(getSetting("wordSpacing"));
  }, [submitPreferences, getSetting, setWordSpacing]);

  return (
    <>
    { wordSpacingRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ t("reader.settings.wordSpacing.title") }
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ wordSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value) } 
        onReset={ async() => await updatePreference(null) }
        range={ wordSpacingRangeConfig.range }
        step={ wordSpacingRangeConfig.step }
        steppers={{
          decrementLabel: t("reader.settings.wordSpacing.decrease"),
          incrementLabel: t("reader.settings.wordSpacing.increase")
        }}
        formatOptions={{ style: "percent" }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
        canBeReset={ canBeReset(ThSpacingSettingsKeys.wordSpacing) }
      />
      : <StatefulSlider
        standalone={ standalone }
        displayTicks={ wordSpacingRangeConfig.variant === ThSettingsRangeVariant.incrementedSlider }
        label={ t("reader.settings.wordSpacing.title") }
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ wordSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value as number) } 
        onReset={ async() => await updatePreference(null) }
        range={ wordSpacingRangeConfig.range }
        step={ wordSpacingRangeConfig.step }
        formatOptions={{ style: "percent" }}
        canBeReset={ canBeReset(ThSpacingSettingsKeys.wordSpacing) }
      /> 
    }
    </>
  )
}