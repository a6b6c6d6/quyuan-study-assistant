import type { SubjectKey } from '../types'

export interface SubjectMeta {
  key: SubjectKey
  label: string
  color: string
}

export const SUBJECTS: SubjectMeta[] = [
  { key: 'math', label: '数学', color: '#1E3A34' },
  { key: 'english', label: '英语', color: '#6F8F72' },
  { key: 'politics', label: '政治', color: '#A8402F' },
  { key: 'major', label: '专业课', color: '#D9A441' },
]

export const DEFAULT_SUBJECT_RATIOS: Record<SubjectKey, number> = {
  math: 40,
  english: 25,
  politics: 15,
  major: 20,
}

export const SUBJECT_MAP: Record<SubjectKey, SubjectMeta> = SUBJECTS.reduce(
  (acc, subject) => {
    acc[subject.key] = subject
    return acc
  },
  {} as Record<SubjectKey, SubjectMeta>,
)
