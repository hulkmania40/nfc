import { Link } from "react-router-dom"
import { ArrowRight, Droplets, WifiOff, Smartphone, Waves } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { Navbar } from "@/components/navbar"

const features = [
  {
    icon: WifiOff,
    title: "Offline First",
    description: "Your data stays on your device. No cloud, no internet needed.",
  },
  {
    icon: Smartphone,
    title: "Installable PWA",
    description: "Add to your home screen. Works like a native app.",
  },
  {
    icon: Waves,
    title: "NFC Tap to Log",
    description: "Tap your phone on any sticker. Water logged instantly.",
  },
]

function AnimatedDroplets() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[...Array(8)].map((_, i) => (
        <Droplets
          key={i}
          className="absolute text-cyan-500/15 animate-droplet"
          size={12 + (i % 3) * 8}
          style={{
            left: `${15 + (i * 12) % 70}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${2.5 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-svh pb-28 pt-2">
      <Navbar />
      <div className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 -z-20 bg-linear-to-b from-[#070b14] via-[#0a1220] to-[#070b14]" />
        <div
          className="absolute -top-40 -left-40 h-125 w-125 -z-10 rounded-full bg-cyan-500/6 blur-[120px] animate-breathe"
        />
        <div
          className="absolute -top-20 -right-20 h-100 w-100 -z-10 rounded-full bg-blue-500/5 blur-[100px] animate-breathe"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.07),transparent_50%)]" />

        <AnimatedDroplets />

        <div className="mx-auto w-full max-w-5xl px-4 pt-12 sm:px-5 sm:pt-16 md:pt-20 lg:pt-24">
          {/* Hero */}
          <section className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/8 px-4 py-1.5 text-xs font-medium text-cyan-400 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-cyan-400" />
              </span>
              Tap to Track Hydration
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground mb-6 animate-slide-up">
              Hydrate
              <br />
              <span className="text-gradient-water">without thinking.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in delay-300">
              Register an NFC sticker on your bottle. Tap your phone. Water logged.
              No apps to open, no buttons to press.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in delay-400">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-cyan-500 text-[#070b14] font-semibold hover:bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
                >
                  Open Dashboard
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link to="/settings">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-border text-muted-foreground hover:text-foreground hover:border-cyan-500/30"
                >
                  <Droplets className="mr-2 size-4" />
                  Set Up NFC Tag
                </Button>
              </Link>
            </div>
          </section>

          {/* Feature cards */}
          <section className="grid gap-3 sm:gap-4 sm:grid-cols-3 mb-20 sm:mb-28 max-w-4xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <GlassCard
                  key={feature.title}
                  tone="default"
                  className="group text-center p-5 sm:p-6 hover:border-cyan-500/20 animate-fade-in"
                >
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </GlassCard>
              )
            })}
          </section>

          {/* How it works - visual flow */}
          <section className="max-w-2xl mx-auto mb-20 sm:mb-28">
            <h2 className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-8">
              How it works
            </h2>
            <div className="grid gap-3 sm:gap-4">
              {[
                { step: "01", title: "Create a tag", desc: "Name your bottle and set the amount (e.g. 250ml)" },
                { step: "02", title: "Copy the URL", desc: "Program your NFC sticker with the provided link" },
                { step: "03", title: "Tap to log", desc: "Stick it on your bottle, tap your phone, done" },
              ].map((item) => (
                <GlassCard key={item.step} tone="default" className="flex items-center gap-4 p-4 sm:p-5 hover:border-cyan-500/15">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-sm font-bold">
                    {item.step}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center pb-6">
            <p className="text-[10px] text-muted-foreground/60 tracking-wider">
              HYDRA — Local-first hydration tracker
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
