import { cn } from "@/lib/utils"

type ProgressRingProps = {
  value: number
  size?: number
  strokeWidth?: number
  trackClassName?: string
  progressClassName?: string
  label?: string
  className?: string
  showFill?: boolean
}

export function ProgressRing({
  value,
  size = 220,
  strokeWidth = 14,
  trackClassName,
  progressClassName,
  label,
  className,
}: ProgressRingProps) {
  const normalized = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (normalized / 100) * circumference
  const center = size / 2

  return (
    <div
      className={cn("relative inline-flex w-full items-center justify-center", className)}
      style={{ maxWidth: `${size}px`, aspectRatio: "1 / 1" }}
    >
      <svg className="size-full" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`ring-grad-${value}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id={`ring-track-${value}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.08)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.04)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          className={cn("fill-none", trackClassName)}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={`url(#ring-track-${value})`}
        />

        {/* Progress arc with glow */}
        <circle
          className={cn("fill-none transition-all duration-700 ease-out", progressClassName)}
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#ring-grad-${value})`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
          filter="url(#glow)"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && (
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
