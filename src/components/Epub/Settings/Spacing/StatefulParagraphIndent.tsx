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

export const StatefulParagraphIndent = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  const paragraphIndentRangeConfig = {
      variant: preferences.settings.keys[ThSettingsKeys.paragraphIndent].variant,
      placeholder: preferences.settings.keys[ThSettingsKeys.paragraphIndent].placeholder,
      range: preferences.settings.keys[ThSettingsKeys.paragraphIndent].range,
      step: preferences.settings.keys[ThSettingsKeys.paragraphIndent].step
    };

  const placeholderText = usePlaceholder(paragraphIndentRangeConfig.placeholder, paragraphIndentRangeConfig.range, "multiplier");
  
  const { getSetting, submitPreferences } = useEpubNavigator();

  const { getEffectiveSpacingValue, setParagraphIndent, canBeReset, allowReset } = useSpacingPresets();

  const paragraphIndent = getEffectiveSpacingValue(ThSpacingSettingsKeys.paragraphIndent);

  const updatePreference = useCallback(async (value: number | number[] | null) => {
    await submitPreferences({
      paragraphIndent: Array.isArray(value) ? value[0] : value
    });

    setParagraphIndent(getSetting("paragraphIndent"));
  }, [submitPreferences, getSetting, setParagraphIndent]);

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
        onReset={ allowReset() ? async () => await updatePreference(null) : undefined }
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
        canBeReset={ canBeReset(ThSpacingSettingsKeys.paragraphIndent) }
      />
      : <StatefulSlider
        standalone={ standalone }
        displayTicks={ paragraphIndentRangeConfig.variant === ThSettingsRangeVariant.incrementedSlider }
        label={ t("reader.settings.paraIndent.title") }
        placeholder={ placeholderText }
        defaultValue={ undefined } 
        value={ paragraphIndent ?? undefined } 
        onChange={ async(value) => await updatePreference(value as number) } 
        onReset={ allowReset() ? async () => await updatePreference(null) : undefined }
        range={ paragraphIndentRangeConfig.range }
        step={ paragraphIndentRangeConfig.step }
        formatOptions={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }}
        canBeReset={ canBeReset(ThSpacingSettingsKeys.paragraphIndent) }
      />
    } 
    </>
  )
}