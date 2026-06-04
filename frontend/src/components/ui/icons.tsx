import type { CSSProperties } from 'react'

interface IconProps {
  size?: number
  color?: string
  style?: CSSProperties
}

type IconFn = (props?: IconProps) => JSX.Element

function makeIcon(
  paths: JSX.Element,
  opts: { fill?: boolean; vb?: number; sw?: number } = {},
): IconFn {
  const { fill = false, vb = 24, sw = 1.7 } = opts
  return ({ size = 20, color = 'currentColor', style } = {}) => (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${vb} ${vb}`}
      fill={fill ? color : 'none'}
      stroke={fill ? 'none' : color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {paths}
    </svg>
  )
}

export const Icon: Record<string, IconFn> = {
  home: makeIcon(<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5" />),
  grid: makeIcon(
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </>,
  ),
  layers: makeIcon(
    <path d="M12 3l8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16.5l8 4 8-4" />,
  ),
  search: makeIcon(
    <>
      <circle cx="11" cy="11" r="6.4" />
      <path d="M20 20l-3.6-3.6" />
    </>,
  ),
  gear: makeIcon(
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.6v2.4M12 19v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.6 12h2.4M19 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </>,
  ),
  user: makeIcon(
    <>
      <circle cx="12" cy="8.4" r="3.6" />
      <path d="M5 19.4c1.2-3.2 4-4.6 7-4.6s5.8 1.4 7 4.6" />
    </>,
  ),
  plus: makeIcon(<path d="M12 5v14M5 12h14" />),
  upload: makeIcon(
    <path d="M12 15V4m0 0L8 8m4-4l4 4M5 16v2.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V16" />,
  ),
  hanger: makeIcon(
    <path d="M12 7.4c0-1.6 1.2-2.6 2.6-2.6 1.4 0 2.1.9 2.1 1.9 0 .9-.6 1.5-1.6 1.8L12 9.6 4 15.4c-.8.6-.4 2 .6 2h14.8c1 0 1.4-1.4.6-2L12 9.6" />,
  ),
  chevL: makeIcon(<path d="M15 6l-6 6 6 6" />),
  chevR: makeIcon(<path d="M9 6l6 6-6 6" />),
  edit: makeIcon(
    <path d="M14.5 5.5l4 4M4 20l1-4L16 5a2 2 0 0 1 3 3L8 19l-4 1Z" />,
  ),
  sparkle: makeIcon(
    <path d="M12 3c.6 4.6 1.8 5.8 6.4 6.4-4.6.6-5.8 1.8-6.4 6.4-.6-4.6-1.8-5.8-6.4-6.4C10.2 8.8 11.4 7.6 12 3Z" />,
    { fill: true },
  ),
  x: makeIcon(<path d="M6 6l12 12M18 6L6 18" />),
  trash: makeIcon(
    <path d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M6.5 7l.8 12.2A1.5 1.5 0 0 0 8.8 20.6h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />,
  ),
}
