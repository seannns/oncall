"use client";

import React from "react";

const PALETTES = ["p0", "p1", "p2", "p3", "p4"];
const STORAGE_KEY = "theme-palette";

export default function ThemeSwitcher() {
  const [idx, setIdx] = React.useState<number>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v ? Math.max(0, PALETTES.indexOf(v)) : 0;
    } catch {
      return 0;
    }
  });

  React.useEffect(() => {
    const theme = PALETTES[idx] ?? PALETTES[0];
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [idx]);

  function handleClick() {
    setIdx((i) => (i + 1) % PALETTES.length);
  }

  return (
    <div className="theme-switcher" aria-hidden={false}>
      <button
        className="theme-switcher-button"
        aria-label="Cycle theme palette"
        onClick={handleClick}
      >
        <span className="theme-switcher-dot" />
      </button>
    </div>
  );
}
