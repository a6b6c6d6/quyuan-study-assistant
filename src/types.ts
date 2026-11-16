export type SubjectKey = 'math' | 'english' | 'politics' | 'major'

export type TabKey = 'today' | 'calendar' | 'plan' | 'experience'

export interface Settings {
  examName: string
  examDate: string
  dailyHours: number
}

export interface StudySession {
  id: string
  subject: SubjectKey
  startedAt: number
  endedAt: number
  durationSec: number
}

export interface DailyTask {
  date: string
  title: string
  target: number
  unit: string
  progress: number
  completed: boolean
}

export interface Checkin {
  date: string
  minutes: number
}

export interface RunningTimer {
  subject: SubjectKey
  /** 已暂停时累计的秒数 */
  accumulatedSec: number
  /** 本次继续计时的起点；暂停时为 null */
  startedAt: number | null
  /** 本次会话最初开始时间 */
  sessionStart: number
}

export interface StudyState {
  settings: Settings
  sessions: StudySession[]
  tasks: DailyTask[]
  checkins: Checkin[]
  bookmarks: string[]
  running: RunningTimer | null
  sample: boolean
}
