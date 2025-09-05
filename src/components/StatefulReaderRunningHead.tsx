"use client";

import { ThRunningHeadFormat } from "@/preferences/models/enums";

import { ThRunningHead } from "@/core/Components";

import { useI18n } from "@/i18n/useI18n";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useAppSelector } from "@/lib/hooks";

export const StatefulReaderRunningHead = () => {
  const { t } = useI18n();
  const { preferences } = usePreferences();
  
  const unstableTimeline = useAppSelector(state => state.publication.unstableTimeline);
  const isFXL = useAppSelector(state => state.publication.isFXL);

  const runningHeadFormat = isFXL ? preferences.theming.header?.runningHead?.format?.fxl : preferences.theming.header?.runningHead?.format?.reflow || ThRunningHeadFormat.title;

  let runningHead = t("reader.app.header.runningHeadFallback");
  if (runningHeadFormat === ThRunningHeadFormat.title) {
    runningHead = unstableTimeline?.title || "";
  } else if (runningHeadFormat === ThRunningHeadFormat.chapter) {
    runningHead = unstableTimeline?.progression?.currentChapter || unstableTimeline?.title || "";
  }

  if (runningHeadFormat === ThRunningHeadFormat.none || !runningHead) {
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