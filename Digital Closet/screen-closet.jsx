// screen-closet.jsx — Closet Grid masonry (desktop + mobile)

const _ratios = [1.32, 1.5, 1.2, 1.42, 1.26, 1.55, 1.16];

function ItemCard({ item, w, ratio, compact }) {
  return (
    <div className="dx-itemcard" style={{ breakInside: 'avoid', marginBottom: compact ? 12 : 18, padding: compact ? 8 : 10 }}>
      <div className="quick" style={compact ? { top: 14, right: 14 } : null}>
        <button className="dx-quickbtn" title="Edit" style={compact ? { width: 30, height: 30 } : null}>{Icon.edit({ size: compact ? 15 : 17 })}</button>
        <button className="dx-quickbtn" title="Add to outfit" style={compact ? { width: 30, height: 30 } : null}>{Icon.layers({ size: compact ? 15 : 17 })}</button>
      </div>
      <GarmentTile item={item} radius={compact ? 11 : 14} showCap iconOnly={compact} iconSize={compact ? 20 : 26} style={{ height: Math.round(w * ratio) }} />
      <div className="dx-itemmeta" style={{ padding: compact ? '9px 3px 2px' : '11px 5px 3px' }}>
        <div className="dx-itemname" style={{ fontSize: compact ? 13.5 : 15, marginBottom: compact ? 6 : 8 }}>{item.name}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {item.tags.slice(0, 2).map((t) => <span key={t} className="dx-chip tiny" style={{ pointerEvents: 'none' }}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function FilterBar({ activeCat = 'All', compact }) {
  return (
    <div style={{ flex: '0 0 auto' }}>
      <div className={'dx-tabs no-bar' + (compact ? '' : '')} style={{ overflowX: compact ? 'auto' : 'visible', paddingBottom: compact ? 4 : 0 }}>
        {CATEGORIES.map((c) => <div key={c} className={'dx-tab' + (c === activeCat ? ' is-active' : '')}>{c}</div>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, flexWrap: compact ? 'nowrap' : 'wrap',
        overflowX: compact ? 'auto' : 'visible' }} className="no-bar">
        <span className="dx-mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginRight: 2, flex: '0 0 auto' }}>Filter</span>
        {ALL_TAGS.map((t, i) => <span key={t} className={'dx-chip' + (i === 0 ? ' is-active' : '')} style={{ flex: '0 0 auto' }}>{t}</span>)}
      </div>
    </div>
  );
}

function ClosetDesktop() {
  const cols = 6;
  const gridW = 1440 - 80 - (cols - 1) * 18;
  const colW = gridW / cols;
  return (
    <div className="dx">
      <TopBar active="closet" />
      <div style={{ flex: 1, minHeight: 0, padding: '30px 40px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <p className="dx-eyebrow" style={{ marginBottom: 10 }}>Your closet</p>
            <h1 className="dx-display" style={{ fontSize: 40 }}>All pieces <span className="dx-muted" style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 26 }}>22</span></h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="dx-btn dx-btn-sm">{Icon.sliders({ size: 17 })} Sort</button>
            <button className="dx-btn dx-btn-sm dx-btn-primary">{Icon.upload({ size: 17, color: '#fff' })} Add piece</button>
          </div>
        </div>
        <FilterBar activeCat="All" />
        <hr className="dx-div" style={{ margin: '22px 0 24px' }} />
        <div style={{ columnCount: cols, columnGap: 18 }}>
          {ITEMS.map((it, i) => <ItemCard key={it.id} item={it} w={colW} ratio={_ratios[i % _ratios.length]} />)}
        </div>
        <div style={{ height: 40 }}></div>
      </div>
    </div>
  );
}

function ClosetMobile() {
  const cols = 2;
  const colW = (390 - 36 - 12) / cols;
  return (
    <div className="dx">
      <TopBar active="closet" compact />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '16px 18px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 className="dx-display" style={{ fontSize: 26 }}>Closet <span className="dx-muted" style={{ fontWeight: 600, fontSize: 17 }}>22</span></h1>
          <button className="dx-iconbtn" style={{ width: 38, height: 38, background: 'var(--clay)', borderColor: 'var(--clay)' }}>{Icon.upload({ size: 18, color: '#fff' })}</button>
        </div>
        <FilterBar activeCat="All" compact />
        <hr className="dx-div" style={{ margin: '16px 0 16px' }} />
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ columnCount: cols, columnGap: 12 }}>
            {ITEMS.slice(0, 10).map((it, i) => <ItemCard key={it.id} item={it} w={colW} ratio={_ratios[i % _ratios.length]} compact />)}
          </div>
        </div>
      </div>
      <BottomNav active="closet" />
    </div>
  );
}

Object.assign(window, { ClosetDesktop, ClosetMobile });
