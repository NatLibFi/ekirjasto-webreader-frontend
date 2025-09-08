"use client";

import React, { useCallback, useEffect, useRef } from "react";

import { ThemeKeyType, usePreferenceKeys } from "@/preferences";

import settingsStyles from "../../Settings/assets/styles/settings.module.css";

import CheckIcon from "./assets/icons/check.svg";

import { ThActionsKeys, ThLayoutDirection } from "@/preferences/models/enums";

import { StatefulRadioGroup } from "../../Settings/StatefulRadioGroup";
import { Radio } from "react-aria-components";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useEpubNavigator } from "@/core/Hooks/Epub/useEpubNavigator";
import { useI18n } from "@/i18n/useI18n";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";
import { setTheme } from "@/lib/themeReducer";

import classNames from "classnames";
import { buildThemeObject } from "@/preferences/helpers/buildThemeObject";

export const StatefulTheme = ({ mapArrowNav }: { mapArrowNav?: number }) => {
  const { fxlThemeKeys, reflowThemeKeys } = usePreferenceKeys();
  const { preferences } = usePreferences();
  const { t } = useI18n();

  const radioGroupRef = useRef<HTMLDivElement | null>(null);

  const isFXL = useAppSelector(state => state.publication.isFXL);
  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === ThLayoutDirection.rtl;
  const themeArray = isFXL ? fxlThemeKeys : reflowThemeKeys;

  const themeObject = useAppSelector(state => state.theming.theme);
  const theme = isFXL ? themeObject.fxl : themeObject.reflow;
  const colorScheme = useAppSelector(state => state.theming.colorScheme);

  const themeItems = useRef<(ThemeKeyType | "auto")[]>(
    themeArray.filter((theme: ThemeKeyType | "auto") => {
      if (theme === "auto") {
        return preferences.theming.themes.systemThemes !== undefined && 
          Object.values(preferences.theming.themes.systemThemes).every(t => 
            themeArray.includes(t)
          );
      }
      return true;
    })
  );

  const dispatch = useAppDispatch();

  const { submitPreferences } = useEpubNavigator();

  const updatePreference = useCallback(async (value: ThemeKeyType | "auto") => {
    const themeProps = buildThemeObject<typeof value>({
      theme: value,
      themeKeys: preferences.theming.themes.keys,
      systemThemes: preferences.theming.themes.systemThemes,
      colorScheme
    })
    await submitPreferences(themeProps);

    dispatch(setTheme({ 
      key: isFXL ? "fxl" : "reflow", 
      value: value
    }));
  }, [isFXL, preferences.theming.themes.keys, preferences.theming.themes.systemThemes, submitPreferences, dispatch, colorScheme]);

  // It’s easier to inline styles from preferences for these
  // than spamming the entire app with all custom properties right now
  const doStyles = useCallback((t: ThemeKeyType | "auto") => {
    // For some reason Typescript will just refuse to create dts files
    // for the packages if we set it to CSSProperties…
    let cssProps: any = {
      boxSizing: "border-box",
      color: "#999999"
    };

    if (t === "auto") {
      if (preferences.theming.themes.systemThemes !== undefined) {
        cssProps.background = isRTL 
        ? `linear-gradient(148deg, ${ preferences.theming.themes.keys[preferences.theming.themes.systemThemes.dark].background } 48%, ${ preferences.theming.themes.keys[preferences.theming.themes.systemThemes.light].background } 100%)` 
        : `linear-gradient(148deg, ${ preferences.theming.themes.keys[preferences.theming.themes.systemThemes.light].background } 0%, ${ preferences.theming.themes.keys[preferences.theming.themes.systemThemes.dark].background } 48%)`;
        cssProps.color = "#ffffff";
        cssProps.border = `1px solid ${ preferences.theming.themes.keys[preferences.theming.themes.systemThemes.light].subdue }`;
      } else {
        cssProps.display = "none";
      }
    } else {
      const themeKey = t as keyof typeof preferences.theming.themes.keys;
      const theme = preferences.theming.themes.keys[themeKey];
      cssProps.background = theme.background;
      cssProps.color = theme.text;
      cssProps.border = `1px solid ${theme.subdue}`;
    };
    
    return cssProps;
  }, [preferences, isRTL]);

  // mapArrowNav is the number of columns. This assumption 
  // should be safe since even in vertical-writing, 
  // the layout should be horizontal (?)
  const handleKeyboardNav = async (e: React.KeyboardEvent) => {
    
    if (mapArrowNav && !isNaN(mapArrowNav)) {
      const findNextVisualTheme = async (perRow: number) => {
        const currentIdx = themeItems.current.findIndex((val) => val === theme);
        const nextIdx = currentIdx + perRow;
        if (nextIdx >= 0 && nextIdx < themeItems.current.length) {
          await updatePreference(themeItems.current[nextIdx]);

          // Focusing here instead of useEffect on theme change so that 
          // it doesn’t steal focus when themes is not the first radio group in the sheet
          if (radioGroupRef.current) {
            const themeToFocus = radioGroupRef.current.querySelector(`#${themeItems.current[nextIdx]}`) as HTMLElement;
            if (themeToFocus) themeToFocus.focus();
          }
        }
      };

      switch(e.code) {
        case "Escape":
          dispatch(setActionOpen({ 
            key: ThActionsKeys.settings,
            isOpen: false 
          })); 
          break;
        case "ArrowUp":
          e.preventDefault();
          await findNextVisualTheme(-mapArrowNav);
          break;
        case "ArrowDown":
          e.preventDefault();
          await findNextVisualTheme(mapArrowNav);
          break;
        case "ArrowLeft":
          e.preventDefault();
          isRTL ? await findNextVisualTheme(1) : await findNextVisualTheme(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          isRTL ? await findNextVisualTheme(-1) : await findNextVisualTheme(1);
          break;
        default:
          break;
      }
    }
  };

  // Edge case where the value stored is auto, but the array doesn’t have it
  useEffect(() => {
    if (theme === "auto" && !themeItems.current.includes(theme)) {
      updatePreference(themeItems.current[0]);
    }
  }, [theme, updatePreference]);

  return (
    <>
    <StatefulRadioGroup
      ref={ radioGroupRef }
      standalone={ true }
      label={ t("reader.settings.themes.title") }
      value={ theme }
      onChange={ async (val) => await updatePreference(val as ThemeKeyType) }
    >
      <div className={ classNames(settingsStyles.readerSettingsRadioWrapper, settingsStyles.readerSettingsThemesWrapper) }>
        { themeItems.current.map(( themeItem ) => 
          <Radio
            className={ classNames(
              settingsStyles.readerSettingsRadio, 
              settingsStyles.readerSettingsThemeRadio
            ) }
            value={ themeItem }
            id={ themeItem }
            key={ themeItem }
            style={ doStyles(themeItem) }
            { ...(mapArrowNav && !isNaN(mapArrowNav) ? {
              onKeyDown: (async (e: React.KeyboardEvent) => await handleKeyboardNav(e))
            } : {}) }
          >
          <span>
            { t(`reader.settings.themes.${ themeItem }`, { defaultValue: themeItem }) }
            { themeItem === theme && <CheckIcon aria-hidden="true" focusable="false" /> }
          </span>
        </Radio>
        ) }
      </div>
    </StatefulRadioGroup>
    </>
  )
}