"use client";

import readerSharedUI from "../assets/styles/readerSharedUI.module.css";
import settingsStyles from "./assets/styles/settings.module.css";

import { ThNumberField, ThNumberFieldProps } from "@/core/Components/Settings/ThNumberField";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useI18n } from "@/i18n/useI18n";

import classNames from "classnames";

export interface StatefulNumberFieldProps extends Omit<ThNumberFieldProps, "classNames"> {
  standalone?: boolean;
  resetLabel?: string;
  placeholder?: string;
}

export const StatefulNumberField = ({
  standalone,
  label,
  placeholder,
  value,
  resetLabel,
  ...props
}: StatefulNumberFieldProps) => {
  const { t } = useI18n();
  const { preferences } = usePreferences();

  return (
    <>
    <ThNumberField
      value={ value }
      { ...props }
      { ...(standalone ? { label: label } : { "aria-label": label }) }
      placeholder={ placeholder }
      className={ classNames(settingsStyles.readerSettingsNumbfield, standalone ? settingsStyles.readerSettingsGroup : "") }
      compounds={{
        wrapper: {
          className: settingsStyles.readerSettingsNumberFieldWrapper
        },
        group: {
          className: settingsStyles.readerSettingsGroupWrapper
        },
        label: {
          className: settingsStyles.readerSettingsLabel
        },
        stepper: {
          className: readerSharedUI.icon
        },
        input: {
          className: settingsStyles.readerSettingsInput,
        },
        reset: {
          className: classNames(readerSharedUI.icon, settingsStyles.readerSettingsResetButton),
          isDisabled: value === undefined,
          compounds: {
            tooltipTrigger: {
              delay: preferences.theming.arrow.tooltipDelay,
              closeDelay: preferences.theming.arrow.tooltipDelay
            },
            tooltip: {
              className: readerSharedUI.tooltip
            },
            label: resetLabel ?? t("reader.settings.reset")
          }
        }
      }}
      />
    </>
  );
};