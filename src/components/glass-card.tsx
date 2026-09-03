import type { HTMLAttributes, ReactNode } from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "soft" | "accent"
  padding?: "none" | "sm" | "default" | "lg"
  border?: boolean
  hoverable?: boolean
  children?: ReactNode
}

const toneClasses = {
  default: "glass",
  soft: "glass",
  accent: "bg-cyan-900/15 border-cyan-500/15",
} satisfies Record<NonNullable<GlassCardProps["tone"]>, string>

const paddingClasses = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  default: "p-4 sm:p-5 md:p-6",
  lg: "p-6 sm:p-8",
} satisfies Record<NonNullable<GlassCardProps["padding"]>, string>

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ tone = "default", padding = "default", border = true, hoverable, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] transition-all duration-300",
          toneClasses[tone],
          paddingClasses[padding],
          border && "border",
          hoverable && [
            "hover:scale-[1.01] hover:shadow-lg",
            "active:scale-[0.99]",
            "cursor-pointer",
            "hover:border-cyan-400/20",
          ],
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        {...props}
      >
        {/* Subtle inner glow at top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/4 to-transparent"
          aria-hidden="true"
        />
        {children}
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"
