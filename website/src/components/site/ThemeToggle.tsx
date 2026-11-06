"use client";

import { useEffect, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const isDark = () => document.documentElement.dataset.theme === "dark";

function stored(): "light" | "dark" | null {
  try {
    const v = localStorage.getItem("theme");
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

// The initial theme is set by the script in <head> (see layout.tsx) so the page never flashes.
export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  // Until the visitor picks a side, follow the system setting as it changes.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (!stored()) document.documentElement.dataset.theme = query.matches ? "dark" : "light";
    };
    query.addEventListener("change", follow);
    return () => query.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private windows can block storage; the choice then lasts until the page closes.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark mode"
      className="flex w-[60px] shrink-0 items-center justify-center bg-surface text-ink transition-colors hover:bg-surface-2"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
      </svg>
    </button>
  );
}
