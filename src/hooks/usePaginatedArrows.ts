import { useEffect, useMemo } from "react";

import { ThArrowVariant } from "@/preferences/models/enums";
import { ThPaginatedAffordancePrefValue } from "@/preferences/preferences";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useReaderTransitions } from "./useReaderTransitions";
import { usePrevious } from "@/core/Hooks/usePrevious";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setHasArrows, setUserNavigated } from "@/lib/readerReducer";

import { makeBreakpointsMap } from "@/core/Helpers/breakpointsMap";

export interface UsePaginatedArrowsReturn {
  isVisible: boolean;
  occupySpace: boolean;
  shouldTrackNavigation: boolean;
}

export const usePaginatedArrows = (): UsePaginatedArrowsReturn => {
  const { preferences } = usePreferences();
  const hasArrows = useAppSelector(state => state.reader.hasArrows);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const breakpoint = useAppSelector(state => state.theming.breakpoint);
  
  // Get reader state transitions
  const {
    isScroll,
    fromImmersive,
    toImmersive,
    fromFullscreen,
    toFullscreen,
    fromScroll,
    toUserNavigation
  } = useReaderTransitions();

  const dispatch = useAppDispatch();

  // Get preferences
  const { variant, discard, hint } = useMemo(() => {
    const prefs = isFXL 
      ? preferences.affordances.paginated.fxl 
      : preferences.affordances.paginated.reflow;
    const prefsMap = makeBreakpointsMap<ThPaginatedAffordancePrefValue>({
      defaultValue: prefs.default,
      fromEnum: ThArrowVariant,
      pref: prefs.breakpoints,
      validateKey: "variant"
    });
    return prefsMap[breakpoint as keyof typeof prefsMap] || prefs.default;
  }, [breakpoint, isFXL, preferences]);

  // Track previous prefs
  const prevVariant = usePrevious(variant);
  const prevDiscard = usePrevious(discard);

  // Handle state transitions
  useEffect(() => {
    // If navigation was just added to discard, reset navigation state
    if (!prevDiscard?.includes("navigation") && discard?.includes("navigation")) {
      dispatch(setUserNavigated(false));
      return;
    }
    
    // If discard changed to "none", show the arrows and reset navigation state
    if (discard === "none" && prevDiscard !== "none") {
      dispatch(setHasArrows(true));
      dispatch(setUserNavigated(false));
      return;
    }
    // Reset when changing from "none" to "stacked" or "layered"
    if (prevVariant === ThArrowVariant.none && variant !== ThArrowVariant.none) {
      dispatch(setHasArrows(true));
      dispatch(setUserNavigated(false));
      return;
    }

    // Check for discard transitions (false -> true)
    const shouldHide = 
      (discard?.includes("immersive") && toImmersive) ||
      (discard?.includes("fullscreen") && toFullscreen) ||
      (discard?.includes("navigation") && toUserNavigation);

    // Check for hint transitions (true -> false)
    const shouldShow = 
      (hint?.includes("immersiveChange") && fromImmersive) ||
      (hint?.includes("fullscreenChange") && fromFullscreen) ||
      (hint?.includes("layoutChange") && fromScroll);

    if (shouldHide) {
      dispatch(setHasArrows(false));
      // Reset the navigation flag after handling the transition
      if (discard?.includes("navigation") && toUserNavigation) {
        dispatch(setUserNavigated(false));
      }
    } else if (shouldShow) {
      dispatch(setHasArrows(true));
    }
  }, [toImmersive, toFullscreen, toUserNavigation, fromImmersive, fromFullscreen, fromScroll, discard, hint, prevVariant, variant, prevDiscard, dispatch]);

  // Early return for special cases
  if (variant === ThArrowVariant.none || isScroll) {
    return {
      isVisible: false,
      occupySpace: false,
      shouldTrackNavigation: false
    };
  }

  return {
    isVisible: hasArrows,
    occupySpace: variant === ThArrowVariant.stacked,
    shouldTrackNavigation: Array.isArray(discard) && discard.includes("navigation")
  };
};