"use client";

import { useCallback } from "react";

import settingsStyles from "./assets/styles/settings.module.css";

import { ThActionsKeys, ThLayoutDirection } from "@/preferences/models/enums";

import { ThRadioGroup, ThRadioGroupProps } from "@/core/Components/Settings/ThRadioGroup";

import { useGridNavigation } from "./hooks/useGridNavigation";
import { useObjectRef } from "react-aria";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

export interface StatefulRadioGroupProps extends Omit<ThRadioGroupProps, "classNames"> {
  standalone?: boolean;
  gridNavigation?: {
    containerRef?: React.RefObject<HTMLDivElement | null>;
    items: React.RefObject<any[]>;
    currentValue: any;
    onChange: (value: any) => void;
    isRTL?: boolean;
    onEscape?: () => void;
    onFocus?: (id: string) => void;
  };
}

export const StatefulRadioGroup = ({
  ref,
  standalone,
  label,
  children,
  gridNavigation,
  ...props
}: StatefulRadioGroupProps) => {
  const resolvedContainerRef = useObjectRef(gridNavigation?.containerRef);
  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === ThLayoutDirection.rtl;
    
  const dispatch = useAppDispatch();

  // Default escape handler that closes settings panel
  const defaultOnEscape = () => {
    dispatch(setActionOpen({
      key: ThActionsKeys.settings,
      isOpen: false
    }));
  };

  // Default focus handler that focuses elements by ID within the container only
  const defaultOnFocus = useCallback((id: string) => {
    const element = resolvedContainerRef.current?.querySelector(`[id="${ id }"]`);
    if (element) (element as HTMLElement).focus();
  }, [resolvedContainerRef]);

  const { onKeyDown } = useGridNavigation({
    containerRef: resolvedContainerRef,
    items: gridNavigation?.items || { current: [] },
    currentValue: gridNavigation?.currentValue || null,
    onChange: gridNavigation?.onChange || (() => {}),
    isRTL: gridNavigation?.isRTL ?? isRTL,
    onEscape: gridNavigation?.onEscape || defaultOnEscape,
    onFocus: gridNavigation?.onFocus || defaultOnFocus
  });

return (
  <>
  <ThRadioGroup 
    ref={ ref }
    className={ standalone ? settingsStyles.readerSettingsGroup : "" }
    { ...props }
    { ...(standalone ? { label: label } : { "aria-label": label }) }
    compounds={{
      wrapper: {
        className: settingsStyles.readerSettingsRadioWrapper,
        ref: resolvedContainerRef
      },
      label: {
        className: settingsStyles.readerSettingsLabel
      },
      radio: {
        className: settingsStyles.readerSettingsRadio,
        onKeyDown: onKeyDown
      }
    }}
  >
    { children }
  </ThRadioGroup>
  </>
  )
};