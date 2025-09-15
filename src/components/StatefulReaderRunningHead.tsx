"use client";

import { useMemo } from "react";

import { ThRunningHeadFormat } from "@/preferences/models/enums";
import { ThFormatPrefValue } from "@/preferences";

import { ThRunningHead } from "@/core/Components";

import { useI18n } from "@/i18n/useI18n";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useAppSelector } from "@/lib/hooks";
import { makeBreakpointsMap } from "@/core/Helpers/breakpointsMap";

export const StatefulReaderRunningHead = () => {
  const { t } = useI18n();
  const { preferences } = usePreferences();
  
  const unstableTimeline = useAppSelector(state => state.publication.unstableTimeline);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const isFullscreen = useAppSelector(state => state.reader.isFullscreen);
  const breakpoint = useAppSelector(state => state.theming.breakpoint);

  const formatPref = isFXL 
    ? preferences.theming.header?.runningHead?.format?.fxl
    : preferences.theming.header?.runningHead?.format?.reflow;

  // Get the fallback format based on isFXL
  const fallbackFormat = useMemo<ThFormatPrefValue<ThRunningHeadFormat>>(() => ({
    variants: ThRunningHeadFormat.title,
    displayInImmersive: true,
    displayInFullscreen: true
  }), []);

  const breakpointsMap = useMemo(() => {
    return makeBreakpointsMap<ThFormatPrefValue<ThRunningHeadFormat>>({
      defaultValue: formatPref?.default || fallbackFormat,
      fromEnum: ThRunningHeadFormat,
      pref: formatPref?.breakpoints,
      validateKey: "variants"
    });
  }, [formatPref, fallbackFormat]);
  
  // Get current preferences with proper fallback
  const currentPrefs = useMemo(() => {
    if (!breakpoint) return formatPref?.default || fallbackFormat;
    return breakpointsMap[breakpoint] || formatPref?.default || fallbackFormat;
  }, [breakpoint, breakpointsMap, formatPref?.default, fallbackFormat]);

  const { variants, displayInImmersive, displayInFullscreen } = currentPrefs;

  const displayFormat = useMemo(() => {
    if (!variants) return ThRunningHeadFormat.title;
    
    // Check if we should hide in immersive mode
    if (isImmersive && displayInImmersive === false && !isHovering) {
      return ThRunningHeadFormat.none;
    }
    
    // Check if we should hide in fullscreen mode
    if (isImmersive && isFullscreen && displayInFullscreen === false && !isHovering) {
      return ThRunningHeadFormat.none;
    }
    
    return variants;
  }, [variants, isImmersive, displayInImmersive, isHovering, isFullscreen, displayInFullscreen]);

  const runningHead = useMemo(() => {
    if (displayFormat === ThRunningHeadFormat.title) {
      return unstableTimeline?.title || "";
    } else if (displayFormat === ThRunningHeadFormat.chapter) {
      return unstableTimeline?.progression?.currentChapter || unstableTimeline?.title || "";
    }
    return t("reader.app.header.runningHeadFallback");
  }, [displayFormat, unstableTimeline, t]);

  if (displayFormat === ThRunningHeadFormat.none || !runningHead) {
    return null;
  }
  
  return (
    <>
    <ThRunningHead 
      label={ runningHead } 
      syncDocTitle={ true }
      aria-label={ t("reader.app.header.runningHead") }
    />
    </>
  );
}