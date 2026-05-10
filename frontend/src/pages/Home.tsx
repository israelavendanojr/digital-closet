import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center px-6 pt-[60px] pb-10 gap-12">
      <div className="text-center">
        <h1 className="text-[42px] font-light tracking-[-1px] mb-3">Organize Your Style</h1>
        <p className="text-base text-text-muted">Your digital wardrobe, always at hand</p>
      </div>
      <div className="flex gap-5 flex-wrap justify-center w-full max-w-[800px]">
        <button
          className="bg-bg-card border border-border rounded px-6 py-8 cursor-pointer text-center flex flex-col items-center gap-2.5 flex-1 min-w-[180px] transition-[box-shadow,transform] duration-150 hover:shadow hover:-translate-y-0.5"
          onClick={() => navigate('/clothes')}
        >
          <div className="text-text-muted mb-1">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium">Loose Clothes</h2>
          <p className="text-[13px] text-text-muted">Browse tops, bottoms &amp; accessories</p>
        </button>

        <button
          className="bg-bg-card border border-border rounded px-6 py-8 cursor-pointer text-center flex flex-col items-center gap-2.5 flex-1 min-w-[180px] transition-[box-shadow,transform] duration-150 hover:shadow hover:-translate-y-0.5"
          onClick={() => navigate('/outfits')}
        >
          <div className="text-text-muted mb-1">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h2 className="text-lg font-medium">Saved Outfits</h2>
          <p className="text-[13px] text-text-muted">View &amp; create your outfit combos</p>
        </button>

        <button
          className="bg-bg-card border border-border rounded px-6 py-8 cursor-pointer text-center flex flex-col items-center gap-2.5 flex-1 min-w-[180px] transition-[box-shadow,transform] duration-150 hover:shadow hover:-translate-y-0.5"
          onClick={() => navigate('/upload')}
        >
          <div className="text-text-muted mb-1">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
          </div>
          <h2 className="text-lg font-medium">Upload</h2>
          <p className="text-[13px] text-text-muted">Add new items to your wardrobe</p>
        </button>
      </div>
    </div>
  )
}
