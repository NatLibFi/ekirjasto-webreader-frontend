"use client";

import { useCallback, useRef } from "react";

import settingsStyles from "./assets/styles/settings.module.css";

import { ThActionsKeys, ThLayoutDirection } from "@/preferences/models/enums";

import { ThRadioGroup, ThRadioGroupProps } from "@/core/Components/Settings/ThRadioGroup";

import { useGridNavigation } from "./hooks/useGridNavigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setActionOpen } from "@/lib/actionsReducer";

export interface StatefulRadioGroupProps extends Omit<ThRadioGroupProps, "classNames"> {
  standalone?: boolean;
  useGraphicalNavigation?: boolean;
}

export const StatefulRadioGroup = ({
  ref,
  standalone,
  useGraphicalNavigation = true,
  label,
  items,
  value,
  children,
  onChange,
  ...props
}: StatefulRadioGroupProps) => {
  const itemsRef = useRef(items || []);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const direction = useAppSelector(state => state.reader.direction);
  const isRTL = direction === ThLayoutDirection.rtl;
    
  const dispatch = useAppDispatch();

  // Default escape handler that closes settings panel
  const onEscapeCallback = useCallback(() => {
    dispatch(setActionOpen({
      key: ThActionsKeys.settings,
      isOpen: false
    }));
  }, [dispatch]);

  // Default focus handler that focuses elements by value within the container only
  const onFocusCallback = useCallback((value: string) => {
    const element = wrapperRef.current?.querySelector(`[value="${ value }"]`);
    if (element) (element as HTMLElement).focus();
  }, []);

  const { onKeyDown } = useGridNavigation({
    containerRef: wrapperRef,
    items: useGraphicalNavigation !== false ? itemsRef : { current: [] },
    currentValue: useGraphicalNavigation !== false ? value : null,
    onChange: onChange || (() => {}),
    isRTL,
    onEscape: onEscapeCallback,
    onFocus: onFocusCallback
  });

return (
  <>
  <ThRadioGroup 
    ref={ ref }
    className={ standalone ? settingsStyles.readerSettingsGroup : "" }
    { ...props }
    { ...(standalone ? { label: label } : { "aria-label": label }) }
    value={ value }
    onChange={ onChange }
    items={ useGraphicalNavigation !== false ? items : [] }
    compounds={{
      wrapper: {
        className: settingsStyles.readerSettingsRadioWrapper,
        ref: wrapperRef
      },
      label: {
        className: settingsStyles.readerSettingsLabel
      },
      radio: {
        className: settingsStyles.readerSettingsRadio,
        onKeyDown: useGraphicalNavigation !== false ? onKeyDown : undefined
      }
    }}
  >
    { children }
  </ThRadioGroup>
  </>
  )
};