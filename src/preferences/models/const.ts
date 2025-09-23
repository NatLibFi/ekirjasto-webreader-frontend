"use client";

import fontStacks from "@readium/css/css/vars/fontStacks.json";

import { 
  ThLineHeightOptions, 
  ThMarginOptions, 
  ThSettingsRangeVariant, 
  ThSpacingSettingsKeys, 
  ThTextSettingsKeys 
} from "./enums";
import { ThActionsTokens, ThSettingsRangePref } from "../preferences";
import { ThCollapsibilityVisibility } from "@/core/Components/Actions/hooks/useCollapsibility";

export const defaultActionKeysObject: ThActionsTokens = {
  visibility: ThCollapsibilityVisibility.partially,
  shortcut: null
};

export const defaultTextSettingsMain = [ThTextSettingsKeys.fontFamily];

export const defaultTextSettingsSubpanel = [
  ThTextSettingsKeys.fontFamily,
  ThTextSettingsKeys.fontWeight,
  ThTextSettingsKeys.textAlign,
  ThTextSettingsKeys.hyphens,
  ThTextSettingsKeys.textNormalize
]

export const defaultSpacingSettingsMain = [
  ThSpacingSettingsKeys.spacingPresets
];

export const defaultSpacingSettingsSubpanel = [
  ThSpacingSettingsKeys.spacingPresets,
  ThSpacingSettingsKeys.margin,
  ThSpacingSettingsKeys.lineHeight,
  ThSpacingSettingsKeys.wordSpacing,
  ThSpacingSettingsKeys.letterSpacing,
  ThSpacingSettingsKeys.paragraphSpacing,
  ThSpacingSettingsKeys.paragraphIndent
]

export const defaultFontFamilyOptions = {
  publisher: null,
  oldStyle: fontStacks.RS__oldStyleTf,
  modern: fontStacks.RS__modernTf,
  sans: fontStacks.RS__sansTf,
  humanist: fontStacks.RS__humanistTf,
  monospace: fontStacks.RS__monospaceTf
}

export const defaultFontSize: Required<ThSettingsRangePref> = {
  variant: ThSettingsRangeVariant.numberField,
  range: [0.7, 2.5],
  step: 0.05
}

export const defaultParagraphSpacing: Required<ThSettingsRangePref> = {
  variant: ThSettingsRangeVariant.numberField,
  range: [0, 3],
  step: 0.5
}

export const defaultParagraphIndent: Required<ThSettingsRangePref> = {
  variant: ThSettingsRangeVariant.numberField,
  range: [0, 2],
  step: 0.25
}

export const defaultWordSpacing: Required<ThSettingsRangePref> = {
  variant: ThSettingsRangeVariant.numberField,
  range: [0, 1],
  step: 0.1
}

export const defaultLetterSpacing: Required<ThSettingsRangePref> = {
  variant: ThSettingsRangeVariant.numberField,
  range: [0, 0.5],
  step: 0.05
}

export const defaultLineHeights = {
  [ThLineHeightOptions.small]: 1.25,
  [ThLineHeightOptions.medium]: 1.5,
  [ThLineHeightOptions.large]: 1.75
}

export const defaultMargins = {
  [ThMarginOptions.small]: 1.25,
  [ThMarginOptions.medium]: 1,
  [ThMarginOptions.large]: 0.75
}

export const defaultZoom: Required<ThSettingsRangePref> = {
  variant: ThSettingsRangeVariant.numberField,
  range: [0.7, 4],
  step: 0.05
}