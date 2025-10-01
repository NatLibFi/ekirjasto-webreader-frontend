"use client";

import { useCallback, useState } from "react";

import { HTMLAttributesWithRef, WithRef } from "../customTypes";

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
import { ThActionButtonProps } from "../Buttons";

import { ThSettingsResetButton } from "./ThSettingsResetButton";

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
    reset?: ThActionButtonProps;
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
  // Force re-render when onReset is called, 
  // otherwise the value will not be updated
  // because React Aria Components do not like
  // when going from uncontrolled to controlled
  // and vice-versa.
  const [renderTrigger, setRenderTrigger] = useState(0);

  const handleReset = useCallback(() => {
    setRenderTrigger(prev => prev + 1);
    onReset?.();
  }, [onReset]);
  
  return(
    <>
    <div { ...compounds?.wrapper }>
      <Slider 
        key={ renderTrigger }
        ref={ ref }
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
      { onReset && <ThSettingsResetButton { ...compounds?.reset } onClick={ handleReset } /> }
    </div>
    </>
  )
}