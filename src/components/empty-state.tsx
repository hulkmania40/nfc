import { type ReactNode } from "react"

import { GlassCard } from "@/components/glass-card"

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <GlassCard className="flex flex-col items-center justify-center gap-4 py-14 text-center">
      <div className="size-16 rounded-full bg-cyan-500/10 text-cyan-400" />
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </GlassCard>
  )
}
