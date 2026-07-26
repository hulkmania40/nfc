import { create } from "zustand"

import { hydrationRepository } from "@/services/hydration-repository"
import type { WaterLog } from "@/types/hydration"

type AddWaterInput = {
  amount: number
  tagId: string
}

type UndoState = {
  logId: string
  amount: number
  expiresAt: number
} | null

type HydrationState = {
  logs: WaterLog[]
  pendingUndo: UndoState
  addWater: (input: AddWaterInput) => WaterLog
  deleteWaterLog: (logId: string) => void
  undoLastEntry: () => void
  clearUndo: () => void
  resetLogs: () => void
  getLastLog: () => WaterLog | undefined
}

const initialLogs = hydrationRepository.getLogs()

export const useHydrationStore = create<HydrationState>((set, get) => ({
  logs: initialLogs,
  pendingUndo: null,
  addWater(input) {
    const log: WaterLog = {
      id: hydrationRepository.createTagId(),
      amount: Math.max(1, Math.round(input.amount)),
      timestamp: new Date().toISOString(),
      tagId: input.tagId,
    }

    set((state) => {
      const logs = [...state.logs, log]
      hydrationRepository.saveLogs(logs)
      return {
        logs,
        pendingUndo: {
          logId: log.id,
          amount: log.amount,
          expiresAt: Date.now() + 5000,
        },
      }
    })

    return log
  },
  deleteWaterLog(logId) {
    set((state) => {
      const logs = state.logs.filter((log) => log.id !== logId)
      hydrationRepository.saveLogs(logs)
      return { logs }
    })
  },
  undoLastEntry() {
    const pendingUndo = get().pendingUndo
    if (!pendingUndo) {
      return
    }

    set((state) => {
      const logs = state.logs.filter((log) => log.id !== pendingUndo.logId)
      hydrationRepository.saveLogs(logs)
      return {
        logs,
        pendingUndo: null,
      }
    })
  },
  clearUndo() {
    set({ pendingUndo: null })
  },
  resetLogs() {
    set(() => {
      hydrationRepository.saveLogs([])
      return {
        logs: [],
        pendingUndo: null,
      }
    })
  },
  getLastLog() {
    return [...get().logs].sort((left, right) => left.timestamp.localeCompare(right.timestamp)).at(-1)
  },
}))
