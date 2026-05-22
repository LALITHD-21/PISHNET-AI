"use client";

import React, { useId } from "react";

interface PhishNetLogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  compact?: boolean;
}

export default function PhishNetLogo({
  className = "",
  markClassName = "h-10 w-10",
  showWordmark = true,
  wordmarkClassName = "",
  compact = false
}: PhishNetLogoProps) {
  const id = useId().replace(/:/g, "");
  const shieldGradientId = `phishnet-mark-shield-${id}`;
  const lineGradientId = `phishnet-mark-line-${id}`;
  const glowId = `phishnet-mark-glow-${id}`;

  return (
    <div className={`group inline-flex items-center gap-3 ${className}`}>
      <div
        className={`${markClassName} relative shrink-0 rounded-2xl border border-white/15 bg-white/[0.04] p-[1px] shadow-[0_0_28px_rgba(16,185,129,0.20)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[360deg]`}
      >
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.32),transparent_42%)]" />
        <svg
          viewBox="0 0 64 64"
          role="img"
          aria-label="PhishNet AI cyber shield logo"
          className="relative h-full w-full rounded-2xl"
        >
          <defs>
            <linearGradient id={shieldGradientId} x1="18" y1="8" x2="48" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EBEBEB" />
              <stop offset="0.52" stopColor="#10B981" />
              <stop offset="1" stopColor="#064E3B" />
            </linearGradient>
            <linearGradient id={lineGradientId} x1="16" y1="16" x2="50" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#EBEBEB" />
            </linearGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0.062 0 0 0 0 0.725 0 0 0 0 0.506 0 0 0 0.75 0"
              />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="64" height="64" rx="18" fill="#050505" />
          <path
            d="M32 8.5 48.5 15v14.1c0 12.1-6.8 21.4-16.5 26.4-9.7-5-16.5-14.3-16.5-26.4V15L32 8.5Z"
            fill="rgba(255,255,255,0.03)"
            stroke={`url(#${shieldGradientId})`}
            strokeWidth="2.4"
          />
          <path
            d="M22 33.5c4.8-9.8 14.8-9.8 20 0-5.2 9.8-15.2 9.8-20 0Z"
            fill="rgba(16,185,129,0.10)"
            stroke={`url(#${lineGradientId})`}
            strokeWidth="2"
            filter={`url(#${glowId})`}
          />
          <circle cx="32" cy="33.5" r="5.2" fill="#10B981" />
          <circle cx="32" cy="33.5" r="2.1" fill="#050505" />
          <path d="M19.5 22.5h8.2M36.3 22.5h8.2M32 14.5v8.2M32 44.3v5.8" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M25.2 26.9 20.4 22.5M38.8 26.9l4.8-4.4M25.2 40.1l-4.8 4.4M38.8 40.1l4.8 4.4" stroke="rgba(235,235,235,0.56)" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="19.5" cy="22.5" r="2.2" fill="#10B981" />
          <circle cx="44.5" cy="22.5" r="2.2" fill="#10B981" />
          <circle cx="20.4" cy="44.5" r="1.7" fill="#EBEBEB" />
          <circle cx="43.6" cy="44.5" r="1.7" fill="#EBEBEB" />
        </svg>
      </div>

      {showWordmark && (
        <div className={wordmarkClassName}>
          <div className="font-outfit text-2xl font-semibold leading-none tracking-tighter gradient-text">
            PhishNet AI
          </div>
          {!compact && (
            <div className="cyber-metadata mt-1 text-white/35">
              Human Firewall Intelligence
            </div>
          )}
        </div>
      )}
    </div>
  );
}
