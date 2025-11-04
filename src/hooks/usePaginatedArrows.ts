import { useEffect, useMemo, useRef } from "react";

import { ThArrowVariant } from "@/preferences/models/enums";
import { ThPaginatedAffordancePrefValue } from "@/preferences/preferences";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { usePrevious } from "@/core/Hooks/usePrevious";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setHasArrows } from "@/lib/readerReducer";

import { makeBreakpointsMap } from "@/core/Helpers/breakpointsMap";

export interface UsePaginatedArrowsReturn {
  isVisible: boolean;
  occupySpace: boolean;
  shouldTrackNavigation: boolean;
}

export const usePaginatedArrows = (): UsePaginatedArrowsReturn => {
  const { preferences } = usePreferences();
  const dispatch = useAppDispatch();
  
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isFullscreen = useAppSelector(state => state.reader.isFullscreen);
  const hasUserNavigated = useAppSelector(state => state.reader.hasUserNavigated);
  const hasArrows = useAppSelector(state => state.reader.hasArrows);
  const scroll = useAppSelector(state => state.settings.scroll);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const breakpoint = useAppSelector(state => state.theming.breakpoint);
  
  // Track previous values
  const wasImmersive = usePrevious(isImmersive) ?? false;
  const wasFullscreen = usePrevious(isFullscreen) ?? false;
  const isScroll = scroll && !isFXL;
  const wasScrolling = usePrevious(isScroll) ?? false;
  const wasUserNavigated = usePrevious(hasUserNavigated) ?? false;

  // Track state transitions
  const fromImmersive = wasImmersive && !isImmersive;
  const toImmersive = !wasImmersive && isImmersive;
  const fromFullscreen = wasFullscreen && !isFullscreen;
  const toFullscreen = !wasFullscreen && isFullscreen;
  const fromScrolling = wasScrolling && !isScroll;
  const toNavigation = !wasUserNavigated && hasUserNavigated;

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

  // Handle state transitions
  useEffect(() => {
    // Check for discard transitions (false -> true)
    const shouldHide = 
      (discard?.includes("immersive") && toImmersive) ||
      (discard?.includes("fullscreen") && toFullscreen) ||
      (discard?.includes("navigation") && toNavigation);

    // Check for hint transitions (true -> false)
    const shouldShow = 
      (hint?.includes("immersiveChange") && fromImmersive) ||
      (hint?.includes("fullscreenChange") && fromFullscreen) ||
      (hint?.includes("layoutChange") && fromScrolling);

    if (shouldHide) {
      dispatch(setHasArrows(false));
    } else if (shouldShow) {
      dispatch(setHasArrows(true));
    }
  }, [toImmersive, toFullscreen, toNavigation, fromImmersive, fromFullscreen, fromScrolling, discard, hint, dispatch]);

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
    occupySpace: hasArrows && variant === ThArrowVariant.stacked,
    shouldTrackNavigation: Array.isArray(discard) && discard.includes("navigation")
  };
};