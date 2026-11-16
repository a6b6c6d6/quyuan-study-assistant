import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Checkin, Settings, StudySession, StudyState, SubjectKey } from '../types'
import { addDays, dateKey, fromKey, startOfWeek, todayKey } from '../lib/date'
import { uid } from '../lib/format'
import { normalizeSubjectRatios } from '../lib/plan'
import { defaultTasks } from '../data/tasks'
import { SUBJECTS } from '../data/subjects'
import { createSampleState } from '../data/sample'

const STORAGE_KEY = 'quyuan-study-v1'

function createEmptyState(settings?: Partial<Settings>): StudyState {
  const date = todayKey()
  return {
    settings: {
      examName: '2028 考研',
      examDate: '2027-12-18',
      dailyHours: 4,
      ...settings,
      subjectRatios: normalizeSubjectRatios(settings?.subjectRatios),
    },
    sessions: [],
    tasks: defaultTasks(date),
    checkins: [],
    bookmarks: [],
    running: null,
    sample: false,
  }
}

function loadState(): StudyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyState()
    const saved = JSON.parse(raw) as Partial<StudyState>
    const base = createEmptyState(saved.settings)
    return {
      ...base,
      ...saved,
      settings: {
        ...base.settings,
        ...(saved.settings ?? {}),
        subjectRatios: normalizeSubjectRatios(saved.settings?.subjectRatios),
      },
      sessions: Array.isArray(saved.sessions) ? saved.sessions : [],
      tasks: Array.isArray(saved.tasks) ? saved.tasks : base.tasks,
      checkins: Array.isArray(saved.checkins) ? saved.checkins : [],
      bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks : [],
      running: saved.running && typeof saved.running === 'object' ? saved.running : null,
      sample: Boolean(saved.sample),
    }
  } catch {
    return createEmptyState()
  }
}

function emptySubjectMap(): Record<SubjectKey, number> {
  return SUBJECTS.reduce(
    (acc, subject) => {
      acc[subject.key] = 0
      return acc
    },
    {} as Record<SubjectKey, number>,
  )
}

interface StudyContextValue {
  state: StudyState
  today: string
  elapsedSec: number
  todaySeconds: number
  todayMinutes: number
  todayBySubject: Record<SubjectKey, number>
  weekMinutes: number
  streak: number
  startTimer: (subject: SubjectKey) => void
  pauseTimer: () => void
  resumeTimer: () => void
  endTimer: () => void
  toggleTask: (date: string, index: number) => void
  updateSettings: (patch: Partial<Settings>) => void
  toggleBookmark: (id: string) => void
  loadSample: () => void
  clearAll: () => void
}

const StudyContext = createContext<StudyContextValue | null>(null)

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudyState>(loadState)
  const [today, setToday] = useState<string>(() => todayKey())
  const [nowMs, setNowMs] = useState<number>(() => Date.now())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* 存储不可用时保持内存状态 */
    }
  }, [state])

  // 跨天时刷新 today，并补齐当天的固定任务
  useEffect(() => {
    const timer = window.setInterval(() => {
      const key = todayKey()
      setToday((prev) => (prev === key ? prev : key))
      setNowMs(Date.now())
    }, 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setState((prev) => {
      if (prev.tasks.some((task) => task.date === today)) return prev
      return { ...prev, tasks: [...prev.tasks, ...defaultTasks(today)] }
    })
  }, [today])

  const runningStart = state.running?.startedAt ?? null

  useEffect(() => {
    if (!runningStart) return
    setNowMs(Date.now())
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [runningStart])

  const elapsedSec = state.running
    ? state.running.accumulatedSec +
      (state.running.startedAt
        ? Math.max(0, Math.floor((nowMs - state.running.startedAt) / 1000))
        : 0)
    : 0

  const todaySessions = state.sessions.filter(
    (session) => dateKey(new Date(session.endedAt)) === today,
  )
  const todaySeconds = todaySessions.reduce((sum, session) => sum + session.durationSec, 0)
  const todayMinutes = Math.round(todaySeconds / 60)

  const todayBySubject = emptySubjectMap()
  todaySessions.forEach((session) => {
    todayBySubject[session.subject] += session.durationSec / 60
  })

  const weekStart = startOfWeek(fromKey(today))
  const weekEnd = addDays(weekStart, 7)
  const weekSeconds = state.sessions
    .filter((session) => {
      const ended = new Date(session.endedAt)
      return ended >= weekStart && ended < weekEnd
    })
    .reduce((sum, session) => sum + session.durationSec, 0)
  const weekMinutes = Math.round(weekSeconds / 60)

  const checkedDates = new Set(state.checkins.map((item) => item.date))
  let streakCursor = fromKey(today)
  if (!checkedDates.has(today)) {
    streakCursor = addDays(streakCursor, -1)
  }
  let streak = 0
  while (checkedDates.has(dateKey(streakCursor))) {
    streak += 1
    streakCursor = addDays(streakCursor, -1)
  }

  const startTimer = useCallback((subject: SubjectKey) => {
    setState((prev) => {
      if (prev.running) return prev
      const now = Date.now()
      return {
        ...prev,
        running: { subject, accumulatedSec: 0, startedAt: now, sessionStart: now },
      }
    })
    setNowMs(Date.now())
  }, [])

  const pauseTimer = useCallback(() => {
    setState((prev) => {
      if (!prev.running || !prev.running.startedAt) return prev
      const extra = Math.max(0, Math.floor((Date.now() - prev.running.startedAt) / 1000))
      return {
        ...prev,
        running: {
          ...prev.running,
          accumulatedSec: prev.running.accumulatedSec + extra,
          startedAt: null,
        },
      }
    })
  }, [])

  const resumeTimer = useCallback(() => {
    setState((prev) => {
      if (!prev.running || prev.running.startedAt) return prev
      return { ...prev, running: { ...prev.running, startedAt: Date.now() } }
    })
    setNowMs(Date.now())
  }, [])

  const endTimer = useCallback(() => {
    setState((prev) => {
      if (!prev.running) return prev
      const running = prev.running
      const extra = running.startedAt
        ? Math.max(0, Math.floor((Date.now() - running.startedAt) / 1000))
        : 0
      const durationSec = running.accumulatedSec + extra
      const endedAt = Date.now()
      if (durationSec < 1) {
        return { ...prev, running: null }
      }

      const session: StudySession = {
        id: uid(),
        subject: running.subject,
        startedAt: running.sessionStart,
        endedAt,
        durationSec,
      }
      const sessions = [...prev.sessions, session]
      const day = dateKey(new Date(endedAt))
      const minutes = Math.round(
        sessions
          .filter((item) => dateKey(new Date(item.endedAt)) === day)
          .reduce((sum, item) => sum + item.durationSec, 0) / 60,
      )

      const checkins: Checkin[] = prev.checkins.map((item) => ({ ...item }))
      const index = checkins.findIndex((item) => item.date === day)
      if (minutes >= 25) {
        if (index >= 0) checkins[index] = { date: day, minutes }
        else checkins.push({ date: day, minutes })
      }

      return { ...prev, sessions, checkins, running: null }
    })
  }, [])

  const toggleTask = useCallback((date: string, index: number) => {
    setState((prev) => {
      const dayTasks = prev.tasks.filter((task) => task.date === date)
      const target = dayTasks[index]
      if (!target) return prev
      const nextTask = {
        ...target,
        completed: !target.completed,
        progress: target.completed ? 0 : target.target,
      }
      return {
        ...prev,
        tasks: prev.tasks.map((task) => (task === target ? nextTask : task)),
      }
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
  }, [])

  const toggleBookmark = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(id)
        ? prev.bookmarks.filter((item) => item !== id)
        : [...prev.bookmarks, id],
    }))
  }, [])

  const loadSample = useCallback(() => {
    setState(createSampleState())
  }, [])

  const clearAll = useCallback(() => {
    setState(createEmptyState())
  }, [])

  const value: StudyContextValue = {
    state,
    today,
    elapsedSec,
    todaySeconds,
    todayMinutes,
    todayBySubject,
    weekMinutes,
    streak,
    startTimer,
    pauseTimer,
    resumeTimer,
    endTimer,
    toggleTask,
    updateSettings,
    toggleBookmark,
    loadSample,
    clearAll,
  }

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}

export function useStudy(): StudyContextValue {
  const context = useContext(StudyContext)
  if (!context) throw new Error('useStudy 必须在 StudyProvider 内使用')
  return context
}
