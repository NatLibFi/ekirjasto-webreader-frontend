"use client";

import React, { useEffect, useState, useMemo } from "react";

import progressionStyles from "./assets/styles/readerProgression.module.css";

import { ThProgressionFormat } from "@/preferences/models/enums";

import { ThProgression } from "@/core/Components/Reader/ThProgression";

import { useI18n } from "@/i18n/useI18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";

import { useAppSelector } from "@/lib/hooks";

import { makeBreakpointsMap } from "@/core/Helpers/breakpointsMap";

// Helper to get the best matching display format from an array of formats
const getBestMatchingFormat = (
  formats: ThProgressionFormat[],
  hasPositions: boolean,
  hasProgression: boolean
): ThProgressionFormat | null => {
  for (const format of formats) {
    switch (format) {
      case ThProgressionFormat.positionsPercentOfTotal:
      case ThProgressionFormat.positionsOfTotal:
      case ThProgressionFormat.positions:
      case ThProgressionFormat.positionsLeft:
        if (hasPositions) {
          return format;
        }
        break;
      case ThProgressionFormat.overallProgression:
      case ThProgressionFormat.resourceProgression:
      case ThProgressionFormat.progressionOfResource:
        if (hasProgression) {
          return format;
        }
        break;
      case ThProgressionFormat.none:
        return format;
    }
  }
  return null;
};

export const StatefulReaderProgression = ({ 
  className 
}: { 
  className?: string 
}) => {
  const { t } = useI18n();
  const { preferences } = usePreferences();
  
  const unstableTimeline = useAppSelector(state => state.publication.unstableTimeline);
  const isFXL = useAppSelector(state => state.publication.isFXL);
  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);
  const breakpoint = useAppSelector(state => state.theming.breakpoint);

  const [displayText, setDisplayText] = useState("");
  
  const formatPref = isFXL 
    ? preferences.theming.progression?.format?.fxl
    : preferences.theming.progression?.format?.reflow;

  const fallbackFormat = isFXL 
    ? ThProgressionFormat.overallProgression
    : ThProgressionFormat.resourceProgression;
  
  const breakpointsMap = useMemo(() => {
    return makeBreakpointsMap<ThProgressionFormat | ThProgressionFormat[]>({
      defaultValue: formatPref?.default || fallbackFormat,
      fromEnum: ThProgressionFormat,
      pref: formatPref?.breakpoints
    });
  }, [formatPref, fallbackFormat]);
  
  // Get the format for the current breakpoint
  const currentFormat = breakpoint ? 
    (breakpointsMap[breakpoint] || formatPref?.default) : 
    (formatPref?.default || fallbackFormat);
  
  // Get the display format, handling both single format and array of formats
  const displayFormat = useMemo(() => {
    if (!currentFormat) return fallbackFormat;
    
    // Check if we should hide in immersive mode
    if (isImmersive && formatPref?.displayInImmersive === false && !isHovering) {
      return ThProgressionFormat.none;
    }
    
    const format = Array.isArray(currentFormat) ? currentFormat[0] : currentFormat;
    const hasPositions = !!unstableTimeline?.progression?.currentPositions?.length;
    const hasProgression = unstableTimeline?.progression?.relativeProgression !== undefined;
    
    if (Array.isArray(currentFormat)) {
      return getBestMatchingFormat(currentFormat, hasPositions, hasProgression) || 
        fallbackFormat;
    }
    
    return format;
  }, [currentFormat, unstableTimeline?.progression, formatPref, fallbackFormat, isImmersive, isHovering]);

  // Update display text based on current position and timeline
  useEffect(() => {
    if (displayFormat === ThProgressionFormat.none || !unstableTimeline?.progression) {
      setDisplayText("");
      return;
    }

    const { 
      currentPositions = [],
      totalPositions,
      relativeProgression,
      totalProgression,
      currentChapter,
      positionsLeft
    } = unstableTimeline.progression;
    
    let text = "";
    
    // Format positions for display (handle array of two positions with a dash)
    const formatPositions = (positions: number[]) => {
      if (positions.length === 2) {
        return positions.join("–");
      }
      return positions[0]?.toString() || "";
    };
        
    switch (displayFormat) {
      case ThProgressionFormat.positions:
        if (currentPositions.length > 0) {
          text = formatPositions(currentPositions);
        }
        break;
        
      case ThProgressionFormat.positionsOfTotal:
        if (currentPositions.length > 0 && totalPositions) {
          text = t("reader.app.progression.of", { 
            current: formatPositions(currentPositions),
            reference: totalPositions
          });
        }
        break;

      case ThProgressionFormat.positionsPercentOfTotal:
        if (currentPositions.length > 0 && totalPositions) {
          const percentage = Math.round((totalProgression || 0) * 100);
          text = t("reader.app.progression.of", { 
            current: formatPositions(currentPositions),
            reference: totalPositions
          }) + ` (${ percentage }%)`;
        }
        break;
        
      case ThProgressionFormat.positionsLeft:
        if (positionsLeft !== undefined) {
          text = t("reader.app.progression.positionsLeft", { 
            count: positionsLeft,
            reference: currentChapter || t("reader.app.progression.referenceFallback")
          });
        }
        break;
        
      case ThProgressionFormat.overallProgression:
        if (totalProgression !== undefined) {
          const percentage = Math.round(totalProgression * 100);
          text = `${ percentage }%`;
        }
        break;
        
      case ThProgressionFormat.resourceProgression:
        if (relativeProgression !== undefined) {
          const percentage = Math.round(relativeProgression * 100);
          text = `${ percentage }%`;
        }
        break;
        
      case ThProgressionFormat.progressionOfResource:
        if (relativeProgression !== undefined) {
          const percentage = Math.round(relativeProgression * 100);
          text = t("reader.app.progression.of", {
            current: `${ percentage }%`,
            reference: currentChapter || t("reader.app.progression.referenceFallback")
          });
        }
        break;
    }
    
    setDisplayText(text);
  }, [displayFormat, unstableTimeline?.progression, t]);

  if (!displayText || displayFormat === ThProgressionFormat.none) {
    return null;
  }

  return (
    <ThProgression 
      id={progressionStyles.current} 
      className={className}
      aria-label={t("reader.app.progression.wrapper")}
    >
      { displayText }
    </ThProgression>
  );
};