import { useState, useRef } from 'react'
import { useUser } from '@clerk/clerk-react'
import Button from './Button'
import { cn } from '../../lib/cn'

const inputClass = cn(
  'bg-bg-input border border-border rounded text-sm px-3 py-2.5 w-full',
  'focus:outline-none focus:ring-1 focus:ring-border transition-shadow duration-150',
)

interface Props {
  onClose: () => void
}

export default function EditProfileModal({ onClose }: Props) {
  const { user, isLoaded } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [closing, setClosing] = useState(false)

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [nameError, setNameError] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const [avatarError, setAvatarError] = useState('')

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 160)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError('')
    try {
      await user!.setProfileImage({ file })
    } catch (err: any) {
      setAvatarError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Failed to update photo.')
    }
  }

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameSaving(true)
    setNameError('')
    setNameSuccess(false)
    try {
      await user!.update({ firstName, lastName })
      setNameSuccess(true)
    } catch (err: any) {
      setNameError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Failed to save name.')
    } finally {
      setNameSaving(false)
    }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSaving(true)
    setPasswordError('')
    setPasswordSuccess(false)
    try {
      await user!.updatePassword({ currentPassword, newPassword })
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: any) {
      setPasswordError(err.errors?.[0]?.longMessage ?? err.errors?.[0]?.message ?? 'Failed to update password.')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (!isLoaded || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/30 ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
        onClick={handleClose}
      />
      <div className={`relative bg-card rounded-xl shadow-xl overflow-y-auto max-h-[90vh] w-[min(92vw,480px)] flex flex-col ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <h2 className="text-xl font-normal">Edit Profile</h2>
          <button
            className="bg-transparent border-none text-text-muted hover:text-text cursor-pointer text-lg p-0 leading-none"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          {/* Profile Picture */}
          <section className="flex flex-col border border-border rounded overflow-hidden">
            <h2 className="text-xs uppercase tracking-[0.5px] text-text font-light px-4 py-3 bg-bg-card">Profile Picture</h2>
            <div className="flex items-center gap-5 px-4 py-4 bg-bg border-t border-border">
              <button
                className="w-18 h-18 rounded-full bg-bg-card border border-border flex items-center justify-center overflow-hidden cursor-pointer shrink-0 hover:opacity-80 transition-opacity duration-150"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile picture"
                type="button"
              >
                {user.imageUrl
                  ? <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  : (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )
                }
              </button>
              <div className="flex flex-col gap-1">
                <p className="text-[15px] font-light text-text">Click photo to change</p>
                <p className="text-xs font-light text-text-muted">JPG, PNG or GIF · max 10MB</p>
                {avatarError && <p className="text-[13px] text-red-500 font-light mt-1">{avatarError}</p>}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </section>

          {/* Name */}
          <section className="flex flex-col border border-border rounded overflow-hidden">
            <h2 className="text-xs uppercase tracking-[0.5px] text-text font-light px-4 py-3 bg-bg-card">Name</h2>
            <form onSubmit={handleSaveName} className="flex flex-col gap-4 px-4 py-4 bg-bg border-t border-border">
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs text-text-muted font-light tracking-wide uppercase">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className={inputClass}
                    placeholder="First name"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs text-text-muted font-light tracking-wide uppercase">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className={inputClass}
                    placeholder="Last name"
                  />
                </div>
              </div>
              {nameError && <p className="text-[13px] text-red-500 font-light">{nameError}</p>}
              {nameSuccess && <p className="text-[13px] text-green-600 font-light">Name updated.</p>}
              <div>
                <Button type="submit" size="sm" disabled={nameSaving}>
                  {nameSaving ? 'Saving…' : 'Save name'}
                </Button>
              </div>
            </form>
          </section>

          {/* Password */}
          {user.passwordEnabled && (
            <section className="flex flex-col border border-border rounded overflow-hidden">
              <h2 className="text-xs uppercase tracking-[0.5px] text-text font-light px-4 py-3 bg-bg-card">Change Password</h2>
              <form onSubmit={handleSavePassword} className="flex flex-col gap-4 px-4 py-4 bg-bg border-t border-border">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted font-light tracking-wide uppercase">Current password</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted font-light tracking-wide uppercase">New password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                  />
                </div>
                {passwordError && <p className="text-[13px] text-red-500 font-light">{passwordError}</p>}
                {passwordSuccess && <p className="text-[13px] text-green-600 font-light">Password updated.</p>}
                <div>
                  <Button type="submit" size="sm" disabled={passwordSaving || !currentPassword || !newPassword}>
                    {passwordSaving ? 'Saving…' : 'Update password'}
                  </Button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
