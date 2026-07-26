import { format, parseISO } from "date-fns"
import { motion } from "framer-motion"

import { GlassCard } from "@/components/glass-card"
import type { TimelineEntry } from "@/types/hydration"
import { formatMilliliters } from "@/utils/hydration"

type HydrationTimelineProps = {
  entries: TimelineEntry[]
}

export function HydrationTimeline({ entries }: HydrationTimelineProps) {
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Timeline</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">Today's drinks</h3>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-slate-500">No drinks recorded for this day yet.</p>
        ) : null}
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/65 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">{format(parseISO(entry.timestamp), "HH:mm")}</p>
              <p className="text-xs text-slate-500">{entry.tagName}</p>
            </div>
            <p className="text-sm font-semibold text-cyan-600">{formatMilliliters(entry.amount)}</p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}
