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

export const StatefulParagraphIndent = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const paragraphIndentRangeConfig = {
      variant: preferences.settings.keys[ThSettingsKeys.paragraphIndent].variant,
      placeholder: preferences.settings.keys[ThSettingsKeys.paragraphIndent].placeholder,
      range: preferences.settings.keys[ThSettingsKeys.paragraphIndent].range,
      step: preferences.settings.keys[ThSettingsKeys.paragraphIndent].step
    };

  const placeholderText = usePlaceholder(paragraphIndentRangeConfig.placeholder, paragraphIndentRangeConfig.range);
  
  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setParagraphIndent } = useSpacingPresets();

  const paragraphIndent = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphIndent);

  const updatePreference = useCallback(async (value: number) => {
    await submitPreferences({
      paragraphIndent: value
    });

    setParagraphIndent(getSetting("paragraphIndent"));
    dispatch(setPublisherStyles(false));
  }, [submitPreferences, getSetting, dispatch, setParagraphIndent]);

  return (
    <>
    { paragraphIndentRangeConfig.variant === ThSettingsRangeVariant.numberField 
      ? <StatefulNumberField 
        standalone={ standalone }
        label={ t("reader.settings.paraIndent.title") }
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ paragraphIndent ?? undefined } 
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
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ paragraphIndent ?? undefined } 
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