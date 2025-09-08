import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { 
  ThLayoutDirection, 
  ThLayoutUI, 
  ThProgressionFormat, 
  ThRunningHeadFormat, 
  ThPreferences,
  CustomizableKeys
} from "@/preferences";

import { mapPreferencesToState } from "./helpers/mapPreferences";

export interface L10nObject {
  locale?: string;
  direction?: ThLayoutDirection;
}

export interface RenditionObject<T extends string | Array<string>> {
  reflow?: T;
  fxl?: T;
}

export interface RenditionChangePayload<T extends string | Array<string>> {
  type: string;
  payload: {
    key: "reflow" | "fxl";
    value?: T;
  }
}

export interface PreferencesReducerState {
  l10n?: {
    locale?: string;
    direction?: ThLayoutDirection;
  },
  progressionFormat?: RenditionObject<ThProgressionFormat | Array<ThProgressionFormat>>;
  runningHeadFormat?: RenditionObject<ThRunningHeadFormat>;
  ui?: RenditionObject<ThLayoutUI>;
  scrollAffordances?: {
    hintInImmersive?: boolean;
    toggleOnMiddlePointer?: Array<"tap" | "click">;
    hideOnForwardScroll?: boolean;
    showOnBackwardScroll?: boolean;
  }
}

const initialState: PreferencesReducerState = {}

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setL10n: (state, action: PayloadAction<L10nObject>) => {
      state.l10n = action.payload
    },
    setProgressionFormat: (state, action: RenditionChangePayload<ThProgressionFormat | Array<ThProgressionFormat>>) => {
      state.progressionFormat = {
        ...state.progressionFormat,
        [action.payload.key]: action.payload.value
      }
    },
    setRunningHeadFormat: (state, action: RenditionChangePayload<ThRunningHeadFormat>) => {
      state.runningHeadFormat = {
        ...state.runningHeadFormat,
        [action.payload.key]: action.payload.value
      }
    },
    setUI: (state, action: RenditionChangePayload<ThLayoutUI>) => {
      state.ui = {
        ...state.ui,
        [action.payload.key]: action.payload.value
      }
    },
    setScrollAffordances: (state, action) => {
      state.scrollAffordances = action.payload
    },
    updateFromPreferences(state, action: PayloadAction<ThPreferences<CustomizableKeys>>) {
      const prefs = action.payload;
      return mapPreferencesToState(prefs);
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setL10n,
  setProgressionFormat,
  setRunningHeadFormat,
  setUI,
  setScrollAffordances,
  updateFromPreferences
} = preferencesSlice.actions;

export default preferencesSlice.reducer;