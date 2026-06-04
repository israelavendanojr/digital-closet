import { useRef, useState, useLayoutEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Icon } from '../ui/icons'
import { cn } from '../../lib/cn'

function HangerMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.71}
      viewBox="0 0 34 24"
      fill="none"
      stroke="var(--color-clay)"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d="M17 9.2c0-2.4 1.7-3.8 3.6-3.8 1.7 0 2.7 1 2.7 2.3 0 1-.7 1.8-1.9 2.1" />
      <path d="M4 18.6 L17 9.6 L30 18.6" />
      <line x1="3" y1="18.6" x2="31" y2="18.6" />
    </svg>
  )
}

function Logo({ compact = false }: { compact?: boolean }) {
  const scale = compact ? 0.82 : 1
  return (
    <div className="flex items-center" style={{ gap: 11 * scale }}>
      <HangerMark size={27 * scale} />
      <span
        className="font-logo leading-none"
        style={{ fontSize: 26 * scale, color: 'var(--color-ink)', letterSpacing: '-0.01em' }}
      >
        digi<span style={{ color: 'var(--color-clay)', fontWeight: 700 }}>·</span>closet
      </span>
    </div>
  )
}

const NAV_LINKS = [
  { id: 'home', label: 'Home', icon: Icon.home, path: '/' },
  { id: 'closet', label: 'Closet', icon: Icon.grid, path: '/clothes' },
  { id: 'outfits', label: 'Outfits', icon: Icon.layers, path: '/outfits' },
]

function isActive(path: string, location: string): boolean {
  if (path === '/') return location === '/'
  return location.startsWith(path)
}

export default function TopNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useUser()

  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 })
  const activeIndex = NAV_LINKS.findIndex(l => isActive(l.path, pathname))

  useLayoutEffect(() => {
    const el = btnRefs.current[activeIndex]
    if (el) setPillStyle({ left: el.offsetLeft, width: el.offsetWidth })
  }, [activeIndex])

  return (
    <nav
      className="flex items-center justify-between px-6 md:px-10 py-[18px] border-b border-border sticky top-0 z-50"
      style={{
        background: 'linear-gradient(var(--color-header), color-mix(in srgb, var(--color-header) 86%, #fff))',
      }}
    >
      {/* Logo */}
      <button
        className="bg-transparent border-none p-0 cursor-pointer transition-all duration-[180ms] hover:-translate-y-[2px] hover:opacity-80"
        onClick={() => navigate('/')}
        aria-label="Home"
      >
        <Logo compact />
      </button>

      {/* Desktop nav pills */}
      <div className="hidden md:flex items-center gap-1 relative">
        {/* sliding pill */}
        <div
          className="absolute rounded-pill bg-ink pointer-events-none"
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
            top: 0,
            bottom: 0,
            transition: 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        {NAV_LINKS.map((link, i) => {
          const active = isActive(link.path, pathname)
          return (
            <button
              key={link.id}
              ref={el => { btnRefs.current[i] = el }}
              onClick={() => navigate(link.path)}
              className={cn(
                'relative z-10 flex items-center gap-2 font-sans font-semibold text-[15px] px-4 py-[9px] rounded-pill border-none cursor-pointer transition-all duration-180',
                active ? 'text-white' : 'text-ink-soft hover:text-ink hover:-translate-y-0.5',
              )}
            >
              {link.icon({ size: 18, color: active ? '#fff' : 'currentColor' })}
              {link.label}
            </button>
          )
        })}
      </div>

      {/* Icon buttons */}
      <div className="flex items-center gap-2">
        
        <button
          className="w-[42px] h-[42px] rounded-full border border-border bg-bg-soft text-ink-soft flex items-center justify-center cursor-pointer transition-all duration-180 hover:-translate-y-0.75 hover:shadow-md hover:border-line"
          onClick={() => navigate('/settings')}
          aria-label="Settings"
        >
          {Icon.gear({ size: 19 })}
        </button>
        <button
          className="w-[42px] h-[42px] rounded-full border border-border bg-bg-soft text-ink-soft flex items-center justify-center cursor-pointer transition-all duration-180 hover:-translate-y-0.75 hover:shadow-md hover:border-line"
          onClick={() => navigate('/profile')}
          aria-label="Profile"
        >
          {user?.imageUrl
            ? <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
            : Icon.user({ size: 19 })
          }
        </button>
      </div>
    </nav>
  )
}

const BOTTOM_LINKS = [
  { id: 'home', label: 'Home', icon: Icon.home, path: '/', fab: false },
  { id: 'closet', label: 'Closet', icon: Icon.grid, path: '/clothes', fab: false },
  { id: 'add', label: 'Add', icon: Icon.upload, path: '/upload', fab: true },
  { id: 'outfits', label: 'Outfits', icon: Icon.layers, path: '/outfits', fab: false },
  { id: 'you', label: 'You', icon: Icon.user, path: '/profile', fab: false },
]

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useUser()

  return (
    <nav
      className="md:hidden flex items-center justify-around px-3 pt-[10px] pb-[18px] border-t border-border fixed bottom-0 left-0 right-0 z-50"
      style={{ background: 'rgba(248,243,232,.92)', backdropFilter: 'blur(8px)' }}
    >
      {BOTTOM_LINKS.map((link) => {
        if (link.fab) {
          return (
            <button
              key={link.id}
              onClick={() => navigate(link.path)}
              className="flex items-center justify-center border-none cursor-pointer -mt-[6px]"
              style={{
                width: 50,
                height: 50,
                borderRadius: 999,
                background: 'var(--color-clay)',
                boxShadow: '0 8px 18px rgba(190,111,74,.32)',
                color: '#fff',
              }}
              aria-label="Upload"
            >
              {link.icon({ size: 24, color: '#fff' })}
            </button>
          )
        }
        const active = isActive(link.path, pathname)
        return (
          <button
            key={link.id}
            onClick={() => navigate(link.path)}
            className="flex flex-col items-center gap-[3px] bg-transparent border-none cursor-pointer"
            style={{ color: active ? 'var(--color-ink)' : 'var(--color-muted)' }}
          >
            {link.id === 'you' && user?.imageUrl
              ? <img src={user.imageUrl} alt="Profile" className="rounded-full object-cover" style={{ width: 22, height: 22, border: active ? '2px solid var(--color-clay)' : '2px solid transparent' }} />
              : link.icon({ size: 22, color: active ? 'var(--color-clay)' : 'var(--color-muted)' })
            }
            <span className="font-sans font-semibold" style={{ fontSize: 10.5 }}>{link.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
