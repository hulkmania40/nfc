import { HeroSection } from "@/components/hero-section"
import { GlassCard } from "@/components/glass-card"
import { Navbar } from "@/components/navbar"
import { ProgressRing } from "@/components/progress-ring"
import { WeeklyChart } from "@/components/weekly-chart"

export function LandingPage() {
  return (
    <div className="min-h-svh pb-20 pt-2">
      <Navbar />

      <div className="space-y-16">
        <HeroSection />

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 md:px-8 lg:grid-cols-[1fr_0.9fr]">
          <GlassCard className="overflow-hidden p-0">
            <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">How it works</p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Tap once. Track instantly. Stay on pace.</h2>
                <p className="text-base leading-7 text-slate-600">
                  Hydra keeps the workflow frictionless: one NFC sticker per glass, one clean log, one elegant dashboard.
                </p>
              </div>
              <div className="grid gap-3">
                {[
                  ["1", "Create a tag", "Give your glass a name and default amount."],
                  ["2", "Tap to confirm", "Accidental taps are protected with a confirmation sheet."],
                  ["3", "Build streaks", "Watch your calendar, chart, and progress ring come alive."],
                ].map(([step, title, description]) => (
                  <GlassCard key={title} tone="soft" className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-sm font-semibold text-cyan-700">
                        {step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Dashboard preview</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">A calm, premium control center</h3>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-center rounded-[2rem] bg-white/70 py-6">
                <ProgressRing value={72} size={180} label="Hydration" className="max-w-[10rem]" />
              </div>
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
          </GlassCard>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 md:px-8 lg:grid-cols-3">
          {[
            ["Beautiful dashboard", "Fluid cards, gradients, and spring motion replace the usual CRUD feel."],
            ["Works offline", "Hydra is a proper PWA, so your history stays available on the plane or in the gym."],
            ["Install as app", "The install prompt makes Hydra feel like a native companion on every device."],
          ].map(([title, description]) => (
            <GlassCard key={title} tone="soft" className="p-6">
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </GlassCard>
          ))}
        </section>

        <footer className="mx-auto w-full max-w-7xl px-5 pb-8 text-sm text-slate-500 md:px-8">
          Hydra is a local-first hydration tracker built for delight, speed, and long-term extensibility.
        </footer>
      </div>
    </div>
  )
}
