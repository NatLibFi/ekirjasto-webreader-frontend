"use client";

import React from "react";

import settingsStyles from "./assets/styles/settings.module.css";

import { ThDropdown, ThDropdownProps } from "@/core/Components/Settings/ThDropdown/ThDropdown";

import classNames from "classnames";

export interface StatefulDropdownProps extends Omit<ThDropdownProps, "classNames"> {
  standalone?: boolean;
}

export const StatefulDropdown = ({
  standalone,
  label,
  className,
  compounds,
  ...props
}: StatefulDropdownProps) => {

  return (
    <ThDropdown
      { ...props }
      { ...(standalone ? { label } : { "aria-label": label }) }
      className={ classNames(
        settingsStyles.readerSettingsDropdown,
        standalone && settingsStyles.readerSettingsGroup,
        className
      ) }
        compounds={{
          label: {
            className: settingsStyles.readerSettingsLabel
          },
          button: {
            className: settingsStyles.readerSettingsDropdownButton
          },
          popover: {
            className: settingsStyles.readerSettingsDropdownPopover,
            placement: "bottom"
          },
          ...(React.isValidElement(compounds?.listbox) 
            ? { listbox: compounds.listbox }
            : {
                listbox: {
                  className: settingsStyles.readerSettingsDropdownListbox,
                  ...(compounds?.listbox || {})
                },
                listboxItem: {
                  className: settingsStyles.readerSettingsDropdownListboxItem,
                  ...(compounds?.listboxItem || {})
                }
              })
        }}
      />
  );
};
