import { formatClock } from '../lib/format'

interface TimerRingProps {
  seconds: number
  progress: number
  status: string
  footnote?: string
}

const RADIUS = 104
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const TICKS = Array.from({ length: 60 }, (_, index) => index)

export function TimerRing({ seconds, progress, status, footnote }: TimerRingProps) {
  const clamped = Math.min(1, Math.max(0, progress))

  return (
    <div className="timer-ring">
      <svg viewBox="0 0 280 280" className="timer-ring-svg" aria-hidden="true">
        <circle cx="140" cy="140" r="132" className="ring-plate" />
        {TICKS.map((tick) => {
          const major = tick % 5 === 0
          return (
            <line
              key={tick}
              x1="140"
              y1={major ? 10 : 14}
              x2="140"
              y2={major ? 25 : 20}
              transform={`rotate(${tick * 6} 140 140)`}
              className={major ? 'ring-tick ring-tick-major' : 'ring-tick'}
            />
          )
        })}
        <circle cx="140" cy="140" r={RADIUS} className="ring-track" strokeWidth="7" />
        <circle
          cx="140"
          cy="140"
          r={RADIUS}
          className="ring-progress"
          strokeWidth="7"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - clamped)}
          transform="rotate(-90 140 140)"
        />
        <circle cx="140" cy="140" r="88" className="ring-inner-dash" strokeDasharray="1.5 7" />
      </svg>
      <div className="ring-center">
        <span className="ring-status">{status}</span>
        <span className="ring-time">{formatClock(seconds)}</span>
        {footnote ? <span className="ring-sub">{footnote}</span> : null}
      </div>
    </div>
  )
}
