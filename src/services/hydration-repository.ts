import { generateReadableId, readStorageValue, removeStorageValue, writeStorageValue } from "@/storage/local-storage"
import type { HydrationTag, Settings, WaterLog } from "@/types/hydration"

export const STORAGE_KEYS = {
  settings: "settings",
  waterLogs: "water_logs",
  registeredTags: "registered_tags",
} as const

export const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 2500,
  defaultGlass: 250,
}

function coerceAmount(value: unknown, fallback: number) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return fallback
  }

  return Math.round(amount)
}

function normalizeSettings(settings: Partial<Settings> | null | undefined): Settings {
  return {
    dailyGoal: coerceAmount(settings?.dailyGoal, DEFAULT_SETTINGS.dailyGoal),
    defaultGlass: coerceAmount(settings?.defaultGlass, DEFAULT_SETTINGS.defaultGlass),
  }
}

function normalizeTag(tag: Partial<HydrationTag>): HydrationTag {
  return {
    id: String(tag.id ?? generateReadableId()),
    name: String(tag.name ?? "Unnamed tag").trim(),
    defaultAmount: coerceAmount(tag.defaultAmount, DEFAULT_SETTINGS.defaultGlass),
  }
}

function normalizeLog(log: Partial<WaterLog>): WaterLog {
  return {
    id: String(log.id ?? generateReadableId(10)),
    amount: coerceAmount(log.amount, DEFAULT_SETTINGS.defaultGlass),
    timestamp: String(log.timestamp ?? new Date().toISOString()),
    tagId: String(log.tagId ?? ""),
  }
}

export type HydrationRepository = {
  getSettings: () => Settings
  saveSettings: (settings: Settings) => void
  getTags: () => HydrationTag[]
  saveTags: (tags: HydrationTag[]) => void
  getLogs: () => WaterLog[]
  saveLogs: (logs: WaterLog[]) => void
  clearAll: () => void
  createTagId: () => string
}

export const hydrationRepository: HydrationRepository = {
  getSettings() {
    return normalizeSettings(readStorageValue<Partial<Settings> | null>(STORAGE_KEYS.settings, null))
  },
  saveSettings(settings) {
    writeStorageValue(STORAGE_KEYS.settings, normalizeSettings(settings))
  },
  getTags() {
    const tags = readStorageValue<Partial<HydrationTag>[]>(STORAGE_KEYS.registeredTags, [])
    return tags.map((tag) => normalizeTag(tag)).filter((tag) => tag.name.length > 0)
  },
  saveTags(tags) {
    writeStorageValue(STORAGE_KEYS.registeredTags, tags.map((tag) => normalizeTag(tag)))
  },
  getLogs() {
    const logs = readStorageValue<Partial<WaterLog>[]>(STORAGE_KEYS.waterLogs, [])
    return logs.map((log) => normalizeLog(log))
  },
  saveLogs(logs) {
    writeStorageValue(STORAGE_KEYS.waterLogs, logs.map((log) => normalizeLog(log)))
  },
  clearAll() {
    removeStorageValue(STORAGE_KEYS.settings)
    removeStorageValue(STORAGE_KEYS.waterLogs)
    removeStorageValue(STORAGE_KEYS.registeredTags)
  },
  createTagId() {
    return generateReadableId()
  },
}
