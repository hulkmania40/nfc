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

  // Check if a day has any logs
  const hasLogs = (date: Date) => {
    return logs.some(log => isSameDay(new Date(log.timestamp), date))
  }

  // Get completion color based on percentage - MORE SUBTLE
  const getDayColor = (percentage: number) => {
    if (percentage >= 100) return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
    if (percentage >= 75) return "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
    if (percentage >= 50) return "bg-sky-100 text-sky-700 hover:bg-sky-200"
    if (percentage >= 25) return "bg-blue-50 text-blue-700 hover:bg-blue-100"
    if (percentage > 0) return "bg-slate-100 text-slate-700 hover:bg-slate-200"
    return "bg-transparent text-slate-500 hover:bg-slate-50"
  }

  // Get dot color for days with logs
  const getDotColor = (percentage: number) => {
    if (percentage >= 100) return "bg-emerald-500"
    if (percentage >= 75) return "bg-cyan-500"
    if (percentage >= 50) return "bg-sky-500"
    if (percentage >= 25) return "bg-blue-400"
    if (percentage > 0) return "bg-slate-400"
    return "bg-transparent"
  }

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="grid lg:grid-cols-[1.4fr_0.9fr]">
        {/* Calendar Section */}
        <div className="p-4 sm:p-5 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 sm:size-10">
                <CalendarDays className="size-4 sm:size-5" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-cyan-600 sm:text-xs">
                  Calendar
                </p>
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {format(referenceDate, "MMMM yyyy")}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 rounded-full px-2.5 text-xs sm:h-8 sm:px-3"
                onClick={goToToday}
              >
                Today
              </Button>
              <div className="flex items-center gap-0.5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                  onClick={() => setReferenceDate((date) => subMonths(date, 1))}
                >
                  <ChevronLeft className="size-3.5 sm:size-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full sm:h-8 sm:w-8"
                  onClick={() => setReferenceDate((date) => addMonths(date, 1))}
                >
                  <ChevronRight className="size-3.5 sm:size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Week Days */}
          <div className="mt-4 grid grid-cols-7 gap-1 sm:mt-6 sm:gap-1.5">
            {weekDays.map((day) => (
              <div key={day} className="py-1 text-center">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                  {day.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>

          {/* Days Grid - IMPROVED UX */}
          <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5">
            {days.map((day) => {
              const isSelected = isSameDay(day.date, selectedDate)
              const isTodayDate = isToday(day.date)
              const isCurrentMonth = isSameMonth(day.date, referenceDate)
              const hasLogsToday = hasLogs(day.date)
              const colorClasses = getDayColor(day.percentage)
              const dotColor = getDotColor(day.percentage)

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setSelectedDate(day.date)}
                  disabled={!isCurrentMonth}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-lg",
                    "transition-all duration-150 ease-in-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2",
                    // Disabled / out of month
                    !isCurrentMonth && "opacity-25 cursor-not-allowed",
                    // Color based on completion - APPLIES TO ALL DAYS
                    isCurrentMonth && colorClasses,
                    // Hover effect - clean and subtle
                    isCurrentMonth && !isSelected && "hover:shadow-sm hover:scale-105",
                    // Selected state - clean ring
                    isSelected && "ring-2 ring-cyan-500 ring-offset-2 ring-offset-white shadow-md scale-105 bg-cyan-500 text-white hover:bg-cyan-500",
                    // Today indicator - subtle
                    isTodayDate && !isSelected && "ring-1 ring-cyan-300"
                  )}
                >
                  {/* Date number */}
                  <span className={cn(
                    "text-sm font-medium",
                    isSelected && "text-white",
                    isTodayDate && !isSelected && "text-cyan-600 font-bold"
                  )}>
                    {format(day.date, "d")}
                  </span>

                  {/* Dot indicator for days with logs - only show if not selected */}
                  {isCurrentMonth && hasLogsToday && !isSelected && (
                    <div className={cn(
                      "absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full",
                      dotColor
                    )} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend - More compact and clean */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50/50 px-3 py-2 sm:mt-5 sm:px-4 sm:py-2.5">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:gap-3 sm:text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-100 border border-emerald-200" />
                <span className="text-slate-600">100%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-100 border border-cyan-200" />
                <span className="text-slate-600">75%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-sky-100 border border-sky-200" />
                <span className="text-slate-600">50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-50 border border-blue-200" />
                <span className="text-slate-600">25%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-100 border border-slate-200" />
                <span className="text-slate-400">&lt;25%</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 sm:text-xs">
              <Droplets className="size-3" />
              <span>{days.filter(d => d.inMonth && hasLogs(d.date)).length} days</span>
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