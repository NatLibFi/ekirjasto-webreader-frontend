import { createSlice } from "@reduxjs/toolkit";

export interface WebPubSettingsReducerState {
  zoom: number;
}

const initialState: WebPubSettingsReducerState = {
  zoom: 1,
}

export const webPubSettingsSlice = createSlice({
  name: "webPubSettings",
  initialState,
  reducers: {
    setWebPubZoom: (state, action) => {
      state.zoom = action.payload
    },
  }
});

export const initialWebPubSettingsState = initialState;

// Action creators are generated for each case reducer function
export const { 
  setWebPubZoom
} = webPubSettingsSlice.actions;

export default webPubSettingsSlice.reducer;