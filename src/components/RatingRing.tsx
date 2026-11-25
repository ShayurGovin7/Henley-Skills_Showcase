interface Props {
  value: number
  size: number
  stroke?: number
  locked?: boolean
  showValue?: boolean
  className?: string
}

/** Circular gauge showing a 0–100 rating */
export function RatingRing({ value, size, stroke = 3, locked, showValue = true, className }: Props) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const color = locked ? 'var(--amber)' : 'var(--holo)'
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={locked ? `${circ * 0.04} ${circ * 0.03}` : `${circ}`}
        strokeDashoffset={locked ? 0 : circ * (1 - value / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        opacity={locked ? 0.9 : 1}
      />
      {locked && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${circ * (value / 100)} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      {showValue && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill={color}
          style={{ font: `600 ${size * 0.34}px var(--font-display)` }}
        >
          {value}
        </text>
      )}
    </svg>
  )
}
