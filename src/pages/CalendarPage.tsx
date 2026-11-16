import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, GinkgoLeaf } from '../components/Icons'
import { Stamp } from '../components/Stamp'
import { SUBJECTS } from '../data/subjects'
import { dateKey, formatDateLabel, fromKey, monthKey } from '../lib/date'
import { formatFocusMinutes } from '../lib/format'
import { useStudy } from '../store/StudyContext'

const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日']

export function CalendarPage() {
  const { state, today, todaySeconds, streak } = useStudy()
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [selected, setSelected] = useState(today)

  const checked = new Set(state.checkins.map((item) => item.date))
  const monthPrefix = monthKey(cursor.year, cursor.month)
  const monthCheckins = state.checkins.filter((item) => item.date.startsWith(monthPrefix)).length

  const firstDay = new Date(cursor.year, cursor.month, 1)
  const leading = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()

  const cells: (string | null)[] = []
  for (let i = 0; i < leading; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(dateKey(new Date(cursor.year, cursor.month, day)))
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const changeMonth = (delta: number) => {
    const next = new Date(cursor.year, cursor.month + delta, 1)
    setCursor({ year: next.getFullYear(), month: next.getMonth() })
  }

  const selectedSessions = state.sessions.filter(
    (session) => dateKey(new Date(session.endedAt)) === selected,
  )
  const selectedSeconds = selectedSessions.reduce(
    (sum, session) => sum + session.durationSec,
    0,
  )
  const selectedTotal = selectedSeconds > 0 ? Math.round(selectedSeconds / 60) : 0
  const selectedBySubject = SUBJECTS.map((subject) => {
    const seconds = selectedSessions
      .filter((session) => session.subject === subject.key)
      .reduce((sum, session) => sum + session.durationSec, 0)
    return { ...subject, seconds }
  }).filter((subject) => subject.seconds > 0)
  const maxSeconds = Math.max(1, ...selectedBySubject.map((subject) => subject.seconds))
  const selectedTasks = state.tasks.filter((task) => task.date === selected)
  const doneTasks = selectedTasks.filter((task) => task.completed).length

  return (
    <div className="page calendar-page">
      <header className="page-head">
        <div>
          <h1 className="page-title">打卡日历</h1>
          <p className="page-sub">银杏叶落处，是坚持过的一天</p>
        </div>
        <Stamp small />
      </header>

      <div className="stats stats-2">
        <div className="card stat">
          <p className="stat-value">
            {streak}
            <span className="stat-unit">天</span>
          </p>
          <p className="stat-label">当前连续</p>
        </div>
        <div className="card stat">
          <p className="stat-value">
            {monthCheckins}
            <span className="stat-unit">天</span>
          </p>
          <p className="stat-label">本月打卡</p>
        </div>
      </div>

      {!checked.has(today) ? (
        <div className="cal-hint">
          <GinkgoLeaf size={14} />
          <span>完成 25 分钟自动打卡</span>
          <span className="cal-hint-num">今日已专注 {formatFocusMinutes(todaySeconds)}</span>
        </div>
      ) : null}

      <section className="card cal-card">
        <div className="cal-nav">
          <button type="button" className="icon-btn" onClick={() => changeMonth(-1)} aria-label="上个月">
            <ChevronLeftIcon />
          </button>
          <p className="cal-month">
            {cursor.year} 年 {cursor.month + 1} 月
          </p>
          <button type="button" className="icon-btn" onClick={() => changeMonth(1)} aria-label="下个月">
            <ChevronRightIcon />
          </button>
        </div>

        <div className="cal-weekdays">
          {WEEK_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="cal-grid">
          {cells.map((key, index) => {
            if (!key) return <span key={`blank-${index}`} className="cal-blank" aria-hidden="true" />
            const classes = ['cal-cell']
            if (checked.has(key)) classes.push('is-checked')
            if (key === today) classes.push('is-today')
            if (key === selected) classes.push('is-selected')
            return (
              <button
                key={key}
                type="button"
                className={classes.join(' ')}
                onClick={() => setSelected(key)}
                aria-label={formatDateLabel(key)}
                aria-pressed={key === selected}
              >
                <span className="cal-day">{fromKey(key).getDate()}</span>
                {checked.has(key) ? <GinkgoLeaf size={11} className="cal-leaf" /> : null}
              </button>
            )
          })}
        </div>

        <p className="cal-legend">
          <GinkgoLeaf size={12} />
          银杏叶为已打卡 · 点击日期查看明细
        </p>
      </section>

      <section className="card cal-detail">
        <div className="card-title-row">
          <h2 className="card-title">{formatDateLabel(selected)}</h2>
          <span className={checked.has(selected) ? 'detail-badge is-on' : 'detail-badge'}>
            {checked.has(selected) ? '已打卡' : '未打卡'}
          </span>
        </div>

        <p className="detail-total">
          {selectedSeconds <= 0 ? (
            '这天还没有专注记录'
          ) : selectedSeconds < 60 ? (
            <>
              专注 <strong>不足 1 分钟</strong>
            </>
          ) : (
            <>
              专注 <strong>{selectedTotal}</strong> 分钟
            </>
          )}
        </p>

        {selectedBySubject.length > 0 ? (
          <div className="detail-bars">
            {selectedBySubject.map((subject) => (
              <div className="detail-row" key={subject.key}>
                <span className="detail-label">{subject.label}</span>
                <span className="bar-track">
                  <span
                    className="bar-fill"
                    style={{
                      width: `${(subject.seconds / maxSeconds) * 100}%`,
                      background: subject.color,
                    }}
                  />
                </span>
                <span className="detail-minutes">
                  {subject.seconds < 60
                    ? '不足 1 分钟'
                    : `${Math.round(subject.seconds / 60)} 分`}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {selectedTasks.length > 0 ? (
          <p className="detail-tasks">
            当天任务完成 {doneTasks}/{selectedTasks.length}
          </p>
        ) : null}
      </section>
    </div>
  )
}
