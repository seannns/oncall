"use client";

import React from "react";
import { createPortal } from "react-dom";

type Option = { value: string; label: string };

export default function CustomSelect({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [portalRect, setPortalRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (e.target && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  React.useEffect(() => {
    if (open && buttonRef.current) setPortalRect(buttonRef.current.getBoundingClientRect());
    else setPortalRect(null);
  }, [open]);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="custom-select" ref={containerRef}>
      <button
        type="button"
        className="custom-select-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        ref={buttonRef}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown') setOpen(true); }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{current.label}</span>
        </div>
        <span aria-hidden>▾</span>
      </button>

      {open && portalRect && createPortal(
        <div
          className="custom-select-list"
          role="listbox"
          style={{
            position: 'fixed',
            top: portalRect.bottom + window.scrollY,
            left: portalRect.left + window.scrollX,
            width: portalRect.width,
            zIndex: 100000,
            opacity: 1,
            transform: 'translateY(0)',
            maxHeight: 'none',
            overflow: 'visible',
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className="custom-select-item"
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
            >
              <span>{opt.label}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
