// Theme state model (three modes). The user picks one of:
//   "light" | "dark"  explicit, fixed
//   "auto"            default; resolves from the operating system theme
//
// Two things are tracked on <html>:
//   data-theme       the RESOLVED theme ("light" | "dark"), drives all CSS
//   data-theme-mode  the chosen MODE ("light" | "dark" | "auto"), drives the
//                    toggle's icon and its knowledge of what to cycle to
//
// Auto resolution (see resolveMode) follows the operating system's
// prefers-color-scheme setting.
//
// IMPORTANT: the no-flash inline script in src/app/layout.tsx duplicates
// readMode + resolveMode so the theme is applied before first paint. Keep the
// two in sync; there is no way to share a module into that inline string.

export type ThemeMode = "light" | "dark" | "auto";

export const THEME_KEY = "theme";
export const THEME_EVENT = "themechange";

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** The stored mode, or "auto" when nothing is saved (the default). */
export function readMode(): ThemeMode {
  try {
    const m = localStorage.getItem(THEME_KEY);
    if (m === "light" || m === "dark" || m === "auto") return m;
  } catch {
    // storage unavailable: fall through to the default
  }
  return "auto";
}

/** The mode currently reflected on <html>, for cheap useSyncExternalStore reads. */
export function readModeAttr(): ThemeMode {
  const m = document.documentElement.getAttribute("data-theme-mode");
  if (m === "light" || m === "dark" || m === "auto") return m;
  return "auto";
}

/** Resolve a mode to the concrete theme that CSS consumes. */
export function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  return prefersDark() ? "dark" : "light";
}

/** Reflect a mode onto <html> (both attributes). Does not persist. */
export function applyMode(mode: ThemeMode): void {
  const d = document.documentElement;
  d.setAttribute("data-theme", resolveMode(mode));
  d.setAttribute("data-theme-mode", mode);
}

/** Persist a mode, apply it, and notify listeners (toggle, other components). */
export function setThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    // storage unavailable: the mode still applies for this session
  }
  applyMode(mode);
  window.dispatchEvent(new Event(THEME_EVENT));
}
