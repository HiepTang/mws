"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "vi";

const STORAGE_KEY = "mws_lang";

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({
  lang: "en",
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

/**
 * Sets data-lang on <html> from localStorage before first paint.
 * Drop into <head> to prevent the brief flicker from server-rendered "en"
 * → client-hydrated "vi" for VI-preference users.
 */
export function LangBootstrapScript() {
  const code = `
    (function () {
      try {
        var l = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
        if (l !== "en" && l !== "vi") l = "en";
        document.documentElement.setAttribute("data-lang", l);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // After hydration, read the value the bootstrap script applied so the
  // React state matches the DOM attribute. Avoids a hydration mismatch on
  // any text that depends on `lang` from context (rather than CSS visibility).
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-lang");
    if (attr === "vi") setLangState("vi");
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.setAttribute("data-lang", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage may be blocked; the in-memory state still updates */
    }
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

/**
 * Renders both EN and VI text. CSS in globals.css hides whichever is not
 * active based on [data-lang] on <html>. Works in server components — no
 * client boundary required for static text.
 */
export function T({ en, vi }: { en: ReactNode; vi: ReactNode }) {
  return (
    <>
      <span className="en-only">{en}</span>
      <span className="vi-only">{vi}</span>
    </>
  );
}
