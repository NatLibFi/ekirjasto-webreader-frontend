"use client";

import React, { useEffect, useState, useMemo } from "react";

import progressionStyles from "./assets/styles/readerProgression.module.css";

import { ThProgressionFormat } from "@/preferences/models/enums";

import { ThProgression } from "@/core/Components/Reader/ThProgression";

import { useI18n } from "@/i18n/useI18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";

import { useAppSelector } from "@/lib/hooks";

// Helper to get the best matching display format from an array of formats
const getBestMatchingFormat = (
  formats: ThProgressionFormat[],
  hasPositions: boolean,
  hasProgression: boolean
): ThProgressionFormat | null => {
  for (const format of formats) {
    switch (format) {
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
  const RSPrefs = usePreferences();
  
  const unstableTimeline = useAppSelector(state => state.publication.unstableTimeline);
  const isFXL = useAppSelector(state => state.publication.isFXL);

  const [displayText, setDisplayText] = useState("");
  
  // Get the display format, handling both single format and array of formats
  const displayFormat = useMemo(() => {
    const format = isFXL ? RSPrefs.theming.progression?.format?.fxl : RSPrefs.theming.progression?.format?.reflow;
    if (!format) return ThProgressionFormat.resourceProgression;
    
    const hasPositions = !!unstableTimeline?.progression?.currentPositions?.length;
    const hasProgression = unstableTimeline?.progression?.relativeProgression !== undefined;
    
    if (Array.isArray(format)) {
      return getBestMatchingFormat(format, hasPositions, hasProgression) || 
             ThProgressionFormat.resourceProgression;
    }
    
    return format;
  }, [RSPrefs.theming.progression?.format, unstableTimeline, isFXL]);

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