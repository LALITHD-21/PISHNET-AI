"use client";

import React, { useEffect, useState } from "react";
import { useSim } from "@/context/SimContext";

interface RadarPoint {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  action: string;
  timestamp: number;
}

export default function RadarScan() {
  const { logs } = useSim();
  const [points, setPoints] = useState<RadarPoint[]>([]);

  useEffect(() => {
    // Generate polar coordinate points for the last 5-6 events
    const activeLogs = logs.slice(0, 7);
    const mapped = activeLogs.map((log) => {
      // Create stable pseudo-random coordinates based on log ID
      const seed = log.id.charCodeAt(0) + log.id.charCodeAt(log.id.length - 1);
      const angle = (seed * 47) % 360;
      // Keep points in outer rings, radius between 40px and 120px
      const radius = 40 + ((seed * 19) % 80);
      
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;

      let color = "#3b82f6"; // blue
      if (log.action === "CLICKED") color = "#f59e0b"; // yellow/orange
      if (log.action === "CREDENTIALS_SUBMITTED") color = "#ef4444"; // red
      if (log.action === "REPORTED") color = "#10b981"; // green

      return {
        id: log.id,
        x,
        y,
        color,
        label: log.employeeName,
        action: log.action,
        timestamp: Date.now()
      };
    });
    setPoints(mapped);
  }, [logs]);

  return (
    <div className="flex flex-col items-center justify-center p-2 relative h-[300px] w-full select-none">
      {/* Radar Shell */}
      <div className="relative w-[260px] h-[260px] rounded-full border border-primary/20 bg-[#04040d]/80 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.05)]">
        
        {/* Cyber Grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Concentric Circles */}
        <div className="absolute w-[200px] h-[200px] rounded-full border border-primary/10"></div>
        <div className="absolute w-[140px] h-[140px] rounded-full border border-primary/10"></div>
        <div className="absolute w-[80px] h-[80px] rounded-full border border-primary/10"></div>
        
        {/* Crosshair Lines */}
        <div className="absolute w-full h-[1px] bg-primary/10"></div>
        <div className="absolute h-full w-[1px] bg-primary/10"></div>
        
        {/* Sweep Hand */}
        <div className="absolute w-[130px] h-[130px] origin-bottom-right bottom-1/2 right-1/2 pointer-events-none overflow-hidden radar-sweep">
          <div className="w-full h-full bg-gradient-to-tr from-primary/15 to-transparent origin-bottom-right rotate-45 rounded-tl-full border-t border-l border-primary/30"></div>
        </div>

        {/* Radar Nodes */}
        {points.map((pt) => (
          <div
            key={pt.id}
            className="absolute transition-all duration-500 ease-out"
            style={{
              left: `calc(50% + ${pt.x}px - 6px)`,
              top: `calc(50% + ${pt.y}px - 6px)`
            }}
          >
            {/* Pulsing ring around target */}
            <span
              className="absolute inline-flex h-3 w-3 rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: pt.color }}
            ></span>
            {/* Core point */}
            <span
              className="relative inline-flex rounded-full h-3 w-3 border border-slate-900 cursor-pointer shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: pt.color, color: pt.color }}
              title={`${pt.label} - ${pt.action}`}
            ></span>
            
            {/* Small tooltips labels */}
            <span className="absolute left-4 -top-2 bg-slate-950/80 border border-slate-800 text-[9px] px-1 py-0.5 rounded text-slate-300 font-mono whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
              {pt.label.split(" ")[0]}
            </span>
          </div>
        ))}

        {/* Outer Ring Angle ticks */}
        <div className="absolute inset-0 flex items-center justify-between text-[7px] text-primary/40 px-1 font-mono">
          <span>270°</span>
          <span>90°</span>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-between text-[7px] text-primary/40 py-1 font-mono">
          <span>0°</span>
          <span>180°</span>
        </div>
        
        {/* Pulsing Radar center */}
        <div className="absolute w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_var(--primary)] pulse-glow"></div>
      </div>
      
      {/* Footer Info */}
      <div className="flex gap-4 text-[10px] font-mono text-slate-400 mt-3 border-t border-slate-900 pt-2 w-full justify-center">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> SAFE
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> CLICK
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> EXPLOIT
        </span>
      </div>
    </div>
  );
}
