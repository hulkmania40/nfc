import { useMemo, useState } from "react"
import { addMonths, format, isSameDay, subMonths } from "date-fns"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { HydrationTimeline } from "@/components/hydration-timeline"
import { buildMonthCalendar, getTimelineForDate } from "@/utils/hydration"
import type { HydrationTag, WaterLog } from "@/types/hydration"

type HydrationCalendarProps = {
  logs: WaterLog[]
  tags: HydrationTag[]
  goal: number
}

export function HydrationCalendar({ logs, tags, goal }: HydrationCalendarProps) {
  const [referenceDate, setReferenceDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  const days = useMemo(() => buildMonthCalendar(referenceDate, logs, goal), [goal, logs, referenceDate])
  const selectedEntries = useMemo(
    () => getTimelineForDate(logs, tags, selectedDate),
    [logs, selectedDate, tags]
  )

  return (
    <GlassCard className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Hydration calendar</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900">{format(referenceDate, "MMMM yyyy")}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="icon-sm" className="rounded-full" onClick={() => setReferenceDate((date) => subMonths(date, 1))}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="secondary" size="icon-sm" className="rounded-full" onClick={() => setReferenceDate((date) => addMonths(date, 1))}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const intensity =
              day.percentage >= 100
                ? "bg-cyan-500 text-white"
                : day.percentage >= 75
                  ? "bg-cyan-400 text-white"
                  : day.percentage >= 50
                    ? "bg-cyan-300 text-slate-900"
                    : day.percentage >= 25
                      ? "bg-cyan-100 text-slate-900"
                      : "bg-white/80 text-slate-400"

            return (
              <motion.button
                key={day.key}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDate(day.date)}
                className={`aspect-square rounded-2xl border border-white/70 text-left text-sm font-medium transition ${intensity} ${
                  day.inMonth ? "shadow-sm" : "opacity-45"
                } ${isSameDay(day.date, selectedDate) ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-white" : ""}`}
              >
                <span className="flex h-full flex-col justify-between p-3">
                  <span>{format(day.date, "d")}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">{day.percentage}%</span>
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
      <HydrationTimeline entries={selectedEntries} />
    </GlassCard>
  )
}
