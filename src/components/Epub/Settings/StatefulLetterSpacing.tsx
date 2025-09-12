"use client";

import { useCallback } from "react";

import { defaultLetterSpacing, ThSettingsKeys, ThSettingsRangeVariant } from "@/preferences";

import { StatefulSettingsItemProps } from "../../Settings/models/settings";

import { StatefulNumberField } from "../../Settings/StatefulNumberField";
import { StatefulSlider } from "../../Settings/StatefulSlider";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setLetterSpacing, setPublisherStyles } from "@/lib/settingsReducer";

export const StatefulLetterSpacing = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const letterSpacing = useAppSelector(state => state.settings.letterSpacing);
  const letterSpacingRangeConfig = {
    variant: preferences.settings.keys?.[ThSettingsKeys.letterSpacing]?.variant ?? defaultLetterSpacing.variant,
    range: preferences.settings.keys?.[ThSettingsKeys.letterSpacing]?.range ?? defaultLetterSpacing.range,
    step: preferences.settings.keys?.[ThSettingsKeys.letterSpacing]?.step ?? defaultLetterSpacing.step
  };
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      letterSpacing: value
    });

    dispatch(setLetterSpacing(getSetting("letterSpacing")));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch]);

  return (
    <>
    { letterSpacingRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ t("reader.settings.letterSpacing.title") }
        defaultValue={ 0 } 
        value={ letterSpacing || 0 } 
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
        defaultValue={ 0 } 
        value={ letterSpacing || 0 } 
        onChange={ async(value) => await updatePreference(value as number) } 
        range={ letterSpacingRangeConfig.range }
        step={ letterSpacingRangeConfig.step }
        formatOptions={ { style: "percent" } }
      />
    } 
    </>
  )
}