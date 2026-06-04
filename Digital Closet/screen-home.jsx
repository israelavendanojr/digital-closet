// screen-home.jsx — Home Dashboard (desktop + mobile)

function StatCard({ n, label, icon, accent }) {
  return (
    <div className="dx-panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: accent ? 'var(--clay-tint)' : 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon({ size: 19, color: accent ? 'var(--clay)' : 'var(--ink-soft)' })}
        </span>
      </div>
      <div>
        <div className="dx-stat-n" style={{ fontSize: 34 }}>{n}</div>
        <div className="dx-muted" style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

// The featured "outfit of the day" hero
function OutfitOfDay({ outfit, big, compact }) {
  const items = outfit.items.map((id) => byId[id]);
  return (
    <div className="dx-panel" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0,
      background: 'linear-gradient(165deg, var(--bg-soft), color-mix(in srgb, var(--clay-tint) 55%, var(--bg-soft)))',
      borderColor: 'var(--clay-soft)', height: big ? '100%' : 'auto' }}>
      <Doodles color="var(--clay)" items={[['sp', 86, 8, 16, 0, .4], ['st', 92, 20, 12, 0, .35], ['dt', 80, 16, 6, 0, .5], ['mn', 90, 88, 15, 0, .3], ['sp', 8, 90, 13, 0, .3]]} />
      <div style={{ position: 'relative', padding: big ? '26px 26px 0' : '16px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dx-eyebrow">Outfit of the day</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.04em' }}>· 64° clear</span>
        </div>
        <h3 className="dx-h2" style={{ fontSize: big ? 30 : 21, marginTop: 8 }}>{outfit.name}</h3>
        {!compact && <p className="dx-sub" style={{ fontSize: 14, marginTop: 6 }}>Pulled together from pieces you wear most.</p>}
      </div>
      <div style={{ position: 'relative', flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: compact ? 10 : 12,
        padding: big ? '20px 26px' : '14px 18px' }}>
        {items.slice(0, 4).map((it) => (
          <GarmentTile key={it.id} item={it} radius={14} showCap iconSize={compact ? 22 : 28} style={{ minHeight: big ? 0 : (compact ? 72 : 96) }} />
        ))}
      </div>
      <div style={{ position: 'relative', padding: big ? '0 26px 24px' : '0 18px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="dx-btn dx-btn-primary" style={{ flex: 1, justifyContent: 'center', padding: compact ? '11px 16px' : null }}>{Icon.check({ size: 18, color: '#fff' })} Wear today</button>
        <button className="dx-iconbtn" title="Shuffle" style={{ background: 'var(--bg-soft)' }}>{Icon.sparkle({ size: 18, color: 'var(--clay)' })}</button>
      </div>
    </div>
  );
}

function RecentRow({ count = 8, cardW = 168 }) {
  const recent = ['stay-cool-tee', 'chelsea-boots', 'olive-sweater', 'baggy-jeans', 'silver-necklace', 'carhartt-beanie', 'onika', 'petrol-jacket'];
  return (
    <div className="dx-row no-bar" style={{ gap: 16 }}>
      {recent.slice(0, count).map((id) => {
        const it = byId[id];
        return (
          <div key={id} className="dx-itemcard" style={{ width: cardW, padding: 9 }}>
            <GarmentTile item={it} radius={13} showCap iconOnly iconSize={22} style={{ height: cardW * 1.18 }} />
            <div className="dx-itemmeta" style={{ padding: '10px 4px 3px' }}>
              <div className="dx-itemname" style={{ fontSize: 14, marginBottom: 0 }}>{it.name}</div>
              <div className="dx-muted dx-mono" style={{ fontSize: 10.5, marginTop: 3 }}>{it.cat.toLowerCase()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HomeDesktop() {
  return (
    <div className="dx">
      <TopBar active="home" />
      <div style={{ flex: 1, minHeight: 0, padding: '34px 40px 40px', display: 'flex', gap: 34 }}>
        {/* left */}
        <div style={{ flex: '1.55', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div>
            <p className="dx-eyebrow" style={{ marginBottom: 12 }}>Tuesday · June 3</p>
            <h1 className="dx-display" style={{ fontSize: 52, display: 'flex', alignItems: 'baseline', gap: 14 }}>
              Welcome back
              <span style={{ position: 'relative', top: -4 }}><Sparkle4 s={26} c="var(--clay)" /></span>
            </h1>
            <p className="dx-sub" style={{ fontSize: 17, marginTop: 12, maxWidth: 460 }}>
              Your wardrobe, all in one place. Here's what's new and what to wear.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <StatCard n="22" label="Pieces catalogued" icon={Icon.hanger} accent />
            <StatCard n="4" label="Outfits built" icon={Icon.layers} />
            <StatCard n="7" label="Categories" icon={Icon.grid} />
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 className="dx-h2" style={{ fontSize: 24 }}>Recently added</h2>
              <a href="#" style={{ fontFamily: 'var(--body)', fontWeight: 600, fontSize: 14, color: 'var(--clay)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                View closet {Icon.arrowR({ size: 16, color: 'var(--clay)' })}
              </a>
            </div>
            <RecentRow count={8} cardW={170} />
            <div style={{ marginTop: 'auto', paddingTop: 22, display: 'flex', gap: 12 }}>
              <button className="dx-btn" style={{ background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' }}>{Icon.upload({ size: 18, color: '#fff' })} Upload a piece</button>
              <button className="dx-btn">{Icon.layers({ size: 18 })} Build an outfit</button>
            </div>
          </div>
        </div>

        {/* right — outfit of the day */}
        <div style={{ flex: '0 0 430px', display: 'flex' }}>
          <OutfitOfDay outfit={OUTFITS[1]} big />
        </div>
      </div>
    </div>
  );
}

function HomeMobile() {
  return (
    <div className="dx">
      <TopBar active="home" compact />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '16px 18px 6px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ flexShrink: 0 }}>
          <p className="dx-eyebrow" style={{ marginBottom: 6 }}>Tuesday · June 3</p>
          <h1 className="dx-display" style={{ fontSize: 27, display: 'flex', alignItems: 'center', gap: 9, whiteSpace: 'nowrap' }}>
            Welcome back <Sparkle4 s={17} c="var(--clay)" />
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {[['22', 'Pieces', true], ['4', 'Outfits', false], ['7', 'Cats', false]].map(([n, l, a]) => (
            <div key={l} className="dx-panel" style={{ flex: 1, padding: '11px 12px', background: a ? 'var(--clay-tint)' : undefined, borderColor: a ? 'var(--clay-soft)' : undefined }}>
              <div className="dx-stat-n" style={{ fontSize: 25 }}>{n}</div>
              <div className="dx-muted" style={{ fontSize: 11.5, fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>

        <OutfitOfDay outfit={OUTFITS[1]} compact />

        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
            <h2 className="dx-h2" style={{ fontSize: 18 }}>Recently added</h2>
            <a href="#" style={{ fontFamily: 'var(--body)', fontWeight: 600, fontSize: 13, color: 'var(--clay)', textDecoration: 'none' }}>All</a>
          </div>
          <RecentRow count={6} cardW={116} />
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}

Object.assign(window, { HomeDesktop, HomeMobile });
