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
  onDelete?: () => void // Optional callback to refresh parent
}

export function HydrationTimeline({ entries, onDelete }: HydrationTimelineProps) {
  const deleteWater = useHydrationStore((state) => state.deleteWaterLog)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile for showing delete buttons
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDelete = async () => {
    if (!deleteTargetId) return
    
    setIsDeleting(true)
    try {
      await deleteWater(deleteTargetId)
      // Refresh parent if callback provided
      if (onDelete) {
        onDelete()
      }
      setDeleteTargetId(null)
    } catch (error) {
      console.error("Failed to delete entry:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteTargetId(id)
  }

  // FIXED: Safely get delete target with proper null check
  const deleteTarget = deleteTargetId 
    ? entries.find(entry => entry.id === deleteTargetId) 
    : null

  // Safely get formatted time for delete target
  const getDeleteTime = () => {
    if (!deleteTarget) return ''
    try {
      return format(parseISO(deleteTarget.timestamp), "h:mm a")
    } catch {
      return ''
    }
  }

  return (
    <>
      <GlassCard className="h-full p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-cyan-600 sm:text-sm">
              Timeline
            </p>
            <h3 className="mt-0.5 text-lg font-semibold text-slate-900 sm:mt-1 sm:text-xl">
              Today's drinks
            </h3>
          </div>
          <div className="text-sm text-slate-400">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>

        <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center sm:py-12">
              <div className="rounded-full bg-slate-100 p-3">
                <AlertCircle className="size-5 text-slate-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-600">No drinks recorded</p>
              <p className="text-xs text-slate-400">Tap a glass to start tracking</p>
            </div>
          ) : (
            entries.map((entry) => {
              const isHovered = hoveredId === entry.id
              const isDeletingThis = isDeleting && deleteTargetId === entry.id
              const showDeleteButton = isHovered || isMobile

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "group relative flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5 transition-all duration-200 sm:px-4 sm:py-3",
                    "hover:border-slate-200 hover:shadow-sm",
                    isDeletingThis && "opacity-50 pointer-events-none"
                  )}
                  onMouseEnter={() => setHoveredId(entry.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Left side - Time and Tag */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 sm:text-base">
                        {format(parseISO(entry.timestamp), "h:mm a")}
                      </span>
                      <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                      <span className="text-xs text-slate-500 sm:text-sm">
                        {entry.tagName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 sm:hidden">
                      {format(parseISO(entry.timestamp), "EEE, MMM d")}
                    </p>
                  </div>

                  {/* Right side - Amount and Delete */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-sm font-semibold text-cyan-600 sm:text-base">
                      {formatMilliliters(entry.amount)}
                    </span>
                    
                    {/* Delete button - shows on hover or mobile */}
                    <button
                      onClick={(e) => handleDeleteClick(entry.id, e)}
                      className={cn(
                        "rounded-full p-1.5 transition-all duration-200",
                        "hover:bg-red-50 hover:text-red-600",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400",
                        showDeleteButton ? "opacity-100" : "opacity-0",
                        isDeletingThis && "pointer-events-none"
                      )}
                      aria-label="Delete entry"
                      disabled={isDeletingThis}
                    >
                      <Trash2 className="size-3.5 text-slate-400 hover:text-red-500 sm:size-4" />
                    </button>
                  </div>

                  {/* Loading overlay for deleting state */}
                  {isDeletingThis && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="inline-block size-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500" />
                        Deleting...
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer with total */}
        {entries.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-3 sm:mt-6 sm:pt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 sm:text-sm">
              <span>Total today</span>
              <span className="font-medium text-slate-600">
                {formatMilliliters(entries.reduce((sum, e) => sum + e.amount, 0))}
              </span>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Delete Confirmation Sheet - FIXED: Proper null checks */}
      {deleteTargetId && deleteTarget && (
        <ConfirmationSheet
          title="Delete this entry?"
          amountLabel={formatMilliliters(deleteTarget.amount)}
          description={`Remove the ${deleteTarget.tagName} log from ${getDeleteTime()}`}
          confirmLabel={isDeleting ? "Deleting..." : "Delete"}
          secondaryLabel="Cancel"
          confirmVariant="destructive"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          icon={<Trash2 className="size-6 text-red-500" />}
        />
      )}
    </>
  )
}