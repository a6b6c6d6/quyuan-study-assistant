import { useEffect, useState } from 'react'
import { SUBJECTS, SUBJECT_MAP } from '../data/subjects'
import { useStudy } from '../store/StudyContext'
import type { SubjectKey } from '../types'
import { ChevronDownIcon, PauseIcon, PlayIcon, StopIcon } from './Icons'
import { TimerRing } from './TimerRing'

interface TimerOverlayProps {
  onClose: () => void
  onSaved: (seconds: number) => void
}

export function TimerOverlay({ onClose, onSaved }: TimerOverlayProps) {
  const {
    state,
    today,
    elapsedSec,
    todayMinutes,
    startTimer,
    pauseTimer,
    resumeTimer,
    endTimer,
  } = useStudy()

  const running = state.running
  const [subject, setSubject] = useState<SubjectKey>(running?.subject ?? 'math')
  const isRunning = Boolean(running?.startedAt)
  const activeSubject = running?.subject ?? subject
  const status = running ? (isRunning ? '正在专注' : '已暂停') : '准备开始'

  const todayChecked = state.checkins.some((item) => item.date === today)
  const liveMinutes = todayMinutes + (running ? Math.floor(elapsedSec / 60) : 0)
  const checkinProgress = todayChecked ? 1 : Math.min(1, liveMinutes / 25)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const handleEnd = () => {
    const seconds = elapsedSec
    endTimer()
    onSaved(seconds)
  }

  return (
    <div className="timer-overlay" role="dialog" aria-modal="true" aria-label="自习计时">
      <div className="timer-overlay-inner">
        <div className="timer-top">
          <button type="button" className="icon-btn" onClick={onClose} aria-label="收起计时">
            <ChevronDownIcon />
          </button>
          <span className="timer-status">{status}</span>
          <span className="timer-top-spacer" aria-hidden="true" />
        </div>

        <div className="timer-body">
          <p className="timer-eyebrow">曲园自习 · 计时</p>
          <h2 className="timer-title">
            {running ? SUBJECT_MAP[running.subject].label : '选择今日科目'}
          </h2>

          <div className="subject-grid">
            {SUBJECTS.map((item) => (
              <button
                key={item.key}
                type="button"
                className="subject-pill"
                aria-pressed={activeSubject === item.key}
                disabled={Boolean(running)}
                onClick={() => setSubject(item.key)}
              >
                <span className="subject-dot" style={{ background: item.color }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="timer-ring-zone">
            <TimerRing
              seconds={running ? elapsedSec : 0}
              progress={running ? Math.min(1, elapsedSec / 3600) : 0}
              status={status}
              footnote={`${SUBJECT_MAP[activeSubject].label} · 25 分钟自动打卡`}
            />
          </div>

          {running ? (
            <div className="timer-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={isRunning ? pauseTimer : resumeTimer}
              >
                {isRunning ? <PauseIcon /> : <PlayIcon />}
                {isRunning ? '暂停' : '继续'}
              </button>
              <button type="button" className="btn btn-seal" onClick={handleEnd}>
                <StopIcon />
                结束并保存
              </button>
            </div>
          ) : (
            <div className="timer-actions single">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => startTimer(subject)}
              >
                <PlayIcon />
                开始计时
              </button>
            </div>
          )}

          <div className="timer-checkin">
            <div className="timer-checkin-row">
              <span>{todayChecked ? '今日已打卡' : '完成 25 分钟自动打卡'}</span>
              <span className="timer-checkin-num">
                {todayChecked ? `${liveMinutes} 分钟` : `${Math.min(liveMinutes, 25)}/25 分钟`}
              </span>
            </div>
            <div className="mini-track">
              <span className="mini-fill" style={{ width: `${checkinProgress * 100}%` }} />
            </div>
            <p className="timer-hint">
              结束并保存后，本次专注会计入今日时长、科目分布与连续打卡。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
