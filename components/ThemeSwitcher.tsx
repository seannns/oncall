"use client";

import React, { useEffect, useState } from "react";

const THEMES = [
  { name: "t1", bg: "#f5e1e1", fg: "#3d2a2a" },
  { name: "t1-inv", bg: "#3d2a2a", fg: "#d4c4c4" },
  { name: "t2", bg: "#e6f7ff", fg: "#003049" },
  { name: "t2-inv", bg: "#003049", fg: "#e6f7ff" },
  { name: "t3", bg: "#f2e5bc", fg: "#3c3836" },
  { name: "t3-inv", bg: "#282828", fg: "#ebdbb2" },
];

export default function ThemeSwitcher() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("theme-idx");
    if (saved) {
      const n = parseInt(saved, 10);
      if (!isNaN(n) && n >= 0 && n < THEMES.length) {
        setIdx(n);
        applyTheme(n);
      }
    }
  }, []);

  function applyTheme(i: number) {
    const t = THEMES[i];
    document.documentElement.style.setProperty("--background", t.bg);
    document.documentElement.style.setProperty("--foreground", t.fg);
  }

  function handleClick() {
    const next = (idx + 1) % THEMES.length;
    setIdx(next);
    applyTheme(next);
    localStorage.setItem("theme-idx", String(next));
  }

  return (
    <div className="theme-switcher" aria-hidden={false}>
      <button
        className="theme-switcher-button"
        aria-label="Cycle theme palette"
        onClick={handleClick}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ overflow: "visible" }}>
          <defs>
            <pattern id="themeSwitcherStripes" patternUnits="userSpaceOnUse" width="2.5" height="2.5" patternTransform="rotate(45)">
              <rect width="2.5" height="2.5" fill="transparent" />
              <path d="M0 0 L0 2.5" stroke="var(--foreground)" strokeWidth="1" strokeLinecap="square" />
            </pattern>
          </defs>
          <circle cx="6" cy="6" r="5" fill="url(#themeSwitcherStripes)" stroke="var(--foreground)" strokeWidth="0.5" />
        </svg>
      </button>
    </div>
  );
}
