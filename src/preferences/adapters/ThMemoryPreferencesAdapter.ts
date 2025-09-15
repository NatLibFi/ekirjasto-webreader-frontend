import { PreferencesReducerState } from "@/lib";
import { ThPreferences, CustomizableKeys } from "../preferences";
import { ThPreferencesAdapter } from "./ThPreferencesAdapter";
import { mapPreferencesToState } from "@/lib/helpers/mapPreferences";

export class ThMemoryPreferencesAdapter<T extends CustomizableKeys = CustomizableKeys> implements ThPreferencesAdapter<T> {
  private currentPreferences: ThPreferences<T>;
  private normalizedState: PreferencesReducerState;
  private listeners: Set<(prefs: ThPreferences<T>) => void> = new Set();

  constructor(initialPreferences: ThPreferences<T>) {
    this.currentPreferences = { ...initialPreferences };
    this.normalizedState = mapPreferencesToState(this.currentPreferences);
  }

  public getPreferences(): ThPreferences<T> {
    return { ...this.currentPreferences };
  }

  public setPreferences(prefs: ThPreferences<T>): void {
    this.currentPreferences = { ...prefs };
    this.normalizedState = mapPreferencesToState(this.currentPreferences);
    this.notifyListeners(this.currentPreferences);
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
