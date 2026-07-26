import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "soft" | "accent"
}

const toneClasses = {
  default: "bg-white/70 border-white/60",
  soft: "bg-white/55 border-white/50",
  accent: "bg-cyan-50/70 border-cyan-100/70",
} satisfies Record<NonNullable<GlassCardProps["tone"]>, string>

export function GlassCard({ className, tone = "default", ...props }: GlassCardProps) {
  return (
    <div
      className={cn("glass-panel rounded-[2rem] p-6 text-slate-900", toneClasses[tone], className)}
      {...props}
    />
  )
}
