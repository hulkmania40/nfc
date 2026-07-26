import { useMemo, type ComponentType } from "react"
import { Link } from "react-router-dom"
import { CalendarDays, Clock3, Flame, Goal, RefreshCw, Sparkles } from "lucide-react"
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

function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  tone?: "default" | "accent"
}) {
  return (
    <GlassCard tone={tone === "accent" ? "accent" : "soft"} className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-cyan-600">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </GlassCard>
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
  const currentStreak = useMemo(() => getCurrentStreak(logs, settings.dailyGoal), [logs, settings.dailyGoal])
  const longestStreak = useMemo(() => getLongestStreak(logs, settings.dailyGoal), [logs, settings.dailyGoal])
  const completion = getGoalCompletion(todayIntake, settings.dailyGoal)
  const hydrationLevel = getHydrationLevel(todayIntake, settings.dailyGoal)
  const lastDrink = getLastDrink(logs)
  const recentLogs = useMemo(
    () => [...logs].sort((left, right) => right.timestamp.localeCompare(left.timestamp)).slice(0, 4),
    [logs]
  )

  if (tags.length === 0) {
    return <TagOnboarding />
  }

  return (
    <div className="mx-auto min-h-svh w-full max-w-7xl px-5 pb-12 pt-2 md:px-8">
      <Navbar />

      <div className="mt-6 space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <GlassCard className="overflow-hidden p-0">
            <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/70 px-4 py-2 text-sm font-medium text-cyan-700 shadow-sm backdrop-blur-md">
                  <Sparkles className="size-4" />
                  Stay Hydrated 💧
                </div>
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">Stay Hydrated.</h1>
                  <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                    Your day at a glance, with calm motion, clear progress, and local-first persistence.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <Button asChild key={tag.id} variant="secondary" className="rounded-full px-4">
                      <Link to={`/tap/${tag.id}`}>{tag.name}</Link>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="relative flex items-center justify-center rounded-[2.5rem] bg-white/55 p-4 shadow-inner shadow-cyan-100/60">
                  <ProgressRing value={hydrationLevel} label="Daily progress" size={240} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <AnimatedCounter value={todayIntake} className="text-4xl font-semibold tracking-tight text-slate-900" suffix=" ml" />
                    <p className="mt-2 text-sm text-slate-500">of {settings.dailyGoal.toLocaleString()} ml</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-6">
            <GlassCard className="space-y-5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">Today's stats</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-900">Small numbers, strong habits</h2>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard icon={Goal} label="Goal completion" value={`${completion}%`} tone="accent" />
                <MetricCard icon={Flame} label="Current streak" value={`${currentStreak} days`} />
                <MetricCard icon={CalendarDays} label="Glasses today" value={`${logs.filter((log) => format(new Date(log.timestamp), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")).length}`} />
                <MetricCard icon={Clock3} label="Last drink" value={lastDrink ? format(new Date(lastDrink.timestamp), "h:mm a") : "No logs yet"} />
              </div>
            </GlassCard>

            <GlassCard className="space-y-5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-500">Quick insights</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-900">Long-term rhythm</h2>
                </div>
                <Button variant="secondary" size="sm" className="rounded-full">
                  <RefreshCw className="size-4" />
                  Sync local data
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard icon={Sparkles} label="Average intake" value={formatMilliliters(averageIntake)} />
                <MetricCard icon={Flame} label="Longest streak" value={`${longestStreak} days`} />
                <MetricCard icon={Goal} label="Monthly total" value={formatMilliliters(monthlyTotals.total)} />
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <WeeklyChart series={weeklySeries} goal={settings.dailyGoal} />
          <GlassCard className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Recent drinks</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Latest hydration events</h3>
            </div>
            {recentLogs.length === 0 ? (
              <EmptyState
                title="No drinks yet"
                description="Tap a glass to see your first hydration log appear here."
                action={
                  <Button asChild className="rounded-full px-5">
                    <Link to={`/tap/${tags[0]?.id ?? ""}`}>Open tap flow</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => {
                  const tag = tags.find((item) => item.id === log.tagId)
                  return (
                    <div key={log.id} className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/65 px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{tag?.name ?? "NFC tap"}</p>
                        <p className="text-sm text-slate-500">{format(new Date(log.timestamp), "h:mm a · MMM d")}</p>
                      </div>
                      <p className="text-sm font-semibold text-cyan-600">{formatMilliliters(log.amount)}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </GlassCard>
        </section>

        <HydrationCalendar logs={logs} tags={tags} goal={settings.dailyGoal} />
      </div>
    </div>
  )
}
