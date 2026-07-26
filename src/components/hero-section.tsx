import { Link } from "react-router-dom"
import { ArrowRight, Droplets, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { WaterBlob } from "@/components/water-blob"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-20 pt-8 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-24 lg:pt-14">
        <div className="relative z-10 max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/70 px-4 py-2 text-sm font-medium text-cyan-700 shadow-sm backdrop-blur-md">
            <Sparkles className="size-4" />
            Offline-first hydration companion
          </div>
          <div className="space-y-5">
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-900 md:text-7xl">
              Hydrate effortlessly.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-slate-600 md:text-xl">
              Tap your glass.
              <br />
              Track your hydration.
              <br />
              Build healthy habits.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-7 py-6 text-base shadow-[0_18px_40px_rgba(14,165,233,0.22)]">
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-7 py-6 text-base">
              <Link to="/dashboard">
                <Droplets className="size-5" />
                Open Dashboard
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Works offline", "Your hydration history stays available without a network."],
              ["Install as app", "Run Hydra from your dock or home screen like a native app."],
              ["NFC-ready flow", "Program a sticker once and keep logging with a simple tap."],
            ].map(([title, description]) => (
              <GlassCard key={title} tone="soft" className="p-5">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-xl">
            <WaterBlob />
            <GlassCard className="absolute left-0 top-12 w-56 -rotate-6 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-500">Tap Alert</p>
              <p className="mt-2 text-base font-medium text-slate-900">Drink Water?</p>
              <p className="text-sm text-slate-500">250ml from Kitchen Glass</p>
            </GlassCard>
            <GlassCard className="absolute bottom-8 right-2 w-60 rotate-3 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-500">Today</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">1,800 ml</p>
              <p className="text-sm text-slate-500">of 2,500 ml goal</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}
