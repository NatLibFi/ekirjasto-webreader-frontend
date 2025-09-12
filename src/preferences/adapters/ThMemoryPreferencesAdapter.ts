import { ThPreferences, CustomizableKeys } from "../preferences";
import { ThPreferencesAdapter } from "./ThPreferencesAdapter";

export class ThMemoryPreferencesAdapter<T extends CustomizableKeys = CustomizableKeys> implements ThPreferencesAdapter<T> {
  private preferences: ThPreferences<T>;
  private listeners: Set<(prefs: ThPreferences<T>) => void> = new Set();

  constructor(initialPreferences: ThPreferences<T>) {
    this.preferences = { ...initialPreferences };
  }

  public getPreferences(): ThPreferences<T> {
    return { ...this.preferences };
  }

  public setPreferences(prefs: ThPreferences<T>): void {
    this.preferences = { ...prefs };
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
