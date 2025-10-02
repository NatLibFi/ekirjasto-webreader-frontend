"use client";

import { ComponentType, SVGProps, useCallback, useEffect, useState } from "react";

import { HTMLAttributesWithRef, WithRef } from "../customTypes";

import { ThSettingsResetButton } from "./ThSettingsResetButton";

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

import { usePrevious } from "@/core/Hooks";

export interface ThNumberFieldProps extends Omit<NumberFieldProps, "minValue" | "maxValue" | "decrementAriaLabel" | "incrementAriaLabel"> {
  ref?: React.ForwardedRef<HTMLInputElement>;
  onReset?: () => void;
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
     * Props for the wrapper component.
     */
    wrapper?: HTMLAttributesWithRef<HTMLDivElement>;
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
    /**
     * Props for the Button component used for resetting the value. See `ThActionButtonProps` for more information.
     */
    reset?: any;
  };
}

export const ThNumberField = ({
  ref,
  onReset,
  label,
  placeholder,
  range,
  isVirtualKeyboardDisabled,
  steppers,
  compounds,
  value,
  ...props
}: ThNumberFieldProps) => {
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

  return (
    <>
      <div { ...compounds?.wrapper }>
        <NumberField
          key={ componentKey }
          ref={ ref }
          value={ value }
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
            {steppers &&
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
        { onReset && <ThSettingsResetButton { ...compounds?.reset } onClick={ onReset } /> }
      </div>
    </>
  );
};