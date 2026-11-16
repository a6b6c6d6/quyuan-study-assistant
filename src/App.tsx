import { useRef, useState } from 'react'
import { TabBar } from './components/TabBar'
import { TimerOverlay } from './components/TimerOverlay'
import { CalendarPage } from './pages/CalendarPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { PlanPage } from './pages/PlanPage'
import { TodayPage } from './pages/TodayPage'
import { StudyProvider } from './store/StudyContext'
import type { TabKey } from './types'

export default function App() {
  const [tab, setTab] = useState<TabKey>('today')
  const [timerOpen, setTimerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }

  const handleSaved = (seconds: number) => {
    setTimerOpen(false)
    if (seconds < 1) {
      showToast('本次没有可保存的计时')
      return
    }
    const minutes = Math.floor(seconds / 60)
    if (minutes < 1) {
      showToast(`已保存本次专注 ${seconds} 秒`)
      return
    }
    showToast(`已保存本次专注 ${minutes} 分钟`)
  }

  return (
    <StudyProvider>
      <div className="app-shell">
        <main className="app-main">
          {tab === 'today' ? <TodayPage onOpenTimer={() => setTimerOpen(true)} /> : null}
          {tab === 'calendar' ? <CalendarPage /> : null}
          {tab === 'plan' ? <PlanPage /> : null}
          {tab === 'experience' ? <ExperiencePage /> : null}
        </main>

        <TabBar value={tab} onChange={setTab} />

        {timerOpen ? (
          <TimerOverlay onClose={() => setTimerOpen(false)} onSaved={handleSaved} />
        ) : null}

        {toast ? (
          <div className="toast" role="status">
            {toast}
          </div>
        ) : null}
      </div>
    </StudyProvider>
  )
}
