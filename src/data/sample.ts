import type { StudySession, StudyState, SubjectKey } from '../types'
import { addDays, dateKey, todayKey } from '../lib/date'
import { uid } from '../lib/format'
import { defaultTasks } from './tasks'

function makeSession(subject: SubjectKey, minutes: number, endedAt: number): StudySession {
  return {
    id: uid(),
    subject,
    startedAt: endedAt - minutes * 60000,
    endedAt,
    durationSec: minutes * 60,
  }
}

export function createSampleState(): StudyState {
  const today = new Date()
  const key = todayKey()
  const dayStart = new Date(today)
  dayStart.setHours(0, 0, 0, 0)
  const noon = dayStart.getTime() + 12 * 3600000

  const sessions: StudySession[] = [
    makeSession('math', 40, noon),
    makeSession('english', 25, noon + 50 * 60000),
    makeSession('politics', 15, noon + 80 * 60000),
  ]

  const checkins = [{ date: key, minutes: 80 }]

  const pastDays = [
    { offset: -1, minutes: 65 },
    { offset: -2, minutes: 40 },
    { offset: -3, minutes: 55 },
  ]

  pastDays.forEach((item) => {
    const day = addDays(today, item.offset)
    const end = new Date(day)
    end.setHours(21, 30, 0, 0)
    const mathMinutes = Math.round(item.minutes * 0.6)
    const englishMinutes = item.minutes - mathMinutes
    sessions.push(makeSession('math', mathMinutes, end.getTime()))
    sessions.push(makeSession('english', englishMinutes, end.getTime() - mathMinutes * 60000))
    checkins.push({ date: dateKey(day), minutes: item.minutes })
  })

  const tasks = defaultTasks(key).map((task, index) => {
    if (index === 0) return { ...task, progress: 1, completed: true }
    if (index === 1) return { ...task, progress: 12 }
    return { ...task, progress: 3 }
  })

  return {
    settings: {
      examName: '2028 考研',
      examDate: '2027-12-18',
      dailyHours: 4,
      subjectRatios: { math: 40, english: 25, politics: 15, major: 20 },
    },
    sessions,
    tasks,
    checkins,
    bookmarks: [],
    running: null,
    sample: true,
  }
}
