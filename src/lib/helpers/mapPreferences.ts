import { PreferencesReducerState } from "../preferencesReducer";
import { ThPreferences, CustomizableKeys } from "@/preferences/preferences";
import { ThProgressionFormat, ThRunningHeadFormat } from "@/preferences/models/enums";

export const mapPreferencesToState = <T extends CustomizableKeys>(prefs: ThPreferences<T>): PreferencesReducerState => {  
  return {
    l10n: {
      locale: prefs.locale,
      direction: prefs.direction
    },
    progressionFormat: {
      reflow: prefs.theming?.progression?.format?.reflow?.default?.variants,
      fxl: prefs.theming?.progression?.format?.fxl?.default?.variants
    },
    runningHeadFormat: {
      reflow: prefs.theming?.header?.runningHead?.format?.reflow?.default?.variants,
      fxl: prefs.theming?.header?.runningHead?.format?.fxl?.default?.variants
    },
    ui: {
      reflow: prefs.theming?.layout?.ui?.reflow,
      fxl: prefs.theming?.layout?.ui?.fxl
    },
    scrollAffordances: {
      hintInImmersive: prefs.affordances?.scroll?.hintInImmersive ?? false,
      toggleOnMiddlePointer: prefs.affordances?.scroll?.toggleOnMiddlePointer ?? [],
      hideOnForwardScroll: prefs.affordances?.scroll?.hideOnForwardScroll ?? false,
      showOnBackwardScroll: prefs.affordances?.scroll?.showOnBackwardScroll ?? false
    }
  };
}

export const mapStateToPreferences = <T extends CustomizableKeys = CustomizableKeys>(
  state: PreferencesReducerState, 
  currentPrefs: ThPreferences<T>
): ThPreferences<T> => {
  const newPrefs: ThPreferences<T> = {
    ...currentPrefs,
    locale: state.l10n?.locale ?? currentPrefs.locale,
    direction: state.l10n?.direction ?? currentPrefs.direction,
    theming: {
      ...currentPrefs.theming,
      ...(state.progressionFormat && {
        progression: {
          ...currentPrefs.theming.progression,
          format: {
            ...currentPrefs.theming.progression?.format,
            ...(state.progressionFormat.reflow !== undefined && {
              reflow: {
                default: {
                  variants: state.progressionFormat.reflow as ThProgressionFormat | ThProgressionFormat[],
                  displayInImmersive: currentPrefs.theming.progression?.format?.reflow?.default?.displayInImmersive,
                  displayInFullscreen: currentPrefs.theming.progression?.format?.reflow?.default?.displayInFullscreen
                }
              }
            }),
            ...(state.progressionFormat.fxl !== undefined && {
              fxl: {
                default: {
                  variants: state.progressionFormat.fxl as ThProgressionFormat | ThProgressionFormat[],
                  displayInImmersive: currentPrefs.theming.progression?.format?.fxl?.default?.displayInImmersive,
                  displayInFullscreen: currentPrefs.theming.progression?.format?.fxl?.default?.displayInFullscreen
                }
              }
            })
          }
        }
      }),
      ...(state.runningHeadFormat && {
        header: {
          ...currentPrefs.theming.header,
          runningHead: {
            ...currentPrefs.theming.header?.runningHead,
            format: {
              ...currentPrefs.theming.header?.runningHead?.format,
              ...(state.runningHeadFormat.reflow !== undefined && {
                reflow: {
                  default: {
                    variants: state.runningHeadFormat.reflow as ThRunningHeadFormat,
                    displayInImmersive: currentPrefs.theming.header?.runningHead?.format?.reflow?.default?.displayInImmersive,
                    displayInFullscreen: currentPrefs.theming.header?.runningHead?.format?.reflow?.default?.displayInFullscreen
                  }
                }
              }),
              ...(state.runningHeadFormat.fxl !== undefined && {
                fxl: {
                  default: {
                    variants: state.runningHeadFormat.fxl as ThRunningHeadFormat,
                    displayInImmersive: currentPrefs.theming.header?.runningHead?.format?.fxl?.default?.displayInImmersive,
                    displayInFullscreen: currentPrefs.theming.header?.runningHead?.format?.fxl?.default?.displayInFullscreen
                  }
                }
              })
            }
          }
        }
      }),
      layout: {
        ...currentPrefs.theming.layout,
        ui: state.ui ? {
          reflow: state.ui.reflow ?? currentPrefs.theming.layout.ui?.reflow,
          fxl: state.ui.fxl ?? currentPrefs.theming.layout.ui?.fxl
        } : currentPrefs.theming.layout.ui
      }
    },
    affordances: {
      ...currentPrefs.affordances,
      scroll: {
        ...currentPrefs.affordances.scroll,
        ...(state.scrollAffordances ? {
          hintInImmersive: state.scrollAffordances.hintInImmersive,
          toggleOnMiddlePointer: state.scrollAffordances.toggleOnMiddlePointer,
          hideOnForwardScroll: state.scrollAffordances.hideOnForwardScroll,
          showOnBackwardScroll: state.scrollAffordances.showOnBackwardScroll
        } : {})
      }
    }
  };

  return newPrefs;
}