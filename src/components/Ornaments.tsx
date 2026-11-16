export function ArchOrnament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 100"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMaxYMax meet"
    >
      <path d="M10 100V56c0-18 14-32 32-32s32 14 32 32v44" stroke="currentColor" strokeWidth="1.2" />
      <path d="M52 100V56c0-18 14-32 32-32s32 14 32 32v44" stroke="currentColor" strokeWidth="1.2" />
      <path d="M94 100V56c0-18 14-32 32-32s32 14 32 32v44" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 100h176" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M30 30h16M30 38h16M72 30h16M72 38h16M114 30h16M114 38h16"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.55"
      />
    </svg>
  )
}
