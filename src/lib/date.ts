const pad = (value: number) => String(value).padStart(2, '0')

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayKey(): string {
  return dateKey(new Date())
}

export function fromKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function isSameMonth(key: string, year: number, month: number): boolean {
  return key.startsWith(`${year}-${pad(month + 1)}`)
}

export function startOfWeek(date: Date): Date {
  const next = new Date(date)
  const offset = (next.getDay() + 6) % 7
  next.setDate(next.getDate() - offset)
  next.setHours(0, 0, 0, 0)
  return next
}

export function daysUntil(dateStr: string): number {
  const target = fromKey(dateStr)
  if (Number.isNaN(target.getTime())) return 0
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - start.getTime()) / 86400000)
}

export function weekdayLabel(date: Date): string {
  return WEEKDAYS[date.getDay()]
}

export function formatDateLabel(key: string): string {
  const date = fromKey(key)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdayLabel(date)}`
}

export function formatMonthDay(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function monthKey(year: number, month: number): string {
  return `${year}-${pad(month + 1)}`
}
