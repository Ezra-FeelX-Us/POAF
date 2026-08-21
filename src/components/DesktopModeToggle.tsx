"use client";

import React, { useState, useEffect } from "react";

export default function DesktopModeToggle({ className = "" }: { className?: string }) {
  const [isDesktopMode, setIsDesktopMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("poaf_desktop_mode") === "true";
    if (saved) {
      applyDesktopMode(true);
      setIsDesktopMode(true);
    }
  }, []);

  function applyDesktopMode(enable: boolean) {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (enable) {
      document.documentElement.classList.add("force-desktop-mode");
      if (viewportMeta) {
        viewportMeta.setAttribute("content", "width=1280, initial-scale=0.35, maximum-scale=3");
      }
      localStorage.setItem("poaf_desktop_mode", "true");
    } else {
      document.documentElement.classList.remove("force-desktop-mode");
      if (viewportMeta) {
        viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=5");
      }
      localStorage.setItem("poaf_desktop_mode", "false");
    }
  }

  function toggleMode() {
    const next = !isDesktopMode;
    setIsDesktopMode(next);
    applyDesktopMode(next);
  }

  return (
    <button
      type="button"
      onClick={toggleMode}
      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
        isDesktopMode
          ? "bg-blue-900/60 border-blue-500/50 text-blue-300 shadow-md"
          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white"
      } ${className}`}
      title={isDesktopMode ? "Switch to Responsive Mobile View" : "Switch to Wide Desktop View"}
    >
      <span className="flex items-center gap-1.5">
        <span>Desktop Mode</span>
      </span>
      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
        isDesktopMode ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400"
      }`}>
        {isDesktopMode ? "ON" : "OFF"}
      </span>
    </button>
  );
}
