"use client";

import React from "react";

type SettingCategory = "speaker" | "microphone" | "ringer" | "enhancements";

type SettingOption = { value: string; label: string };

const SETTINGS_DATA: Record<SettingCategory, { icon: string; label: string; options: SettingOption[] }> = {
  speaker: {
    icon: "H",
    label: "Speaker",
    options: [
      { value: "default", label: "Default Speaker" },
      { value: "speaker-1", label: "Internal Speaker" },
      { value: "speaker-2", label: "Bluetooth Headset" },
    ],
  },
  microphone: {
    icon: "M",
    label: "Microphone",
    options: [
      { value: "default", label: "Default Microphone" },
      { value: "mic-1", label: "Built-in Mic" },
      { value: "mic-2", label: "USB Mic" },
    ],
  },
  ringer: {
    icon: "R",
    label: "Ringer",
    options: [
      { value: "default", label: "Default Ringer" },
      { value: "ringer-1", label: "Ringer (Headset)" },
      { value: "ringer-2", label: "Ringer (Device)" },
    ],
  },
  enhancements: {
    icon: "+",
    label: "Enhancements",
    options: [
      { value: "noise", label: "Noise Isolation" },
      { value: "echo", label: "Echo Cancellation" },
      { value: "auto-gain", label: "Auto Gain Control" },
    ],
  },
};

const CATEGORIES: SettingCategory[] = ["speaker", "microphone", "ringer", "enhancements"];

export default function SettingsDrawer() {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState<SettingCategory | null>(null);
  const [selected, setSelected] = React.useState<Record<SettingCategory, string>>({
    speaker: "default",
    microphone: "default",
    ringer: "default",
    enhancements: "noise",
  });
  const TRANS_MS = 220;

  function open() {
    setMounted(true);
    window.requestAnimationFrame(() => setVisible(true));
  }

  function close() {
    setVisible(false);
    setExpanded(null);
    setTimeout(() => setMounted(false), TRANS_MS + 10);
  }

  function toggle() {
    if (mounted && visible) close();
    else open();
  }

  function toggleExpand(cat: SettingCategory) {
    setExpanded((curr) => (curr === cat ? null : cat));
  }

  function selectOption(cat: SettingCategory, value: string) {
    setSelected((prev) => ({ ...prev, [cat]: value }));
    setExpanded(null);
  }

  function getSelectedLabel(cat: SettingCategory) {
    const opt = SETTINGS_DATA[cat].options.find((o) => o.value === selected[cat]);
    return opt?.label ?? "";
  }

  function handleLogout() {
    console.log("Log out clicked");
    close();
  }

  return (
    <>
      <div className="settings-wrapper">
        <button
          className="settings-button"
          aria-label={visible ? "Close settings" : "Open settings"}
          aria-expanded={visible}
          onClick={toggle}
        >
          <span className="settings-initial">S</span>
        </button>
      </div>

      {mounted && (
        <>
          <div className={`settings-backdrop ${visible ? "open" : ""}`} onClick={close} />
          <aside className={`settings-drawer ${visible ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Settings drawer">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div className="drawer-title">SETTINGS</div>
              <button onClick={close} aria-label="Close" className="settings-button" style={{ color: "var(--foreground)" }}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0", marginBottom: "16px" }}>
              {CATEGORIES.map((cat, idx) => {
                const data = SETTINGS_DATA[cat];
                const isExpanded = expanded === cat;
                return (
                  <div key={cat}>
                    <button
                      onClick={() => toggleExpand(cat)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 12px",
                        border: "1px solid var(--foreground)",
                        borderTop: idx === 0 ? "1px solid var(--foreground)" : "none",
                        background: "var(--background)",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "2px" }}>
                          {data.label.toUpperCase()}
                        </div>
                        <div style={{ fontSize: "12px", opacity: 0.7 }}>
                          {getSelectedLabel(cat)}
                        </div>
                      </div>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "transform 200ms ease",
                        }}
                      >
                        ›
                      </div>
                    </button>
                    <div
                      style={{
                        maxHeight: isExpanded ? "200px" : "0px",
                        opacity: isExpanded ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 200ms ease, opacity 200ms ease",
                        borderLeft: "1px solid var(--foreground)",
                        borderRight: "1px solid var(--foreground)",
                        borderBottom: isExpanded ? "1px solid var(--foreground)" : "none",
                      }}
                    >
                      <div style={{ padding: "8px" }}>
                        {data.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => selectOption(cat, opt.value)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "10px 12px",
                              border: "none",
                              borderBottom: "1px solid var(--foreground)",
                              background: selected[cat] === opt.value ? "var(--foreground)" : "transparent",
                              color: selected[cat] === opt.value ? "var(--background)" : "var(--foreground)",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="logout-button" onClick={handleLogout}>Log Out</button>
          </aside>
        </>
      )}
    </>
  );
}
