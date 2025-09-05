"use client";

import React, { useCallback, useEffect, useRef } from "react";

import { ActionKeyType, usePreferenceKeys } from "@/preferences";

import { ThLayoutUI } from "@/preferences/models/enums";

import readerHeaderStyles from "./assets/styles/readerHeader.module.css";
import overflowMenuStyles from "./Actions/assets/styles/overflowMenu.module.css";

import { ThActionEntry } from "@/core/Components/Actions/ThActionsBar";
import { ThHeader  } from "@/core/Components/Reader/ThHeader";
import { StatefulBackLink } from "./StatefulBackLink";
import { StatefulReaderRunningHead } from "./StatefulReaderRunningHead";
import { ThInteractiveOverlay } from "../core/Components/Reader/ThInteractiveOverlay";
import { StatefulCollapsibleActionsBar } from "./Actions/StatefulCollapsibleActionsBar";

import { useI18n } from "@/i18n/useI18n";
import { usePlugins } from "./Plugins/PluginProvider";
import { usePreferences } from "@/preferences/hooks";
import { useActions } from "@/core/Components";
import { useFocusWithin } from "react-aria";

import { setHovering } from "@/lib/readerReducer";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const StatefulReaderHeader = ({
  layout
}: {
  layout: ThLayoutUI;
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { reflowActionKeys, fxlActionKeys } = usePreferenceKeys();
  const RSPrefs = usePreferences();
  const { t } = useI18n();
  const { actionsComponentsMap } = usePlugins();
  
  const actionsMap = useAppSelector(state => state.actions.keys);
  const overflowMap = useAppSelector(state => state.actions.overflow);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isScroll = useAppSelector(state => state.settings.scroll);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const hasScrollAffordance = useAppSelector(state => state.reader.hasScrollAffordance);

  const actions = useActions({ ...actionsMap, ...overflowMap });
  const dispatch = useAppDispatch();

  const { focusWithinProps } = useFocusWithin({
    onFocusWithin() {
      dispatch(setHovering(true));
    },
    onBlurWithin() {      
      if (actions.everyOpenDocked()) {
        dispatch(setHovering(false));
      }
    }
  });

  const setHover = () => {
    if (!hasScrollAffordance && actions.everyOpenDocked()) {
      dispatch(setHovering(true));
    }
  };

  const removeHover = () => {
    if (!hasScrollAffordance && actions.everyOpenDocked()) {
      dispatch(setHovering(false));
    }
  };

  const listActionItems = useCallback(() => {
    const actionKeys = isFXL? fxlActionKeys : reflowActionKeys;
    const actionsItems: ThActionEntry<ActionKeyType>[] = [];

    if (actionsComponentsMap && Object.keys(actionsComponentsMap).length > 0) {
      actionKeys.forEach((key) => {      
        if (actionsComponentsMap[key]) {
          actionsItems.push({
            Trigger: actionsComponentsMap[key].Trigger,
            Target: actionsComponentsMap[key].Target,
            key: key
          });
        } else {
          console.warn(`Action key "${ key }" not found in the plugin registry while present in preferences.`);
        }
      });
    }
    
    return actionsItems;
  }, [isFXL, fxlActionKeys, reflowActionKeys, actionsComponentsMap]);

  useEffect(() => {
    // Blur any focused element when entering immersive mode
    if (isImmersive) {
      const focusElement = document.activeElement;
      if (focusElement && headerRef.current?.contains(focusElement)) {
        (focusElement as HTMLElement).blur();
      }
    }
  }, [isImmersive]);

  return (
    <>
    <ThInteractiveOverlay 
      id="reader-header-overlay"
      className="bar-overlay"
      isActive={ layout === ThLayoutUI.layered && isImmersive && !isHovering }
      onMouseEnter={ setHover }
      onMouseLeave={ removeHover }
    />

    <ThHeader 
      ref={ headerRef }
      className={ readerHeaderStyles.header } 
      id="top-bar" 
      aria-label={ t("reader.app.header.label") } 
      onMouseEnter={ setHover } 
      onMouseLeave={ removeHover }
      { ...focusWithinProps }
    >
      { RSPrefs.theming.header?.backLink && <StatefulBackLink className={ readerHeaderStyles.backLinkWrapper } /> }
      
      <StatefulReaderRunningHead />
      
      <StatefulCollapsibleActionsBar 
        id="reader-header-overflowMenu" 
        items={ listActionItems() }
        prefs={{ 
          ...RSPrefs.actions, 
          displayOrder: isFXL 
            ? RSPrefs.actions.fxlOrder 
            : RSPrefs.actions.reflowOrder 
        }}
        className={ readerHeaderStyles.actionsWrapper } 
        aria-label={ t("reader.app.header.actions") } 
        overflowMenuClassName={ 
          (!isScroll || RSPrefs.affordances.scroll.hintInImmersive) 
            ? overflowMenuStyles.hintButton 
            : undefined 
        }
      />
    </ThHeader>
    </>
  );
}