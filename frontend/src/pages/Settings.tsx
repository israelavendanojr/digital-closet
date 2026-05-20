import { useState } from 'react'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="px-6 py-8 max-w-160 mx-auto w-full flex flex-col gap-8">
      <h1 className="text-[32px] font-light">Settings</h1>

      <section className="flex flex-col border border-border rounded overflow-hidden">
        <h2 className="text-xs uppercase tracking-[0.5px] text-text font-light px-4 py-3 bg-bg-card">Appearance</h2>
        <div className="flex items-center justify-between px-4 py-3.5 bg-bg border-t border-border gap-4">
          <div>
            <p className="text-[15px] text-text font-light">Dark mode</p>
            <p className="text-xs font-light text-text-muted mt-0.5">Switch to dark theme</p>
          </div>
          <button
            className={`w-11 h-6.5 rounded-pill border-none relative cursor-pointer transition-colors duration-200 shrink-0 ${darkMode ? 'toggle-on bg-text-muted' : 'bg-text-light'}`}
            onClick={() => setDarkMode(v => !v)}
            aria-pressed={darkMode}
          >
            <span className="toggle-thumb absolute top-0.75 left-0.75 w-5 h-5 rounded-full bg-bg transition-transform duration-200 block" />
          </button>
        </div>
      </section>

      <section className="flex flex-col border border-border rounded overflow-hidden">
        <h2 className="text-xs font-light uppercase tracking-[0.5px] text-text px-4 py-3 bg-bg-card">Notifications</h2>
        <div className="flex items-center justify-between px-4 py-3.5 bg-bg border-t border-border gap-4">
          <div>
            <p className="text-[15px] font-light text-text">Push notifications</p>
            <p className="text-xs font-light text-text-muted mt-0.5">Receive outfit suggestions</p>
          </div>
          <button
            className={`w-11 h-6.5 rounded-pill border-none relative cursor-pointer transition-colors duration-200 shrink-0 ${notifications ? 'toggle-on bg-text-muted' : 'bg-text-light'}`}
            onClick={() => setNotifications(v => !v)}
            aria-pressed={notifications}
          >
            <span className="toggle-thumb absolute top-0.75 left-0.75 w-5 h-5 rounded-full bg-bg transition-transform duration-200 block" />
          </button>
        </div>
      </section>

      <section className="flex flex-col border border-border rounded overflow-hidden">
        <h2 className="text-xs font-light uppercase tracking-[0.5px] text-text px-4 py-3 bg-bg-card">Account</h2>
        <div className="flex items-center justify-between px-4 py-3.5 bg-bg border-t border-border gap-4 cursor-pointer hover:bg-hover">
          <p className="text-[15px] font-light text-text">Edit profile</p>
          <span className="text-xl text-text-muted">›</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5 bg-bg border-t border-border gap-4 cursor-pointer hover:bg-hover">
          <p className="text-[15px] font-light text-text">Privacy</p>
          <span className="text-xl text-text-muted">›</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5 bg-bg border-t border-border gap-4 cursor-pointer hover:bg-hover-error">
          <p className="text-[15px] font-bold text-[#c0392b]">Sign out</p>
          <span className="text-xl text-text-muted">›</span>
        </div>
      </section>
    </div>
  )
}
