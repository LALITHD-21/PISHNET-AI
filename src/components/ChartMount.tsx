"use client";

import React, { ReactNode, useEffect, useState } from "react";

export default function ChartMount({ children, className = "h-64 w-full min-w-0" }: { children: ReactNode; className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={className}>
      {mounted ? children : (
        <div className="flex h-full w-full items-center justify-center rounded border border-slate-900 bg-slate-950/30 font-mono text-[10px] uppercase tracking-wider text-slate-600">
          Calibrating analytics viewport...
        </div>
      )}
    </div>
  );
}
