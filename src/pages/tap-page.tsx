import { useMemo, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Droplets, Clock, AlertTriangle, ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { AnimatedCounter } from "@/components/animated-counter"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { WaterGlass } from "@/components/water-glass"
import { useHydrationStore } from "@/stores/hydration-store"
import { useTagStore } from "@/stores/tag-store"
import { getLastDrink, getTodayIntake } from "@/utils/hydration"

export function TapPage() {
  const navigate = useNavigate()
  const { tagId } = useParams()
  const tags = useTagStore((state) => state.tags)
  const logs = useHydrationStore((state) => state.logs)

  const tag = useMemo(() => tags.find((item) => item.id === tagId), [tagId, tags])
  const todayIntake = useMemo(() => getTodayIntake(logs), [logs])

  if (tag === undefined) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm glass rounded-[1.5rem] p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <AlertTriangle className="size-8" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-foreground">Tag Not Found</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This NFC sticker hasn&apos;t been registered. Set it up in settings first.
          </p>
          <div className="mt-6 flex gap-2">
            <Button onClick={() => navigate("/settings")} className="flex-1 rounded-full bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/20">
              Go to Settings
            </Button>
            <Button onClick={() => navigate(-1)} variant="ghost" className="rounded-full text-muted-foreground">
              <ArrowLeft className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TapFlow
      tagId={tag.id}
      tagName={tag.name}
      defaultAmount={tag.defaultAmount}
      todayIntake={todayIntake}
    />
  )
}

type TapFlowProps = {
  tagId: string
  tagName: string
  defaultAmount: number
  todayIntake: number
}

function TapFlow({ tagId, tagName, defaultAmount, todayIntake }: TapFlowProps) {
  const navigate = useNavigate()
  const addWater = useHydrationStore((state) => state.addWater)
  const logs = useHydrationStore((state) => state.logs)

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLogging, setIsLogging] = useState(false)
  const [loggedAmount, setLoggedAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const lastDrink = useMemo(() => getLastDrink(logs), [logs])
  const timeSinceLastDrink = useMemo(() => {
    if (!lastDrink) return Infinity
    return Date.now() - new Date(lastDrink.timestamp).getTime()
  }, [lastDrink])

  const isRecentLog = timeSinceLastDrink < 3000
  const [allowOverride, setAllowOverride] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isRecentLog || allowOverride) {
        setShowConfirmation(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [isRecentLog, allowOverride])

  const handleConfirm = () => {
    setError(null)
    setIsLogging(true)
    setLoggedAmount(defaultAmount)

    try {
      addWater({ amount: defaultAmount, tagId })
      setTimeout(() => {
        navigate("/dashboard")
      }, 1400)
    } catch {
      setError("Failed to log hydration. Please try again.")
      setIsLogging(false)
    }
  }

  const handleCancel = () => navigate("/dashboard")
  const handleOverride = () => {
    setAllowOverride(true)
    setShowConfirmation(true)
  }

  // Loading / success state
  if (isLogging) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 via-transparent to-blue-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-cyan-500/10 blur-[80px] animate-breathe" />
        </div>

        <div className="relative text-center">
          <div className="relative mx-auto flex size-32 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ripple" />
            <div className="absolute inset-4 rounded-full border border-cyan-500/15 animate-ripple" style={{ animationDelay: "0.5s" }} />
            <div className="flex size-20 items-center justify-center rounded-full bg-cyan-500/10">
              <Droplets className="size-10 text-cyan-400" />
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">Logged</p>
            <AnimatedCounter
              value={loggedAmount}
              className="text-5xl font-bold text-foreground"
              suffix=""
            />
            <span className="text-lg text-muted-foreground ml-1">ml</span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">{tagName}</p>

          <div className="mt-6 h-1 w-48 mx-auto overflow-hidden rounded-full bg-cyan-500/10">
            <div className="h-full w-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500 animate-shimmer" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4">
        <div className="w-full max-w-sm glass rounded-[1.5rem] p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => setError(null)} variant="outline" className="mt-6 w-full rounded-full">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Cooldown state
  if (isRecentLog && !allowOverride && !showConfirmation) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4">
        <div className="w-full max-w-sm glass rounded-[1.5rem] p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <Clock className="size-8" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground">Slow down!</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            You just logged a drink {formatDistanceToNow(new Date(lastDrink?.timestamp ?? 0))} ago.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button onClick={handleOverride} className="w-full rounded-full bg-cyan-500 text-[#070b14] font-semibold">
              Log Anyway
            </Button>
            <Button onClick={handleCancel} variant="outline" className="w-full rounded-full border-border text-muted-foreground">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Main confirmation
  const goalPercent = Math.round((todayIntake / 2500) * 100)

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-8">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-500/5 blur-[100px] animate-breathe" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-linear-to-t from-cyan-500/3 to-transparent" />
      </div>

      <div className="w-full max-w-sm animate-scale-in">
        {/* Back button */}
        <button
          onClick={handleCancel}
          className="mb-6 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Cancel
        </button>

        <GlassCard className="relative overflow-hidden p-6 sm:p-8 text-center">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_60%)]" />

          {/* Water glass */}
          <div className="relative flex justify-center mb-6">
            <WaterGlass percentage={goalPercent} size={120} />
          </div>

          {/* Info */}
          <div className="relative space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Tap Detected
            </p>
            <h2 className="text-2xl font-bold text-foreground">{tagName}</h2>
            <p className="text-sm text-muted-foreground">
              {defaultAmount.toLocaleString()} ml
            </p>

            <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-muted-foreground">
              <span>Today: {todayIntake.toLocaleString()} ml</span>
            </div>
          </div>

          {/* Actions */}
          <div className="relative mt-8 flex flex-col gap-2.5">
            <Button
              onClick={handleConfirm}
              className="w-full rounded-full bg-cyan-500 text-[#070b14] font-bold text-base h-12 hover:bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all active:scale-95"
            >
              <Droplets className="mr-2 size-5" />
              Confirm Drink
            </Button>
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="w-full rounded-full text-muted-foreground hover:text-foreground h-10"
            >
              Cancel
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
