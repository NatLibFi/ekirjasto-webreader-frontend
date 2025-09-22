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
import { setParagraphIndent, setPublisherStyles } from "@/lib/settingsReducer";

export const StatefulParagraphIndent = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const paragraphIndent = useAppSelector(state => state.settings.paragraphIndent);
  const paragraphIndentRangeConfig = {
      variant: preferences.settings.keys[ThSettingsKeys.paragraphIndent].variant,
      range: preferences.settings.keys[ThSettingsKeys.paragraphIndent].range,
      step: preferences.settings.keys[ThSettingsKeys.paragraphIndent].step
    };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      paragraphIndent: value
    });

    dispatch(setParagraphIndent(getSetting("paragraphIndent")));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    { paragraphIndentRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ t("reader.settings.paraIndent.title") }
        defaultValue={ 0 } 
        value={ paragraphIndent || 0 } 
        onChange={ async(value) => await updatePreference(value) } 
        range={ paragraphIndentRangeConfig.range }
        step={ paragraphIndentRangeConfig.step }
        steppers={{
          decrementLabel: t("reader.settings.paraIndent.decrease"),
          incrementLabel: t("reader.settings.paraIndent.increase")
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
        displayTicks={ paragraphIndentRangeConfig.variant === ThSettingsRangeVariant.incrementedSlider }
        label={ t("reader.settings.paraIndent.title") }
        defaultValue={ 0 } 
        value={ paragraphIndent || 0 } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ paragraphIndentRangeConfig.range }
        step={ paragraphIndentRangeConfig.step }
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