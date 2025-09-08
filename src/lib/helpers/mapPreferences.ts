import { PreferencesReducerState } from '../preferencesReducer';
import { ThPreferences, CustomizableKeys } from '@/preferences/preferences';

export const mapPreferencesToState = <T extends CustomizableKeys>(prefs: ThPreferences<T>): PreferencesReducerState => {
  return {
    l10n: {
      locale: prefs.locale,
      direction: prefs.direction
    },
    progressionFormat: {
      reflow: prefs.theming?.progression?.format?.reflow,
      fxl: prefs.theming?.progression?.format?.fxl
    },
    runningHeadFormat: {
      reflow: prefs.theming?.header?.runningHead?.format?.reflow,
      fxl: prefs.theming?.header?.runningHead?.format?.fxl
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
      progression: {
        format: {
          reflow: state.progressionFormat?.reflow ?? currentPrefs.theming.progression?.format?.reflow,
          fxl: state.progressionFormat?.fxl ?? currentPrefs.theming.progression?.format?.fxl
        }
      },
      header: state.runningHeadFormat ? {
        ...currentPrefs.theming.header,
        runningHead: {
          format: {
            reflow: state.runningHeadFormat.reflow ?? currentPrefs.theming.header?.runningHead?.format?.reflow,
            fxl: state.runningHeadFormat.fxl ?? currentPrefs.theming.header?.runningHead?.format?.fxl
          }
        }
      } : currentPrefs.theming.header,
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