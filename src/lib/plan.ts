import type { SubjectKey } from '../types'
import { DEFAULT_SUBJECT_RATIOS, SUBJECTS } from '../data/subjects'

export interface StudyBlock {
  key: SubjectKey
  label: string
  color: string
  minutes: number
  startMin: number
  endMin: number
}

const STEP = 15
const START_MIN = 8 * 60

export function normalizeSubjectRatios(value: unknown): Record<SubjectKey, number> {
  const ratios: Record<SubjectKey, number> = { ...DEFAULT_SUBJECT_RATIOS }
  if (!value || typeof value !== 'object') return ratios

  SUBJECTS.forEach((subject) => {
    const raw = (value as Record<string, unknown>)[subject.key]
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      ratios[subject.key] = Math.min(100, Math.max(0, Math.round(raw)))
    }
  })

  return ratios
}

function resolveRatios(
  subjectRatios?: Record<SubjectKey, number> | null,
): Record<SubjectKey, number> {
  if (!subjectRatios || typeof subjectRatios !== 'object') {
    return { ...DEFAULT_SUBJECT_RATIOS }
  }

  let total = 0
  for (const subject of SUBJECTS) {
    const value = subjectRatios[subject.key]
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      return { ...DEFAULT_SUBJECT_RATIOS }
    }
    total += value
  }

  if (total !== 100) return { ...DEFAULT_SUBJECT_RATIOS }
  return subjectRatios
}

export function buildPlanBlocks(
  dailyHours: number,
  subjectRatios?: Record<SubjectKey, number> | null,
): StudyBlock[] {
  const ratios = resolveRatios(subjectRatios)
  const safeHours = Number.isFinite(dailyHours) && dailyHours > 0 ? dailyHours : 4
  const total = Math.max(STEP, Math.round((safeHours * 60) / STEP) * STEP)

  const minutes = SUBJECTS.map((subject) =>
    Math.max(0, Math.round((total * ratios[subject.key]) / 100 / STEP) * STEP),
  )

  const diff = total - minutes.reduce((sum, value) => sum + value, 0)

  if (diff > 0) {
    let targetIndex = -1
    let targetRatio = 0
    SUBJECTS.forEach((subject, index) => {
      const ratio = ratios[subject.key]
      if (ratio > targetRatio) {
        targetRatio = ratio
        targetIndex = index
      }
    })
    if (targetIndex >= 0) minutes[targetIndex] += diff
  } else if (diff < 0) {
    let remaining = -diff
    const order = SUBJECTS.map((subject, index) => ({
      index,
      ratio: ratios[subject.key],
    }))
      .filter((item) => item.ratio > 0)
      .sort((a, b) => b.ratio - a.ratio)

    for (const item of order) {
      if (remaining <= 0) break
      const take = Math.min(minutes[item.index], remaining)
      minutes[item.index] -= take
      remaining -= take
    }
  }

  let cursor = START_MIN
  return SUBJECTS.map((subject, index) => {
    const block = {
      key: subject.key,
      label: subject.label,
      color: subject.color,
      minutes: minutes[index],
      startMin: cursor,
      endMin: cursor + minutes[index],
    }
    cursor += minutes[index]
    return block
  })
}
