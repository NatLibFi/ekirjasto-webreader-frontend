"use client";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import settingsStyles from "./assets/styles/settings.module.css";

import { ThSettingsGroupPref, ThSpacingSettingsKeys, ThTextSettingsKeys } from "@/preferences";
import { PressEvent } from "react-aria";
import { SettingComponent } from "@/components/Plugins/PluginRegistry";

import { ThSettingsWrapper } from "@/core/Components/Settings/ThSettingsWrapper";

import { usePreferences } from "@/preferences/hooks/usePreferences";

import classNames from "classnames";

export interface StatefulGroupWrapperProps {
  heading: string;
  moreLabel: string;
  moreTooltip: string;
  onPressMore: (e: PressEvent) => void;
  componentsMap: Record<string, SettingComponent>;
  prefs?: ThSettingsGroupPref<ThTextSettingsKeys | ThSpacingSettingsKeys>;
  defaultPrefs: {
    main: ThTextSettingsKeys[] | ThSpacingSettingsKeys[];
    subPanel: ThTextSettingsKeys[] | ThSpacingSettingsKeys[];
  };
}

export const StatefulGroupWrapper = ({
  heading,
  moreLabel,
  moreTooltip,
  onPressMore,
  componentsMap,
  prefs,
  defaultPrefs
}: StatefulGroupWrapperProps) => {
  const { preferences } = usePreferences();
  
  const main = prefs?.main || defaultPrefs.main;
  const displayOrder = prefs?.subPanel !== undefined 
    ? prefs.subPanel 
    : defaultPrefs.subPanel;

  const resolvedPrefs = {
    main: main,
    subPanel: displayOrder
  };
  
  return(
    <>
    <ThSettingsWrapper
      className={ classNames(settingsStyles.readerSettingsGroup, settingsStyles.readerSettingsAdvancedGroup) }
      items={ componentsMap }
      prefs={ resolvedPrefs }
      compounds={{
        label: heading,
        heading: {
          className: classNames(settingsStyles.readerSettingsLabel, settingsStyles.readerSettingsGroupLabel)
        },
        button: {
          className: classNames(readerSharedUI.icon, settingsStyles.readerSettingsAdvancedIcon),
          "aria-label": moreLabel,
          compounds: {
            tooltipTrigger: {
              delay: preferences.theming.icon.tooltipDelay,
              closeDelay: preferences.theming.icon.tooltipDelay
            },
            tooltip: {
              className: readerSharedUI.tooltip,
              placement: "top",
              offset: preferences.theming.icon.tooltipOffset || 0
            },
            label: moreTooltip
          },
          onPress: onPressMore
        }
      }}
    />
    </>
  )
}