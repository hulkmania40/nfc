import { useMemo, type ComponentType } from "react"
import { Link } from "react-router-dom"
import {
  Flame,
  Gauge,
  Droplets,
  Clock3,
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
import { BottomTabNav } from "@/components/navbar"
import { TagOnboarding } from "@/components/tag-onboarding"
import { WaterGlass } from "@/components/water-glass"
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
  getWeeklySeries,
  getTodayIntake,
} from "@/utils/hydration"

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3 transition-colors hover:border-cyan-500/15">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
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
  const averageIntake = useMemo(() => getAverageIntake(logs), [logs])
  const currentStreak = useMemo(() => getCurrentStreak(logs, settings.dailyGoal), [logs, settings.dailyGoal])
  const completion = getGoalCompletion(todayIntake, settings.dailyGoal)
  const hydrationLevel = getHydrationLevel(todayIntake, settings.dailyGoal)
  const lastDrink = getLastDrink(logs)

  const recentLogs = useMemo(
    () =>
      [...logs]
        .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
        .slice(0, 5),
    [logs]
  )

  const todayGlasses = useMemo(
    () =>
      logs.filter(
        (log) =>
          format(new Date(log.timestamp), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
      ),
    [logs]
  )

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const motivationalMessage =
    completion >= 100
      ? "You crushed it! Goal reached."
      : completion >= 75
        ? "Almost there, keep sipping!"
        : completion >= 50
          ? "Halfway there. You got this."
          : completion > 0
            ? "Every sip counts. Keep going."
            : "Time to start hydrating!"

  if (tags.length === 0) {
    return <TagOnboarding />
  }

  return (
    <div className="min-h-svh pb-24 pt-2">
      <Navbar />

      <div className="mx-auto w-full max-w-5xl space-y-4 px-3 sm:space-y-5 sm:px-5">
        {/* Hero Card - Greeting + Progress */}
        <GlassCard className="relative overflow-hidden p-5 sm:p-6 md:p-8">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-cyan-500/4 blur-[80px]" aria-hidden="true" />
          <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/8 px-3 py-1 text-[11px] font-medium text-cyan-400">
                <Gauge className="size-3" />
                {getGreeting()}
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  {motivationalMessage}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {todayIntake.toLocaleString()} of {settings.dailyGoal.toLocaleString()} ml today
                </p>
              </div>

              {/* Quick tap buttons */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:mx-0 sm:px-0">
                {tags.slice(0, 4).map((tag) => (
                  <Link key={tag.id} to={`/tap/${tag.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 rounded-full border-cyan-500/15 bg-cyan-500/5 text-cyan-400 text-xs hover:bg-cyan-500/15 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
                    >
                      <Droplets className="mr-1.5 size-3.5" />
                      {tag.name}
                      <span className="ml-1.5 text-cyan-400/60">({tag.defaultAmount}ml)</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress ring + water glass */}
            <div className="flex items-center justify-center gap-5 sm:gap-6">
              <div className="relative">
                <ProgressRing value={hydrationLevel} size={140} strokeWidth={10} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <AnimatedCounter
                    value={todayIntake}
                    className="text-xl font-bold text-foreground"
                    suffix=""
                  />
                  <span className="text-[9px] text-muted-foreground mt-0.5">ml</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <WaterGlass percentage={hydrationLevel} size={80} />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stats row */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <MetricCard icon={Flame} label="Streak" value={`${currentStreak}d`} sub={currentStreak > 0 ? "days hydrated" : "start today"} />
          <MetricCard icon={Droplets} label="Glasses" value={`${todayGlasses.length}`} sub="today" />
          <MetricCard icon={Clock3} label="Last drink" value={lastDrink ? format(new Date(lastDrink.timestamp), "h:mm a") : "—"} />
          <MetricCard icon={TrendingUp} label="Avg / day" value={formatMilliliters(averageIntake)} sub="last 30d" />
        </div>

        {/* Chart + Recent logs */}
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <WeeklyChart series={weeklySeries} goal={settings.dailyGoal} />

          <GlassCard className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  Recent logs
                </p>
                <h3 className="text-sm font-semibold text-foreground mt-0.5">
                  Latest drinks
                </h3>
              </div>
              <Link to="/history">
                <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground hover:text-foreground">
                  View all
                </Button>
              </Link>
            </div>

            {recentLogs.length === 0 ? (
              <EmptyState
                title="No drinks yet"
                description="Tap a glass to start."
                action={
                  <Link to={`/tap/${tags[0]?.id ?? ""}`}>
                    <Button size="sm" className="rounded-full mt-3 bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/20">
                      Start tracking
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-1.5 max-h-70 overflow-y-auto pr-1">
                {recentLogs.map((log) => {
                  const tag = tags.find((item) => item.id === log.tagId)
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between rounded-xl border border-border/40 bg-card/50 px-3 py-2.5 transition-colors hover:border-cyan-500/10"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">
                          {tag?.name ?? "NFC tap"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {format(new Date(log.timestamp), "h:mm a · MMM d")}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-cyan-400 ml-2">
                        {formatMilliliters(log.amount)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Calendar */}
        <HydrationCalendar logs={logs} tags={tags} goal={settings.dailyGoal} />
      </div>

      <BottomTabNav />
    </div>
  )
}
