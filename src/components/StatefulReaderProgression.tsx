"use client";

import React, { useEffect, useState, useMemo } from "react";

import progressionStyles from "./assets/styles/readerProgression.module.css";

import { ThProgressionDisplayFormat } from "@/preferences/models/enums";

import { ThProgression } from "@/core/Components/Reader/ThProgression";

import { useI18n } from "@/i18n/useI18n";
import { usePreferences } from "@/preferences/hooks/usePreferences";

import { useAppSelector } from "@/lib/hooks";

// Helper to get the best matching display format from an array of formats
const getBestMatchingFormat = (
  formats: ThProgressionDisplayFormat[],
  hasPositions: boolean,
  hasProgression: boolean
): ThProgressionDisplayFormat | null => {
  for (const format of formats) {
    switch (format) {
      case ThProgressionDisplayFormat.positionsOfTotal:
      case ThProgressionDisplayFormat.positions:
      case ThProgressionDisplayFormat.positionsLeft:
        if (hasPositions) {
          return format;
        }
        break;
      case ThProgressionDisplayFormat.overallProgression:
      case ThProgressionDisplayFormat.resourceProgression:
      case ThProgressionDisplayFormat.progressionOfResource:
        if (hasProgression) {
          return format;
        }
        break;
      case ThProgressionDisplayFormat.none:
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
  const [displayText, setDisplayText] = useState("");
  
  // Get the display format, handling both single format and array of formats
  const displayFormat = useMemo(() => {
    const format = RSPrefs.affordances?.progressionDisplayFormat;
    if (!format) return ThProgressionDisplayFormat.none;
    
    const hasPositions = !!unstableTimeline?.progression?.currentPositions?.length;
    const hasProgression = unstableTimeline?.progression?.relativeProgression !== undefined;
    
    if (Array.isArray(format)) {
      return getBestMatchingFormat(format, hasPositions, hasProgression) || 
             ThProgressionDisplayFormat.none;
    }
    
    return format;
  }, [RSPrefs.affordances?.progressionDisplayFormat, unstableTimeline]);

  // Update display text based on current position and timeline
  useEffect(() => {
    if (displayFormat === ThProgressionDisplayFormat.none || !unstableTimeline?.progression) {
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
      case ThProgressionDisplayFormat.positions:
        if (currentPositions.length > 0) {
          text = formatPositions(currentPositions);
        }
        break;
        
      case ThProgressionDisplayFormat.positionsOfTotal:
        if (currentPositions.length > 0 && totalPositions) {
          text = t("reader.app.progression.of", { 
            current: formatPositions(currentPositions),
            reference: totalPositions
          });
        }
        break;
        
      case ThProgressionDisplayFormat.positionsLeft:
        if (positionsLeft !== undefined) {
          text = t("reader.app.progression.positionsLeft", { 
            count: positionsLeft,
            reference: currentChapter || t("reader.app.progression.referenceFallback")
          });
        }
        break;
        
      case ThProgressionDisplayFormat.overallProgression:
        if (totalProgression !== undefined) {
          const percentage = Math.round(totalProgression * 100);
          text = `${ percentage }%`;
        }
        break;
        
      case ThProgressionDisplayFormat.resourceProgression:
        if (relativeProgression !== undefined) {
          const percentage = Math.round(relativeProgression * 100);
          text = `${ percentage }%`;
        }
        break;
        
      case ThProgressionDisplayFormat.progressionOfResource:
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

  if (!displayText || displayFormat === ThProgressionDisplayFormat.none) {
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