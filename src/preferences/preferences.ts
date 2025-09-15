import { UnstableShortcutRepresentation } from "@/core/Helpers/keyboardUtilities";
import { BreakpointsMap } from "@/core/Hooks/useBreakpoints";
import { ThemeTokens } from "@/preferences/hooks/useTheming";
import { 
  ThActionsKeys,
  ThDockingKeys,
  ThDockingTypes,
  ThLineHeightOptions, 
  ThSettingsKeys, 
  ThSettingsRangeVariant, 
  ThSheetHeaderVariant, 
  ThSheetTypes, 
  ThSpacingSettingsKeys, 
  ThTextSettingsKeys, 
  ThThemeKeys, 
  ThLayoutDirection, 
  ThLayoutUI,
  ThBackLinkVariant,
  ThProgressionFormat,
  ThRunningHeadFormat,
  ThBreakpoints
} from "./models/enums";
import { ThCollapsibility, ThCollapsibilityVisibility } from "@/core/Components/Actions/hooks/useCollapsibility";

export type ThBackLinkContent = 
  | { 
      type: "img";
      src: string;
      alt?: string;
    }
  | {
      type: "svg";
      content: string; // Raw SVG string
    };

export interface ThBackLinkPref {
  href: string;
  variant?: ThBackLinkVariant;
  visibility?: "always" | "partially";
  content?: ThBackLinkContent;
}

export type ThBottomSheetDetent = "content-height" | "full-height";

export interface ThActionsSnappedPref {
  scrim?: boolean | string;
  maxWidth?: number | null;
  maxHeight?: number | ThBottomSheetDetent;
  peekHeight?: number | ThBottomSheetDetent;
  minHeight?: number | ThBottomSheetDetent;
}

export interface ThActionsDockedPref {
  dockable: ThDockingTypes,
  dragIndicator?: boolean,
  width?: number,
  minWidth?: number,
  maxWidth?: number
}

export interface ThActionsTokens {
  visibility: ThCollapsibilityVisibility;
  shortcut: string | null;
  sheet?: {
    defaultSheet: Exclude<ThSheetTypes, ThSheetTypes.dockedStart | ThSheetTypes.dockedEnd>;
    breakpoints: BreakpointsMap<ThSheetTypes>;
  };
  docked?: ThActionsDockedPref;
  snapped?: ThActionsSnappedPref;
};

export type CustomizableKeys = {
  action?: string;
  theme?: string;
  settings?: string;
  text?: string;
  spacing?: string;
};

// Key types to better handle custom keys for external consumers
export type ActionKey<K extends CustomizableKeys> = 
  K extends { action: infer A } 
    ? A extends string 
      ? ThActionsKeys | A 
      : ThActionsKeys
    : ThActionsKeys;

export type ThemeKey<K extends CustomizableKeys> = 
  K extends { theme: infer T } 
    ? T extends string 
      ? ThThemeKeys | T 
      : ThThemeKeys
    : ThThemeKeys;

export type SettingsKey<K extends CustomizableKeys> = 
  K extends { settings: infer S } 
    ? S extends string 
      ? ThSettingsKeys | S 
      : ThSettingsKeys
    : ThSettingsKeys;

export type TextSettingsKey<K extends CustomizableKeys> = 
  K extends { text: infer T } 
    ? T extends string 
      ? ThTextSettingsKeys | T 
      : ThTextSettingsKeys
    : ThTextSettingsKeys;

export type SpacingSettingsKey<K extends CustomizableKeys> = 
  K extends { spacing: infer S } 
    ? S extends string 
      ? ThSpacingSettingsKeys | S 
      : ThSpacingSettingsKeys
    : ThSpacingSettingsKeys;

export interface ThActionsPref<K extends CustomizableKeys> {
  reflowOrder: Array<ActionKey<K>>;
  fxlOrder: Array<ActionKey<K>>;
  collapse: ThCollapsibility;
  keys: Record<ActionKey<K>, ThActionsTokens>;
};

export interface ThDockingPref<T extends string> {
  displayOrder: T[];
  collapse: ThCollapsibility;
  dock: BreakpointsMap<ThDockingTypes> | boolean; 
  keys: {
    [key in T]: Pick<ThActionsTokens, "visibility" | "shortcut">;
  }
};

export interface ThSettingsGroupPref<T> {
  main?: T[];
  subPanel?: T[] | null;
  header?: ThSheetHeaderVariant;
}

export interface ThSettingsRangePref {
  variant?: ThSettingsRangeVariant;
  range?: [number, number];
  step?: number;
}

export type ThSettingsKeyTypes = {
  [ThSettingsKeys.letterSpacing]?: ThSettingsRangePref;
  [ThSettingsKeys.lineHeight]?: {
      [key in Exclude<ThLineHeightOptions, ThLineHeightOptions.publisher>]: number
    };
  [ThSettingsKeys.paragraphIndent]?: ThSettingsRangePref;
  [ThSettingsKeys.paragraphSpacing]?: ThSettingsRangePref;
  [ThSettingsKeys.wordSpacing]?: ThSettingsRangePref;
  [ThSettingsKeys.zoom]?: ThSettingsRangePref;
}

export type ThConstraintKeys = Extract<ThSheetTypes, ThSheetTypes.bottomSheet | ThSheetTypes.popover> | "pagination";

export interface ThFormatPrefValue<T extends string | Array<string>> {
  variants: T;
  displayInImmersive?: boolean;
  displayInFullscreen?: boolean;
}

export interface ThFormatPref<T extends string | Array<string>> {
  default: ThFormatPrefValue<T>;
  breakpoints?: { 
    [key in ThBreakpoints]?: ThFormatPrefValue<T>;
  };
}

// Main preferences interface with simplified generics
export interface ThPreferences<K extends CustomizableKeys = {}> {
  direction?: ThLayoutDirection;
  locale?: string;
  typography: {
    minimalLineLength?: number | null;
    maximalLineLength?: number | null;
    optimalLineLength: number;
    pageGutter: number;
  };
  theming: {
    header?: {
      backLink?: ThBackLinkPref | null;
      runningHead?: {
        format?: {
          reflow?: ThFormatPref<ThRunningHeadFormat>;
          fxl?: ThFormatPref<ThRunningHeadFormat>;
        }
      }
    };
    progression?: {
      format?: {
        reflow?: ThFormatPref<ThProgressionFormat | Array<ThProgressionFormat>>;
        fxl?: ThFormatPref<ThProgressionFormat | Array<ThProgressionFormat>>;
      };
    };
    arrow: {
      size: number;
      offset: number;
      tooltipDelay?: number;
    };
    icon: {
      size: number;
      tooltipOffset: number;
      tooltipDelay?: number;
    };
    layout: {
      ui?: {
        reflow?: ThLayoutUI,
        fxl?: ThLayoutUI
      };
      radius: number;
      spacing: number;
      defaults: {
        dockingWidth: number;
        scrim: string;
      };
      constraints?: {
        [key in ThConstraintKeys]?: number | null
      }
    };
    breakpoints: BreakpointsMap<number | null>;
    themes: {
      reflowOrder: Array<ThemeKey<K> | "auto">;
      fxlOrder: Array<ThemeKey<K> | "auto">;
      systemThemes?: {
        light: ThemeKey<K>;
        dark: ThemeKey<K>;
      };
      // keys never includes "auto"
      keys: Record<Exclude<ThemeKey<K>, "auto"> & string, ThemeTokens>;
    };
  };
  affordances: {
    scroll: {
      hintInImmersive: boolean;
      toggleOnMiddlePointer: Array<"tap" | "click">;
      hideOnForwardScroll: boolean;
      showOnBackwardScroll: boolean;
    }
  };
  actions: ThActionsPref<K>;
  shortcuts: {
    representation: UnstableShortcutRepresentation;
    joiner?: string;
  };
  docking: ThDockingPref<ThDockingKeys>;
  settings: {
    reflowOrder: Array<SettingsKey<K>>;
    fxlOrder: Array<SettingsKey<K>>;
    keys?: ThSettingsKeyTypes;
    text?: ThSettingsGroupPref<TextSettingsKey<K>>;
    spacing?: ThSettingsGroupPref<SpacingSettingsKey<K>>;
  };
}

/**
 * Creates a new preferences object with the provided parameters
 * @param params The preferences object to create
 * @returns A new preferences object
 */
export const createPreferences = <K extends CustomizableKeys = {}>(
  params: ThPreferences<K>
): ThPreferences<K> => {
  // Helper function to validate keys against the provided order arrays
  const validateObjectKeys = <K extends string, V>(
    orderArrays: K[][],
    keysObj: Record<string, V>,
    context: string,
    specialCase?: string,
    fallback?: V
  ): void => {
    // Combine all arrays and filter out special cases if needed
    const allOrders = new Set<K>(
      orderArrays.flatMap(arr => specialCase ? arr.filter(k => k !== specialCase) : arr)
    );
    
    // Get available keys
    const availableKeys = Object.keys(keysObj);
    
    // Check that all keys exist and add from fallback if available
    allOrders.forEach(key => {
      if (!availableKeys.includes(key)) {
        if (fallback) {
          // Add the missing key from fallback to the params object
          keysObj[key] = fallback;
        }
        console.warn(`Key "${ key }" in ${ context } order arrays not found in ${ context }.keys.${ fallback ? `\nUsing fallback: ${ JSON.stringify(fallback) }` : "" }`);
      }
    });
  };
  
  // Validate actions
  if (params.actions) {
    validateObjectKeys<ActionKey<K>, ThActionsTokens>(
      [params.actions.reflowOrder as Array<ActionKey<K>>, params.actions.fxlOrder as Array<ActionKey<K>>],
      params.actions.keys as Record<string, ThActionsTokens>,
      "actions"
    );
  }
  
  // Validate themes
  if (params.theming?.themes) {
    validateObjectKeys<ThemeKey<K> | "auto", ThemeTokens>(
      [params.theming.themes.reflowOrder as Array<ThemeKey<K> | "auto">, params.theming.themes.fxlOrder as Array<ThemeKey<K> | "auto">],
      params.theming.themes.keys as Record<string, ThemeTokens>,
      "theming.themes",
      "auto" // Special case for themes
    );
  }
  
  return params;
};

// Default internal keys alias for convenience
export type DefaultKeys = {
  action: ThActionsKeys;
  theme: ThThemeKeys;
  settings: ThSettingsKeys;
  text: ThTextSettingsKeys;
  spacing: ThSpacingSettingsKeys;
};

// Type helpers that support both custom and default keys
export type ActionKeyType<K extends CustomizableKeys = DefaultKeys> = K["action"] extends string ? K["action"] : ThActionsKeys;
export type ThemeKeyType<K extends CustomizableKeys = DefaultKeys> = K["theme"] extends string ? K["theme"] : ThThemeKeys;
export type SettingsKeyType<K extends CustomizableKeys = DefaultKeys> = K["settings"] extends string ? K["settings"] : ThSettingsKeys;
export type TextSettingsKeyType<K extends CustomizableKeys = DefaultKeys> = K["text"] extends string ? K["text"] : ThTextSettingsKeys;
export type SpacingSettingsKeyType<K extends CustomizableKeys = DefaultKeys> = K["spacing"] extends string ? K["spacing"] : ThSpacingSettingsKeys;