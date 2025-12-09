"use client";

import { 
  EpubNavigator
} from "@readium/navigator";

export function copyProtection(navigatorInstance: EpubNavigator) {
  // BLOCK copy, right-click, selection inside each content iframe
  const cframes = navigatorInstance._cframes || [];
  const prevent = (e: Event) => e.preventDefault();

  const attachBlocker = (iframe: HTMLIFrameElement) => {
    const prevent = (e: Event) => e.preventDefault();

    const doAttach = (doc: Document | null) => {
      if (!doc) return;
      doc.addEventListener("contextmenu", prevent);
      doc.addEventListener("copy", prevent);
      doc.addEventListener("cut", prevent);
      doc.addEventListener("selectstart", prevent);
      doc.addEventListener("mousedown", prevent);
    };

    const doc = iframe.contentDocument;
    if (doc?.readyState === "complete" || doc?.readyState === "interactive") {
      // Already loaded → attach immediately
      doAttach(doc);
    } else {
      // Not yet loaded → wait for load event
      iframe.addEventListener("load", () => {
        doAttach(iframe.contentDocument);
      });
    }
  };

  cframes.forEach((cframe: any) => {
    const iframe = cframe.frame;
    if (!iframe) return;
      attachBlocker(cframe.iframe);

    iframe.addEventListener("load", () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      doc.addEventListener("copy", prevent);
      doc.addEventListener("cut", prevent);
      doc.addEventListener("contextmenu", prevent);
      doc.addEventListener("selectstart", prevent);
      doc.addEventListener("mousedown", prevent);
    });
  });
}
