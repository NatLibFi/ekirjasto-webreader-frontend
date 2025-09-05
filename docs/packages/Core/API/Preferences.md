# Preferences API Reference

This document details the preferences management system that handles user settings, theming, and layout preferences.

## Core Components

### ThPreferencesProvider

Context provider component for preferences management.

**Props:**
```typescript
interface Props<T extends Partial<CustomizableKeys>> {
  value?: ThPreferences<T>;
  children: React.ReactNode;
}
```

**Features:**
- Preferences context management
- Default preferences handling
- Type-safe customization
- Direction setting

## Hooks

### usePreferences

Hook for accessing and updating the preferences context.

```typescript
function usePreferences<T extends Partial<CustomizableKeys>>(): ThPreferencesContextType<T>
```

**Features:**
- Type-safe preferences access
- Default values handling
- Update method
- Context validation

### usePreferenceKeys

Hook for safely accessing and using preference keys with proper type inference.

```typescript
function usePreferenceKeys<T extends Partial<CustomizableKeys>>(): {
  reflowActionKeys: Array<T["actionKeys"] | ThActionsKeys>;
  fxlActionKeys: Array<T["actionKeys"] | ThActionsKeys>;
  reflowThemeKeys: Array<T["themeKeys"] | ThThemeKeys>;
  fxlThemeKeys: Array<T["themeKeys"] | ThThemesKeys>;
  reflowSettingsKeys: Array<T["settingsKeys"] | ThSettingsKeys>;
  fxlSettingsKeys: Array<T["settingsKeys"] | ThSettingsKeys>;
  mainTextSettingsKeys: Array<T["textSettingsKeys"] | ThSettingsKeys>;
  subPanelTextSettingsKeys: Array<T["textSettingsKeys"] | ThSettingsKeys>;
  mainSpacingSettingsKeys: Array<T["spacingSettingsKeys"] | ThSettingsKeys>;
  subPanelSpacingSettingsKeys: Array<T["spacingSettingsKeys"] | ThSettingsKeys>;
}
```

**Features:**
- Type-safe key access
- Custom key support
- Helper functions for type assertion

### useTheming

Hook for managing theme-related preferences and side effects.

```typescript
interface useThemingProps<T extends string> {
  theme: string;
  themeKeys: { [key in T]?: ThemeTokens };
  systemKeys?: {
    light: T;
    dark: T;
  };
  breakpointsMap: BreakpointsMap<number | null>;
  initProps?: Record<string, any>;
  onBreakpointChange?: (breakpoint: ThBreakpoints | null) => void;
  onColorSchemeChange?: (colorScheme: ThColorScheme) => void;
  onContrastChange?: (contrast: ThContrast) => void;
  onForcedColorsChange?: (forcedColors: boolean) => void;
  onMonochromeChange?: (isMonochrome: boolean) => void;
  onReducedMotionChange?: (reducedMotion: boolean) => void;
  onReducedTransparencyChange?: (reducedTransparency: boolean) => void; 
}
```

**Features:**
- Theme management
- System theme detection
- CSS variable handling
- Media query support

## Helpers

### buildThemeObject

Utility for creating theme objects.

```typescript
interface buildThemeProps<T extends string> {
  theme: string;
  themeKeys: { [key in T]?: ThemeTokens };
  systemThemes?: {
    light: T;
    dark: T;
  };
  colorScheme?: ThColorScheme;
}
```

**Features:**
- Theme object creation
- System theme handling