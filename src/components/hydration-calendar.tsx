import { useMemo, useState } from "react"
import {
  addMonths,
  format,
  isSameDay,
  subMonths,
  isToday,
  isSameMonth,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarDays, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { HydrationTimeline } from "@/components/hydration-timeline"
import { buildMonthCalendar, getTimelineForDate } from "@/utils/hydration"
import type { HydrationTag, WaterLog } from "@/types/hydration"
import { cn } from "@/lib/utils"

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

  const goToToday = () => {
    const today = new Date()
    setReferenceDate(today)
    setSelectedDate(today)
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const getDayColor = (percentage: number) => {
    if (percentage >= 100) return "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
    if (percentage >= 75) return "bg-cyan-500/12 text-cyan-400/80 hover:bg-cyan-500/20"
    if (percentage >= 50) return "bg-cyan-500/6 text-cyan-400/60 hover:bg-cyan-500/12"
    if (percentage > 0) return "bg-cyan-500/[0.03] text-muted-foreground hover:bg-cyan-500/8"
    return "text-muted-foreground/60 hover:bg-cyan-500/[0.04]"
  }

  const getDotColor = (percentage: number) => {
    if (percentage >= 100) return "bg-cyan-400"
    if (percentage >= 75) return "bg-cyan-500"
    if (percentage >= 50) return "bg-cyan-600"
    if (percentage > 0) return "bg-cyan-700/50"
    return "bg-transparent"
  }

  const inMonthDays = days.filter(d => d.inMonth)
  const activeDays = inMonthDays.filter(d => d.total > 0).length

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="grid lg:grid-cols-[1.5fr_1fr]">
        <div className="p-4 sm:p-5 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <CalendarDays className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                  Calendar
                </p>
                <h3 className="text-sm font-semibold text-foreground">
                  {format(referenceDate, "MMMM yyyy")}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-lg px-2 text-cyan-400 hover:bg-cyan-500/10"
                onClick={goToToday}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-cyan-500/10"
                onClick={() => setReferenceDate((date) => subMonths(date, 1))}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-cyan-500/10"
                onClick={() => setReferenceDate((date) => addMonths(date, 1))}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Week Days */}
          <div className="mt-4 grid grid-cols-7 gap-0.5">
            {weekDays.map((day) => (
              <div key={day} className="py-1 text-center">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {day.slice(0, 2)}
                </span>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="mt-0.5 grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const isSelected = isSameDay(day.date, selectedDate)
              const isTodayDate = isToday(day.date)
              const isCurrentMonth = isSameMonth(day.date, referenceDate)
              const colorClasses = getDayColor(day.percentage)
              const dotColor = getDotColor(day.percentage)

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setSelectedDate(day.date)}
                  disabled={!isCurrentMonth}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-all duration-150",
                    !isCurrentMonth && "opacity-15 cursor-not-allowed",
                    isCurrentMonth && colorClasses,
                    isCurrentMonth && !isSelected && "hover:scale-105",
                    isSelected && "bg-cyan-500 text-[#070b14] font-bold scale-105 shadow-[0_0_12px_rgba(34,211,238,0.3)]",
                    isTodayDate && !isSelected && "ring-1 ring-cyan-500/40"
                  )}
                >
                  {format(day.date, "d")}
                  {isCurrentMonth && day.total > 0 && !isSelected && (
                    <div className={cn("absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full", dotColor)} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-between text-[9px] text-muted-foreground px-0.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>100%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                <span>50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-800" />
                <span>&lt;25%</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="size-2.5 text-cyan-400" />
              <span>{activeDays} days</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="border-t border-border/40 lg:border-t-0 lg:border-l lg:border-border/40">
          <HydrationTimeline entries={selectedEntries} />
        </div>
      </div>
    </GlassCard>
  )
}
