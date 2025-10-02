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

export const StatefulParagraphSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const paragraphSpacingRangeConfig = {
    variant: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].variant,
    placeholder: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].placeholder,
    range: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].range,
    step: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].step
  };

  const placeholderText = usePlaceholder(paragraphSpacingRangeConfig.placeholder, paragraphSpacingRangeConfig.range);
  
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setParagraphSpacing, canBeReset } = useSpacingPresets();

  const paragraphSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphSpacing);

  const updatePreference = useCallback(async (value: number | number[] | null) => {
    await submitPreferences({
      paragraphSpacing: Array.isArray(value) ? value[0] : value
    });

    setParagraphSpacing(getSetting("paragraphSpacing"));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch, setParagraphSpacing]);

  return (
    <>
    { paragraphSpacingRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ t("reader.settings.paraSpacing.title") }
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ paragraphSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value) } 
        onReset={ async() => await updatePreference(null) }
        range={ paragraphSpacingRangeConfig.range }
        step={ paragraphSpacingRangeConfig.step }
        steppers={{
          decrementLabel: t("reader.settings.paraSpacing.decrease"),
          incrementLabel: t("reader.settings.paraSpacing.increase")
        }}
        formatOptions={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }} 
        isWheelDisabled={ true }
        isVirtualKeyboardDisabled={ true }
        canBeReset={ canBeReset(ThSpacingSettingsKeys.paragraphSpacing) }
      />
      : <StatefulSlider
        standalone={ standalone }
        displayTicks={ paragraphSpacingRangeConfig.variant === ThSettingsRangeVariant.incrementedSlider }
        label={ t("reader.settings.paraSpacing.title") }
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ paragraphSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value as number) } 
        onReset={ async() => await updatePreference(null) }
        range={ paragraphSpacingRangeConfig.range }
        step={ paragraphSpacingRangeConfig.step }
        formatOptions={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }}
        canBeReset={ canBeReset(ThSpacingSettingsKeys.paragraphSpacing) }
      /> 
    }
    </>
  )
}