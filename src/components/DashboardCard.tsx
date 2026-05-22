"use client";

import React, { MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  glowColor?: string;
}

export default function DashboardCard({
  title,
  subtitle,
  children,
  className = "",
  headerAction,
  glowColor = "rgba(0, 240, 255, 0.15)"
}: DashboardCardProps) {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`cyber-card p-6 rounded-3xl relative overflow-hidden ${className}`}
      style={{
        boxShadow: `0 24px 80px 0 rgba(0, 0, 0, 0.46), inset 0 0 18px ${glowColor}`
      }}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10 z-10 relative">
          <div>
            {title && (
              <h3 className="font-outfit text-2xl md:text-3xl font-bold tracking-tighter text-[#EBEBEB] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary inline-block rounded-full shadow-[0_0_12px_var(--primary)] animate-pulse"></span>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="cyber-metadata text-white/58 mt-2 leading-relaxed">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="text-xs">{headerAction}</div>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
