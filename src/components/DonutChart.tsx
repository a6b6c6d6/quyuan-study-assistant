export interface DonutSlice {
  key: string
  label: string
  color: string
  minutes: number
}

const RADIUS = 62
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function DonutChart({ data }: { data: DonutSlice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.minutes, 0)
  const hasData = total > 0
  const shortFocus = hasData && total < 1
  const showSegments = total >= 1
  const gap = showSegments ? 4 : 0
  let cursor = 0

  const segments = showSegments
    ? data
        .filter((slice) => slice.minutes > 0)
        .map((slice) => {
          const length = (slice.minutes / total) * CIRCUMFERENCE
          const segment = {
            ...slice,
            dash: Math.max(0.5, length - gap),
            offset: cursor,
          }
          cursor += length
          return segment
        })
    : []

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 160 160" className="donut" role="img" aria-label="今日专注分布">
        <circle cx="80" cy="80" r={RADIUS} className="donut-track" strokeWidth="18" />
        {segments.map((segment) => (
          <circle
            key={segment.key}
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke={segment.color}
            strokeWidth="18"
            strokeDasharray={`${segment.dash} ${CIRCUMFERENCE - segment.dash}`}
            strokeDashoffset={-segment.offset}
            transform="rotate(-90 80 80)"
          />
        ))}
        {shortFocus ? (
          <text x="80" y="84" textAnchor="middle" className="donut-short">
            不足 1 分钟
          </text>
        ) : (
          <>
            <text x="80" y="78" textAnchor="middle" className="donut-total">
              {hasData ? Math.round(total) : '—'}
            </text>
            <text x="80" y="96" textAnchor="middle" className="donut-unit">
              {hasData ? '分钟' : '暂无'}
            </text>
          </>
        )}
      </svg>
      <ul className="donut-legend">
        {data.map((slice) => (
          <li key={slice.key} className={slice.minutes > 0 ? 'legend-row' : 'legend-row is-empty'}>
            <span className="legend-dot" style={{ background: slice.color }} />
            <span className="legend-label">{slice.label}</span>
            <span className="legend-value">
              {slice.minutes <= 0
                ? '0 分'
                : slice.minutes < 1
                  ? '不足 1 分钟'
                  : `${Math.round(slice.minutes)} 分`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
