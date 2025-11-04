"use client";

import React, { useEffect, useRef, useState } from "react";

import arrowStyles from "./assets/styles/readerArrowButton.module.css";
import readerSharedUI from "./assets/styles/readerSharedUI.module.css";

import { PressEvent } from "react-aria";

import { ThNavigationButton, ThNavigationButtonProps } from "@/core/Components/Buttons/ThNavigationButton";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useI18n } from "@/i18n/useI18n";
import { usePaginatedArrows } from "@/hooks/usePaginatedArrows";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUserNavigated } from "@/lib/readerReducer";

import { isActiveElement } from "@/core/Helpers/focusUtilities";


import classNames from "classnames";

export interface StatefulReaderArrowButtonProps extends ThNavigationButtonProps {
  direction: "left" | "right";
}

export const StatefulReaderArrowButton = ({
  direction,
  className,
  isDisabled,
  onPress,
  ...props
}: StatefulReaderArrowButtonProps) => {
  const { preferences } = usePreferences();
  const { t } = useI18n();
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRTL = useAppSelector(state => state.publication.isRTL);
  const hasArrows = useAppSelector(state => state.reader.hasArrows);

  const { 
    isVisible, 
    occupySpace, 
    shouldTrackNavigation 
  } = usePaginatedArrows();
  

  const dispatch = useAppDispatch();

  const [isHovering, setIsHovering] = useState(false);

  const label = (
    direction === "right" && !isRTL || 
    direction === "left" && isRTL
  ) 
    ? t("reader.navigation.goForward") 
    : t("reader.navigation.goBackward");

  const handleClassNameFromState = () => {
    let className = "";
    if (!isVisible) {
      className = arrowStyles.visuallyHidden;
    }
    return className;
  };

  const handleClassNameFromSpaceProp = () => {
    let className = "";
    if (occupySpace) {
      className = arrowStyles.viewportLarge;
    }
    return className;
  };

  useEffect(() => {
    if ((isDisabled || (!hasArrows && !isHovering)) && isActiveElement(buttonRef.current)) {
      buttonRef.current!.blur();
    }
  });

  const blurOnEsc = (event: React.KeyboardEvent) => {    
    if (isActiveElement(buttonRef.current) && event.code === "Escape") {
      buttonRef.current!.blur();
    }
  };

  const handleOnPress = (e: PressEvent, cb: (e: PressEvent) => void) => {
    if (shouldTrackNavigation) {
      dispatch(setUserNavigated(true));
    }
    cb(e);
  }

  return (
    <>
    <ThNavigationButton 
      direction={ direction }
      ref= { buttonRef }
      aria-label={ label }
      onPress={ (e: PressEvent) => onPress && handleOnPress(e, onPress) }
      onHoverChange={ (isHovering: boolean) => setIsHovering(isHovering) } 
      onKeyDown={ blurOnEsc }
      className={ classNames(className, handleClassNameFromSpaceProp(), handleClassNameFromState()) }
      isDisabled={ isDisabled }
      preventFocusOnPress={ true }
      { ...props }
      compounds={ {
        tooltipTrigger: {
          delay: preferences.theming.arrow.tooltipDelay,
          closeDelay: preferences.theming.arrow.tooltipDelay
        },
        tooltip: {
          placement: direction === "left" ? "right" : "left",
          className: readerSharedUI.tooltip
        },
        label: label
      } }
    />
    </>
  )
}