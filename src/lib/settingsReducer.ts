import { createSlice } from "@reduxjs/toolkit";

import { 
  ThLineHeightOptions, 
  ThSpacingPresetKeys, 
  ThSpacingSettingsKeys, 
  ThTextAlignOptions 
} from "@/preferences/models/enums";
import { defaultFontFamilyOptions } from "@/preferences/models/const";

export interface LineLengthStateObject {
  optimal?: number | null;
  min?: {
    chars?: number | null;
    isDisabled?: boolean;
  },
  max?: {
    chars?: number | null;
    isDisabled?: boolean;
  }
}

export interface SetLineLengthPayload {
  type: string;
  payload: {
    key: "optimal" | "min" | "max";
    value?: number | null;
    isDisabled?: boolean;
  }
}

export interface UpdateBaseValuesPayload {
  type: string;
  payload: {
    key: SpacingStateKey;
    value: any;
  }
}

export type SpacingStateKey = Exclude<ThSpacingSettingsKeys, ThSpacingSettingsKeys.spacingPresets | ThSpacingSettingsKeys.publisherStyles>;

export interface SpacingStateObject {
  preset: ThSpacingPresetKeys;
  baseValues: Partial<Record<SpacingStateKey, any>>;    // Current preset values
  userOverrides: Partial<Record<SpacingStateKey, any>>; // User modifications only
}

export interface SettingsReducerState {
  columnCount: string;
  fontFamily: keyof typeof defaultFontFamilyOptions;
  fontSize: number;
  fontWeight: number;
  hyphens: boolean | null;
  letterSpacing: number | null;
  lineHeight: ThLineHeightOptions;
  lineLength: LineLengthStateObject | null;
  paragraphIndent: number | null;
  paragraphSpacing: number | null;
  publisherStyles: boolean;
  scroll: boolean;
  spacing: SpacingStateObject;
  textAlign: ThTextAlignOptions;
  textNormalization: boolean;
  wordSpacing: number | null;
}

const initialState: SettingsReducerState = {
  columnCount: "auto",
  fontFamily: "publisher",
  fontSize: 1,
  fontWeight: 400,
  hyphens: null,
  letterSpacing: null,
  lineHeight: ThLineHeightOptions.publisher,
  lineLength: null,
  paragraphIndent: null,
  paragraphSpacing: null,
  publisherStyles: true,
  scroll: false,
  spacing: {
    preset: ThSpacingPresetKeys.publisher,
    baseValues: {}, // Publisher preset uses publisher defaults, not our custom presets
    userOverrides: {}
  },
  textAlign: ThTextAlignOptions.publisher,
  textNormalization: false,
  wordSpacing: null,
}

const handleSpacingSetting = (state: any, action: any, settingKey: ThSpacingSettingsKeys) => {
  const { value } = action.payload;

  // Initialize spacing state if needed
  if (!state.spacing) {
    state.spacing = {
      preset: ThSpacingPresetKeys.publisher,
      baseValues: {},
      userOverrides: {}
    };
  }

  // Ensure new properties exist for backward compatibility
  if (!state.spacing.baseValues) {
    state.spacing.baseValues = {};
  }
  if (!state.spacing.userOverrides) {
    state.spacing.userOverrides = {};
  }

  if (value === null) {
    // Reset - remove user override
    delete state.spacing.userOverrides[settingKey];
    // For custom preset, also clear base value so it falls back to defaults
    if (state.spacing.preset === ThSpacingPresetKeys.custom) {
      delete state.spacing.baseValues[settingKey];
    }
  } else {
    // User modification - add to userOverrides
    state.spacing.userOverrides[settingKey] = value;
    state[settingKey] = value;

    // If user is modifying a setting and current preset is not "custom", switch to "custom"
    if (state.spacing.preset !== ThSpacingPresetKeys.custom) {
      state.spacing.preset = ThSpacingPresetKeys.custom;
    }
  }
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setColumnCount: (state, action) => {
      state.columnCount = action.payload
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload
    },
    setFontWeight: (state, action) => {
      state.fontWeight = action.payload
    },
    setHyphens: (state, action) => {
      state.hyphens = action.payload
    },
    setLetterSpacing: (state, action) => {
      handleSpacingSetting(state, action, ThSpacingSettingsKeys.letterSpacing);
    },
    setLineHeight: (state, action) => {
      handleSpacingSetting(state, action, ThSpacingSettingsKeys.lineHeight);
    },
    setLineLength: (state, action: SetLineLengthPayload) => {
      // For min and max, we need to spread and handle isDisabled
      // when it is directly set, or depending on the payload value
      const deriveIsDisabled = (value: number | null | undefined, isDisabled?: boolean): boolean => {
        if (value === null) return true;
        if (isDisabled !== undefined) return isDisabled;
        return false;
      };

      switch (action.payload.key) {
        case "optimal":
          if (action.payload.value) {
            state.lineLength = {
              ...state.lineLength,
              optimal: action.payload.value
            };
          }
          break;
        
        case "min":
          state.lineLength = {
            ...state.lineLength,
            min: {
              ...state.lineLength?.min,
              chars: action.payload.value !== undefined 
                ? action.payload.value 
                : state.lineLength?.min?.chars,
              isDisabled: deriveIsDisabled(action.payload.value, action.payload.isDisabled)
            }
          };
          break;
        
        case "max":
          state.lineLength = {
            ...state.lineLength,
            max: {
              ...state.lineLength?.max,
              chars: action.payload.value !== undefined 
                ? action.payload.value 
                : state.lineLength?.max?.chars,
              isDisabled: deriveIsDisabled(action.payload.value, action.payload.isDisabled)
            }
          };
          break;
        default:
          break;
      }
    },
    setParagraphIndent: (state, action) => {
      handleSpacingSetting(state, action, ThSpacingSettingsKeys.paragraphIndent);
    },
    setParagraphSpacing: (state, action) => {
      handleSpacingSetting(state, action, ThSpacingSettingsKeys.paragraphSpacing);
    },
    setPublisherStyles: (state, action) => {
      state.publisherStyles = action.payload
    },
    setScroll: (state, action) => {
      state.scroll = action.payload
    },
    setSpacingPreset: (state, action) => {
      if (!state.spacing) {
        state.spacing = {
          preset: action.payload,
          baseValues: {},
          userOverrides: {}
        };
      } else {
        // When switching presets, update baseValues to new preset values and keep userOverrides
        state.spacing.preset = action.payload;

        // Update baseValues based on the new preset
        if (action.payload === ThSpacingPresetKeys.publisher) {
          state.spacing.baseValues = {};
        } else {
          // For other presets, baseValues will be populated when getEffectiveSpacingValue is called
          // We keep userOverrides intact but clear baseValues for non-publisher presets
          state.spacing.baseValues = {};
        }
      }

      // Ensure new properties exist for backward compatibility
      if (!state.spacing.baseValues) {
        state.spacing.baseValues = {};
      }
      if (!state.spacing.userOverrides) {
        state.spacing.userOverrides = {};
      }

      // For publisher and custom presets, check if all user modifications are cleared
      if (action.payload === ThSpacingPresetKeys.publisher || action.payload === ThSpacingPresetKeys.custom) {
        const hasUserModifications = Object.keys(state.spacing.userOverrides || {}).length > 0;
        if (!hasUserModifications) {
          state.publisherStyles = initialState.publisherStyles;
        } else {
          state.publisherStyles = false;
        }
      } else {
        state.publisherStyles = false;
      }
    },
    updateBaseValues: (state, action: UpdateBaseValuesPayload) => {
      const { key, value } = action.payload;

      // Initialize spacing state if needed
      if (!state.spacing) {
        state.spacing = {
          preset: ThSpacingPresetKeys.publisher,
          baseValues: {},
          userOverrides: {}
        };
      }

      // Ensure baseValues exists
      if (!state.spacing.baseValues) {
        state.spacing.baseValues = {};
      }

      // Update the specific base value
      state.spacing.baseValues[key] = value;
    },
    setTextAlign: (state, action) => {
      state.textAlign = action.payload
    },
    setTextNormalization: (state, action) => {
      state.textNormalization = action.payload
    },
    setWordSpacing: (state, action) => {
      handleSpacingSetting(state, action, ThSpacingSettingsKeys.wordSpacing);
    },
    resetSpacingSettings: (state, action) => {      
      const { payload } = action;

      // If a preset is specified, clear overrides for that preset
      if (payload?.preset) {
        const { preset } = payload;

        // Ensure new properties exist for backward compatibility
        if (!state.spacing) {
          state.spacing = {
            preset: ThSpacingPresetKeys.publisher,
            baseValues: {},
            userOverrides: {}
          };
        }
        if (!state.spacing.userOverrides) {
          state.spacing.userOverrides = {};
        }

        state.spacing.userOverrides = {};

        if (preset === ThSpacingPresetKeys.publisher) {
          state.publisherStyles = initialState.publisherStyles;
        }

        return;
      }

      // Otherwise, reset all spacing settings to initial state
      state.publisherStyles = initialState.publisherStyles;

      state.letterSpacing = initialState.letterSpacing;
      state.lineHeight = initialState.lineHeight;
      state.paragraphIndent = initialState.paragraphIndent;
      state.paragraphSpacing = initialState.paragraphSpacing;
      state.wordSpacing = initialState.wordSpacing;
    },
    resetTextSettings: (state) => {
      state.fontFamily = initialState.fontFamily;
      state.fontWeight = initialState.fontWeight;
      state.hyphens = initialState.hyphens;
      state.textAlign = initialState.textAlign;
      state.textNormalization = initialState.textNormalization;
    }
  }
});

export const initialSettingsState = initialState;

// Action creators are generated for each case reducer function
export const { 
  setColumnCount,
  setFontSize,
  setFontWeight, 
  setFontFamily,
  setHyphens, 
  setLetterSpacing,
  setLineHeight,
  setLineLength,
  setParagraphIndent,
  setParagraphSpacing,
  setPublisherStyles,
  setScroll,
  setSpacingPreset,
  setTextAlign,
  setTextNormalization, 
  setWordSpacing,
  resetSpacingSettings,
  resetTextSettings,
  updateBaseValues
} = settingsSlice.actions;

export default settingsSlice.reducer;