import { ThPreferences, CustomizableKeys } from "../preferences";
import { PreferencesAdapter } from "./PreferencesAdapter";

export class MemoryPreferencesAdapter<T extends CustomizableKeys = CustomizableKeys> implements PreferencesAdapter<T> {
  private prefs: ThPreferences<T>;
  private listeners: Set<(prefs: ThPreferences<T>) => void> = new Set();

  constructor(initialPrefs: ThPreferences<T>) {
    this.prefs = { ...initialPrefs };
  }

  public getPreferences(): ThPreferences<T> {
    return { ...this.prefs };
  }

  public setPreferences(prefs: ThPreferences<T>): void {
    this.prefs = { ...prefs };
    this.notifyListeners(this.prefs);
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
