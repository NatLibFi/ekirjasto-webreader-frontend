"use client";

import React, { ComponentType, SVGProps } from "react";

import { HTMLAttributesWithRef, WithRef } from "../customTypes";

import { 
  Label, 
  LabelProps, 
  Radio, 
  RadioGroup, 
  RadioGroupProps, 
  RadioProps 
} from "react-aria-components"

export interface ThRadioGroupItems {
  id: string;
  value: string;
  icon?: ComponentType<SVGProps<SVGElement>>;
  label: string;
  isDisabled?: boolean;
}

export interface ThRadioGroupProps extends RadioGroupProps {
  ref?: React.ForwardedRef<HTMLDivElement>;
  label?: string;
  items?: ThRadioGroupItems[];
  compounds?: {
    /**
     * Props for the wrapper component. See `HTMLAttributesWithRef` for more information.
     */
    wrapper?: HTMLAttributesWithRef<HTMLDivElement>;
    /**
     * Props for the label component. See `LabelProps` for more information.
     */
    label?: WithRef<LabelProps, HTMLLabelElement>;
    /**
     * Props for the radio component. See `RadioProps` for more information.
     */
    radio?: Omit<RadioProps, "value">;
    /**
     * Props for the radio label component. See `HTMLAttributesWithRef` for more information.
     */
    radioLabel?: HTMLAttributesWithRef<HTMLSpanElement>;
  }
}

export const ThRadioGroup = ({
  ref,
  label,
  items,
  compounds,
  children,
  ...props
}: ThRadioGroupProps) => {
  if (React.isValidElement(children)) {
    return (
      <RadioGroup 
        ref={ ref }
        { ...props }
      >
        { label && <Label { ...compounds?.label }>
            { label }
          </Label> 
        }
        { children }
      </RadioGroup>
    )
  } else if (items) {
    return (
      <RadioGroup 
        { ...props }
      >
        { label && <Label { ...compounds?.label }>
            { label }
          </Label> 
        }
        <div { ...compounds?.wrapper }>
          { items.map((item) => (
            <Radio 
              { ...compounds?.radio }
              id={ item.id }
              key={ item.id }
              value={ item.value }
              isDisabled={ item.isDisabled }
            >
              <React.Fragment>
                { item.icon && <item.icon aria-hidden="true" focusable="false" /> }
                <span { ...compounds?.radioLabel }>
                  { item.label }
                </span> 
              </React.Fragment>
            </Radio>
          )) }
        </div>
      </RadioGroup>
    )
  }
}