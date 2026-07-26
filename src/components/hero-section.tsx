import { Link } from "react-router-dom"
import {
  ArrowRight,
  Droplets,
  Sparkles,
  Smartphone,
  WifiOff,
  Waves,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { WaterBlob } from "@/components/water-blob"

const features = [
  {
    icon: WifiOff,
    title: "Offline First",
    description: "Everything works without internet.",
  },
  {
    icon: Smartphone,
    title: "Installable",
    description: "Runs like a native iPhone app.",
  },
  {
    icon: Waves,
    title: "NFC Ready",
    description: "Tap your glass and keep drinking.",
  },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 -z-30 bg-gradient-to-b from-cyan-50 via-white to-slate-100" />

      <div className="absolute left-[-220px] top-[-140px] h-[520px] w-[520px] rounded-full bg-cyan-300/30 blur-[120px] animate-pulse" />

      <div className="absolute right-[-180px] top-16 h-[420px] w-[420px] rounded-full bg-sky-300/20 blur-[120px] animate-pulse [animation-delay:2s]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_60%)]" />

      <div className="mx-auto grid max-w-7xl gap-20 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

        {/* LEFT */}

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-5 py-2 backdrop-blur-xl shadow-lg">

            <Sparkles className="h-4 w-4 text-cyan-500" />

            <span className="text-sm font-medium text-slate-700">
              Beautiful Offline Hydration Tracker
            </span>

          </div>

          <h1 className="mt-8 max-w-2xl text-6xl font-semibold tracking-[-0.06em] text-slate-900 md:text-7xl xl:text-8xl leading-[0.95]">

            Hydration

            <br />

            <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 bg-clip-text text-transparent">

              should feel
              <br />
              effortless.

            </span>

          </h1>

          <p className="mt-8 max-w-xl text-xl leading-9 text-slate-600">

            Turn your favourite glass into an intelligent hydration
            companion.

            Simply tap the NFC sticker, confirm your drink,
            and build healthier habits without thinking about it.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full px-8 shadow-[0_20px_60px_rgba(14,165,233,0.30)] transition-all duration-300 hover:scale-[1.03]"
            >
              <Link to="/dashboard">

                Get Started

                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-14 rounded-full px-8"
            >
              <Link to="/dashboard">

                <Droplets className="mr-2 h-5 w-5" />

                Open Dashboard

              </Link>
            </Button>

          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">

            {features.map((feature) => {

              const Icon = feature.icon

              return (

                <GlassCard
                  key={feature.title}
                  className="group border-white/70 bg-white/60 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 transition-transform duration-300 group-hover:scale-110">

                    <Icon className="h-6 w-6 text-cyan-600" />

                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>

                </GlassCard>

              )

            })}

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative flex justify-center lg:justify-end">

          <div className="relative h-[720px] w-full max-w-[560px]">

            <WaterBlob />

            {/* Floating NFC Card */}

            <GlassCard
              className="absolute left-0 top-12 w-64 rounded-3xl border-white/70 bg-white/70 p-6 backdrop-blur-3xl shadow-[0_30px_80px_rgba(15,23,42,0.15)] animate-[float_5s_ease-in-out_infinite]"
            >

              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-500">
                NFC DETECTED
              </p>

              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                Kitchen Glass
              </h3>

              <p className="mt-1 text-slate-500">
                Ready to log hydration
              </p>

              <div className="mt-6 flex items-end gap-2">

                <span className="text-5xl font-bold tracking-tight text-cyan-600">
                  250
                </span>

                <span className="pb-2 text-lg text-slate-500">
                  ml
                </span>

              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200">

                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500" />

              </div>

              <p className="mt-4 text-sm text-slate-500">
                Tap your phone to confirm.
              </p>

            </GlassCard>

                        {/* Main Dashboard Preview */}

            <GlassCard
              className="absolute right-0 top-28 w-[360px] rounded-[36px] border-white/70 bg-white/60 p-8 backdrop-blur-3xl shadow-[0_35px_100px_rgba(15,23,42,0.16)]"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Today's Progress
                  </p>

                  <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                    1,800 ml
                  </h2>

                </div>

                <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-600">
                  72%
                </div>

              </div>

              {/* Glass */}

              <div className="relative mt-8 flex h-72 items-end justify-center">

                <div className="relative h-64 w-40 overflow-hidden rounded-b-[42px] rounded-t-[26px] border border-white/70 bg-white/50 shadow-inner">

                  {/* water */}

                  <div
                    className="absolute bottom-0 left-0 w-full rounded-t-[32px] bg-gradient-to-t from-cyan-500 via-sky-400 to-cyan-300"
                    style={{
                      height: "72%",
                    }}
                  >

                    <div className="absolute top-0 left-[-25%] h-5 w-[150%] rounded-full bg-white/30" />

                    <div className="absolute top-2 left-[-15%] h-3 w-[130%] rounded-full bg-white/20" />

                  </div>

                  {/* shine */}

                  <div className="absolute left-4 top-4 h-[85%] w-[10px] rounded-full bg-white/40 blur-sm" />

                  <div className="absolute right-6 top-12 h-28 w-[6px] rounded-full bg-white/20 blur-sm" />

                </div>

                {/* percentage */}

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-6xl font-bold tracking-tight text-slate-900">
                    72%
                  </span>

                  <p className="mt-2 text-slate-500">
                    Daily Goal
                  </p>

                </div>

              </div>

              {/* stats */}

              <div className="mt-8 grid grid-cols-3 gap-4">

                {[
                  {
                    value: "7",
                    label: "Glasses",
                  },
                  {
                    value: "3",
                    label: "Streak",
                  },
                  {
                    value: "2.5L",
                    label: "Goal",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-white/70 p-4 text-center backdrop-blur-xl"
                  >

                    <h3 className="text-2xl font-bold text-slate-900">
                      {item.value}
                    </h3>

                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                      {item.label}
                    </p>

                  </div>
                ))}

              </div>

            </GlassCard>

            {/* Weekly Card */}

            <GlassCard
              className="absolute bottom-8 left-10 w-60 rounded-3xl border-white/70 bg-white/65 p-5 backdrop-blur-3xl shadow-xl animate-[float_7s_ease-in-out_infinite]"
            >

              <p className="text-xs uppercase tracking-[0.3em] text-cyan-500">
                Weekly Average
              </p>

              <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                2.1L
              </h3>

              <div className="mt-6 flex items-end gap-2 h-24">

                {[40,60,52,88,95,72,84].map((height,index)=>(
                  <div
                    key={index}
                    className="flex-1 rounded-full bg-gradient-to-t from-cyan-500 to-sky-300 transition-all duration-500 hover:scale-y-110"
                    style={{ height }}
                  />
                ))}

              </div>

            </GlassCard>

            {/* Floating blobs */}

            <div className="absolute right-6 top-2 h-6 w-6 rounded-full bg-cyan-300 blur-sm animate-pulse" />

            <div className="absolute bottom-12 right-24 h-12 w-12 rounded-full bg-sky-200/70 blur-md animate-pulse [animation-delay:2s]" />

          </div>

        </div>

      </div>

    </section>
  )
}