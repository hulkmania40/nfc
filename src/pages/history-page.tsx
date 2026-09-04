import { useMemo, useState } from "react"
import { format } from "date-fns"
import { Droplets, Trash2 } from "lucide-react"

import { GlassCard } from "@/components/glass-card"
import { cn } from "@/lib/utils"
import { useHydrationStore } from "@/stores/hydration-store"
import { useTagStore } from "@/stores/tag-store"
import { formatMilliliters } from "@/utils/hydration"

export function HistoryPage() {
  const logs = useHydrationStore((state) => state.logs)
  const deleteWaterLog = useHydrationStore((state) => state.deleteWaterLog)
  const tags = useTagStore((state) => state.tags)

  const [filterTag, setFilterTag] = useState<string | null>(null)

  const sorted = useMemo(() => {
    let result = [...logs].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    if (filterTag) {
      result = result.filter((log) => log.tagId === filterTag)
    }
    return result
  }, [logs, filterTag])

  const grouped = useMemo(() => {
    const groups: Record<string, typeof sorted> = {}
    for (const log of sorted) {
      const key = format(new Date(log.timestamp), "EEEE, MMMM d, yyyy")
      if (!groups[key]) groups[key] = []
      groups[key].push(log)
    }
    return groups
  }, [sorted])

  return (
    <div className="min-h-svh pb-24 pt-2">
      <div className="mx-auto w-full max-w-5xl space-y-4 px-3 sm:space-y-5 sm:px-5">
        {/* Header */}
        <div className="flex items-center gap-2 text-cyan-400 py-4 sm:py-6">
          <Droplets className="size-4" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em]">History</p>
        </div>

        {/* Tag filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            onClick={() => setFilterTag(null)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              filterTag === null
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                filterTag === tag.id
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Droplets className="size-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {filterTag ? "No logs for this tag" : "No drinks logged yet"}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {filterTag ? "Try selecting a different tag" : "Tap a glass to start tracking"}
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([day, dayLogs]) => (
              <div key={day}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  {day}
                </p>
                <div className="space-y-2">
                  {dayLogs.map((log) => {
                    const tag = tags.find((t) => t.id === log.tagId)
                    return (
                      <GlassCard
                        key={log.id}
                        className="flex items-center justify-between p-3 sm:p-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                            <Droplets className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {tag?.name ?? "NFC Tap"}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {format(new Date(log.timestamp), "h:mm a")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-cyan-400">
                            {formatMilliliters(log.amount)}
                          </span>
                          <button
                            onClick={() => deleteWaterLog(log.id)}
                            className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            aria-label="Delete log"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </GlassCard>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
