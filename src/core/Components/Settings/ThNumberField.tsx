"use client";

import { ComponentType, SVGProps } from "react";

import { WithRef } from "../customTypes";

import AddIcon from "./assets/icons/add.svg";
import RemoveIcon from "./assets/icons/remove.svg";

import { 
  Button, 
  ButtonProps, 
  Group, 
  GroupProps, 
  Input, 
  InputProps, 
  Label, 
  LabelProps, 
  NumberField, 
  NumberFieldProps 
} from "react-aria-components";

export interface ThNumberFieldProps extends Omit<NumberFieldProps, "minValue" | "maxValue" | "decrementAriaLabel" | "incrementAriaLabel"> {
  ref?: React.ForwardedRef<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  range: number[];
  isVirtualKeyboardDisabled?: boolean;
  steppers?: {
    decrementIcon?: ComponentType<SVGProps<SVGElement>> | null;
    decrementLabel: string;
    incrementIcon?: ComponentType<SVGProps<SVGElement>> | null;
    incrementLabel: string;
  };
  compounds?: {
    /**
     * Props for the Group component. See `GroupProps` for more information.
     */
    group?: WithRef<GroupProps, HTMLDivElement>;
    /**
     * Props for the Input component. See `InputProps` for more information.
     */
    input?: Omit<WithRef<InputProps, HTMLInputElement>, "placeholder">;
    /**
     * Props for the Label component. See `LabelProps` for more information.
     */
    label?: WithRef<LabelProps, HTMLLabelElement>;
    /**
     * Props for the Button component used for decrement/increment. See `ButtonProps` for more information.
     */
    stepper?: ButtonProps;
  };
}

export const ThNumberField = ({
  ref,
  label,
  placeholder,
  range,
  isVirtualKeyboardDisabled,
  steppers,
  compounds,
  ...props
}: ThNumberFieldProps) => {

  return (
    <NumberField 
      ref={ ref }
      minValue={ Math.min(...range) }
      maxValue={ Math.max(...range) }
      decrementAriaLabel={ steppers?.decrementLabel }
      incrementAriaLabel={ steppers?.incrementLabel }
      { ...props }
    >
      { label && <Label { ...compounds?.label }>
          { label }
        </Label>
      }

      <Group { ...compounds?.group }>
        { steppers && 
          <Button 
          { ...compounds?.stepper }
          slot="decrement" 
        >
          { steppers.decrementIcon 
            ? <steppers.decrementIcon aria-hidden="true" focusable="false" /> 
            : <RemoveIcon aria-hidden="true" focusable="false" /> }
          </Button> 
        }

        <Input 
          { ...compounds?.input } 
          { ...(isVirtualKeyboardDisabled ? { inputMode: "none" } : {}) }
          placeholder={ placeholder } 
        />

        { steppers && 
          <Button 
            { ...compounds?.stepper }
            slot="increment" 
          >
            { steppers.incrementIcon 
              ? <steppers.incrementIcon aria-hidden="true" focusable="false" /> 
              : <AddIcon aria-hidden="true" focusable="false" /> }
          </Button>
        }
      </Group>
    </NumberField>
  );
};