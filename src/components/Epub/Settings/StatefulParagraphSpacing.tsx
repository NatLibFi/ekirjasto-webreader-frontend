"use client";

import { useCallback } from "react";

import { ThSettingsKeys, ThSettingsRangeVariant } from "@/preferences";

import { StatefulSettingsItemProps } from "../../Settings/models/settings";

import { StatefulNumberField } from "../../Settings/StatefulNumberField";
import { StatefulSlider } from "../../Settings/StatefulSlider";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setParagraphSpacing, setPublisherStyles } from "@/lib/settingsReducer";

export const StatefulParagraphSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const paragraphSpacing = useAppSelector(state => state.settings.paragraphSpacing);
  const paragraphSpacingRangeConfig = {
    variant: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].variant,
    range: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].range,
    step: preferences.settings.keys[ThSettingsKeys.paragraphSpacing].step
  };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      paragraphSpacing: value
    });

    dispatch(setParagraphSpacing(getSetting("paragraphSpacing")));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    { paragraphSpacingRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ t("reader.settings.paraSpacing.title") }
        defaultValue={ 0 } 
        value={ paragraphSpacing || 0 } 
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
        defaultValue={ 0 } 
        value={ paragraphSpacing || 0 } 
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