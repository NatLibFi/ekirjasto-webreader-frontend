import { createSlice } from "@reduxjs/toolkit";

import { 
  ThLineHeightOptions, 
  ThMarginOptions, 
  ThSpacingKeys, 
  ThSpacingSettingsKeys, 
  ThTextAlignOptions 
} from "@/preferences/models/enums";
import { defaultFontFamilyOptions } from "@/preferences/models/const";

export interface LineLengthStateObject {
  multiplier?: ThMarginOptions | null;
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

export interface SetLineLengthMultiplierPayload {
  type: string;
  payload: {
    value: ThMarginOptions;
    preset?: ThSpacingKeys;
  }
}

export interface SetSpacingPresetPayload {
  type: string;
  payload: ThSpacingKeys;
}

export interface SetSpacingOverridePayload {
  type: string;
  payload: {
    key: ThSpacingKeys;
    value: {
      [key in ThSpacingSettingsKeys]?: string | number | ThMarginOptions;
    }
  }
}

export interface SpacingStateObject {
  preset: ThSpacingKeys;
  overrides: {
    [key in ThSpacingKeys]?: {
      [key in ThSpacingSettingsKeys]?: string | number;
    }
  }
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
    preset: ThSpacingKeys.publisher,
    overrides: {}
  },
  textAlign: ThTextAlignOptions.publisher,
  textNormalization: false,
  wordSpacing: null,
}

const handleSpacingSetting = (state: any, action: any, settingKey: ThSpacingSettingsKeys) => {
  if (!state.spacing) {
    state.spacing = {
      preset: action.payload?.preset || ThSpacingKeys.publisher,
      overrides: {}
    };
  }

  const { value, preset } = action.payload;
  if (preset) {
    const currentOverrides = state.spacing.overrides[preset] || {};
    state.spacing.overrides = {
      ...state.spacing.overrides,
      [preset]: {
        ...currentOverrides,
        [settingKey]: value
      }
    };
  } else {
    state[settingKey] = value;
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
    setLineLengthMultiplier: (state, action: SetLineLengthMultiplierPayload) => {
      const { value, preset } = action.payload;
      if (preset) {
        const currentOverrides = state.spacing.overrides[preset] || {};
        state.spacing.overrides = {
          ...state.spacing.overrides,
          [preset]: {
            ...currentOverrides,
            margin: value
          }
        };
      } else {
        state.lineLength = {
          ...state.lineLength,
          multiplier: value
        };
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
    setSpacingPreset: (state, action: SetSpacingPresetPayload) => {
      if (!state.spacing) {
        state.spacing = {
          preset: action.payload,
          overrides: {}
        };
        if (action.payload !== ThSpacingKeys.publisher && action.payload !== ThSpacingKeys.custom) {
          state.publisherStyles = false;
        }
      } else {
        state.spacing.preset = action.payload;

        if (
          (action.payload === ThSpacingKeys.publisher || action.payload === ThSpacingKeys.custom) && 
          (!state.spacing.overrides[action.payload] || 
            Object.keys(state.spacing.overrides[action.payload] || {}).length === 0)
        ) {
          state.publisherStyles = initialState.publisherStyles;
        } else {
          state.publisherStyles = false;
        }
      }
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

        state.spacing.overrides = {
          ...state.spacing.overrides,
          [preset as keyof typeof state.spacing.overrides]: {}
        };

        if (preset === ThSpacingKeys.publisher) {
          state.publisherStyles = initialState.publisherStyles;
        }

        return;
      }

      // Otherwise, reset all spacing settings to initial state
      state.publisherStyles = initialState.publisherStyles;

      state.letterSpacing = initialState.letterSpacing;
      state.lineHeight = initialState.lineHeight;
      state.lineLength && (state.lineLength.multiplier = undefined);
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
  setLineLengthMultiplier,
  setParagraphIndent,
  setParagraphSpacing,
  setPublisherStyles,
  setScroll,
  setSpacingPreset,
  setTextAlign,
  setTextNormalization, 
  setWordSpacing,
  resetSpacingSettings,
  resetTextSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;