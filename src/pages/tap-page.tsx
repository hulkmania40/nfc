import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Droplets, Sparkles } from "lucide-react"

import { AnimatedCounter } from "@/components/animated-counter"
import { ConfirmationSheet } from "@/components/confirmation-sheet"
import { GlassCard } from "@/components/glass-card"
import { useHydrationStore } from "@/stores/hydration-store"
import { useTagStore } from "@/stores/tag-store"
import { getLastDrink } from "@/utils/hydration"

export function TapPage() {
  const navigate = useNavigate()
  const { tagId } = useParams()
  const tags = useTagStore((state) => state.tags)
  const logs = useHydrationStore((state) => state.logs)
  const tag = useMemo(() => tags.find((item) => item.id === tagId), [tagId, tags])

  if (tag === undefined) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-3xl items-center px-5 py-10 md:px-8">
        <GlassCard className="w-full text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Unknown tag</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">That NFC sticker is not registered yet.</h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">
            Add the tag from onboarding or settings, then try tapping again.
          </p>
        </GlassCard>
      </div>
    )
  }

  return <TapFlow tagId={tag.id} tagName={tag.name} defaultAmount={tag.defaultAmount} logs={logs} navigate={navigate} />
}

type TapFlowProps = {
  tagId: string
  tagName: string
  defaultAmount: number
  logs: ReturnType<typeof useHydrationStore.getState>["logs"]
  navigate: ReturnType<typeof useNavigate>
}

function TapFlow({ tagId, tagName, defaultAmount, logs, navigate }: TapFlowProps) {
  const addWater = useHydrationStore((state) => state.addWater)
  const lastDrink = useMemo(() => getLastDrink(logs), [logs])
  const [allowOverride, setAllowOverride] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [celebrationAmount, setCelebrationAmount] = useState(0)
  const [now] = useState(() => Date.now())

  const recentLog = lastDrink !== undefined && now - new Date(lastDrink.timestamp).getTime() < 5000
  const showDoubleTapProtection = recentLog && !allowOverride && !isCelebrating

  const handleConfirm = () => {
    setCelebrationAmount(defaultAmount)
    setIsCelebrating(true)
    addWater({ amount: defaultAmount, tagId })
    window.setTimeout(() => {
      navigate("/dashboard")
    }, 1500)
  }

  return (
    <div className="relative min-h-svh overflow-hidden px-5 py-8 md:px-8">
      <AnimatePresence mode="wait">
        {showDoubleTapProtection ? (
          <ConfirmationSheet
            key="double-tap"
            title="You just logged a drink."
            amountLabel="Try again in a moment"
            description="This guard prevents accidental NFC re-scans."
            confirmLabel="Add Another"
            secondaryLabel="Cancel"
            onCancel={() => navigate("/dashboard")}
            onConfirm={() => setAllowOverride(true)}
          />
        ) : (
          <ConfirmationSheet
            key="tap-confirmation"
            title="Drink Water?"
            amountLabel={`${defaultAmount.toLocaleString()} ml`}
            description={tagName}
            confirmLabel="Add Water"
            onCancel={() => navigate("/dashboard")}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCelebrating ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-slate-950/25 backdrop-blur-sm"
          >
            <GlassCard className="relative w-[min(92vw,28rem)] overflow-hidden text-center">
              <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.25),transparent_60%)]" />
              <div className="relative mx-auto flex size-28 items-end justify-center overflow-hidden rounded-full border border-cyan-100 bg-white/70 shadow-inner shadow-cyan-100/60">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,#7dd3fc,#0ea5e9)]"
                />
                <motion.div
                  initial={{ scale: 0.92, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative z-10 flex size-16 items-center justify-center rounded-full bg-white/85 text-cyan-600 shadow-lg"
                >
                  <Droplets className="size-8" />
                </motion.div>
                {[0, 1, 2, 3].map((index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.6, y: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 1.2], y: [-4, -20, -30] }}
                    transition={{ duration: 1.1, delay: index * 0.08 }}
                    className="absolute size-2 rounded-full bg-cyan-300"
                    style={{ left: `${28 + index * 11}%`, top: `${20 + index * 6}%` }}
                  />
                ))}
              </div>
              <div className="relative mt-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-500">Logged</p>
                <AnimatedCounter value={celebrationAmount} className="text-5xl font-semibold tracking-tight text-slate-900" suffix=" ml" />
                <p className="text-sm text-slate-500">Returning to dashboard...</p>
              </div>
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="mt-6 h-1 origin-left rounded-full bg-cyan-400"
              />
              <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
                <Sparkles className="size-4" />
                Ripple complete
              </div>
            </GlassCard>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
