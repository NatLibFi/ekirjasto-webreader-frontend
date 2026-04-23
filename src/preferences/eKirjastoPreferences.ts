

 "use client";
 
 import { UnstableShortcutMetaKeywords, UnstableShortcutRepresentation } from "@/core/Helpers/keyboardUtilities";
 import { ThCollapsibilityVisibility } from "@/core/Components/Actions/hooks/useCollapsibility";
 import { 
   ThActionsKeys, 
   ThBreakpoints, 
   ThDockingTypes, 
   ThDockingKeys, 
   ThSettingsKeys, 
   ThSheetTypes, 
   ThThemeKeys,  
   ThSheetHeaderVariant,
   ThLayoutUI,
   ThBackLinkVariant,
   ThProgressionFormat,
   ThRunningHeadFormat,
   ThDocumentTitleFormat,
   ThArrowVariant,
   lightTheme,
   darkTheme,
   paperTheme,
   sepiaTheme,
   ekirjasto1Theme,
   ekirjasto2Theme,
   ekirjasto3Theme,
   defaultSettingsAction,
   defaultFullscreenAction,
   defaultTocAction,
   defaultJumpToPositionAction,
   strictContentProtectionConfig,
   defaultContentProtectionConfig,
   defaultFontCollection,
   defaultLetterSpacing, 
   defaultLineHeights, 
   defaultParagraphIndent, 
   defaultParagraphSpacing, 
   defaultSpacingPresets, 
   defaultSpacingPresetsOrder, 
   defaultSpacingSettingsMain, 
   defaultSpacingSettingsSubpanel, 
   defaultTextSettingsMain, 
   defaultTextSettingsSubpanel, 
   defaultWordSpacing, 
   defaultZoom,
   tamilCollection
 } from "./models";
 import { createPreferences, ThPreferences, DefaultKeys } from "./preferences";

 const CustomLogo = 
  `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 974 1200">
    <style type="text/css">
	    .st0{fill:#3FB8AF;}
    </style>
    <g> 
      <path class="st0" d="M833.7,227.2c0-76.6-62.1-138.7-138.7-138.7c0,0-520.2,0-542.3,0C64.4,88.4,24.7,36.7,5.9,1H1l0.2,230.3 C3.4,306,64.5,365.9,139.7,365.9H695C771.6,365.9,833.7,303.8,833.7,227.2"/> 
      <path class="st0" d="M972.8,1060.3c0-76.6-62.1-138.7-138.7-138.7c0,0-659.3,0-681.4,0c-88.3,0-128-51.7-146.8-87.4H1l0.2,230.3 c2.2,74.7,63.3,134.6,138.5,134.6h694.4C910.7,1199,972.8,1136.9,972.8,1060.3"/> 
      <path class="st0" d="M695,643.5c0-76.6-62.1-138.7-138.7-138.7c0,0-381.5,0-403.6,0c-88.3,0-128-51.7-146.8-87.4H1l0.2,230.3 c2.2,74.7,63.3,134.6,138.5,134.6h416.6C632.9,782.2,695,720.1,695,643.5"/> 
    </g>
  </svg>`
 
 export const eKirjastoPreferences: ThPreferences<DefaultKeys> = createPreferences<DefaultKeys>({
 //  direction: ThLayoutDirection.ltr,
 //  locale: "en",
   experiments: {
     reflow: ["experimentalHeaderFiltering", "experimentalZoom"],
     webPub: ["experimentalHeaderFiltering", "experimentalZoom"]
   },
   metadata: {
     documentTitle: {
       format: ThDocumentTitleFormat.title
     }
   },
   typography: {
     minimalLineLength: 40, // undefined | null | number of characters. If 2 cols will switch to 1 based on this
     optimalLineLength: 55, // number of characters. If auto layout, picks colCount based on this
     maximalLineLength: 70, // undefined | null | number of characters.
     pageGutter: 20
   },
   theming: {
    header: {
      backLink: {
        variant: ThBackLinkVariant.custom,
        visibility: "partially",
        href: "",
        content: { 
          type: "svg",
          content: CustomLogo
        }      
      },
       runningHead: {
         format: {
           reflow: {
             default: {
               variants: ThRunningHeadFormat.chapter,
               displayInImmersive: true,
               displayInFullscreen: false
             },
             breakpoints: {
               [ThBreakpoints.compact]: {
                 variants: ThRunningHeadFormat.chapter,
                 displayInImmersive: false,
                 displayInFullscreen: false
               }
             }
           },
           fxl: {
             default: {
               variants: ThRunningHeadFormat.title,
               displayInImmersive: true,
               displayInFullscreen: true
             },
             breakpoints: {
               [ThBreakpoints.compact]: {
                 variants: ThRunningHeadFormat.title,
                 displayInImmersive: false,
                 displayInFullscreen: true
               }
             }
           },
           webPub: {
             default: {
               variants: ThRunningHeadFormat.chapter,
               displayInImmersive: true,
               displayInFullscreen: true
             }
           }
         }
       }
     },
     progression: {
       format: {
         reflow: {
           default: {
             variants: [
               ThProgressionFormat.positionsPercentOfTotal,
               ThProgressionFormat.progressionOfResource
             ],
             displayInImmersive: true,
             displayInFullscreen: false
           },
           breakpoints: {
             [ThBreakpoints.compact]: {
               variants: [
                 ThProgressionFormat.positionsOfTotal, 
                 ThProgressionFormat.resourceProgression
               ],
               displayInImmersive: false,
               displayInFullscreen: false
             }
           }
         },
         fxl: {
           default: {
             variants: [
               ThProgressionFormat.positionsOfTotal, 
               ThProgressionFormat.overallProgression,
               ThProgressionFormat.none
             ],
             displayInImmersive: true,
             displayInFullscreen: true
           },
           breakpoints: {
             [ThBreakpoints.compact]: {
               variants: [
                 ThProgressionFormat.positions, 
                 ThProgressionFormat.overallProgression,
                 ThProgressionFormat.none
               ],
               displayInImmersive: false,
               displayInFullscreen: true
             }
           }
         },
         webPub: {
           default: {
             variants: [
               ThProgressionFormat.readingOrderIndex, 
               ThProgressionFormat.none
             ],
             displayInImmersive: true,
             displayInFullscreen: true
           }
         }
       }
     },
     arrow: {
       size: 40, // Size of the left and right arrows in px
       offset: 5 // offset of the arrows from the edges in px
     },
     icon: {
       size: 24, // Size of icons in px
       tooltipOffset: 10 // offset of tooltip in px
     },
     layout: {
       ui: {
         reflow: ThLayoutUI.layered,
         fxl: ThLayoutUI.layered,
         webPub: ThLayoutUI.stacked
       },
       radius: 5, // border-radius of containers
       spacing: 20, // padding of containers/sheets
       defaults: {
         dockingWidth: 340, // default width of resizable panels
         scrim: "rgba(0, 0, 0, 0.2)" // default scrim/underlay bg-color
       },
       constraints: {
         [ThSheetTypes.bottomSheet]: 600, // Max-width of all bottom sheets
         [ThSheetTypes.popover]: 600, // Max-width of all popover sheets
         pagination: 1024 // Max-width of pagination component
       }
     },
     breakpoints: {
       // See https://m3.material.io/foundations/layout/applying-layout/window-size-classes
       [ThBreakpoints.compact]: 600, // Phone in portrait
       [ThBreakpoints.medium]: 840, // Tablet in portrait, Foldable in portrait (unfolded)
       [ThBreakpoints.expanded]: 1200, // Phone in landscape, Tablet in landscape, Foldable in landscape (unfolded), Desktop
       [ThBreakpoints.large]: 1600, // Desktop
       [ThBreakpoints.xLarge]: null // Desktop Ultra-wide
     },
     themes: {
       reflowOrder: [
         "auto", 
         ThThemeKeys.light, 
         ThThemeKeys.paper,
         ThThemeKeys.sepia, 
         ThThemeKeys.dark, 
         ThThemeKeys.ekirjasto1,
         ThThemeKeys.ekirjasto2,
         ThThemeKeys.ekirjasto3
       ],
       fxlOrder: [
         "auto",
         ThThemeKeys.light,
         ThThemeKeys.dark
       ],
       systemThemes: {
         light: ThThemeKeys.light,
         dark: ThThemeKeys.dark
       },
       keys: {
         [ThThemeKeys.light]: lightTheme,
         [ThThemeKeys.dark]: darkTheme,
         [ThThemeKeys.paper]: paperTheme,
         [ThThemeKeys.sepia]: sepiaTheme,
         [ThThemeKeys.ekirjasto1]: ekirjasto1Theme,
         [ThThemeKeys.ekirjasto2]: ekirjasto2Theme,
         [ThThemeKeys.ekirjasto3]: ekirjasto3Theme
       }
     },
   },
   contentProtection: strictContentProtectionConfig,
   affordances: { 
     scroll: {
       hintInImmersive: true,
       toggleOnMiddlePointer: ["tap", "click"],
       hideOnForwardScroll: true,
       showOnBackwardScroll: true
     },
     paginated: {
       reflow: {
         default: {
           variant: ThArrowVariant.layered,
           discard: ["navigation"],
           hint: ["layoutChange"]
         },
         breakpoints: {
           [ThBreakpoints.large]: {
             variant: ThArrowVariant.stacked
           },
           [ThBreakpoints.xLarge]: {
             variant: ThArrowVariant.stacked
           }
         }
       },
       fxl: {
         // Note FXL arrows are always layered
         // FXL navigator is using the window width to calculate the layout
         // so we need to force the layered variant to prevent layout issues
         default: {
           variant: ThArrowVariant.layered,
           discard: ["navigation"],
           hint: "none"
         }
       }
     }
   },
   shortcuts: {
     representation: UnstableShortcutRepresentation.symbol,
     joiner: "+"
   },
   actions: {
     reflowOrder: [
       ThActionsKeys.settings,
       ThActionsKeys.toc,
       ThActionsKeys.fullscreen,
       ThActionsKeys.jumpToPosition
     ],
     fxlOrder: [
       ThActionsKeys.settings,
       ThActionsKeys.toc,
       ThActionsKeys.fullscreen,
       ThActionsKeys.jumpToPosition
     ],
     webPubOrder: [
       ThActionsKeys.settings,
       ThActionsKeys.toc,
       ThActionsKeys.fullscreen
     ],
     collapse: {
       // Number of partially icons to display
       // value "all" a keyword for the length of displayOrder above
       // Icons with visibility always are excluded from collapsing
       [ThBreakpoints.compact]: 2,
       [ThBreakpoints.medium]: 3
     }, 
     keys: {
       [ThActionsKeys.settings]: defaultSettingsAction,
       [ThActionsKeys.fullscreen]: defaultFullscreenAction,
       [ThActionsKeys.toc]: defaultTocAction,
       [ThActionsKeys.jumpToPosition]: defaultJumpToPositionAction
     }
   },
   docking: {
     displayOrder: [
       ThDockingKeys.transient,
       ThDockingKeys.start,
       ThDockingKeys.end
     ],
     dock: {
       [ThBreakpoints.compact]: ThDockingTypes.none,
       [ThBreakpoints.medium]: ThDockingTypes.none,
       [ThBreakpoints.expanded]: ThDockingTypes.start,
       [ThBreakpoints.large]: ThDockingTypes.both,
       [ThBreakpoints.xLarge]: ThDockingTypes.both
     },
     collapse: true,
     keys: {
       [ThDockingKeys.start]: {
         visibility: ThCollapsibilityVisibility.overflow,
         shortcut: null
       },
       [ThDockingKeys.end]: {
         visibility: ThCollapsibilityVisibility.overflow,
         shortcut: null
       },
       [ThDockingKeys.transient]: {
         visibility: ThCollapsibilityVisibility.overflow,
         shortcut: null
       }
     }
   },
   settings: {
     reflowOrder: [
       ThSettingsKeys.zoom,
       ThSettingsKeys.textGroup,
       ThSettingsKeys.theme,
       ThSettingsKeys.spacingGroup,
       ThSettingsKeys.layout,
       ThSettingsKeys.columns
     ],
     fxlOrder: [
       ThSettingsKeys.theme,
       ThSettingsKeys.columns
     ],
     webPubOrder: [
       ThSettingsKeys.zoom,
       ThSettingsKeys.textGroup,
       ThSettingsKeys.spacingGroup
     ],
     keys: {
       [ThSettingsKeys.fontFamily]: {
         default: defaultFontCollection,
         tamil: {
           supportedLanguages: ["ta"],
           fonts: tamilCollection
         }
       },
       [ThSettingsKeys.letterSpacing]: defaultLetterSpacing,
       [ThSettingsKeys.lineHeight]: {
         allowUnset: false,
         keys: defaultLineHeights
       },
       [ThSettingsKeys.paragraphIndent]: defaultParagraphIndent,
       [ThSettingsKeys.paragraphSpacing]: defaultParagraphSpacing,
       [ThSettingsKeys.wordSpacing]: defaultWordSpacing,
       [ThSettingsKeys.zoom]: defaultZoom
     },
     text: {
       header: ThSheetHeaderVariant.previous,
       main: defaultTextSettingsMain,
       subPanel: defaultTextSettingsSubpanel
     },
     spacing: {
       header: ThSheetHeaderVariant.previous,
       main: defaultSpacingSettingsMain,
       subPanel: defaultSpacingSettingsSubpanel,
       presets: {
         reflowOrder: defaultSpacingPresetsOrder,
         webPubOrder: defaultSpacingPresetsOrder,
         keys: defaultSpacingPresets
       }
     }
   }
 })
