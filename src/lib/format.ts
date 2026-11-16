const pad = (value: number) => String(value).padStart(2, '0')

export function formatClock(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function formatMinutes(totalMinutes: number): string {
  const safe = Math.max(0, Math.round(totalMinutes))
  if (safe < 60) return `${safe} 分钟`
  const hours = Math.floor(safe / 60)
  const minutes = safe % 60
  return minutes ? `${hours} 小时 ${minutes} 分` : `${hours} 小时`
}

export function formatFocusMinutes(seconds: number): string {
  if (seconds <= 0) return '0 分钟'
  if (seconds < 60) return '不足 1 分钟'
  return formatMinutes(seconds / 60)
}

export function minutesToClock(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${pad(hours)}:${pad(minutes)}`
}

export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
