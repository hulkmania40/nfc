import { create } from "zustand"

import { DEFAULT_SETTINGS, hydrationRepository } from "@/services/hydration-repository"
import type { Settings } from "@/types/hydration"

type SettingsState = {
  settings: Settings
  setDailyGoal: (dailyGoal: number) => void
  setDefaultGlass: (defaultGlass: number) => void
  resetSettings: () => void
}

const initialSettings = hydrationRepository.getSettings()

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: initialSettings,
  setDailyGoal(dailyGoal) {
    set((state) => {
      const settings = { ...state.settings, dailyGoal: Math.max(1, Math.round(dailyGoal)) }
      hydrationRepository.saveSettings(settings)
      return { settings }
    })
  },
  setDefaultGlass(defaultGlass) {
    set((state) => {
      const settings = { ...state.settings, defaultGlass: Math.max(1, Math.round(defaultGlass)) }
      hydrationRepository.saveSettings(settings)
      return { settings }
    })
  },
  resetSettings() {
    set(() => {
      hydrationRepository.saveSettings(DEFAULT_SETTINGS)
      return { settings: DEFAULT_SETTINGS }
    })
  },
}))
