import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center px-4 md:px-6 pt-10 md:pt-[60px] pb-10 gap-9 w-full overflow-x-hidden">
      <div className="flex flex-col justify-start items-center xl:items-start w-[1250px]">
        <h1 className="text-[42px] font-light tracking-[-2px]">Organize Your Style</h1>
        <p className="text-base text-text-muted font-light">Mix and match your favorite pieces, all in one place</p>
      </div>
      
      <div className="flex flex-wrap gap-10 xl:gap-0 justify-center w-full min-h-[300px]">
        <h1 className="rotate-90 cursor-default text-2xl mr-12 hidden xl:block">✮ ⋆ ˚｡✧ ⋆｡°✩✮ ⋆ ˚｡✧ ⋆</h1>
        <button
          className="bg-bg-card border border-border rounded-4xl px-6 py-8 xl:mr-30 cursor-pointer text-center flex flex-row items-center justify-center gap-20 flex-2 min-w-[350px] max-w-[800px] transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-md hover:bg-hover shadow-sm"
          onClick={() => navigate('/clothes')}
        >
          <div>
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
            </svg>
          </div>
          <div className="flex flex-col gap-2.5">
            <h2 className="text-5xl font-light">Loose Clothes</h2>
            <p className="text-xl text-text-muted font-light">Browse tops, bottoms &amp; accessories</p>
          </div>
        </button>

        <div className="flex items-center justify-end">
          <h1 className="rotate-90 cursor-default text-2xl -mr-21 -ml-75 hidden xl:block">✩₊˚.⋆☾⋆⁺₊✧₊⋆⁺₊✩₊˚.⋆☾⋆⁺₊</h1>
        </div>

        <button
          className="bg-bg-card border border-border rounded-4xl px-6 py-8 xl:mt-0 cursor-pointer text-center flex flex-col items-center justify-center flex-1 min-w-[180px] max-w-[350px] transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-md hover:bg-hover shadow-sm"
          onClick={() => navigate('/outfits')}
        >
          <div>
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="8" height="8" rx="2" />
              <rect x="14" y="3" width="8" height="8" rx="2" />
              <rect x="3" y="14" width="8" height="8" rx="2" />
              <rect x="14" y="14" width="8" height="8" rx="2" />
            </svg>
          </div>
          <h2 className="text-4xl font-light mt-4">Saved Outfits</h2>
          <p className="text-md text-text-muted font-light mt-2">View &amp; create your outfit combos</p>
        </button>
        <h1 className="-rotate-90 cursor-default text-2xl ml-10 hidden xl:block">✩₊˚.⋆☾⋆⁺₊✧₊⋆⁺₊✩₊˚.⋆☾⋆⁺₊</h1>
      </div>

      <button
          className="bg-bg border border-none rounded mt-10 px-6 py-8 cursor-pointer text-center flex flex-col items-center gap-2.5 flex-1 min-w-[180px] max-w-[800px] transition-[box-shadow,transform] duration-150 hover:opacity-[70%]"
          onClick={() => navigate('/upload')}
        >
          <div>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
          </div>
          <h2 className="text-4xl font-light">Upload</h2>
          <p className="text-[16px] text-text-light font-light">Add new items to your wardrobe</p>
        </button>

    </div>
  )
}
