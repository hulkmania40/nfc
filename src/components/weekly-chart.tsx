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
  const chartHeight = 160 // Base height in pixels

  return (
    <GlassCard className="p-4 sm:p-5 md:p-6">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 sm:text-sm">
            Weekly chart
          </p>
          <h3 className="mt-0.5 text-lg font-medium text-slate-900 sm:text-xl">
            7-day hydration
          </h3>
        </div>
        <p className="text-xs text-slate-500 sm:text-sm">
          Daily goal {goal.toLocaleString()} ml
        </p>
      </div>

      {/* Chart - Fixed height calculation */}
      <div className="mt-6 flex items-end gap-1.5 sm:gap-2 md:gap-3">
        {series.map((item) => {
          // Calculate height as percentage of max, with minimum 8px
          const heightPercentage = (item.total / maxTotal) * 100
          const height = Math.max(8, (heightPercentage / 100) * chartHeight)
          const reachedGoal = item.total >= goal
          
          return (
            <div key={item.key} className="flex flex-1 flex-col items-center gap-2 sm:gap-3">
              {/* Bar container with fixed height */}
              <div 
                className="relative flex w-full items-end justify-center rounded-xl bg-slate-50/80 px-1 py-2 sm:rounded-2xl sm:px-2 sm:py-3"
                style={{ height: chartHeight + 16 }} // +16 for padding
              >
                {/* Bar with rounded top */}
                <div
                  className={`w-full max-w-12 rounded-t-lg ${
                    reachedGoal
                      ? "bg-linear-to-t from-cyan-500 to-cyan-300"
                      : "bg-linear-to-t from-slate-300 to-slate-200"
                  } transition-all duration-300`}
                  style={{ 
                    height: Math.max(4, height),
                    minHeight: 4,
                    borderRadius: height > 8 ? '8px 8px 0 0' : '4px'
                  }}
                />
              </div>
              
              {/* Labels - Responsive text */}
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-slate-700 sm:mt-1 sm:text-xs">
                  {item.total.toLocaleString()}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}