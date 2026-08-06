import { useMemo, useState } from "react"
import { 
  addMonths, 
  format, 
  isSameDay, 
  subMonths, 
  isToday, 
  isSameMonth,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"

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

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"]

  // Check if a day has any logs
  const hasLogs = (date: Date) => {
    return logs.some(log => isSameDay(new Date(log.timestamp), date))
  }

  // Get completion color based on percentage
  const getDayColor = (percentage: number) => {
    if (percentage >= 100) return "bg-emerald-500"
    if (percentage >= 75) return "bg-cyan-500"
    if (percentage >= 50) return "bg-cyan-400"
    if (percentage >= 25) return "bg-cyan-300"
    if (percentage > 0) return "bg-cyan-200"
    return "bg-transparent"
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="grid lg:grid-cols-[1.4fr_0.9fr]">
        {/* Calendar Section */}
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-cyan-600">
                  Calendar
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {format(referenceDate, "MMMM yyyy")}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full text-xs h-8 px-3"
                onClick={goToToday}
              >
                Today
              </Button>
              <div className="flex items-center gap-0.5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setReferenceDate((date) => subMonths(date, 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setReferenceDate((date) => addMonths(date, 1))}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Week Days */}
          <div className="mt-6 grid grid-cols-7 gap-1.5">
            {weekDays.map((day) => (
              <div key={day} className="py-1 text-center">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Days Grid - Clean, minimal */}
          <div className="mt-1 grid grid-cols-7 gap-1.5">
            {days.map((day) => {
              const isSelected = isSameDay(day.date, selectedDate)
              const isTodayDate = isToday(day.date)
              const isCurrentMonth = isSameMonth(day.date, referenceDate)
              const hasLogsToday = hasLogs(day.date)
              const dayColor = getDayColor(day.percentage)

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setSelectedDate(day.date)}
                  disabled={!isCurrentMonth}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-xl",
                    "transition-all duration-200 ease-in-out",
                    "hover:scale-105 hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2",
                    // Selected state
                    isSelected && "ring-2 ring-cyan-500 ring-offset-2 ring-offset-white scale-105 shadow-md",
                    // Disabled / out of month
                    !isCurrentMonth && "opacity-30 cursor-not-allowed hover:scale-100 hover:shadow-none",
                    // Current month with logs
                    isCurrentMonth && hasLogsToday && dayColor,
                    // Current month without logs
                    isCurrentMonth && !hasLogsToday && "hover:bg-slate-50",
                    // Today indicator
                    isTodayDate && !isSelected && "font-bold text-cyan-600"
                  )}
                >
                  {/* Date number */}
                  <span className={cn(
                    "text-sm font-medium",
                    isTodayDate && isSelected && "text-white",
                    isTodayDate && !isSelected && "text-cyan-600",
                    isSelected && "text-white"
                  )}>
                    {format(day.date, "d")}
                  </span>

                  {/* Log indicator dot - subtle */}
                  {isCurrentMonth && hasLogsToday && !isSelected && (
                    <div className={cn(
                      "absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                      dayColor
                    )} />
                  )}

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl bg-cyan-500 -z-10" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Mini Stats */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-2.5">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>≥100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <span>50-99%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-200" />
                <span>1-49%</span>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              {days.filter(d => d.inMonth && hasLogs(d.date)).length} days logged
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="border-t border-slate-100 lg:border-l lg:border-t-0">
          <HydrationTimeline entries={selectedEntries} />
        </div>
      </div>
    </GlassCard>
  )
}