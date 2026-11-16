import type { DailyTask } from '../types'

export function defaultTasks(date: string): DailyTask[] {
  return [
    { date, title: '高数', target: 1, unit: '题', progress: 0, completed: false },
    { date, title: '单词', target: 20, unit: '个', progress: 0, completed: false },
    { date, title: '政治', target: 5, unit: '题', progress: 0, completed: false },
  ]
}
