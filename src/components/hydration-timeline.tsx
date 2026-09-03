import { format, parseISO } from "date-fns"
import { useState, useEffect } from "react"
import { Trash2, AlertCircle } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { ConfirmationSheet } from "@/components/confirmation-sheet"
import type { TimelineEntry } from "@/types/hydration"
import { formatMilliliters } from "@/utils/hydration"
import { useHydrationStore } from "@/stores/hydration-store"
import { cn } from "@/lib/utils"

type HydrationTimelineProps = {
  entries: TimelineEntry[]
  onDelete?: () => void
}

export function HydrationTimeline({ entries, onDelete }: HydrationTimelineProps) {
  const deleteWater = useHydrationStore((state) => state.deleteWaterLog)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleDelete = async () => {
    if (!deleteTargetId) return
    setIsDeleting(true)
    try {
      await deleteWater(deleteTargetId)
      if (onDelete) onDelete()
      setDeleteTargetId(null)
    } catch (error) {
      console.error("Failed to delete entry:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const deleteTarget = deleteTargetId ? entries.find(entry => entry.id === deleteTargetId) : null
  const getDeleteTime = () => {
    if (!deleteTarget) return ""
    try {
      return format(parseISO(deleteTarget.timestamp), "h:mm a")
    } catch {
      return ""
    }
  }

  return (
    <>
      <GlassCard className="h-full rounded-none sm:rounded-[1.5rem] sm:m-4 sm:my-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Timeline
            </p>
            <h3 className="text-sm font-semibold text-foreground mt-0.5">
              Today&apos;s drinks
            </h3>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        <div className="mt-4 space-y-1.5 max-h-80 overflow-y-auto pr-1">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-10 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-cyan-500/5">
                <AlertCircle className="size-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-xs font-medium text-muted-foreground">No drinks recorded</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">Tap a glass to start</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="group relative flex items-center justify-between rounded-xl border border-border/30 bg-card/30 px-3 py-2.5 transition-colors hover:border-cyan-500/10"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground tabular-nums">
                      {format(parseISO(entry.timestamp), "h:mm a")}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border hidden sm:block" />
                    <span className="text-[10px] text-muted-foreground truncate">{entry.tagName}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/70 sm:hidden mt-0.5">
                    {format(parseISO(entry.timestamp), "EEE, MMM d")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-cyan-400 tabular-nums">
                    {formatMilliliters(entry.amount)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteTargetId(entry.id)
                    }}
                    className={cn(
                      "rounded-lg p-1 transition-all duration-200",
                      "hover:bg-red-500/10 hover:text-red-400",
                      isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                    aria-label="Delete entry"
                  >
                    <Trash2 className="size-3 text-muted-foreground hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="mt-3 border-t border-border/30 pt-2.5">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Total today</span>
              <span className="font-semibold text-cyan-400 tabular-nums">
                {formatMilliliters(entries.reduce((sum, e) => sum + e.amount, 0))}
              </span>
            </div>
          </div>
        )}
      </GlassCard>

      {deleteTargetId && deleteTarget && (
        <ConfirmationSheet
          title="Delete this entry?"
          amountLabel={formatMilliliters(deleteTarget.amount)}
          description={`Remove the ${deleteTarget.tagName} log at ${getDeleteTime()}`}
          confirmLabel={isDeleting ? "Deleting..." : "Delete"}
          secondaryLabel="Cancel"
          confirmVariant="destructive"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      )}
    </>
  )
}
