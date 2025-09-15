import { PreferencesReducerState } from "@/lib";
import { ThPreferences, CustomizableKeys } from "../preferences";
import { ThPreferencesAdapter } from "./ThPreferencesAdapter";
import { mapPreferencesToState } from "@/lib/helpers/mapPreferences";

export class ThMemoryPreferencesAdapter<T extends CustomizableKeys = CustomizableKeys> implements ThPreferencesAdapter<T> {
  private preferences: ThPreferences<T>;
  private normalizedState: PreferencesReducerState;
  private listeners: Set<(prefs: ThPreferences<T>) => void> = new Set();

  constructor(initialPreferences: ThPreferences<T>) {
    this.preferences = { ...initialPreferences };
    this.normalizedState = mapPreferencesToState(this.preferences);
  }

  public getPreferences(): ThPreferences<T> {
    return { ...this.preferences };
  }

  public setPreferences(prefs: ThPreferences<T>): void {
    this.preferences = { ...prefs };
    this.normalizedState = mapPreferencesToState(this.preferences);
    this.notifyListeners(this.preferences);
  }

  public subscribe(listener: (prefs: ThPreferences<T>) => void): void {
    this.listeners.add(listener);
  }

  public unsubscribe(listener: (prefs: ThPreferences<T>) => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(prefs: ThPreferences<T>): void {
    this.listeners.forEach(listener => listener({ ...prefs }));
  }
}
