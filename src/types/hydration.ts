export type Settings = {
  dailyGoal: number
  defaultGlass: number
}

export type HydrationTag = {
  id: string
  name: string
  defaultAmount: number
}

export type WaterLog = {
  id: string
  amount: number
  timestamp: string
  tagId: string
}

export type TimelineEntry = {
  id: string
  amount: number
  tagId: string
  tagName: string
  timestamp: string
}

export type CalendarDay = {
  date: Date
  key: string
  inMonth: boolean
  total: number
  percentage: number
}
