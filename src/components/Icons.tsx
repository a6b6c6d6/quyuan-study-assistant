import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function TodayIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 3.8v2.2M12 18v2.2M3.8 12H6M18 12h2.2" />
    </Svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.8" y="5.2" width="16.4" height="15" rx="2.4" />
      <path d="M3.8 9.6h16.4M8 3.6v3M16 3.6v3" />
      <path d="M7.4 13.4h2.2M7.4 16.8h2.2M14.4 13.4h2.2" />
    </Svg>
  )
}

export function PlanIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4.2" y="3.8" width="15.6" height="16.4" rx="2.4" />
      <path d="M8 8.2l1.4 1.4L12 7M8 14.2l1.4 1.4L12 13M14.4 8.4h3M14.4 14.4h3" />
    </Svg>
  )
}

export function ExperienceIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 6.6C10.1 5.1 7.2 4.6 4.4 5.1v12.3c2.8-.5 5.7 0 7.6 1.5 1.9-1.5 4.8-2 7.6-1.5V5.1c-2.8-.5-5.7 0-7.6 1.5Z" />
      <path d="M12 6.6v12.3" />
    </Svg>
  )
}

export function GinkgoLeaf({
  size = 16,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 28c0-4.8 0-8 0-9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M16 19.2C9.4 19.2 5.2 14.8 4.6 8.2c4.7 1.9 8.6 4.2 11.4 7.4 2.8-3.2 6.7-5.5 11.4-7.4-.6 6.6-4.8 11-11.4 11Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.4l4.2 4.2L19 6.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.2 4h9.6c.7 0 1.2.5 1.2 1.2V20l-6-4.2L6 20V5.2C6 4.5 6.5 4 7.2 4Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronLeftIcon() {
  return (
    <Svg width="20" height="20">
      <path d="M14.4 5.6 8 12l6.4 6.4" />
    </Svg>
  )
}

export function ChevronRightIcon() {
  return (
    <Svg width="20" height="20">
      <path d="M9.6 5.6 16 12l-6.4 6.4" />
    </Svg>
  )
}

export function ChevronDownIcon() {
  return (
    <Svg width="20" height="20">
      <path d="M6 9.6 12 15.6l6-6" />
    </Svg>
  )
}

export function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  )
}

export function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="5.5" width="3.4" height="13" rx="1.4" fill="currentColor" />
      <rect x="13.6" y="5.5" width="3.4" height="13" rx="1.4" fill="currentColor" />
    </svg>
  )
}

export function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.6v12.8L18.2 12 8 5.6Z" fill="currentColor" />
    </svg>
  )
}
