import { createSlice } from "@reduxjs/toolkit";

import { ThLineHeightOptions, ThTextAlignOptions } from "@/preferences/models/enums";
import { defaultFontFamilyOptions } from "@/preferences/models/const";

export interface LineLengthStateObject {
  multiplier?: number | null;
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
  textAlign: ThTextAlignOptions.publisher,
  textNormalization: false,
  wordSpacing: null,
}

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
      state.letterSpacing = action.payload
    },
    setLineHeight: (state, action) => {
      state.lineHeight = action.payload
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
    setLineLengthMultiplier: (state, action) => {
      state.lineLength = {
        ...state.lineLength,
        // Ensure multiplier is never 0, default to 1 if 0 is provided
        multiplier: action.payload === 0 ? 1 : action.payload
      }
    },
    setParagraphIndent: (state, action) => {
      state.paragraphIndent = action.payload
    },
    setParagraphSpacing: (state, action) => {
      state.paragraphSpacing = action.payload
    },
    setPublisherStyles: (state, action) => {
      state.publisherStyles = action.payload
    },
    setScroll: (state, action) => {
      state.scroll = action.payload
    },
    setTextAlign: (state, action) => {
      state.textAlign = action.payload
    },
    setTextNormalization: (state, action) => {
      state.textNormalization = action.payload
    },
    setWordSpacing: (state, action) => {
      state.wordSpacing = action.payload
    }
  }
})

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
  setTextAlign,
  setTextNormalization, 
  setWordSpacing
} = settingsSlice.actions;

export default settingsSlice.reducer;