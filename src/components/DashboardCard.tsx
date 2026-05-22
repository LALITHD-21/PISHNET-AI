"use client";

import React, { ReactNode } from "react";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
      className={`cyber-card p-6 rounded-xl border border-[rgba(0,240,255,0.15)] bg-slate-950/40 backdrop-blur-md relative overflow-hidden ${className}`}
      style={{
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 12px ${glowColor}`
      }}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60 z-10 relative">
          <div>
            {title && (
              <h3 className="font-outfit text-md font-bold tracking-wider text-slate-100 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-primary inline-block rounded-full shadow-[0_0_8px_var(--primary)]"></span>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div className="text-xs">{headerAction}</div>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
