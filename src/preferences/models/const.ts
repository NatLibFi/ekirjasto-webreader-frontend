"use client";

import fontStacks from "@readium/css/css/vars/fontStacks.json";

import { 
  ThLineHeightOptions, 
  ThMarginOptions, 
  ThSettingsKeys, 
  ThSettingsRangeVariant, 
  ThSpacingKeys, 
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
  [ThLineHeightOptions.small]: 1.3,
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

export const defaultSpacingPresets = {
  [ThSpacingKeys.tight]: {
    [ThSettingsKeys.lineHeight]: ThLineHeightOptions.small,
    [ThSettingsKeys.margin]: ThMarginOptions.small,
    [ThSettingsKeys.paragraphSpacing]: 0,
    [ThSettingsKeys.paragraphIndent]: 1
  },
  [ThSpacingKeys.balanced]: {
    [ThSettingsKeys.lineHeight]: ThLineHeightOptions.medium,
    [ThSettingsKeys.margin]: ThMarginOptions.medium,
  },
  [ThSpacingKeys.loose]: {
    [ThSettingsKeys.lineHeight]: ThLineHeightOptions.large,
    [ThSettingsKeys.margin]: ThMarginOptions.medium,
    [ThSettingsKeys.paragraphSpacing]: 1.5
  },
  [ThSpacingKeys.accessible]: {
    [ThSettingsKeys.lineHeight]: ThLineHeightOptions.large,
    [ThSettingsKeys.margin]: ThMarginOptions.large,
    [ThSettingsKeys.paragraphSpacing]: 3,
    [ThSettingsKeys.paragraphIndent]: 0,
    [ThSettingsKeys.letterSpacing]: 0.1,
    [ThSettingsKeys.wordSpacing]: 0.3
  }
}