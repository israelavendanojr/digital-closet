import { useState } from 'react'
import { useSignUp } from '@clerk/clerk-react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { cn } from '../lib/cn'

type Step = 'register' | 'verify'

const inputClass = cn(
  'bg-bg-input border border-border rounded text-sm px-3 py-2.5 w-full',
  'focus:outline-none focus:ring-1 focus:ring-border transition-shadow duration-150',
)

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      await signUp.create({ emailAddress: email, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setStep('verify')
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate('/')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Invalid code.')
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
                <g filter="url(#su-a)">
                  <path fill="url(#su-b)" d="m6.411 0 27.457 2.886-2.412 22.943L4 22.943 6.411 0Z" shapeRendering="crispEdges"/>
                </g>
                <defs>
                  <pattern id="su-b" width="1" height="1" patternContentUnits="objectBoundingBox">
                    <use href="#su-c" transform="matrix(.00195 0 0.00003 .00234 0 -.098)"/>
                  </pattern>
                  <image id="su-c" width="480" height="480" data-name="image.png" href="data:image/png;base64,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dW8q4ucC8HQ0AMAE01o/o9ls/swcXy+t9fT8/PzbPM+7qNFo5A4ZWlxcPOmOO+74uDkOYP1oAICyaK2nwzC8UUSOMyurSdM0cRznRawCAMXjHACg1GZnZ+dnZmZ2tlqtqXq9/utmfV9s225EUfQbMzMzn+eMgOIwAAAl2rx584OpqanHaA6A0UEDAEwarbWISMvzPM/zPMuyrDXLsqy15nmep5VSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUWuoB5u3SnBMjxRkAAAAASUVORK5CYII=" preserveAspectRatio="none"/>
                </defs>
              </svg>
            </span>
            <span>set</span>
          </span>
          <p className="text-text-muted font-light text-sm">create your closet</p>
        </div>

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-[13px] text-red-500 font-light">{error}</p>}
            <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-light tracking-tight">Check your email</h2>
              <p className="text-sm text-text-muted font-light">We sent a 6-digit code to <span className="text-text">{email}</span></p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted font-light tracking-wide uppercase">Verification code</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className={inputClass}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            {error && <p className="text-[13px] text-red-500 font-light">{error}</p>}
            <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify Email'}
            </Button>
            <button
              type="button"
              className="text-sm text-text-muted font-light hover:text-text transition-colors duration-150 text-center bg-transparent border-none cursor-pointer"
              onClick={() => { setStep('register'); setError(''); setCode('') }}
            >
              Use a different email
            </button>
          </form>
        )}

        <div className="flex flex-col gap-4">
          <div className="border-t border-border" />
          <p className="text-sm text-text-muted font-light text-center">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-text hover:underline transition-all duration-150">
              Sign in
            </Link>
          </p>
        </div>

      </div>

      <p className="text-text-light text-sm select-none mt-5 tracking-widest">✧ ⋆｡°✩ ✮ ⋆ ˚｡✧ ⋆｡°✩</p>
    </div>
  )
}
