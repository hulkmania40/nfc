import { useMemo } from "react"
import { cn } from "@/lib/utils"

type WaterGlassProps = {
  percentage: number
  size?: number
  className?: string
  label?: string
}

export function WaterGlass({ percentage, size = 200, className, label }: WaterGlassProps) {
  const fillY = useMemo(() => {
    const p = Math.max(0, Math.min(100, percentage))
    return 100 - p
  }, [percentage])

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size * 1.6 }}>
      {/* Glass container */}
      <svg viewBox="0 0 120 192" className="size-full drop-shadow-2xl">
        <defs>
          <linearGradient id="water-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="glass-tint" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.12)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.08)" />
          </linearGradient>
          <clipPath id="glass-clip">
            <path d="M28,12 L92,12 L78,168 C76,178 44,178 42,168 Z" />
          </clipPath>
          <filter id="water-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glass outline */}
        <path
          d="M28,12 L92,12 L78,168 C76,178 44,178 42,168 Z"
          fill="url(#glass-tint)"
          stroke="rgba(34,211,238,0.2)"
          strokeWidth="1.2"
        />

        {/* Water fill - clipped to glass shape */}
        {percentage > 0 && (
          <g clipPath="url(#glass-clip)">
            <rect
              x="0"
              y={fillY}
              width="120"
              height={192 - fillY}
              fill="url(#water-fill)"
              filter="url(#water-glow)"
            />

            {/* Animated wave surface */}
            <path
              d={`M0,${fillY} C20,${fillY - 4} 40,${fillY + 4} 60,${fillY} C80,${fillY - 4} 100,${fillY + 4} 120,${fillY} L120,${fillY + 12} L0,${fillY + 12} Z`}
              fill="rgba(34,211,238,0.35)"
              style={{ animation: "wave 3s ease-in-out infinite" }}
            />
            <path
              d={`M0,${fillY + 2} C15,${fillY - 2} 35,${fillY + 5} 55,${fillY + 2} C75,${fillY - 2} 95,${fillY + 5} 115,${fillY + 2} L115,${fillY + 16} L0,${fillY + 16} Z`}
              fill="rgba(255,255,255,0.08)"
              style={{ animation: "wave 4s ease-in-out infinite reverse" }}
            />

            {/* Bubbles */}
            {percentage > 15 && (
              <circle cx="50" cy={fillY + 20} r="2.5" fill="rgba(255,255,255,0.2)" style={{ animation: "breathe 2.5s ease-in-out infinite" }} />
            )}
            {percentage > 30 && (
              <circle cx="65" cy={fillY + 35} r="1.8" fill="rgba(255,255,255,0.15)" style={{ animation: "breathe 3s ease-in-out infinite 0.5s" }} />
            )}
            {percentage > 45 && (
              <circle cx="45" cy={fillY + 50} r="2" fill="rgba(255,255,255,0.18)" style={{ animation: "breathe 2.8s ease-in-out infinite 1s" }} />
            )}
          </g>
        )}

        {/* Glass highlight */}
        <path
          d="M34,18 L38,18 L34,150 Z"
          fill="rgba(255,255,255,0.08)"
          rx="2"
        />
        <path
          d="M86,18 L90,18 L88,100 Z"
          fill="rgba(255,255,255,0.03)"
        />

        {/* Top rim */}
        <ellipse cx="60" cy="12" rx="32" ry="4" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="1" />
      </svg>

      {/* Percentage overlay */}
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ paddingTop: "10%" }}>
          <span className="text-3xl font-bold tracking-tight text-cyan-400">
            {Math.round(percentage)}%
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {label}
          </span>
        </div>
      )}
    </div>
  )
}
