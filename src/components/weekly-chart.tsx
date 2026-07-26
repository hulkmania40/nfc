import { GlassCard } from "@/components/glass-card"

type WeeklySeriesItem = {
  date: Date
  key: string
  label: string
  total: number
}

type WeeklyChartProps = {
  series: WeeklySeriesItem[]
  goal: number
}

export function WeeklyChart({ series, goal }: WeeklyChartProps) {
  const maxTotal = Math.max(goal, ...series.map((item) => item.total), 1)

  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Weekly chart</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">7-day hydration</h3>
        </div>
        <p className="text-sm text-slate-500">Daily goal {goal.toLocaleString()} ml</p>
      </div>
      <div className="mt-8 flex items-end gap-3">
        {series.map((item) => {
          const height = Math.max(12, (item.total / maxTotal) * 180)
          const reachedGoal = item.total >= goal
          return (
            <div key={item.key} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-48 w-full items-end justify-center rounded-3xl bg-white/55 px-2 py-3">
                <div
                  className={`w-full max-w-12 rounded-[1.2rem] ${
                    reachedGoal
                      ? "bg-[linear-gradient(180deg,#0ea5e9,#22d3ee)]"
                      : "bg-[linear-gradient(180deg,#bfdbfe,#7dd3fc)]"
                  }`}
                  style={{ height }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{item.total.toLocaleString()} ml</p>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
