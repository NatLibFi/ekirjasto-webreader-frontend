import { Store } from "@reduxjs/toolkit";

import { ThPreferences, CustomizableKeys } from "../preferences/preferences";

import { ThPreferencesAdapter } from "../preferences/adapters/ThPreferencesAdapter";

import { AppState } from "@/lib/store";
import { preferencesSlice } from "@/lib/preferencesReducer";
import { mapStateToPreferences } from "@/lib/helpers/mapPreferences";

export class ThReduxPreferencesAdapter<T extends CustomizableKeys = CustomizableKeys> implements ThPreferencesAdapter<T> {
  private store: Store<AppState>;
  private listeners: Set<(prefs: ThPreferences<T>) => void> = new Set();
  private currentPrefs: ThPreferences<T>;

  constructor(store: Store<AppState>, initialPrefs: ThPreferences<T>) {
    this.store = store;
    this.currentPrefs = initialPrefs;
    
    this.store.subscribe(() => {
      const state = this.store.getState();
      const prefs = this.mapStateToPreferences(state);
      this.notifyListeners(prefs);
    });
  }

  public getPreferences(): ThPreferences<T> {
    return { ...this.currentPrefs };
  }

  public setPreferences(prefs: ThPreferences<T>): void {
    this.currentPrefs = prefs;
    this.store.dispatch(preferencesSlice.actions.updateFromPreferences(prefs as any));
    this.notifyListeners(prefs);
  }

  public subscribe(callback: (prefs: ThPreferences<T>) => void): void {
    this.listeners.add(callback);
    callback(this.getPreferences());
  }

  public unsubscribe(callback: (prefs: ThPreferences<T>) => void): void {
    this.listeners.delete(callback);
  }

  private mapStateToPreferences(state: AppState): ThPreferences<T> {
    if (!state.preferences) return this.currentPrefs;
    
    const updatedPrefs = mapStateToPreferences<T>(state.preferences, { ...this.currentPrefs });
    return updatedPrefs;
  }

  private notifyListeners(prefs: ThPreferences<T>): void {
    const prefsCopy = JSON.parse(JSON.stringify(prefs));
    this.listeners.forEach(callback => callback(prefsCopy));
  }
}
