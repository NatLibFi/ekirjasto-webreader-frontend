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
  ThRunningHeadFormat
} from "./models/enums";
import { ThCollapsibility, ThCollapsibilityVisibility } from "@/core/Components/Actions/hooks/useCollapsibility";
import { defaultActionKeysObject } from "./models";

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

export interface ThActionsPref<T extends string> {
  reflowOrder: T[];
  fxlOrder: T[];
  collapse: ThCollapsibility;
  keys: {
    [key in T]: ThActionsTokens;
  }
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

// Simplified type for customizable keys
export type CustomKeyType = string;

export interface CustomizableKeys {
  actionKeys: CustomKeyType;
  themeKeys: CustomKeyType;
  settingsKeys: CustomKeyType;
  textSettingsKeys: CustomKeyType;
  spacingSettingsKeys: CustomKeyType;
  constraintsKeys: CustomKeyType;
  customSettingsKeyTypes: Record<string, unknown>;
}

// Default keys with standard enum values
export interface DefaultKeys {
  actionKeys: ThActionsKeys;
  themeKeys: ThThemeKeys;
  settingsKeys: ThSettingsKeys;
  textSettingsKeys: ThTextSettingsKeys;
  spacingSettingsKeys: ThSpacingSettingsKeys;
  constraintsKeys: ThConstraintKeys;
  customSettingsKeyTypes: ThSettingsKeyTypes;
}

// Type helper for key arrays and objects
export type KeysOf<T, D> = T extends CustomKeyType ? T : D;

// Main preferences interface with simplified generics
export interface ThPreferences<T extends Partial<CustomizableKeys> = {}> {
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
          reflow?: ThRunningHeadFormat;
          fxl?: ThRunningHeadFormat;
        }
      }
    };
    progression?: {
      format?: {
        reflow?: ThProgressionFormat | Array<ThProgressionFormat>;
        fxl?: ThProgressionFormat | Array<ThProgressionFormat>;
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
        [key in KeysOf<T["constraintsKeys"], ThConstraintKeys>]?: number | null
      }
    };
    breakpoints: BreakpointsMap<number | null>;
    themes: {
      reflowOrder: Array<KeysOf<T["themeKeys"], ThThemeKeys> | "auto">;
      fxlOrder: Array<KeysOf<T["themeKeys"], ThThemeKeys> | "auto">;
      systemThemes?: {
        light: KeysOf<T["themeKeys"], ThThemeKeys>;
        dark: KeysOf<T["themeKeys"], ThThemeKeys>;
      };
      keys: {
        [key in KeysOf<T["themeKeys"], ThThemeKeys>]: ThemeTokens;
      };
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
  actions: ThActionsPref<KeysOf<T["actionKeys"], ThActionsKeys>>;
  shortcuts: {
    representation: UnstableShortcutRepresentation;
    joiner?: string;
  };
  docking: ThDockingPref<ThDockingKeys>;
  settings: {
    reflowOrder: Array<KeysOf<T["settingsKeys"], ThSettingsKeys>>;
    fxlOrder: Array<KeysOf<T["settingsKeys"], ThSettingsKeys>>;
    keys?: T["customSettingsKeyTypes"] | ThSettingsKeyTypes;
    text?: ThSettingsGroupPref<KeysOf<T["textSettingsKeys"], ThTextSettingsKeys>>;
    spacing?: ThSettingsGroupPref<KeysOf<T["spacingSettingsKeys"], ThSpacingSettingsKeys>>;
  };
}

/**
 * Creates a new preferences object with the provided parameters
 * @param params The preferences object to create
 * @returns A new preferences object
 */
export const createPreferences = <T extends Partial<CustomizableKeys>>(
  params: ThPreferences<T>
): ThPreferences<T> => {
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
    validateObjectKeys<KeysOf<T["actionKeys"], ThActionsKeys>, ThActionsTokens>(
      [params.actions.reflowOrder, params.actions.fxlOrder],
      params.actions.keys as Record<string, ThActionsTokens>,
      "actions",
      undefined,
      defaultActionKeysObject as ThActionsTokens
    );
  }
  
  // Validate themes
  if (params.theming?.themes) {
    validateObjectKeys<KeysOf<T["themeKeys"], ThThemeKeys> | "auto", ThemeTokens>(
      [params.theming.themes.reflowOrder, params.theming.themes.fxlOrder],
      params.theming.themes.keys as Record<string, ThemeTokens>,
      "theming.themes",
      "auto" // Special case for themes
    );
  }
  
  return params;
};

// Simplified type helpers
export type ActionKeyType = ThActionsKeys | CustomKeyType;
export type ThemeKeyType = ThThemeKeys | CustomKeyType;
export type SettingsKeyType = ThSettingsKeys | CustomKeyType;
export type TextSettingsKeyType = ThTextSettingsKeys | CustomKeyType;
export type SpacingSettingsKeyType = ThSpacingSettingsKeys | CustomKeyType;