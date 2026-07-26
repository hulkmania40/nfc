import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subDays,
} from "date-fns"

import type { HydrationTag, TimelineEntry, WaterLog } from "@/types/hydration"

const WEEK_STARTS_ON = 1

function toDate(value: string) {
  return parseISO(value)
}

function dayKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function formatMilliliters(amount: number) {
  return `${amount.toLocaleString()} ml`
}

export function getDailyTotal(logs: WaterLog[], date = new Date()) {
  return logs.reduce((sum, log) => (isSameDay(toDate(log.timestamp), date) ? sum + log.amount : sum), 0)
}

export function getLastDrink(logs: WaterLog[]) {
  return [...logs].sort((left, right) => toDate(left.timestamp).getTime() - toDate(right.timestamp).getTime()).at(-1)
}

export function getGoalCompletion(amount: number, goal: number) {
  if (goal <= 0) {
    return 0
  }

  return Math.min(100, Math.round((amount / goal) * 100))
}

export function getHydrationLevel(amount: number, goal: number) {
  return getGoalCompletion(amount, goal)
}

export function getTodayIntake(logs: WaterLog[]) {
  return getDailyTotal(logs, startOfToday())
}

export function getWeeklySeries(logs: WaterLog[], referenceDate = new Date()) {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: WEEK_STARTS_ON })
  return eachDayOfInterval({ start: weekStart, end: subDays(weekStart, -6) }).map((date) => ({
    date,
    key: dayKey(date),
    label: format(date, "EEE"),
    total: getDailyTotal(logs, date),
  }))
}

export function getMonthlyTotals(logs: WaterLog[], referenceDate = new Date()) {
  const monthStart = startOfMonth(referenceDate)
  const monthEnd = endOfMonth(referenceDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return {
    total: days.reduce((sum, date) => sum + getDailyTotal(logs, date), 0),
    days,
  }
}

export function getAverageIntake(logs: WaterLog[], days = 30) {
  if (days <= 0) {
    return 0
  }

  const totals = Array.from({ length: days }, (_, index) => getDailyTotal(logs, subDays(new Date(), index)))
  const total = totals.reduce((sum, value) => sum + value, 0)
  return Math.round(total / days)
}

function buildDailyMap(logs: WaterLog[]) {
  return logs.reduce<Record<string, number>>((map, log) => {
    const key = dayKey(toDate(log.timestamp))
    map[key] = (map[key] ?? 0) + log.amount
    return map
  }, {})
}

export function getCurrentStreak(logs: WaterLog[], goal: number, referenceDate = new Date()) {
  const dailyMap = buildDailyMap(logs)
  let streak = 0

  for (let offset = 0; offset < 365; offset += 1) {
    const date = subDays(referenceDate, offset)
    if ((dailyMap[dayKey(date)] ?? 0) < goal) {
      break
    }

    streak += 1
  }

  return streak
}

export function getLongestStreak(logs: WaterLog[], goal: number) {
  const dailyMap = buildDailyMap(logs)
  const dates = Object.keys(dailyMap).sort()

  let longest = 0
  let current = 0
  let previousDate: Date | null = null

  for (const key of dates) {
    const date = parseISO(key)
    const total = dailyMap[key] ?? 0

    if (total >= goal) {
      if (previousDate && Math.round((date.getTime() - previousDate.getTime()) / 86_400_000) === 1) {
        current += 1
      } else {
        current = 1
      }
      longest = Math.max(longest, current)
    } else {
      current = 0
    }

    previousDate = date
  }

  return longest
}

export function getTimelineForDate(logs: WaterLog[], tags: HydrationTag[], date: Date): TimelineEntry[] {
  const tagLookup = new Map(tags.map((tag) => [tag.id, tag.name]))

  return logs
    .filter((log) => isSameDay(toDate(log.timestamp), date))
    .sort((left, right) => toDate(left.timestamp).getTime() - toDate(right.timestamp).getTime())
    .map((log) => ({
      id: log.id,
      amount: log.amount,
      tagId: log.tagId,
      tagName: tagLookup.get(log.tagId) ?? "NFC tap",
      timestamp: log.timestamp,
    }))
}

export function buildMonthCalendar(referenceDate: Date, logs: WaterLog[], goal: number) {
  const monthStart = startOfMonth(referenceDate)
  const monthEnd = endOfMonth(referenceDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: WEEK_STARTS_ON })
  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd })

  return allDays.map((date) => {
    const total = getDailyTotal(logs, date)
    return {
      date,
      key: dayKey(date),
      inMonth: format(date, "MM") === format(referenceDate, "MM"),
      total,
      percentage: getGoalCompletion(total, goal),
    }
  })
}
