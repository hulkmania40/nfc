import { useMemo, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Droplets, Sparkles, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { AnimatedCounter } from "@/components/animated-counter"
import { ConfirmationSheet } from "@/components/confirmation-sheet"
import { Button } from "@/components/ui/button"
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
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Sparkles className="size-8" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
            Tag Not Found
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This NFC sticker hasn't been registered yet. Please set it up in settings first.
          </p>
          <Button 
            onClick={() => navigate("/settings")} 
            className="mt-6 w-full rounded-full"
          >
            Go to Settings
          </Button>
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

  // Check for double tap protection
  const lastDrink = useMemo(() => getLastDrink(logs), [logs])
  const timeSinceLastDrink = useMemo(() => {
    if (!lastDrink) return Infinity
    return Date.now() - new Date(lastDrink.timestamp).getTime()
  }, [lastDrink])
  
  const isRecentLog = timeSinceLastDrink < 3000 // 3 seconds cooldown
  const [allowOverride, setAllowOverride] = useState(false)

  // Auto-show confirmation on mount
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
      
      // Show success state
      setTimeout(() => {
        navigate("/dashboard")
      }, 1200)
    } catch (err) {
      setError("Failed to log hydration. Please try again.")
      setIsLogging(false)
    }
  }

  const handleCancel = () => {
    navigate("/dashboard")
  }

  const handleOverride = () => {
    setAllowOverride(true)
    setShowConfirmation(true)
  }

  // Loading state
  if (isLogging) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
        <div className="w-[min(92vw,28rem)] rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8">
          <div className="relative mx-auto flex size-24 items-center justify-center rounded-full bg-cyan-50">
            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/20" />
            <Droplets className="size-10 text-cyan-500" />
          </div>
          
          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium uppercase tracking-wider text-cyan-600">
              Logging...
            </p>
            <AnimatedCounter 
              value={loggedAmount} 
              className="text-4xl font-semibold text-slate-900 sm:text-5xl" 
              suffix=" ml"
            />
            <p className="text-sm text-slate-400">{tagName}</p>
          </div>

          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-full animate-[progress_1.2s_ease-in-out] rounded-full bg-linear-to-r from-cyan-400 to-cyan-600" />
          </div>
          
          <p className="mt-4 text-xs text-slate-400">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-red-800">Oops!</h2>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Button 
            onClick={() => setError(null)} 
            className="mt-6 w-full rounded-full"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Double tap protection
  if (isRecentLog && !allowOverride && !showConfirmation) {
    return (
      <div className="flex min-h-svh items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Clock className="size-8" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Too Soon!
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            You just logged a drink {formatDistanceToNow(new Date(lastDrink?.timestamp ?? 0))} ago.
            This prevents accidental double-taps.
          </p>
          <div className="mt-6 space-y-3">
            <Button 
              onClick={handleOverride} 
              className="w-full rounded-full"
            >
              Log Anyway
            </Button>
            <Button 
              onClick={handleCancel} 
              variant="outline" 
              className="w-full rounded-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Main confirmation sheet
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-8">
      <ConfirmationSheet
        title="Log Hydration"
        amountLabel={`${defaultAmount.toLocaleString()} ml`}
        description={`Tap to log ${tagName}`}
        confirmLabel="Confirm"
        secondaryLabel="Cancel"
        isOpen={showConfirmation}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        extraInfo={
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span>Today: {todayIntake.toLocaleString()} ml</span>
            <span className="h-4 w-px bg-slate-200" />
            <span>{tagName}</span>
          </div>
        }
      />
    </div>
  )
}