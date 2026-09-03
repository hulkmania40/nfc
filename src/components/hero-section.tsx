import { Link } from "react-router-dom"
import {
  ArrowRight,
  Droplets,
  Sparkles,
  Smartphone,
  WifiOff,
  Waves,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { WaterGlass } from "@/components/water-glass"

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: WifiOff,
    title: "Offline First",
    description: "Data stays on your device. No internet, no cloud.",
  },
  {
    icon: Smartphone,
    title: "Installable",
    description: "Add to home screen. Feels like a native app.",
  },
  {
    icon: Waves,
    title: "NFC Tap to Log",
    description: "Tap your phone. Water logged instantly.",
  },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-30 bg-linear-to-b from-[#070b14] via-[#0a1220] to-[#070b14]" />
      <div
        className="absolute -top-40 -left-40 h-125 w-125 -z-10 rounded-full bg-cyan-500/6 blur-[120px] animate-breathe"
      />
      <div
        className="absolute -top-20 -right-20 h-100 w-100 -z-10 rounded-full bg-blue-500/5 blur-[100px] animate-breathe"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.07),transparent_50%)]" />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-5 lg:py-24">

        {/* LEFT */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/8 px-4 py-1.5 text-xs font-medium text-cyan-400">
            <Sparkles className="size-3.5" />
            Offline Hydration Tracker
          </div>

          <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.05]">
            Hydrate
            <br />
            <span className="text-gradient-water">effortlessly.</span>
          </h1>

          <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
            Turn any bottle into a smart hydration companion.
            Tap, confirm, and build better habits without lifting a finger.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="rounded-full bg-cyan-500 text-[#070b14] font-semibold hover:bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.25)] transition-all hover:shadow-[0_0_40px_rgba(34,211,238,0.35)]"
              >
                Launch App
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link to="/settings">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-border text-muted-foreground hover:text-foreground hover:border-cyan-500/30"
              >
                <Droplets className="mr-2 size-4" />
                Set Up Tags
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <GlassCard
                  key={feature.title}
                  tone="default"
                  className="group p-5 text-left hover:border-cyan-500/15"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </GlassCard>
              )
            })}
          </div>
        </div>

        {/* RIGHT — Visual showcase */}
        <div className="relative flex items-center justify-center">
          {/* Water glass visual */}
          <div className="relative">
            <WaterGlass percentage={72} size={200} />

            {/* Floating stat cards */}
            <GlassCard
              className="absolute -right-4 top-4 w-44 rounded-2xl p-3 animate-float-slow"
              tone="default"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">1,800</p>
              <p className="text-[10px] text-cyan-400">ml logged</p>
            </GlassCard>

            <GlassCard
              className="absolute -left-6 bottom-16 w-40 rounded-2xl p-3 animate-float-medium"
              tone="default"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Streak</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">5 days</p>
            </GlassCard>

            {/* Weekly mini bar chart */}
            <GlassCard
              className="absolute -right-2 bottom-4 w-48 rounded-2xl p-3 animate-float-fast"
              tone="default"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">This week</p>
              <div className="flex items-end gap-1 h-12">
                {[45, 60, 30, 85, 72, 50, 68].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-linear-to-t from-cyan-500/60 to-cyan-400/30 transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}
