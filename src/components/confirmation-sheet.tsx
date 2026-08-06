import { useEffect, useRef, type ReactNode } from "react"
import { Droplets, X } from "lucide-react"
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
  isOpen?: boolean
  extraInfo?: ReactNode
  isLoading?: boolean
  confirmVariant?: "default" | "destructive" | "outline"
  icon?: ReactNode
}

export function ConfirmationSheet({
  title,
  amountLabel,
  description,
  confirmLabel,
  secondaryLabel = "Cancel",
  onConfirm,
  onCancel,
  isOpen = true,
  extraInfo,
  isLoading = false,
  confirmVariant = "default",
  icon,
}: ConfirmationSheetProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus confirm button by default, but allow escape to cancel
      const timer = setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === "Escape") {
        e.preventDefault()
        onCancel()
      }
      
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onConfirm()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onCancel, onConfirm])

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      aria-describedby={description ? "confirmation-description" : undefined}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />
      
      {/* Sheet */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200 sm:max-w-lg">
        <GlassCard className="relative overflow-hidden p-6 text-center sm:p-8">
          {/* Close button - mobile friendly */}
          <button
            onClick={onCancel}
            className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors sm:right-4 sm:top-4"
            aria-label="Close"
          >
            <X className="size-4 sm:size-5" />
          </button>

          {/* Background gradient */}
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_62%)]" />

          {/* Icon */}
          <div className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-cyan-50/90 shadow-inner shadow-cyan-200/50 sm:size-24">
            <div className="flex size-14 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 sm:size-16">
              {icon || <Droplets className="size-6 sm:size-8" />}
            </div>
          </div>

          {/* Content */}
          <div className="relative mt-6 space-y-3 sm:mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-600 sm:text-sm">
              Hydration Check
            </p>
            
            <h2 
              id="confirmation-title"
              className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
            >
              {title}
            </h2>
            
            <div className="text-3xl font-semibold tracking-tight text-cyan-600 sm:text-4xl md:text-5xl">
              {amountLabel}
            </div>
            
            {description && (
              <p 
                id="confirmation-description"
                className="mx-auto max-w-sm text-sm leading-6 text-slate-500 sm:text-base"
              >
                {description}
              </p>
            )}
            
            {extraInfo && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                {extraInfo}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="relative mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-center">
            <Button
              ref={cancelButtonRef}
              variant="outline"
              className="rounded-full px-6 py-2.5 text-sm sm:py-3"
              onClick={onCancel}
              disabled={isLoading}
            >
              {secondaryLabel}
            </Button>
            
            <Button
              ref={confirmButtonRef}
              variant={confirmVariant}
              className="rounded-full px-6 py-2.5 text-sm sm:py-3"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Logging...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}