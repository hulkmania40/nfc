import { HeroSection } from "@/components/hero-section"
import { GlassCard } from "@/components/glass-card"
import { Navbar } from "@/components/navbar"
import { ProgressRing } from "@/components/progress-ring"
import { WeeklyChart } from "@/components/weekly-chart"

export function LandingPage() {
  return (
    <div className="min-h-svh pb-8 pt-2">
      <Navbar />

      <div className="space-y-8 md:space-y-12">
        {/* Mobile-optimized Hero */}
        <HeroSection />

        {/* Core Workflow - Stack on mobile, side-by-side on desktop */}
        <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-5 md:gap-6 md:px-8 lg:grid-cols-[1fr_0.9fr]">
          <GlassCard className="overflow-hidden p-0">
            <div className="grid gap-4 p-4 sm:p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div className="space-y-3 md:space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 md:text-sm">
                  How it works
                </p>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  Log hydration in 3 steps
                </h2>
                <p className="text-sm leading-6 text-slate-600 md:text-base md:leading-7">
                  Simple NFC-based tracking with offline-first data storage.
                </p>
              </div>
              <div className="grid gap-2 sm:gap-3">
                {[
                  ["1", "Add a glass", "Name your container and set a default amount (e.g., 500ml)."],
                  ["2", "Tap to confirm", "Each tap logs your intake with a confirmation step."],
                  ["3", "Track progress", "View your history and daily totals at a glance."],
                ].map(([step, title, description]) => (
                  <div 
                    key={title} 
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-semibold text-cyan-700 sm:size-8 sm:text-sm">
                      {step}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-slate-900 sm:text-base">{title}</h3>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:mt-1 sm:text-sm sm:leading-6">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Data Display - Responsive chart */}
          <GlassCard className="space-y-4 p-4 sm:p-5 md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 md:text-sm">
                Your data
              </p>
              <h3 className="mt-1 text-lg font-medium text-slate-900 sm:text-xl">
                Daily summary
              </h3>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-center rounded-2xl bg-white/70 py-4 sm:py-6">
                <ProgressRing 
                  value={72} 
                  size={window.innerWidth < 640 ? 140 : 160} 
                  label="Today's goal" 
                  className="max-w-32 sm:max-w-40" 
                />
              </div>
              <div className="w-full overflow-x-auto">
                <div className="min-w-70 sm:min-w-0">
                  <WeeklyChart
                    goal={2500}
                    series={[
                      { date: new Date(), key: "m", label: "Mon", total: 1200 },
                      { date: new Date(), key: "t", label: "Tue", total: 1900 },
                      { date: new Date(), key: "w", label: "Wed", total: 2500 },
                      { date: new Date(), key: "th", label: "Thu", total: 1800 },
                      { date: new Date(), key: "f", label: "Fri", total: 2100 },
                      { date: new Date(), key: "s", label: "Sat", total: 900 },
                      { date: new Date(), key: "su", label: "Sun", total: 1650 },
                    ]}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Key Features - Stack on mobile, grid on desktop */}
        <section className="mx-auto grid w-full max-w-7xl gap-3 px-4 sm:px-5 md:gap-5 md:px-8 lg:grid-cols-3">
          {[
            ["Offline-first", "Data is stored locally. No internet connection required."],
            ["NFC integration", "Simple tap-to-log functionality with confirmation."],
            ["Daily analytics", "View your hydration patterns and trends."],
          ].map(([title, description]) => (
            <div 
              key={title} 
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6"
            >
              <h3 className="text-base font-medium text-slate-900 sm:text-lg">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500 sm:mt-2 sm:text-sm md:leading-7">
                {description}
              </p>
            </div>
          ))}
        </section>

        <footer className="mx-auto w-full max-w-7xl px-4 pb-6 text-center text-xs text-slate-400 sm:px-5 sm:text-sm md:px-8 md:pb-8">
          <span>Hydra — Local-first hydration tracker</span>
        </footer>
      </div>
    </div>
  )
}