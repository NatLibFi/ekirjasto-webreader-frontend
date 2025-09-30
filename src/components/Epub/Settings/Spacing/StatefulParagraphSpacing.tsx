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

export const StatefulParagraphSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const paragraphSpacingRangeConfig = {
    variant: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].variant,
    range: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].range,
    step: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].step
  };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setParagraphSpacing } = useSpacingPresets();

  const paragraphSpacing = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphSpacing);

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      paragraphSpacing: value
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
        placeholder={ `${ paragraphSpacingRangeConfig.range[0]} - ${paragraphSpacingRangeConfig.range[1] }` }
        defaultValue={ undefined } 
        value={ paragraphSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value) } 
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
      />
      : <StatefulSlider
        standalone={ standalone }
        displayTicks={ paragraphSpacingRangeConfig.variant === ThSettingsRangeVariant.incrementedSlider }
        label={ t("reader.settings.paraSpacing.title") }
        placeholder={ `${ paragraphSpacingRangeConfig.range[0]} - ${paragraphSpacingRangeConfig.range[1] }` }
        defaultValue={ undefined } 
        value={ paragraphSpacing ?? undefined } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ paragraphSpacingRangeConfig.range }
        step={ paragraphSpacingRangeConfig.step }
        formatOptions={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }}
      /> 
    }
    </>
  )
}