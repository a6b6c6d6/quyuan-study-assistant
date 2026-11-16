import { useState } from 'react'
import { ArchOrnament } from '../components/Ornaments'
import { Stamp } from '../components/Stamp'
import { daysUntil, formatDateLabel } from '../lib/date'
import { minutesToClock } from '../lib/format'
import { buildPlanBlocks } from '../lib/plan'
import { useStudy } from '../store/StudyContext'

const FIXED_TASKS = [
  { time: '07:30', text: '单词 20 个', note: '早读先过一遍' },
  { time: '19:30', text: '政治 5 题', note: '做完立刻对答案' },
  { time: '21:30', text: '高数 1 题', note: '当天错题当天标' },
]

export function PlanPage() {
  const { state, updateSettings } = useStudy()
  const { settings } = state
  const [hoursText, setHoursText] = useState(String(settings.dailyHours))
  const countdown = Math.max(0, daysUntil(settings.examDate))
  const blocks = buildPlanBlocks(settings.dailyHours)
  const totalMinutes = blocks.reduce((sum, block) => sum + block.minutes, 0)
  const examLabel = settings.examDate ? formatDateLabel(settings.examDate) : '未设置考试日期'

  const handleHoursChange = (raw: string) => {
    setHoursText(raw)
    const value = Number(raw)
    if (raw.trim() !== '' && !Number.isNaN(value) && value > 0) {
      updateSettings({ dailyHours: Math.min(16, Math.max(0.5, value)) })
    }
  }

  const normalizeHours = () => {
    const value = Number(hoursText)
    const next =
      Number.isNaN(value) || value <= 0
        ? settings.dailyHours
        : Math.min(16, Math.max(0.5, value))
    updateSettings({ dailyHours: next })
    setHoursText(String(next))
  }

  return (
    <div className="page plan-page">
      <header className="page-head">
        <div>
          <h1 className="page-title">备考计划</h1>
          <p className="page-sub">把大目标拆成今天能做完的块</p>
        </div>
        <Stamp small />
      </header>

      <section className="card plan-countdown">
        <ArchOrnament className="arch-bg" />
        <p className="countdown-label">距离 {settings.examName || '目标考试'} 还有</p>
        <p className="countdown-value">
          {countdown}
          <small>天</small>
        </p>
        <p className="plan-exam-date">{examLabel}</p>
      </section>

      <section className="card plan-form">
        <div className="card-title-row">
          <h2 className="card-title">备考设置</h2>
          <span className="card-note">修改后立即生效</span>
        </div>

        <label className="plan-field">
          <span>考试名称</span>
          <input
            type="text"
            value={settings.examName}
            placeholder="例如 2027 考研"
            onChange={(event) => updateSettings({ examName: event.target.value })}
          />
        </label>

        <div className="plan-row">
          <label className="plan-field">
            <span>考试日期</span>
            <input
              type="date"
              value={settings.examDate}
              onChange={(event) => updateSettings({ examDate: event.target.value })}
            />
          </label>
          <label className="plan-field">
            <span>每天可学（小时）</span>
            <input
              type="number"
              min={0.5}
              max={16}
              step={0.5}
              value={hoursText}
              onChange={(event) => handleHoursChange(event.target.value)}
              onBlur={normalizeHours}
            />
          </label>
        </div>
      </section>

      <section className="card plan-blocks">
        <div className="card-title-row">
          <h2 className="card-title">今日建议时间块</h2>
          <span className="card-note">共 {totalMinutes} 分钟</span>
        </div>

        <div className="ratio-bar" aria-hidden="true">
          {blocks.map((block) => (
            <span
              key={block.key}
              className="ratio-seg"
              style={{ flexGrow: block.minutes, background: block.color }}
            />
          ))}
        </div>

        <div className="block-list">
          {blocks.map((block) => (
            <div className="block-row" key={block.key}>
              <span className="block-dot" style={{ background: block.color }} />
              <span className="block-name">{block.label}</span>
              <span className="block-time">
                {minutesToClock(block.startMin)}–{minutesToClock(block.endMin)}
              </span>
              <span className="block-minutes">{block.minutes} 分</span>
            </div>
          ))}
        </div>

        <p className="plan-note">
          按数学 40%、英语 25%、政治 15%、专业课 20% 分配，并按 15 分钟取整。
        </p>
      </section>

      <section className="card plan-timeline">
        <div className="card-title-row">
          <h2 className="card-title">每日固定任务</h2>
          <span className="card-note">每天自动生成</span>
        </div>
        <div className="timeline">
          {FIXED_TASKS.map((task) => (
            <div className="timeline-item" key={task.time}>
              <span className="timeline-time">{task.time}</span>
              <span className="timeline-body">
                <span className="timeline-text">{task.text}</span>
                <span className="timeline-note">{task.note}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
