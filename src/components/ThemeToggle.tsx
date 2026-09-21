"use client";

// Client component #1 (PLAN §2.3): a three-state theme control that cycles
// Auto -> Light -> Dark -> Auto. Auto (the default) follows the computer theme;
// see src/lib/theme.ts. The no-flash script in the root layout applies the
// initial theme before paint.
//
// The chosen mode is read with useSyncExternalStore from the <html
// data-theme-mode> attribute (the React 19 way to read an external store),
// which avoids setState-in-effect and hydration warnings.

import { useEffect, useSyncExternalStore } from "react";
import {
  applyMode,
  readMode,
  readModeAttr,
  setThemeMode,
  THEME_EVENT,
  type ThemeMode,
} from "@/lib/theme";

const NEXT: Record<ThemeMode, ThemeMode> = {
  auto: "light",
  light: "dark",
  dark: "auto",
};

const LABEL: Record<ThemeMode, string> = {
  auto: "auto (matches computer theme)",
  light: "light",
  dark: "dark",
};

function subscribe(onChange: () => void) {
  const onCustom = () => onChange();
  // Cross-tab: another tab changed the stored mode. Reflect it here, then
  // notify (attributes are per-document, so this tab must re-apply).
  const onStorage = (e: StorageEvent) => {
    if (e.key === "theme") {
      applyMode(readMode());
      onChange();
    }
  };
  window.addEventListener(THEME_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

// Server + first client render before hydration: assume auto (the default; the
// no-flash script has already applied the real resolved theme independently).
const getServerSnapshot = (): ThemeMode => "auto";

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, readModeAttr, getServerSnapshot);

  // While in auto, re-resolve if the OS preference flips live.
  useEffect(() => {
    if (mode !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyMode("auto");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const next = NEXT[mode];

  return (
    <button
      type="button"
      onClick={() => setThemeMode(next)}
      aria-label={`Theme: ${LABEL[mode]}. Switch to ${LABEL[next]}.`}
      title={`Theme: ${LABEL[mode]}`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted transition-colors duration-[--duration-fast] hover:bg-paper-sunken hover:text-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {mode === "auto" ? (
        // Auto: a half-filled circle (the common "adaptive/contrast" glyph).
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" />
        </svg>
      ) : mode === "light" ? (
        // Light: sun.
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      ) : (
        // Dark: moon.
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
