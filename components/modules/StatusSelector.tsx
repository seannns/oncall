"use client";

import React from "react";
import { createPortal } from "react-dom";

type StatusOption = "Available" | "Unavailable" | "Personal" | "Emails" | "Meal" | "Break";

const STATUS_OPTIONS: StatusOption[] = ["Available","Unavailable","Personal","Emails","Meal","Break"];

export default function StatusSelector({ id, title }: { id: string; title: string }) {
  const [status, setStatus] = React.useState<StatusOption>("Available");
  const [startTs, setStartTs] = React.useState<number>(() => Date.now());
  const [elapsed, setElapsed] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [portalRect, setPortalRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    // update elapsed every second
    const t = setInterval(() => setElapsed(Math.max(0, Date.now() - startTs)), 1000);
    return () => clearInterval(t);
  }, [startTs]);

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
    if (open && buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setPortalRect(r);
    } else {
      setPortalRect(null);
    }
  }, [open]);

  function formatElapsed(ms: number) {
    const total = Math.floor(ms / 1000);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const two = (n: number) => n.toString().padStart(2, "0");
    if (hours >= 1) return `${hours}:${two(minutes)}:${two(seconds)}`;
    return `${minutes}:${two(seconds)}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <div className="text-sm font-bold">STATUS</div>
        <div className="text-xs font-medium text-foreground">{formatElapsed(elapsed)}</div>
      </div>
      <hr className="my-2 module-divider-inline" />

      <div className="mt-2">
        <div className={`custom-select ${open ? 'open' : ''}`} ref={containerRef}>
          <button
            type="button"
            className="custom-select-button"
            aria-haspopup="listbox"
            aria-expanded={open}
            ref={buttonRef}
            onClick={() => {
              setOpen((s) => {
                const next = !s;
                if (next && buttonRef.current) {
                  setPortalRect(buttonRef.current.getBoundingClientRect());
                } else {
                  setPortalRect(null);
                }
                return next;
              });
            }}
            onKeyDown={(e) => { if (e.key === 'ArrowDown') setOpen(true); }}
          >
            <div className="flex items-center gap-2">
              <span className={`status-dot ${status.toLowerCase()}`}></span>
              <span className="text-sm">{status}</span>
            </div>
            <span aria-hidden>▾</span>
          </button>
          {/* dropdown list (always in DOM so CSS animation can run) */}
          {/* list is rendered into a fixed-position portal to avoid clipping by transformed ancestors */}
          {null}
        </div>
      </div>
      {/* render portal dropdown */}
      <StatusPortal
        rect={portalRect}
        open={open}
        options={STATUS_OPTIONS}
        status={status}
        onPick={(opt) => { setStatus(opt as StatusOption); setStartTs(Date.now()); setElapsed(0); }}
        onClose={() => setOpen(false)}

      />
    </div>
  );
}

// Render the dropdown portal element outside the component root so it's not clipped.
// Render the dropdown portal element outside the component root so it's not clipped.
function StatusPortal({ rect, open, options, status, onPick, onClose }: {
  rect: DOMRect | null;
  open: boolean;
  options: string[];
  status: string;
  onPick: (opt: string) => void;
  onClose: () => void;
}) {
  // Debug helper: logs when portal renders (check browser console)
  if (typeof window !== 'undefined') console.debug('StatusPortal render', { rect, open });
  if (!open || !rect) return null;
  const style: React.CSSProperties = {
    position: 'fixed',
    top: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    zIndex: 100000,
    // Portal-specific overrides so the global `.custom-select-list` rule
    // (which assumes the list is inside the `.custom-select` wrapper)
    // doesn't keep the portal hidden (max-height:0; opacity:0).
    opacity: 1,
    transform: 'translateY(0)',
    maxHeight: 'none',
    overflow: 'visible',
  };
  return createPortal(
    <div className="custom-select-list" role="listbox" style={style} onMouseDown={(e) => e.preventDefault()}>
      {options.filter((o) => o !== status).map((opt) => (
        <div
          key={opt}
          role="option"
          aria-selected={opt === status}
          className="custom-select-item"
          onMouseDown={(e) => { e.preventDefault(); onPick(opt); onClose(); }}
        >
          <span className={`status-dot ${opt.toLowerCase()}`}></span>
          <span>{opt}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}
