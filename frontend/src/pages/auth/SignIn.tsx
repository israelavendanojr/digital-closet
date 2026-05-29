import { useState } from 'react'
import { useSignIn } from '@clerk/clerk-react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { cn } from '../lib/cn'

const inputClass = cn(
  'bg-bg-input border border-border rounded text-sm px-3 py-2.5 w-full',
  'focus:outline-none focus:ring-1 focus:ring-border transition-shadow duration-150',
)

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOAuth = async (strategy: 'oauth_google' | 'oauth_apple') => {
    if (!isLoaded) return
    await signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    })
  }

  const handleSignIn = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate('/')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <p className="text-text-light text-sm select-none mb-5 tracking-widest">✮ ⋆ ˚｡✧ ⋆｡°✩ ✮ ⋆ ˚｡✧</p>

      <div className="bg-bg-card border border-border rounded-xl shadow w-full max-w-95 p-10 flex flex-col gap-7">

        {/* Logo */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-4xl font-medium font-logo text-text tracking-[-0.5px] text-shadow-sm select-none">
            <span>digi•cl</span>
            <span className="relative inline-block h-0 w-4">
              o
              <svg
                className="absolute bottom-[-1.57em] left-[-75%] w-[1em] h-[1em] rotate-7 pointer-events-none"
                fill="none"
                viewBox="0 0 38 34"
              >
                <g filter="url(#si-a)">
                  <path fill="url(#si-b)" d="m6.411 0 27.457 2.886-2.412 22.943L4 22.943 6.411 0Z" shapeRendering="crispEdges"/>
                </g>
                <defs>
                  <pattern id="si-b" width="1" height="1" patternContentUnits="objectBoundingBox">
                    <use href="#si-c" transform="matrix(.00195 0 0.00003 .00234 0 -.098)"/>
                  </pattern>
                  <image id="si-c" width="480" height="480" data-name="image.png" href="data:image/png;base64,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…SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUWuoB5u3SnBMjxRkAAAAASUVORK5CYII=" preserveAspectRatio="none"/>
                </defs>
              </svg>
            </span>
            <span>set</span>
          </span>
          <p className="text-text-muted font-light text-sm">welcome back</p>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted font-light tracking-wide uppercase">Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted font-light tracking-wide uppercase">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-[13px] text-red-500 font-light">{error}</p>}
          <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-text-muted font-light">or</span>
          <div className="flex-1 border-t border-border" />
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => handleOAuth('oauth_google')}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5832-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
              <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
          <Button type="button" variant="ghost" size="lg" className="w-full" onClick={() => handleOAuth('oauth_apple')}>
            <svg width="16" height="18" viewBox="0 0 814 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.7C172.8 791.1 128 682.9 128 581c0-174.7 113.4-267.3 224.6-267.3 59.2 0 108.4 39.5 147.6 39.5 37.6 0 96.4-41.5 164.4-41.5 26.4 0 108.2 2.6 168.1 80.2zm-127.5-152.7c29.8-35.5 51.1-84.7 51.1-133.9 0-6.8-.5-13.7-1.7-20.3-48.1 1.9-104.9 32.6-139.5 72.4-26.7 30.5-52 79.7-52 129.5 0 7.5 1.3 15 2 17.4 3 .7 7.9 1.3 12.8 1.3 43.3 0 97.6-29.3 127.3-66.4z"/>
            </svg>
            Continue with Apple
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border-t border-border" />
          <p className="text-sm text-text-muted font-light text-center">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-text hover:underline transition-all duration-150">
              Sign up
            </Link>
          </p>
        </div>

      </div>

      <p className="text-text-light text-sm select-none mt-5 tracking-widest">✧ ⋆｡°✩ ✮ ⋆ ˚｡✧ ⋆｡°✩</p>
    </div>
  )
}
