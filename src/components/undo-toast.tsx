import { useEffect } from "react"
import { Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glass-card"
import { useHydrationStore } from "@/stores/hydration-store"

export function UndoToast() {
  const pendingUndo = useHydrationStore((state) => state.pendingUndo)
  const undoLastEntry = useHydrationStore((state) => state.undoLastEntry)
  const clearUndo = useHydrationStore((state) => state.clearUndo)

  useEffect(() => {
    if (pendingUndo === null) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      clearUndo()
    }, Math.max(0, pendingUndo.expiresAt - Date.now()))

    return () => {
      window.clearTimeout(timeout)
    }
  }, [clearUndo, pendingUndo])

  return (
    pendingUndo !== null ? (
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          <GlassCard className="pointer-events-auto flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Added {pendingUndo.amount}ml</p>
              <p className="text-sm text-slate-600">Undo available for 5 seconds.</p>
            </div>
            <Button variant="secondary" className="rounded-full px-4" onClick={undoLastEntry}>
              <Undo2 className="size-4" />
              Undo
            </Button>
          </GlassCard>
        </div>
      </div>
    ) : null
  )
}
