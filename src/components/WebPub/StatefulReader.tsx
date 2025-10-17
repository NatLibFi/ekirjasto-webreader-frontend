"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import "../assets/styles/reader.css";

import { StatefulReaderProps } from "../Epub/StatefulReader";
import { 
  ThActionsKeys, 
  ThDocumentTitleFormat, 
  ThLayoutUI, 
  ThProgressionFormat 
} from "@/preferences/models/enums";

import { WebPubNavigatorListeners } from "@readium/navigator";

import { 
  Fetcher, 
  HttpFetcher, 
  Locator, 
  Manifest, 
  Publication, 
  ReadingProgression 
} from "@readium/shared";
import {
  BasicTextSelection,
  FrameClickEvent,
} from "@readium/navigator-html-injectables";

import { I18nProvider } from "react-aria";
import { ThPluginProvider } from "../Plugins/PluginProvider";
import { ThPluginRegistry } from "../Plugins/PluginRegistry";
import { NavigatorProvider } from "@/core/Navigator";

import { createDefaultPlugin } from "../Plugins/helpers/createDefaultPlugin";

import { StatefulDockingWrapper } from "../Docking/StatefulDockingWrapper";
import { StatefulReaderHeader } from "../StatefulReaderHeader";
import { StatefulReaderFooter } from "../StatefulReaderFooter";

import { usePreferences } from "@/preferences/hooks/usePreferences";
import { useWebPubNavigator } from "@/core/Hooks/WebPub";
import { useI18n } from "@/i18n/useI18n";
import { useLocalStorage } from "@/core/Hooks/useLocalStorage";
import { useFullscreen } from "@/core/Hooks/useFullscreen";
import { useTimeline } from "@/core/Hooks/useTimeline";
import { useDocumentTitle } from "@/core/Hooks/useDocumentTitle";
import { ThemeKeyType, useTheming } from "@/preferences";

import { toggleActionOpen, useAppStore } from "@/lib";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { 
  setDirection, 
  setFullscreen, 
  setHovering, 
  setLoading, 
  setPlatformModifier, 
  setReaderProfile,
  toggleImmersive
} from "@/lib/readerReducer";
import { 
  setPublicationEnd, 
  setPublicationStart, 
  setRTL, 
  setTimeline 
} from "@/lib/publicationReducer";
import { 
  setBreakpoint, 
  setColorScheme, 
  setContrast, 
  setForcedColors, 
  setMonochrome, 
  setReducedMotion, 
  setReducedTransparency 
} from "@/lib/themeReducer";

import Peripherals from "@/helpers/peripherals";

import { getPlatformModifier } from "@/core/Helpers/keyboardUtilities";
import { propsToCSSVars } from "@/core/Helpers/propsToCSSVars";
import classNames from "classnames";

export const ExperimentalWebPubStatefulReader = ({
  rawManifest,
  selfHref,
  plugins
}: StatefulReaderProps) => {
  const [pluginsRegistered, setPluginsRegistered] = useState(false);

  useEffect(() => {
    if (plugins && plugins.length > 0) {
      plugins.forEach(plugin => {
        ThPluginRegistry.register(plugin);
      });
    } else {
      ThPluginRegistry.register(createDefaultPlugin());
    }
    setPluginsRegistered(true);
  }, [plugins]);

  if (!pluginsRegistered) {
    return null;
  }

  return (
    <>
      <ThPluginProvider>
        <WebPubStatefulReaderInner rawManifest={ rawManifest } selfHref={ selfHref } />
      </ThPluginProvider>
    </>
  );
};

const WebPubStatefulReaderInner = ({ rawManifest, selfHref }: { rawManifest: object; selfHref: string }) => {
  const [publication, setPublication] = useState<Publication | null>(null);

  const container = useRef<HTMLDivElement>(null);
  const localDataKey = useRef(`${selfHref}-current-location`);

  const theme = "auto";

  const dispatch = useAppDispatch();

  const { preferences } = usePreferences();
  const { t } = useI18n();

  const webPubNavigator = useWebPubNavigator();
  const { 
    WebPubNavigatorLoad, 
    WebPubNavigatorDestroy,
    canGoBackward,
    canGoForward,
    currentPositions,
  } = webPubNavigator;

  // Init theming (breakpoints, theme, media queries…)
  useTheming<ThemeKeyType>({ 
    theme: theme,
    themeKeys: preferences.theming.themes.keys,
    systemKeys: preferences.theming.themes.systemThemes,
    breakpointsMap: preferences.theming.breakpoints,
    initProps: {
      ...propsToCSSVars(preferences.theming.arrow, "arrow"), 
      ...propsToCSSVars(preferences.theming.icon, "icon"),
      ...propsToCSSVars(preferences.theming.layout, "layout")
    },
    onBreakpointChange: (breakpoint) => dispatch(setBreakpoint(breakpoint)),
    onColorSchemeChange: (colorScheme) => dispatch(setColorScheme(colorScheme)),
    onContrastChange: (contrast) => dispatch(setContrast(contrast)),
    onForcedColorsChange: (forcedColors) => dispatch(setForcedColors(forcedColors)),
    onMonochromeChange: (isMonochrome) => dispatch(setMonochrome(isMonochrome)),
    onReducedMotionChange: (reducedMotion) => dispatch(setReducedMotion(reducedMotion)),
    onReducedTransparencyChange: (reducedTransparency) => dispatch(setReducedTransparency(reducedTransparency))
  });

  const onFsChange = useCallback((isFullscreen: boolean) => {
    dispatch(setFullscreen(isFullscreen));
  }, [dispatch]);
  const fs = useFullscreen(onFsChange);

  const { setLocalData, getLocalData, localData } = useLocalStorage(localDataKey.current);

  const timeline = useTimeline({
    publication: publication,
    currentLocation: localData,
    currentPositions: currentPositions() || [],
    positionsList: undefined,
    onChange: (timeline) => {
      dispatch(setTimeline(timeline));
    }
  });

  const documentTitleFormat = preferences.metadata?.documentTitle?.format;

  let documentTitle: string | undefined;

  if (documentTitleFormat) {
    if (typeof documentTitleFormat === "object" && "key" in documentTitleFormat) {
      const translatedTitle = t(documentTitleFormat.key);
      documentTitle = translatedTitle !== documentTitleFormat.key
        ? translatedTitle
        : documentTitleFormat.fallback;
    } else {
      switch (documentTitleFormat) {
        case ThDocumentTitleFormat.title:
          documentTitle = timeline?.title;
          break;
        case ThDocumentTitleFormat.chapter:
          documentTitle = timeline?.progression?.currentChapter;
          break;
        case ThDocumentTitleFormat.titleAndChapter:
          if (timeline?.title && timeline?.progression?.currentChapter) {
            documentTitle = `${timeline.title} – ${timeline.progression.currentChapter}`;
          }
          break;
        case ThDocumentTitleFormat.none:
          documentTitle = undefined;
          break;
        default:
          documentTitle = documentTitleFormat;
          break;
      }
    }
  }

  useDocumentTitle(documentTitle);

  const isImmersive = useAppSelector(state => state.reader.isImmersive);
  const isHovering = useAppSelector(state => state.reader.isHovering);

  const layoutUI = preferences.theming.layout.ui?.webPub || ThLayoutUI.stacked;

  const p = new Peripherals(useAppStore(), preferences.actions, {
    moveTo: () => {},
    goProgression: () => {},
    toggleAction: (actionKey) => {
      switch (actionKey) {
        case ThActionsKeys.fullscreen:
          fs.handleFullscreen();
          break;
        case ThActionsKeys.toc:
          dispatch(toggleActionOpen({
            key: actionKey
          }))
          break;
        default:
          break
      }
    }
  });

  const toggleIsImmersive = useCallback(() => {
    // If tap/click in iframe, then header/footer no longer hoovering 
    dispatch(setHovering(false));
    dispatch(toggleImmersive());
  }, [dispatch]);

  const listeners: WebPubNavigatorListeners = {
    frameLoaded: async function (_wnd: Window): Promise<void> {
      p.observe(window);
    },
    positionChanged: async function (locator: Locator): Promise<void> {
      setLocalData(locator)

      if (canGoBackward()) {
        dispatch(setPublicationStart(false));
      } else {
        dispatch(setPublicationStart(true));
      }

      if (canGoForward()) {
        dispatch(setPublicationEnd(false));
      } else {
        dispatch(setPublicationEnd(true));
      }
    },
    tap: function (_e: FrameClickEvent): boolean {
      toggleIsImmersive();
      return true;
    },
    click: function (_e: FrameClickEvent): boolean {
      return false;
    },
    zoom: function (_scale: number): void { },
    scroll: function (_delta: number): void { },
    customEvent: function (_key: string, _data: unknown): void { },
    handleLocator: function (locator: Locator): boolean {
      const href = locator.href;

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        if (confirm(`Open "${href}" ?`)) window.open(href, "_blank");
      } else {
        console.warn("Unhandled locator", locator);
      }
      return false;
    },
    textSelected: function (_selection: BasicTextSelection): void { },
  };

  useEffect(() => {
    preferences.direction && dispatch(setDirection(preferences.direction));
    dispatch(setPlatformModifier(getPlatformModifier()));
  }, [preferences.direction, dispatch]);

  useEffect(() => {
    const fetcher: Fetcher = new HttpFetcher(undefined, selfHref);
    const manifest = Manifest.deserialize(rawManifest)!;
    manifest.setSelfLink(selfHref);
  
    setPublication(new Publication({
      manifest: manifest,
      fetcher: fetcher
    }));
  }, [rawManifest, selfHref]);

  useEffect(() => {
    if (!publication) return;

    dispatch(setReaderProfile("webPub"));
    
    dispatch(setRTL(publication.metadata.effectiveReadingProgression === ReadingProgression.rtl));

    const initialPosition: Locator | null = getLocalData();

    WebPubNavigatorLoad({
      container: container.current,
      publication: publication,
      listeners: listeners,
      initialPosition: initialPosition ? new Locator(initialPosition) : undefined,
    }, () => {
      p.observe(window);
    });

    dispatch(setLoading(false));

    return () => {
      WebPubNavigatorDestroy(() => {
        p.destroy();
      });
    };
  }, [publication]);

  return (
    <>
    <I18nProvider locale={ preferences.locale }>
    <NavigatorProvider navigator={ webPubNavigator }>
      <main id="reader-main">
        <StatefulDockingWrapper>
          <div 
            id="reader-shell" 
            className={ 
              classNames(
                "isScroll",
                isImmersive ? "isImmersive" : "",
                isHovering ? "isHovering" : "",
                layoutUI
              )
            }
          >
            <StatefulReaderHeader 
              actionKeys={ preferences.actions.webPubOrder }
              actionsOrder={ preferences.actions.webPubOrder }
              layout={ layoutUI } 
              runningHeadFormatPref={ preferences.theming.header?.runningHead?.format?.webPub }
            />

            <article id="wrapper" aria-label={ t("reader.app.publicationWrapper") }>
              <div id="container" ref={ container }></div>
            </article>

          <StatefulReaderFooter 
            layout={ layoutUI } 
            progressionFormatPref={ preferences.theming.progression?.format?.webPub }
            progressionFormatFallback={ ThProgressionFormat.readingOrderIndex }
          />
        </div>
      </StatefulDockingWrapper>
    </main>
  </NavigatorProvider>
  </I18nProvider>
  </>
  );
};
