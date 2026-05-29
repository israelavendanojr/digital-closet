import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { signOut } = useClerk()
  const navigate = useNavigate()

  return (
    <div className="px-6 py-8 max-w-160 mx-auto w-full flex flex-col gap-8">
      <h1 className="text-[32px] font-light">Settings</h1>

      

      <section className="flex flex-col border border-border rounded overflow-hidden">
        <h2 className="text-xs font-light uppercase tracking-[0.5px] text-text px-4 py-3 bg-bg-card">Account</h2>
        <div className="flex items-center justify-between px-4 py-3.5 bg-bg border-t border-border gap-4 cursor-pointer hover:bg-hover" onClick={() => navigate('/settings/edit-profile')}>
          <p className="text-[15px] font-light text-text">Edit profile</p>
          <span className="text-xl text-text-muted">›</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5 bg-bg border-t border-border gap-4 cursor-pointer hover:bg-hover">
          <p className="text-[15px] font-light text-text">Privacy</p>
          <span className="text-xl text-text-muted">›</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5 bg-bg border-t border-border gap-4 cursor-pointer hover:bg-hover-error" onClick={() => signOut()}>
          <p className="text-[15px] font-bold text-[#c0392b]">Sign out</p>
          <span className="text-xl text-text-muted">›</span>
        </div>
      </section>
    </div>
  )
}
