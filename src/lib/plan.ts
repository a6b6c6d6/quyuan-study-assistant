import type { SubjectKey } from '../types'
import { SUBJECTS } from '../data/subjects'

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

export function buildPlanBlocks(dailyHours: number): StudyBlock[] {
  const safeHours = Number.isFinite(dailyHours) && dailyHours > 0 ? dailyHours : 4
  const total = Math.max(STEP, Math.round((safeHours * 60) / STEP) * STEP)

  const minutes = SUBJECTS.map((subject) =>
    Math.max(0, Math.round((total * subject.ratio) / STEP) * STEP),
  )
  const diff = total - minutes.reduce((sum, value) => sum + value, 0)
  minutes[0] += diff

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
