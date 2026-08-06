import { useMemo, type ComponentType } from "react"
import { Link } from "react-router-dom"
import {
  CalendarDays,
  Clock3,
  Flame,
  Goal,
  RefreshCw,
  Sparkles,
  Droplets,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"

import { AnimatedCounter } from "@/components/animated-counter"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { GlassCard } from "@/components/glass-card"
import { HydrationCalendar } from "@/components/hydration-calendar"
import { Navbar } from "@/components/navbar"
import { ProgressRing } from "@/components/progress-ring"
import { TagOnboarding } from "@/components/tag-onboarding"
import { WeeklyChart } from "@/components/weekly-chart"
import { useHydrationStore } from "@/stores/hydration-store"
import { useSettingsStore } from "@/stores/settings-store"
import { useTagStore } from "@/stores/tag-store"
import {
  formatMilliliters,
  getAverageIntake,
  getCurrentStreak,
  getGoalCompletion,
  getHydrationLevel,
  getLastDrink,
  getLongestStreak,
  getMonthlyTotals,
  getTodayIntake,
  getWeeklySeries,
} from "@/utils/hydration"

// Simplified Metric Card - Less visual weight
function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  trend?: { value: number; label: string }
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 sm:size-10">
          <Icon className="size-3.5 sm:size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
            {label}
          </p>
          <p className="mt-0.5 text-base font-semibold text-slate-900 sm:text-lg">
            {value}
          </p>
          {trend && (
            <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
              {trend.value > 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const tags = useTagStore((state) => state.tags)
  const settings = useSettingsStore((state) => state.settings)
  const logs = useHydrationStore((state) => state.logs)

  const todayIntake = useMemo(() => getTodayIntake(logs), [logs])
  const weeklySeries = useMemo(() => getWeeklySeries(logs), [logs])
  const monthlyTotals = useMemo(() => getMonthlyTotals(logs), [logs])
  const averageIntake = useMemo(() => getAverageIntake(logs), [logs])
  const currentStreak = useMemo(
    () => getCurrentStreak(logs, settings.dailyGoal),
    [logs, settings.dailyGoal]
  )
  const longestStreak = useMemo(
    () => getLongestStreak(logs, settings.dailyGoal),
    [logs, settings.dailyGoal]
  )
  const completion = getGoalCompletion(todayIntake, settings.dailyGoal)
  const hydrationLevel = getHydrationLevel(todayIntake, settings.dailyGoal)
  const lastDrink = getLastDrink(logs)

  const recentLogs = useMemo(
    () =>
      [...logs]
        .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
        .slice(0, 4),
    [logs]
  )

  const todayGlasses = useMemo(
    () =>
      logs.filter(
        (log) =>
          format(new Date(log.timestamp), "yyyy-MM-dd") ===
          format(new Date(), "yyyy-MM-dd")
      ),
    [logs]
  )

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  if (tags.length === 0) {
    return <TagOnboarding />
  }

  return (
    <div className="min-h-svh pt-2 pb-8">
      <Navbar />

      <div className="mx-auto mt-4 w-full max-w-7xl space-y-4 px-4 sm:mt-6 sm:space-y-6 sm:px-5 md:px-8">
        {/* Main Dashboard Card - Mobile Optimized */}
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="overflow-hidden p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {/* Left Content - Mobile First */}
              <div className="flex-1 space-y-3 sm:space-y-4">
                {/* Greeting Badge - Mobile Optimized */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm">
                  <Sparkles className="size-3 sm:size-3.5" />
                  <span className="whitespace-nowrap">{getGreeting()}! 👋</span>
                </div>

                {/* Progress Message - Responsive */}
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl lg:text-4xl">
                    {completion >= 80
                      ? "You're crushing it! 💪"
                      : completion >= 50
                        ? "Keep the momentum going! 🚀"
                        : "Let's start hydrating! 💧"}
                  </h1>
                  <p className="mt-1 text-sm leading-5 text-slate-500 sm:mt-2 sm:text-base sm:leading-6">
                    {completion >= 80
                      ? "Amazing progress today! You're well on your way."
                      : completion >= 50
                        ? "You're halfway to your goal. Stay consistent!"
                        : "Every drop counts. Let's reach your daily goal together."}
                  </p>
                </div>

                {/* Quick Action Buttons - Horizontal scroll on mobile */}
                <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                  {tags.slice(0, 3).map((tag) => (
                    <Button
                      asChild
                      key={tag.id}
                      variant="outline"
                      size="sm"
                      className="shrink-0 rounded-full border-slate-200 text-xs sm:text-sm"
                    >
                      <Link to={`/tap/${tag.id}`}>
                        <Droplets className="mr-1 size-3 sm:mr-1.5 sm:size-3.5" />
                        <span className="whitespace-nowrap">{tag.name}</span>
                      </Link>
                    </Button>
                  ))}
                  {tags.length > 3 && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="shrink-0 rounded-full text-xs sm:text-sm"
                    >
                      <Link to="/tags">
                        <span className="whitespace-nowrap">
                          +{tags.length - 3} more
                        </span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Ring - Clean, no duplicate progress bar */}
              <div className="flex justify-center md:justify-end">
                <div className="relative flex w-full max-w-44 items-center justify-center rounded-2xl bg-slate-50/50 p-3 sm:max-w-52 sm:p-4">
                  <ProgressRing
                    value={hydrationLevel}
                    size={180}
                    className="max-w-36 sm:max-w-44 md:max-w-48"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center sm:px-6">
                    <p className="text-[8px] font-medium tracking-[0.2em] text-slate-400 uppercase sm:text-[10px]">
                      Today
                    </p>
                    <AnimatedCounter
                      value={todayIntake}
                      className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 sm:mt-1 sm:text-2xl md:text-3xl"
                      suffix=" ml"
                    />
                    <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
                      of {settings.dailyGoal.toLocaleString()} ml
                    </p>
                    {/* Removed the duplicate progress bar */}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Stats Grid - Simplified with better mobile spacing */}
          <div className="grid gap-3 sm:gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase sm:text-xs">
                  Today's stats
                </p>
                <span className="text-[10px] text-slate-400 sm:text-xs">
                  {completion}% complete
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-3 sm:gap-2">
                <MetricCard
                  icon={Goal}
                  label="Progress"
                  value={`${completion}%`}
                  trend={{ value: completion - 50, label: "vs goal" }}
                />
                <MetricCard
                  icon={Flame}
                  label="Streak"
                  value={`${currentStreak}d`}
                />
                <MetricCard
                  icon={Droplets}
                  label="Glasses"
                  value={`${todayGlasses.length}`}
                />
                <MetricCard
                  icon={Clock3}
                  label="Last"
                  value={
                    lastDrink
                      ? format(new Date(lastDrink.timestamp), "h:mm a")
                      : "—"
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase sm:text-xs">
                  Insights
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] sm:h-7 sm:text-xs"
                >
                  <RefreshCw className="mr-1 size-2.5 sm:size-3" />
                  <span className="hidden sm:inline">Sync</span>
                </Button>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
                <div className="rounded-lg bg-slate-50/50 p-2 text-center sm:p-3">
                  <p className="text-[9px] text-slate-400 sm:text-xs">Avg</p>
                  <p className="text-xs font-semibold text-slate-900 sm:text-sm">
                    {formatMilliliters(averageIntake)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50/50 p-2 text-center sm:p-3">
                  <p className="text-[9px] text-slate-400 sm:text-xs">Best</p>
                  <p className="text-xs font-semibold text-slate-900 sm:text-sm">
                    {longestStreak}d
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50/50 p-2 text-center sm:p-3">
                  <p className="text-[9px] text-slate-400 sm:text-xs">
                    Monthly
                  </p>
                  <p className="text-xs font-semibold text-slate-900 sm:text-sm">
                    {formatMilliliters(monthlyTotals.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chart and Recent Logs */}
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <WeeklyChart series={weeklySeries} goal={settings.dailyGoal} />

          <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase sm:text-xs">
                  Recent logs
                </p>
                <h3 className="mt-0.5 text-sm font-medium text-slate-900">
                  Latest drinks
                </h3>
              </div>
              {recentLogs.length > 0 && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-[10px] sm:text-xs"
                >
                  <Link to="/history">View all</Link>
                </Button>
              )}
            </div>

            {recentLogs.length === 0 ? (
              <EmptyState
                title="No drinks yet"
                description="Tap a glass to start tracking your hydration."
                action={
                  <Button asChild size="sm" className="rounded-full">
                    <Link to={`/tap/${tags[0]?.id ?? ""}`}>Start tracking</Link>
                  </Button>
                }
              />
            ) : (
              <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
                {recentLogs.map((log) => {
                  const tag = tags.find((item) => item.id === log.tagId)
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-2.5 py-2 sm:px-3 sm:py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-900 sm:text-sm">
                          {tag?.name ?? "NFC tap"}
                        </p>
                        <p className="text-[10px] text-slate-400 sm:text-xs">
                          {format(new Date(log.timestamp), "h:mm a · MMM d")}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-cyan-600 sm:text-sm">
                        {formatMilliliters(log.amount)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Calendar - Simplified */}
        <HydrationCalendar logs={logs} tags={tags} goal={settings.dailyGoal} />
      </div>
    </div>
  )
}
