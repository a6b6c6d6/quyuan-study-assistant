import type { SubjectKey } from '../types'

export interface SubjectMeta {
  key: SubjectKey
  label: string
  color: string
  ratio: number
}

export const SUBJECTS: SubjectMeta[] = [
  { key: 'math', label: '数学', color: '#1E3A34', ratio: 0.4 },
  { key: 'english', label: '英语', color: '#6F8F72', ratio: 0.25 },
  { key: 'politics', label: '政治', color: '#A8402F', ratio: 0.15 },
  { key: 'major', label: '专业课', color: '#D9A441', ratio: 0.2 },
]

export const SUBJECT_MAP: Record<SubjectKey, SubjectMeta> = SUBJECTS.reduce(
  (acc, subject) => {
    acc[subject.key] = subject
    return acc
  },
  {} as Record<SubjectKey, SubjectMeta>,
)
