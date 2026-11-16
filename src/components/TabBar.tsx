import type { ReactNode } from 'react'
import type { TabKey } from '../types'
import {
  CalendarIcon,
  ExperienceIcon,
  PlanIcon,
  TodayIcon,
} from './Icons'

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: 'today', label: '今日', icon: <TodayIcon /> },
  { key: 'calendar', label: '日历', icon: <CalendarIcon /> },
  { key: 'plan', label: '计划', icon: <PlanIcon /> },
  { key: 'experience', label: '经验', icon: <ExperienceIcon /> },
]

interface TabBarProps {
  value: TabKey
  onChange: (tab: TabKey) => void
}

export function TabBar({ value, onChange }: TabBarProps) {
  return (
    <nav className="tabbar" aria-label="主导航">
      {TABS.map((tab) => {
        const active = tab.key === value
        return (
          <button
            key={tab.key}
            type="button"
            className={active ? 'tabbar-item is-active' : 'tabbar-item'}
            onClick={() => onChange(tab.key)}
            aria-current={active ? 'page' : undefined}
          >
            <span className="tabbar-icon">{tab.icon}</span>
            <span className="tabbar-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
