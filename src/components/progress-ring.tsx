import { cn } from "@/lib/utils"

type ProgressRingProps = {
  value: number
  size?: number
  strokeWidth?: number
  trackClassName?: string
  progressClassName?: string
  label?: string
}

export function ProgressRing({
  value,
  size = 220,
  strokeWidth = 16,
  trackClassName,
  progressClassName,
  label,
}: ProgressRingProps) {
  const normalized = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (normalized / 100) * circumference
  const center = size / 2

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={cn("fill-none stroke-white/55", trackClassName)}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={cn("fill-none stroke-cyan-400 transition-all duration-300 ease-out", progressClassName)}
          cx={center}
          cy={center}
          r={radius}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label ? <div className="text-xs font-medium uppercase tracking-[0.32em] text-slate-500">{label}</div> : null}
      </div>
    </div>
  )
}
