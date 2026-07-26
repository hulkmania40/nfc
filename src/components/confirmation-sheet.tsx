import { Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"

type ConfirmationSheetProps = {
  title: string
  amountLabel: string
  description?: string
  confirmLabel: string
  secondaryLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationSheet({
  title,
  amountLabel,
  description,
  confirmLabel,
  secondaryLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationSheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/28 px-4 backdrop-blur-xl">
      <div className="w-full max-w-xl">
        <GlassCard className="relative overflow-hidden px-8 py-10 text-center">
          <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_62%)]" />
          <div className="relative mx-auto flex size-24 items-center justify-center rounded-full bg-cyan-50/90 shadow-inner shadow-cyan-200/50">
            <div className="flex size-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#dffbfd,#38bdf8_72%,#0ea5e9)] text-white shadow-[0_20px_50px_rgba(14,165,233,0.3)]">
              <Droplets className="size-8" />
            </div>
          </div>
          <div className="relative mt-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.36em] text-cyan-500">Hydration check</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
            <p className="text-4xl font-semibold tracking-tight text-cyan-600 md:text-5xl">{amountLabel}</p>
            {description ? <p className="mx-auto max-w-md text-sm leading-6 text-slate-600">{description}</p> : null}
          </div>
          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="secondary" className="rounded-full px-6" onClick={onCancel}>
              {secondaryLabel}
            </Button>
            <Button className="rounded-full px-6" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
