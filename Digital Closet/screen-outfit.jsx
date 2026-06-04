// screen-outfit.jsx — Outfit Builder Canvas (desktop + mobile). Visual mock.

// A garment "floating" on the board (background-removed look).
function FloatItem({ item, x, y, w, rot = 0, z = 1, selected, scale = 1 }) {
  const tint = `color-mix(in srgb, ${item.color} 15%, var(--surface))`;
  const tint2 = `color-mix(in srgb, ${item.color} 6%, var(--surface))`;
  const W = w * scale;
  return (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: W, zIndex: z, transform: `rotate(${rot}deg)` }}>
      <div style={{ position: 'relative', borderRadius: 16, height: W * 1.16, overflow: 'hidden',
        background: `linear-gradient(155deg, ${tint}, ${tint2})`,
        border: '1px solid var(--border-soft)',
        boxShadow: selected ? '0 18px 40px rgba(63,58,49,.22)' : '0 12px 26px rgba(63,58,49,.15)' }}>
        <span style={{ position: 'absolute', inset: 0, opacity: .5,
          backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 11px, rgba(63,58,49,.045) 11px 12px)' }}></span>
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-58%)' }}>{Icon.image({ size: Math.max(20, W * 0.16), color: 'rgba(63,58,49,.26)' })}</span>
        <span style={{ position: 'absolute', top: 8, left: 8, width: 12, height: 12, borderRadius: '50%', background: item.color,
          boxShadow: '0 0 0 2px rgba(251,248,241,.9)' }}></span>
        <span style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)', background: 'rgba(251,248,241,.85)',
          padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap', border: '1px solid var(--border-soft)' }}>{item.name.toLowerCase()}</span>
      </div>
      {selected && (
        <div style={{ position: 'absolute', inset: -6, border: '1.5px dashed var(--clay)', borderRadius: 20, pointerEvents: 'none' }}>
          {[['-7px', '-7px'], ['-7px', 'auto'], ['auto', '-7px'], ['auto', 'auto']].map((p, i) => (
            <span key={i} style={{ position: 'absolute', top: i < 2 ? p[0] : 'auto', bottom: i >= 2 ? '-7px' : 'auto',
              left: i % 2 === 0 ? '-7px' : 'auto', right: i % 2 === 1 ? '-7px' : 'auto',
              width: 12, height: 12, borderRadius: 4, background: '#fff', border: '1.5px solid var(--clay)' }}></span>
          ))}
        </div>
      )}
    </div>
  );
}

function PickerCard({ item, w }) {
  return (
    <div style={{ position: 'relative', borderRadius: 13, padding: 7, background: 'var(--bg-soft)', border: '1px solid var(--border-soft)',
      cursor: 'grab', breakInside: 'avoid', marginBottom: 10, transition: '.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-soft)'; }}>
      <span style={{ position: 'absolute', top: 12, right: 12, color: 'var(--faint)', zIndex: 2 }}>{Icon.drag({ size: 15, color: 'var(--faint)' })}</span>
      <GarmentTile item={item} radius={9} showCap iconOnly iconSize={18} showSwatch={false} style={{ height: w * 1.1 }} />
      <div className="dx-mono" style={{ fontSize: 10, color: 'var(--ink-soft)', padding: '7px 3px 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
    </div>
  );
}

function BuilderBar({ name = 'Untitled look', tags = ['casual', 'chic'], compact }) {
  return (
    <header className="dx-top" style={{ padding: compact ? '12px 16px' : '14px 30px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 10 : 18, minWidth: 0 }}>
        <button className="dx-iconbtn" style={{ width: compact ? 36 : 40, height: compact ? 36 : 40 }}>{Icon.chevL({ size: 20 })}</button>
        {!compact && <Logo scale={0.78} />}
        {!compact && <span style={{ width: 1, height: 30, background: 'var(--border)' }}></span>}
        <div style={{ minWidth: 0 }}>
          {!compact && <p className="dx-eyebrow" style={{ marginBottom: 3 }}>Building outfit</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="dx-h2" style={{ fontSize: compact ? 18 : 23, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{name}</span>
            {Icon.edit({ size: compact ? 15 : 17, color: 'var(--muted)' })}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 8 : 12 }}>
        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {tags.map((t) => <span key={t} className="dx-chip">{t}<span style={{ color: 'var(--faint)' }}>×</span></span>)}
            <span className="dx-chip" style={{ borderStyle: 'dashed', color: 'var(--muted)' }}>{Icon.plus({ size: 13, color: 'var(--muted)' })} tag</span>
          </div>
        )}
        <button className="dx-btn dx-btn-primary" style={compact ? { padding: '10px 16px' } : null}>{Icon.check({ size: 18, color: '#fff' })} {compact ? 'Save' : 'Save outfit'}</button>
      </div>
    </header>
  );
}

// the board background (dotted, soft)
const boardBg = {
  background: 'radial-gradient(circle at 1px 1px, rgba(63,58,49,.10) 1px, transparent 0)',
  backgroundSize: '26px 26px',
};

function Board({ scale = 1, children, height }) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0, height,
      borderRadius: 22, overflow: 'hidden',
      background: 'linear-gradient(170deg, var(--surface), color-mix(in srgb, var(--card) 50%, var(--surface)))',
      border: '1px solid var(--border)', boxShadow: 'inset 0 2px 18px rgba(63,58,49,.05)' }}>
      <div style={{ position: 'absolute', inset: 0, ...boardBg, opacity: .6 }}></div>
      <Doodles color="var(--clay)" items={[['sp', 92, 6, 15, 0, .3], ['st', 6, 90, 13, 0, .28], ['dt', 88, 92, 6, 0, .4], ['mn', 5, 8, 14, 0, .22]]} />
      {children}
    </div>
  );
}

function OutfitDesktop() {
  const look = ['yankees-cap', 'petrol-jacket', 'burgundy-tee', 'dune-pant', 'black-loafers'];
  const pickerW = (270 - 28 - 10) / 2;
  return (
    <div className="dx">
      <BuilderBar name="Night Out" tags={['formal', 'chic']} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 20, padding: 20 }}>
        {/* picker */}
        <aside className="dx-panel" style={{ flex: '0 0 270px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 className="dx-h2" style={{ fontSize: 17 }}>Your closet</h3>
            <span className="dx-chip tiny" style={{ pointerEvents: 'none' }}>22</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 999, padding: '8px 13px', marginBottom: 12 }}>
            {Icon.search({ size: 16, color: 'var(--muted)' })}
            <span className="dx-muted" style={{ fontSize: 13 }}>Search pieces</span>
          </div>
          <div className="dx-tabs no-bar" style={{ overflowX: 'auto', marginBottom: 12, flex: '0 0 auto' }}>
            {['All', 'Tops', 'Bottoms', 'Shoes'].map((c, i) => <div key={c} className={'dx-tab' + (i === 0 ? ' is-active' : '')} style={{ fontSize: 13, padding: '6px 12px' }}>{c}</div>)}
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', columnCount: 2, columnGap: 10 }} className="no-bar">
            {ITEMS.map((it) => <PickerCard key={it.id} item={it} w={pickerW} />)}
          </div>
        </aside>

        {/* canvas */}
        <Board>
          <div style={{ position: 'absolute', top: 18, left: 20, display: 'flex', alignItems: 'center', gap: 8, zIndex: 20 }}>
            <span className="dx-chip" style={{ background: 'rgba(251,248,241,.8)', pointerEvents: 'none' }}>{Icon.layers({ size: 14, color: 'var(--clay)' })} 5 pieces</span>
            <span className="dx-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>drag to arrange · layer freely</span>
          </div>

          <FloatItem item={byId[look[0]]} x={42} y={4} w={150} rot={-6} z={5} />
          <FloatItem item={byId[look[1]]} x={13} y={26} w={250} rot={-4} z={2} />
          <FloatItem item={byId[look[2]]} x={40} y={30} w={240} rot={3} z={6} selected />
          <FloatItem item={byId[look[3]]} x={66} y={28} w={210} rot={5} z={3} />
          <FloatItem item={byId[look[4]]} x={44} y={66} w={210} rot={-2} z={4} />

          {/* floating board toolbar */}
          <div style={{ position: 'absolute', bottom: 18, right: 18, display: 'flex', gap: 6, background: 'rgba(251,248,241,.92)',
            border: '1px solid var(--border)', borderRadius: 999, padding: 6, boxShadow: 'var(--shadow-md)', zIndex: 20 }}>
            {[Icon.plus, Icon.layers, Icon.sparkle].map((ic, i) => (
              <button key={i} className="dx-iconbtn" style={{ width: 36, height: 36, border: 'none', background: i === 0 ? 'var(--clay)' : 'transparent' }}>{ic({ size: 18, color: i === 0 ? '#fff' : 'var(--ink-soft)' })}</button>
            ))}
          </div>
        </Board>
      </div>
    </div>
  );
}

function OutfitMobile() {
  const look = ['yankees-cap', 'petrol-jacket', 'burgundy-tee', 'dune-pant', 'black-loafers'];
  const tray = ['olive-sweater', 'light-wash', 'onika', 'chelsea-boots', 'black-cap', 'silver-necklace'];
  return (
    <div className="dx">
      <BuilderBar name="Night Out" compact />
      <div style={{ flex: 1, minHeight: 0, position: 'relative', padding: '12px 12px 0', display: 'flex', flexDirection: 'column' }}>
        <Board height="100%">
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 20 }}>
            <span className="dx-chip tiny" style={{ background: 'rgba(251,248,241,.85)', pointerEvents: 'none' }}>{Icon.layers({ size: 13, color: 'var(--clay)' })} 5 pieces</span>
          </div>
          <FloatItem item={byId[look[0]]} x={40} y={4} w={92} rot={-6} z={5} />
          <FloatItem item={byId[look[1]]} x={8} y={24} w={150} rot={-4} z={2} />
          <FloatItem item={byId[look[2]]} x={40} y={30} w={140} rot={3} z={6} selected />
          <FloatItem item={byId[look[3]]} x={58} y={26} w={130} rot={5} z={3} />
          <FloatItem item={byId[look[4]]} x={42} y={64} w={130} rot={-2} z={4} />
        </Board>
      </div>
      {/* drag tray */}
      <div style={{ flex: '0 0 auto', padding: '12px 0 16px', background: 'rgba(248,243,232,.92)', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 10px' }}>
          <span className="dx-h2" style={{ fontSize: 15 }}>Your closet</span>
          <span className="dx-mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>drag up to add ↑</span>
        </div>
        <div className="dx-row no-bar" style={{ gap: 10, padding: '0 16px' }}>
          {tray.map((id) => (
            <div key={id} style={{ width: 76, flex: '0 0 auto' }}>
              <GarmentTile item={byId[id]} radius={11} showCap iconOnly iconSize={18} showSwatch={false} style={{ height: 84, boxShadow: 'var(--shadow-sm)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OutfitDesktop, OutfitMobile });
