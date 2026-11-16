import { CheckIcon, GinkgoLeaf } from '../components/Icons'
import { ArchOrnament } from '../components/Ornaments'
import { DonutChart } from '../components/DonutChart'
import { Stamp } from '../components/Stamp'
import { TimerRing } from '../components/TimerRing'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { daysUntil, formatMonthDay, weekdayLabel } from '../lib/date'
import { formatFocusMinutes } from '../lib/format'
import { useStudy } from '../store/StudyContext'

interface TodayPageProps {
  onOpenTimer: () => void
}

export function TodayPage({ onOpenTimer }: TodayPageProps) {
  const {
    state,
    today,
    elapsedSec,
    todaySeconds,
    todayMinutes,
    todayBySubject,
    weekMinutes,
    streak,
    toggleTask,
    loadSample,
    clearAll,
  } = useStudy()

  const now = new Date()
  const countdown = daysUntil(state.settings.examDate)
  const todayTasks = state.tasks.filter((task) => task.date === today)
  const doneCount = todayTasks.filter((task) => task.completed).length
  const running = state.running
  const dailyGoal = Math.max(30, state.settings.dailyHours * 60)
  const hasTodayFocus = todaySeconds > 0
  const shortTodayFocus = hasTodayFocus && todaySeconds < 60
  const ringProgress = running
    ? Math.min(1, elapsedSec / 3600)
    : Math.min(1, todaySeconds / (dailyGoal * 60))
  const hasRecords = state.sessions.length > 0 || state.checkins.length > 0

  const donutData = SUBJECTS.map((subject) => ({
    key: subject.key,
    label: subject.label,
    color: subject.color,
    minutes: todayBySubject[subject.key],
  }))

  return (
    <div className="page today-page">
      <header className="today-head">
        <div>
          <div className="brand-line">
            <h1 className="today-title">曲园自习</h1>
            <Stamp />
          </div>
          <p className="today-sub">曲阜师范大学 · 考研备考手账</p>
        </div>
        <div className="today-date">
          <span className="date-strong">{formatMonthDay(now)}</span>
          <span>{weekdayLabel(now)}</span>
        </div>
      </header>

      {state.sample ? (
        <div className="sample-banner">
          <span>当前为示例数据 · 仅用于演示</span>
          <button type="button" className="text-btn" onClick={clearAll}>
            清空
          </button>
        </div>
      ) : null}

      <section className="card countdown-card">
        <ArchOrnament className="arch-bg" />
        <div>
          <p className="countdown-label">距离 {state.settings.examName || '目标考试'}</p>
          <p className="countdown-value">
            {Math.max(0, countdown)}
            <small>天</small>
          </p>
        </div>
        <div className="countdown-meta">
          <span className="meta-label">考试日</span>
          <strong>{state.settings.examDate || '未设置'}</strong>
          <span className="meta-label">每天 {state.settings.dailyHours} 小时</span>
        </div>
      </section>

      <section className="timer-block">
        <TimerRing
          seconds={running ? elapsedSec : todaySeconds}
          progress={ringProgress}
          status={
            running
              ? running.startedAt
                ? '正在专注'
                : '已暂停'
              : hasTodayFocus
                ? '今日累计'
                : '今日专注'
          }
          footnote={
            running
              ? `${SUBJECT_MAP[running.subject].label} · 点击下方继续`
              : hasTodayFocus
                ? `今日已专注 ${formatFocusMinutes(todaySeconds)}`
                : '25 分钟自动打卡'
          }
        />
        <button type="button" className="btn btn-primary btn-start" onClick={onOpenTimer}>
          {running ? '继续自习' : '开始自习'}
        </button>
      </section>

      <div className="stats">
        <div className="card stat">
          <p className="stat-value">
            {shortTodayFocus ? '不足 1' : todayMinutes}
            <span className="stat-unit">分钟</span>
          </p>
          <p className="stat-label">今日专注</p>
        </div>
        <div className="card stat">
          <p className="stat-value">
            {streak}
            <span className="stat-unit">天</span>
          </p>
          <p className="stat-label">连续打卡</p>
        </div>
        <div className="card stat">
          <p className="stat-value">
            {weekMinutes}
            <span className="stat-unit">分钟</span>
          </p>
          <p className="stat-label">本周累计</p>
        </div>
      </div>

      <section className="card task-card">
        <div className="card-title-row">
          <h2 className="card-title">今日三件小事</h2>
          <span className="card-note">
            {doneCount}/{todayTasks.length} 完成
          </span>
        </div>
        <div className="task-list">
          {todayTasks.map((task, index) => (
            <button
              key={`${task.date}-${task.title}`}
              type="button"
              className={task.completed ? 'task-row is-done' : 'task-row'}
              onClick={() => toggleTask(today, index)}
              aria-pressed={task.completed}
            >
              <span className="task-check">{task.completed ? <CheckIcon /> : null}</span>
              <span className="task-name">{task.title}</span>
              <span className="task-progress">
                {task.progress}/{task.target} {task.unit}
              </span>
            </button>
          ))}
        </div>
        <p className="task-foot">完成后轻点勾选，刷新后仍会保留。</p>
      </section>

      <section className="card donut-card">
        <div className="card-title-row">
          <h2 className="card-title">今日专注分布</h2>
          <span className="card-note">按科目时长</span>
        </div>
        <DonutChart data={donutData} />
      </section>

      {!hasRecords ? (
        <section className="empty-card">
          <GinkgoLeaf size={26} className="empty-leaf" />
          <p className="empty-title">还没有专注记录</p>
          <p className="empty-text">
            开始一次自习，或者先载入示例数据，看看完整的打卡与图表效果。
          </p>
          <button type="button" className="btn btn-outline" onClick={loadSample}>
            载入示例数据
          </button>
        </section>
      ) : null}
    </div>
  )
}
