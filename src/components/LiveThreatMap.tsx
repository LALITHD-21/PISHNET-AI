"use client";

import React, { useEffect, useState } from "react";
import { useSim } from "@/context/SimContext";

interface NodeLocation {
  name: string;
  x: number;
  y: number;
  status: "secure" | "warning" | "alert";
  country: string;
}

interface AttackArc {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
  progress: number;
}

const NODES: { [key: string]: NodeLocation } = {
  "Finance & Accounting": { name: "Finance Hub", x: 140, y: 90, status: "secure", country: "London, UK" },
  "Human Resources": { name: "HR Registry", x: 260, y: 60, status: "secure", country: "Paris, FR" },
  "Engineering & IT": { name: "Core R&D", x: 80, y: 70, status: "secure", country: "San Jose, US" },
  "Sales & Marketing": { name: "APAC Sales", x: 400, y: 110, status: "secure", country: "Tokyo, JP" },
  "Operations": { name: "Ops Center", x: 380, y: 180, status: "secure", country: "Sydney, AU" }
};

export default function LiveThreatMap() {
  const { logs } = useSim();
  const [nodes, setNodes] = useState<{ [key: string]: NodeLocation }>(NODES);
  const [activeAttacks, setActiveAttacks] = useState<AttackArc[]>([]);

  useEffect(() => {
    if (logs.length === 0) return;
    const latestLog = logs[0];
    const targetDept = latestLog.department;
    const targetNode = NODES[targetDept];

    if (!targetNode) return;

    // Determine status color based on log action
    let newStatus: NodeLocation["status"] = "secure";
    let color = "#3b82f6"; // Blue info
    
    if (latestLog.action === "CLICKED") {
      newStatus = "warning";
      color = "#f59e0b"; // Orange warning
    } else if (latestLog.action === "CREDENTIALS_SUBMITTED") {
      newStatus = "alert";
      color = "#ef4444"; // Red alarm
    } else if (latestLog.action === "REPORTED") {
      newStatus = "secure";
      color = "#10b981"; // Green safe
    } else {
      newStatus = "secure"; // DELIVERED/OPENED
      color = "#6366f1";
    }

    // Update targeted node status
    setNodes(prev => ({
      ...prev,
      [targetDept]: {
        ...prev[targetDept],
        status: newStatus
      }
    }));

    // Generate an attack vector originating from a random threat IP source location
    const threatSource = {
      x: 30 + Math.random() * 400,
      y: 10 + Math.random() * 50
    };

    const newAttack: AttackArc = {
      id: "arc_" + Date.now() + Math.random(),
      fromX: threatSource.x,
      fromY: threatSource.y,
      toX: targetNode.x,
      toY: targetNode.y,
      color,
      progress: 0
    };

    setActiveAttacks(prev => [...prev.slice(-3), newAttack]);

    // Animate the line progress
    const duration = 1200;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      setActiveAttacks(prev =>
        prev.map(arc => (arc.id === newAttack.id ? { ...arc, progress } : arc))
      );

      if (progress >= 1) {
        clearInterval(interval);
        // Fade out node warning/alert state back to secure slowly
        setTimeout(() => {
          setNodes(prev => ({
            ...prev,
            [targetDept]: { ...prev[targetDept], status: "secure" }
          }));
        }, 3000);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="w-full relative bg-[#04040d]/90 rounded-xl border border-slate-900 p-4 min-h-[250px] flex flex-col justify-between overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] select-none">
      
      {/* HUD Header overlay */}
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
          PLATFORM FEED: LIVE VECTOR MONITOR
        </span>
        <span>SYS STATUS: COMPLIANT</span>
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-1 w-full relative min-h-[180px]">
        <svg viewBox="0 0 500 220" className="w-full h-full text-slate-800">
          
          {/* Custom Stylized continents dots */}
          {/* North America */}
          <circle cx="50" cy="50" r="1.5" className="fill-slate-800/40" />
          <circle cx="80" cy="60" r="2" className="fill-slate-800/40" />
          <circle cx="110" cy="70" r="1.5" className="fill-slate-800/40" />
          <circle cx="90" cy="90" r="1" className="fill-slate-800/40" />
          
          {/* South America */}
          <circle cx="130" cy="130" r="1.5" className="fill-slate-800/30" />
          <circle cx="140" cy="160" r="2" className="fill-slate-800/30" />
          <circle cx="160" cy="180" r="1" className="fill-slate-800/30" />
          
          {/* Eurasia / Europe / Asia */}
          <circle cx="230" cy="50" r="1.5" className="fill-slate-800/40" />
          <circle cx="260" cy="60" r="2" className="fill-slate-800/40" />
          <circle cx="300" cy="50" r="1.5" className="fill-slate-800/40" />
          <circle cx="340" cy="70" r="2" className="fill-slate-800/40" />
          <circle cx="380" cy="80" r="1.5" className="fill-slate-800/40" />
          <circle cx="420" cy="90" r="2" className="fill-slate-800/40" />
          <circle cx="400" cy="120" r="1" className="fill-slate-800/40" />
          
          {/* Africa */}
          <circle cx="260" cy="120" r="1.5" className="fill-slate-800/30" />
          <circle cx="280" cy="140" r="2" className="fill-slate-800/30" />
          
          {/* Australia */}
          <circle cx="440" cy="170" r="2" className="fill-slate-800/40" />
          <circle cx="460" cy="180" r="1.5" className="fill-slate-800/40" />

          {/* Draw connecting grids (Cyber mesh) */}
          <path d="M 80,70 L 140,90 L 260,60 L 400,110 L 380,180 L 140,90" fill="none" stroke="rgba(0, 240, 255, 0.03)" strokeWidth="1" strokeDasharray="3,3" />

          {/* Active Attack Arcs */}
          {activeAttacks.map((arc) => {
            const dx = arc.toX - arc.fromX;
            // Draw curved line using quadratic bezier: control point pulled upwards
            const cx = arc.fromX + dx / 2;
            const cy = Math.min(arc.fromY, arc.toY) - 30; // arc curve intensity
            
            // Calculate current animated endpoint coords
            const t = arc.progress;
            const currentX = (1 - t) * (1 - t) * arc.fromX + 2 * (1 - t) * t * cx + t * t * arc.toX;
            const currentY = (1 - t) * (1 - t) * arc.fromY + 2 * (1 - t) * t * cy + t * t * arc.toY;

            return (
              <g key={arc.id}>
                {/* Attack Path line */}
                <path
                  d={`M ${arc.fromX},${arc.fromY} Q ${cx},${cy} ${arc.toX},${arc.toY}`}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="1.5"
                  strokeOpacity={0.2}
                  strokeDasharray="4,4"
                />
                
                {/* Glowing projectile head */}
                {arc.progress < 1 && (
                  <circle
                    cx={currentX}
                    cy={currentY}
                    r="3"
                    fill={arc.color}
                    className="shadow-[0_0_8px_currentColor] animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Draw Office Location Nodes */}
          {Object.values(nodes).map((node) => {
            let color = "fill-slate-500";
            let glowColor = "rgba(100,116,139,0.3)";
            if (node.status === "secure") {
              color = "fill-cyan-400";
              glowColor = "rgba(34,211,238,0.3)";
            } else if (node.status === "warning") {
              color = "fill-amber-400";
              glowColor = "rgba(251,191,36,0.3)";
            } else if (node.status === "alert") {
              color = "fill-rose-500";
              glowColor = "rgba(244,63,94,0.3)";
            }

            return (
              <g key={node.name} className="cursor-pointer">
                {/* Radar node pulse */}
                {node.status !== "secure" && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill="none"
                    stroke={node.status === "alert" ? "#ef4444" : "#f59e0b"}
                    strokeWidth="1"
                    className="animate-ping origin-center"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                )}
                {/* Core Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  className={`${color} transition-all duration-300`}
                  style={{ filter: `drop-shadow(0px 0px 4px ${glowColor})` }}
                />
                {/* Node Label */}
                <text
                  x={node.x + 8}
                  y={node.y + 3}
                  className="fill-slate-400 text-[6px] font-semibold tracking-wider font-mono uppercase"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info details */}
      <div className="flex flex-wrap justify-between gap-2 border-t border-slate-900/60 pt-2 text-[9px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> SECURE HUBS
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> SUSPICIOUS ACT
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> ATTACK DETECTED
        </span>
      </div>
    </div>
  );
}
