"use client";

import { useMemo, useCallback } from "react";

import { StatefulSettingsItemProps } from "../../../Settings/models/settings";

import DefaultIcon from "./assets/icons/format_bold_wght200.svg";
import BolderIcon from "./assets/icons/format_bold_wght500.svg";

import { StatefulRadioGroup } from "@/components/Settings/StatefulRadioGroup";

import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFontWeight } from "@/lib/settingsReducer";

type FontWeight = "default" | "bolder";

export const UnstableStatefulFontWeight = ({ standalone = true }: StatefulSettingsItemProps) => {
  const { t } = useI18n();
  const fontWeight = useAppSelector(state => state.settings.fontWeight);

  const dispatch = useAppDispatch();

  const { getSetting, submitPreferences } = useEpubNavigator();

  const items = [
    {
      id: "default",
      icon: DefaultIcon,
      label: t("reader.settings.fontWeight.default"), 
      value: "default" 
    },
    {
      id: "bolder",
      icon: BolderIcon,
      label: t("reader.settings.fontWeight.bolder"), 
      value: "bolder" 
    }
  ];

  const derivedValue = useMemo(() => {
    if (fontWeight === 400) {
      return "default";
    } else if (fontWeight === 700) {
      return "bolder";
    }
    return "default";
  }, [fontWeight]);

  const updatePreference = useCallback(async (value: FontWeight) => {
    const fontWeightValue = value === "default" ? 400 : 700;
    await submitPreferences({ fontWeight: fontWeightValue });

    dispatch(setFontWeight(getSetting("fontWeight")));
  }, [submitPreferences, getSetting, dispatch]);

  return(
    <>
    <StatefulRadioGroup 
      standalone={ standalone } 
      label={ t("reader.settings.fontWeight.title") }
      orientation="horizontal" 
      value={ derivedValue } 
      onChange={ async (val: string) => await updatePreference(val as FontWeight) }
      items={ items }
    />  
    </>
  )
}