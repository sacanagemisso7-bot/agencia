"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type MarketingTheme = "light" | "dark";

type MarketingThemeContextValue = {
  theme: MarketingTheme;
  effectiveTheme: MarketingTheme;
  canToggle: boolean;
  setTheme: (theme: MarketingTheme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "ameni-home-theme";

const MarketingThemeContext = createContext<MarketingThemeContextValue | null>(null);

function normalizeTheme(value: string | null | undefined): MarketingTheme {
  return value === "dark" ? "dark" : "light";
}

function applyTheme(theme: MarketingTheme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function MarketingThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const canToggle = pathname === "/";
  const [theme, setThemeState] = useState<MarketingTheme>("light");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setThemeState(normalizeTheme(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  const effectiveTheme = canToggle ? theme : "dark";

  useEffect(() => {
    applyTheme(effectiveTheme);
  }, [effectiveTheme]);

  const setTheme = useCallback((nextTheme: MarketingTheme) => {
    setThemeState(nextTheme);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const value = useMemo<MarketingThemeContextValue>(
    () => ({
      theme,
      effectiveTheme,
      canToggle,
      setTheme,
      toggleTheme,
    }),
    [canToggle, effectiveTheme, setTheme, theme, toggleTheme],
  );

  return <MarketingThemeContext.Provider value={value}>{children}</MarketingThemeContext.Provider>;
}

export function useMarketingTheme() {
  const context = useContext(MarketingThemeContext);

  if (!context) {
    throw new Error("useMarketingTheme must be used within MarketingThemeProvider");
  }

  return context;
}

export const marketingThemeInitScript = `
  (function () {
    var storageKey = "${STORAGE_KEY}";
    var storedTheme = "light";

    try {
      var rawTheme = window.localStorage.getItem(storageKey);
      storedTheme = rawTheme === "dark" ? "dark" : "light";
    } catch (error) {}

    var effectiveTheme = window.location.pathname === "/" ? storedTheme : "dark";
    document.documentElement.dataset.theme = effectiveTheme;
    document.documentElement.style.colorScheme = effectiveTheme;
  })();
`;
