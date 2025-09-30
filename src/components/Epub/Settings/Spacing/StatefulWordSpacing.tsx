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

import { useAppDispatch } from "@/lib/hooks";
import { setPublisherStyles } from "@/lib/settingsReducer";

import { getPlaceholder } from "../helpers/getPlaceholder";

export const StatefulWordSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const wordSpacingRangeConfig = {
    variant: preferences.settings.keys[ThSettingsKeys.wordSpacing].variant,
    placeholder: preferences.settings.keys[ThSettingsKeys.wordSpacing].placeholder,
    range: preferences.settings.keys[ThSettingsKeys.wordSpacing].range,
    step: preferences.settings.keys[ThSettingsKeys.wordSpacing].step
  };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setWordSpacing } = useSpacingPresets();

  const wordSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.wordSpacing);

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      wordSpacing: value
    });

    setWordSpacing(getSetting("wordSpacing"));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch, setWordSpacing]);

  return (
    <>
    { wordSpacingRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ t("reader.settings.wordSpacing.title") }
        placeholder={ getPlaceholder(wordSpacingRangeConfig.placeholder, wordSpacingRangeConfig.range) }
        defaultValue={ undefined } 
        value={ wordSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value) } 
        range={ wordSpacingRangeConfig.range }
        step={ wordSpacingRangeConfig.step }
        steppers={{
          decrementLabel: t("reader.settings.wordSpacing.decrease"),
          incrementLabel: t("reader.settings.wordSpacing.increase")
        }}
        formatOptions={{ style: "percent" }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
      />
      : <StatefulSlider
        standalone={ standalone }
        displayTicks={ wordSpacingRangeConfig.variant === ThSettingsRangeVariant.incrementedSlider }
        label={ t("reader.settings.wordSpacing.title") }
        placeholder={ getPlaceholder(wordSpacingRangeConfig.placeholder, wordSpacingRangeConfig.range) }
        defaultValue={ undefined } 
        value={ wordSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ wordSpacingRangeConfig.range }
        step={ wordSpacingRangeConfig.step }
        formatOptions={{ style: "percent" }}
      /> 
    }
    </>
  )
}