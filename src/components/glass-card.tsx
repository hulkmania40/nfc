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
  default: "bg-white/70 border-white/60 text-slate-900",
  soft: "bg-white/55 border-white/50 text-slate-900",
  accent: "bg-cyan-50/70 border-cyan-100/70 text-slate-900",
} satisfies Record<NonNullable<GlassCardProps["tone"]>, string>

const paddingClasses = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  default: "p-4 sm:p-6 md:p-8",
  lg: "p-6 sm:p-8 md:p-10",
} satisfies Record<NonNullable<GlassCardProps["padding"]>, string>

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    tone = "default",
    padding = "default",
    border = true,
    hoverable = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "relative overflow-hidden rounded-[2rem] backdrop-blur-xl shadow-sm",
          "transition-all duration-200 ease-in-out",
          // Tone styles
          toneClasses[tone],
          // Border
          border && "border",
          // Padding
          paddingClasses[padding],
          // Hover effects
          hoverable && [
            "hover:scale-[1.01] hover:shadow-md hover:backdrop-blur-xl",
            "active:scale-[0.99] active:shadow-sm",
            "cursor-pointer"
          ],
          // Focus styles for accessibility
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = "GlassCard"