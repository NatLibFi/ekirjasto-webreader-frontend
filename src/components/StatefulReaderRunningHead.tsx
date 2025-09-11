"use client";

import { useMemo } from "react";

import { ThRunningHeadFormat } from "@/preferences/models/enums";

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
  const breakpoint = useAppSelector(state => state.theming.breakpoint);

  const formatPref = isFXL 
    ? preferences.theming.header?.runningHead?.format?.fxl
    : preferences.theming.header?.runningHead?.format?.reflow;
    
  // Create breakpoints map for the format
  const breakpointsMap = useMemo(() => {
    return makeBreakpointsMap<ThRunningHeadFormat>({
      defaultValue: formatPref?.default || ThRunningHeadFormat.title,
      fromEnum: ThRunningHeadFormat,
      pref: formatPref?.breakpoints
    });
  }, [formatPref]);
    
  // Get the format for the current breakpoint
  const currentFormat = breakpoint ? 
    (breakpointsMap[breakpoint] || formatPref?.default) : 
    (formatPref?.default || ThRunningHeadFormat.title);

  const displayFormat = useMemo(() => {
    if (!currentFormat) return ThRunningHeadFormat.title;
    
    // Check if we should hide in immersive mode
    if (isImmersive && formatPref?.displayInImmersive === false && !isHovering) {
      return ThRunningHeadFormat.none;
    }
    
    return currentFormat;
  }, [currentFormat, isImmersive, formatPref, isHovering]);

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