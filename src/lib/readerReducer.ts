import { createSlice } from "@reduxjs/toolkit";

import { defaultPlatformModifier, UnstablePlatformModifier } from "@/core/Helpers/keyboardUtilities";
import { ThSettingsContainerKeys, ThLayoutDirection } from "@/preferences/models/enums";

export interface ReaderReducerState {
  profile: "epub" | "webPub" | undefined;
  direction: ThLayoutDirection;
  isLoading: boolean;
  isImmersive: boolean;
  isHovering: boolean;
  hasScrollAffordance: boolean;
  hasArrows: boolean;
  isFullscreen: boolean;
  settingsContainer: ThSettingsContainerKeys;
  platformModifier: UnstablePlatformModifier;
}

const initialState: ReaderReducerState = {
  profile: undefined,
  direction: ThLayoutDirection.ltr,
  isLoading: true,
  isImmersive: false,
  isHovering: false,
  hasScrollAffordance: false,
  hasArrows: true,
  isFullscreen: false,
  settingsContainer: ThSettingsContainerKeys.initial,
  platformModifier: defaultPlatformModifier
}

export const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    setReaderProfile: (state, action) => {
      state.profile = action.payload
    },
    setDirection: (state, action) => {
      state.direction = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setPlatformModifier: (state, action) => {
      state.platformModifier = action.payload
    },
    setImmersive: (state, action) => {
      state.isImmersive = action.payload
      if (action.payload === true) {
        state.isHovering = false;
        state.hasScrollAffordance = false;
      }
    },
    toggleImmersive: (state) => {
      state.isImmersive = !state.isImmersive;
      if (state.isImmersive === true) {
        state.isHovering = false;
        state.hasScrollAffordance = false;
      }
    },
    setHovering: (state, action) => {
      state.isHovering = action.payload
    },
    setScrollAffordance: (state, action) => {
      state.hasScrollAffordance = action.payload
      if (action.payload === true) {
        state.isHovering = false;
        state.isImmersive = false;
      }
    },
    setArrows: (state, action) => {
      state.hasArrows = action.payload
    },
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload
    },
    setSettingsContainer: (state, action) => {
      state.settingsContainer = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { 
  setReaderProfile, 
  setDirection, 
  setLoading,
  setPlatformModifier, 
  setImmersive, 
  toggleImmersive, 
  setHovering, 
  setScrollAffordance, 
  setArrows, 
  setFullscreen, 
  setSettingsContainer
} = readerSlice.actions;

export default readerSlice.reducer;