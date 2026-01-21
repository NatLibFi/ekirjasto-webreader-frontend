"use client";

import { 
  EpubNavigator
} from "@readium/navigator";

const EVENTS = ["contextmenu", "copy", "cut", "selectstart", "mousedown"];

export function copyProtection(navigatorInstance: EpubNavigator) {
  // BLOCK copy, right-click, selection inside each content iframe
  const cframes = navigatorInstance._cframes || [];

  const prevent = (e: Event) => e.preventDefault();

  const doAttach = (doc: Document | null) => {
    if (!doc) return;

    // Skip if already attached
    if ((doc as any)._copyBlockApplied) return;
    (doc as any)._copyBlockApplied = true;

    EVENTS.forEach((evt) => doc.addEventListener(evt, prevent));
  };

  const attachBlocker = (iframe: HTMLIFrameElement) => {
    const doc = iframe.contentDocument;
    if (doc && (doc?.readyState === "complete" || doc?.readyState === "interactive")) {
      doAttach(doc);
    } else {
      iframe.addEventListener("load", () => {
        doAttach(iframe.contentDocument);
      });
    }
  };

  cframes.forEach((cframe: any) => {
    const iframe = cframe?.frame;
    if (!iframe) return;
    attachBlocker(cframe.iframe);
  });
}
