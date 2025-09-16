"use client";

export enum ThLayoutUI {
  stacked = "stacked-ui",
  layered = "layered-ui"
}

export enum ThBackLinkVariant {
  arrow = "arrow",
  home = "home",
  library = "library",
  custom = "custom"
}

export enum ThDocumentTitleFormat {
  title = "title",
  chapter = "chapter",
  titleAndChapter = "titleAndChapter",
  none = "none"
}

export enum ThRunningHeadFormat {
  title = "title",
  chapter = "chapter",
  // titleAndChapter = "titleAndChapter",
  none = "none"
}

export enum ThProgressionFormat {
  positionsPercentOfTotal = "positionsPercentOfTotal",  // x-y of z (%)
  positionsOfTotal = "positionsOfTotal",                // x-y of z
  positions = "positions",                              // x-y
  overallProgression = "overallProgression",            // x%
  positionsLeft = "positionsLeft",                      // x left in chapter
  resourceProgression = "resourceProgression",          // x%
  progressionOfResource = "progressionOfResource",      // x% of y
  none = "none"                                         // nothing displayed
}

export enum ThActionsKeys {
  fullscreen = "fullscreen",
  jumpToPosition = "jumpToPosition",
  settings = "settings",
  toc = "toc"
}

export enum ThBreakpoints {
  compact = "compact",
  medium = "medium",
  expanded = "expanded",
  large = "large",
  xLarge = "xLarge"
}

export enum ThDockingKeys {
  start = "dockingStart",
  end = "dockingEnd",
  transient = "dockingTransient"
}

export enum ThDockingTypes {
  none = "none",
  both = "both",
  start = "start",
  end = "end"
}

export enum ThSettingsKeys {
  columns = "columns",
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  layout = "layout",
  letterSpacing = "letterSpacing",
  lineHeight = "lineHeight",
  paragraphIndent = "paragraphIndent",
  paragraphSpacing = "paragraphSpacing",
  publisherStyles = "publisherStyles",
  spacingGroup = "spacingGroup",
  textAlign = "textAlign",
  textGroup = "textGroup",
  textNormalize = "textNormalize",
  theme = "theme",
  wordSpacing = "wordSpacing",
  zoom = "zoom"
}

export enum ThTextSettingsKeys {
  fontFamily = "fontFamily",
  fontWeight = "fontWeight",
  hyphens = "hyphens",
  textAlign = "textAlign",
  textNormalize = "textNormalize"
}

export enum ThSpacingSettingsKeys {
  letterSpacing = "letterSpacing",
  lineHeight = "lineHeight",
  paragraphIndent = "paragraphIndent",
  paragraphSpacing = "paragraphSpacing",
  publisherStyles = "publisherStyles",
  wordSpacing = "wordSpacing"
}

export enum ThSettingsContainerKeys {
  initial = "initial",
  text = "text",
  spacing = "spacing"
}

export enum ThSettingsRangeVariant {
  slider = "slider",
  incrementedSlider = "incrementedSlider",
  numberField = "numberField"
}

export enum ThSheetTypes {
  popover = "popover",
  fullscreen = "fullscreen",
  dockedStart = "docked start",
  dockedEnd = "docked end",
  bottomSheet = "bottomSheet"
}

export enum ThSheetHeaderVariant {
  close = "close",
  previous = "previous"
}

export enum ThThemeKeys {
  light = "light",
  sepia = "sepia",
  dark = "dark",
  paper = "paper",
  contrast1 = "contrast1",
  contrast2 = "contrast2",
  contrast3 = "contrast3",
  ekirjasto1 = "E-Kirjasto 1",
  ekirjasto2 = "E-Kirjasto 2",
  ekirjasto3 = "E-Kirjasto 3"
}

export enum ThLayoutDirection {
  rtl = "rtl",
  ltr = "ltr"
}

export enum ThLayoutOptions { 
  scroll = "scroll_option",
  paginated = "page_option"
}

export enum ThTextAlignOptions {
  publisher = "publisher",
  start = "start",
  justify = "justify"
}

export enum ThLineHeightOptions {
  publisher = "publisher",
  small = "small",
  medium = "medium",
  large = "large"
}