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
    <GlassCard className="p-4 sm:p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Weekly
          </p>
          <h3 className="text-sm font-semibold text-foreground mt-0.5">
            7-Day Hydration
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Goal: {goal.toLocaleString()} ml
        </p>
      </div>

      <div className="mt-5 flex items-end gap-2 sm:gap-3">
        {series.map((item) => {
          const heightPercentage = (item.total / maxTotal) * 100
          const height = Math.max(6, (heightPercentage / 100) * 130)
          const reachedGoal = item.total >= goal

          return (
            <div key={item.key} className="flex flex-1 flex-col items-center gap-1.5 sm:gap-2">
              <div className="relative flex w-full items-end justify-center rounded-xl bg-cyan-500/4 px-0.5 py-2 sm:rounded-2xl sm:px-1.5 sm:py-3">
                <div
                  className={`w-full max-w-10 rounded-t-lg transition-all duration-500 ${
                    reachedGoal
                      ? "bg-linear-to-t from-cyan-600 to-cyan-400"
                      : "bg-linear-to-t from-cyan-700/40 to-cyan-600/20"
                  }`}
                  style={{
                    height: Math.max(6, height),
                    minHeight: 6,
                    borderRadius: height > 8 ? "6px 6px 0 0" : "3px 3px 0 0",
                    boxShadow: reachedGoal ? "0 0 12px rgba(34,211,238,0.2)" : "none",
                  }}
                />

                {/* Amount label above bar */}
                {item.total > 0 && (
                  <span className="absolute -top-1 text-[9px] font-medium text-cyan-400/80 sm:text-[10px]">
                    {item.total > 999 ? `${(item.total/1000).toFixed(1)}L` : `${item.total}ml`}
                  </span>
                )}
              </div>

              <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
