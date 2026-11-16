export function Stamp({ small = false }: { small?: boolean }) {
  return (
    <span
      className={small ? 'stamp stamp-small' : 'stamp'}
      role="img"
      aria-label="曲园印章"
    >
      <span>曲</span>
      <span>园</span>
    </span>
  )
}
