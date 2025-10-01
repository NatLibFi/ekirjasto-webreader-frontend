"use client";

import Reset from "./assets/icons/reset_settings.svg";

import { ThActionButton, ThActionButtonProps } from "../Buttons/ThActionButton";

export const ThSettingsResetButton = ({
  label,
  ref,
  compounds,
  children,
  ...props
}: ThActionButtonProps) => {
  return (
    <ThActionButton
      ref={ ref }
      compounds={ compounds }
      { ...props }
    >
      { children 
        ? children 
        : <>
          <Reset aria-hidden="true" focusable="false" /> 
          { label }
          </> 
      }
    </ThActionButton>
  )
}