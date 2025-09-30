"use client";

import settingsStyles from "./assets/styles/settings.module.css";

import { ThSlider, ThSliderProps } from "@/core/Components/Settings/ThSlider";

import classNames from "classnames";

export interface StatefulSliderProps extends Omit<ThSliderProps, "classNames"> {
  standalone?: boolean;
  placeholder?: string;
  displayTicks?: boolean;
}

export const StatefulSlider = ({
  standalone,
  label,
  placeholder,
  displayTicks = false,
  ...props
}: StatefulSliderProps) => {
  const style = {
    ...(displayTicks && props.range && props.step ? {
      "--slider-ticks": (() => {
        const [min, max] = [Math.min(...props.range), Math.max(...props.range)];
        const step = props.step || 1;
        const range = max - min;
        const totalIntervals = range / step;
        return Math.ceil(totalIntervals);
      })()
    } : {}),
    ...props.style
  };

  return (
    <>
    <ThSlider
      { ...props }
      { ...(standalone ? { label: label } : {"aria-label": label}) }
      placeholder={ placeholder }
      className={classNames(
        settingsStyles.readerSettingsSlider,
        standalone && settingsStyles.readerSettingsGroup,
        displayTicks && settingsStyles.readerSettingsSliderWithTicks
      )}
      style={ style }
      compounds={{
        label: {
          className: classNames(settingsStyles.readerSettingsLabel, settingsStyles.readerSettingsSliderLabel)
        },
        output: {
          className: settingsStyles.readerSettingsSliderOutput
        },
        placeholder: {
          className: settingsStyles.readerSettingsSliderPlaceholder
        },
        track: {
          className: settingsStyles.readerSettingsSliderTrack
        },
        thumb: {
          className: settingsStyles.readerSettingsSliderThumb
        }
      }}
    />
    </>
  )
}