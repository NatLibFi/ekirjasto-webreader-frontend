"use client";

import { useEffect, useState } from "react";

import { HTMLAttributesWithRef, WithRef } from "../customTypes";

import { ThSettingsResetButton } from "./ThSettingsResetButton";

import { 
  Label,
  LabelProps,
  Slider,
  SliderOutput,
  SliderOutputProps,
  SliderProps,
  SliderThumb,
  SliderThumbProps,
  SliderTrack,
  SliderTrackProps 
} from "react-aria-components";

import { usePrevious } from "@/core/Hooks";

export interface ThSliderProps extends Omit<SliderProps, "minValue" | "maxValue"> {
  ref?: React.ForwardedRef<HTMLDivElement>;
  onReset?: () => void;
  label?: string;
  placeholder?: string;
  range: number[];
  compounds?: {
    /**
     * Props for the wrapper component.
     */
    wrapper?: HTMLAttributesWithRef<HTMLDivElement>;
    /**
     * Props for the label component. See `LabelProps` for more information.
     */
    label?: WithRef<LabelProps, HTMLLabelElement>;
    /**
     * Props for the slider output component. See `SliderOutputProps` for more information.
     */
    output?: WithRef<SliderOutputProps, HTMLOutputElement>;
    /**
     * Props for the slider placeholder component. See `HTMLSpanElement` for more information.
     */
    placeholder?: HTMLAttributesWithRef<HTMLSpanElement>;
    /**
     * Props for the slider track component. See `SliderTrackProps` for more information.
     */
    track?: WithRef<SliderTrackProps, HTMLDivElement>;
    /**
     * Props for the slider thumb component. See `SliderThumbProps` for more information.
     */
    thumb?: WithRef<SliderThumbProps, HTMLDivElement>;
    /**
     * Props for the reset button component. See `ThActionButtonProps` for more information.
     */
    reset?: any;
  };
}

export const ThSlider = ({
  ref,
  onReset,
  label,
  placeholder,
  range,
  compounds,
  value,
  ...props
}: ThSliderProps) => {
  // Track value changes to detect uncontrolled/controlled transitions
  const [valueTransitionKey, setValueTransitionKey] = useState(0);
  const previousValue = usePrevious(value);

  useEffect(() => {
    const isControlled = value !== undefined;
    const wasControlled = previousValue !== undefined;

    // Force key change on any controlled/uncontrolled transition
    if (isControlled !== wasControlled) {
      setValueTransitionKey(prev => prev + 1);
    }
  }, [previousValue, value]);

  // Create key that includes the transition state
  const componentKey = `${ value !== undefined ? "controlled" : "uncontrolled" }-${ String(value) }-${ valueTransitionKey }`;

  return(
    <>
    <div { ...compounds?.wrapper }>
      <Slider
        key={ componentKey }
        ref={ ref }
        value={ value }
        minValue={ Math.min(...range) }
        maxValue={ Math.max(...range) }
        { ...props }
      >
        { label && <Label { ...compounds?.label }>
            { label }
          </Label>
        }
        <SliderOutput { ...compounds?.output }>
          { value !== undefined
            ? value
            : placeholder
              ? <span { ...compounds?.placeholder }>{ placeholder }</span>
              : null
          }
        </SliderOutput>
        <SliderTrack { ...compounds?.track }>
          <SliderThumb { ...compounds?.thumb } />
        </SliderTrack>
      </Slider>
      { onReset && <ThSettingsResetButton { ...compounds?.reset } onClick={ onReset } /> }
    </div>
    </>
  )
}