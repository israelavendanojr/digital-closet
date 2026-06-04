// dc-data.jsx — shared design system pieces for the digi·closet redesign.
// Icons, logo wordmark, top chrome, celestial doodles, garment placeholder
// tile, and the wardrobe data model. Exports everything to window.

/* ---------------------------------------------------------------- icons */
// Minimal line-icon set. 24x24 grid, 1.7 stroke, round caps.
const I = (paths, { fill = false, vb = 24, sw = 1.7 } = {}) => ({ size = 20, color = 'currentColor', style } = {}) =>
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill={fill ? color : 'none'}
    stroke={fill ? 'none' : color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flex: '0 0 auto', ...style }}>{paths}</svg>;

const Icon = {
  gear: I(<><circle cx="12" cy="12" r="3.2"/><path d="M12 2.6v2.4M12 19v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.6 12h2.4M19 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></>),
  user: I(<><circle cx="12" cy="8.4" r="3.6"/><path d="M5 19.4c1.2-3.2 4-4.6 7-4.6s5.8 1.4 7 4.6"/></>),
  search: I(<><circle cx="11" cy="11" r="6.4"/><path d="M20 20l-3.6-3.6"/></>),
  plus: I(<path d="M12 5v14M5 12h14"/>),
  sliders: I(<><path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h7M15 17h5"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="13" cy="17" r="2"/></>),
  chevD: I(<path d="M6 9l6 6 6-6"/>),
  chevR: I(<path d="M9 6l6 6-6 6"/>),
  chevL: I(<path d="M15 6l-6 6 6 6"/>),
  edit: I(<path d="M14.5 5.5l4 4M4 20l1-4L16 5a2 2 0 0 1 3 3L8 19l-4 1Z"/>),
  layers: I(<path d="M12 3l8 4-8 4-8-4 8-4ZM4 12l8 4 8-4M4 16.5l8 4 8-4"/>),
  heart: I(<path d="M12 20s-7-4.4-9.2-9C1.4 8 3 4.8 6.2 4.8c2 0 3.2 1.2 3.8 2.2.6-1 1.8-2.2 3.8-2.2 3.2 0 4.8 3.2 3.4 6.2C19 15.6 12 20 12 20Z"/>),
  grid: I(<><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></>),
  home: I(<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5"/>),
  hanger: I(<path d="M12 7.4c0-1.6 1.2-2.6 2.6-2.6 1.4 0 2.1.9 2.1 1.9 0 .9-.6 1.5-1.6 1.8L12 9.6 4 15.4c-.8.6-.4 2 .6 2h14.8c1 0 1.4-1.4.6-2L12 9.6"/>),
  upload: I(<path d="M12 15V4m0 0L8 8m4-4l4 4M5 16v2.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V16"/>),
  sparkle: I(<path d="M12 3c.6 4.6 1.8 5.8 6.4 6.4-4.6.6-5.8 1.8-6.4 6.4-.6-4.6-1.8-5.8-6.4-6.4C10.2 8.8 11.4 7.6 12 3Z"/>, { fill: true }),
  arrowR: I(<path d="M5 12h14M13 6l6 6-6 6"/>),
  image: I(<><rect x="3.5" y="4.5" width="17" height="15" rx="2.6"/><circle cx="9" cy="10" r="1.7"/><path d="M5 18l4.5-4.5 3 2.5L16 12l3.5 4"/></>),
  check: I(<path d="M5 12.5l4.5 4.5L19 7"/>),
  trash: I(<path d="M5 7h14M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M6.5 7l.8 12.2A1.5 1.5 0 0 0 8.8 20.6h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7"/>),
  calendar: I(<><rect x="4" y="5" width="16" height="15" rx="2.4"/><path d="M4 9.5h16M8.5 3v3.4M15.5 3v3.4"/></>),
  x: I(<path d="M6 6l12 12M18 6L6 18"/>),
  drag: I(<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>, { sw: 2.4 }),
  bag: I(<path d="M6 8h12l-.9 11.2a1.5 1.5 0 0 1-1.5 1.4H8.4a1.5 1.5 0 0 1-1.5-1.4L6 8ZM9 8V6.4a3 3 0 0 1 6 0V8"/>),
};

/* ---------------------------------------------------------------- logo */
function HangerMark({ size = 26, color = 'var(--clay)' }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 34 24" fill="none"
      stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M17 9.2c0-2.4 1.7-3.8 3.6-3.8 1.7 0 2.7 1 2.7 2.3 0 1-.7 1.8-1.9 2.1" />
      <path d="M4 18.6 L17 9.6 L30 18.6" />
      <line x1="3" y1="18.6" x2="31" y2="18.6" />
    </svg>
  );
}

function Logo({ scale = 1 }) {
  return (
    <div className="dx-logo" style={{ gap: 11 * scale }}>
      <span className="mark"><HangerMark size={27 * scale} /></span>
      <span className="dx-wordmark" style={{ fontSize: 26 * scale }}>
        digi<span className="dot">·</span>closet
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- chrome */
// Top app bar. `nav` shows the primary route pills (desktop). `compact` is
// the mobile bar (smaller, no inline nav).
function TopBar({ active = 'home', nav = true, compact = false }) {
  const links = [
    { id: 'home', label: 'Home', icon: Icon.home },
    { id: 'closet', label: 'Closet', icon: Icon.grid },
    { id: 'outfits', label: 'Outfits', icon: Icon.layers },
  ];
  return (
    <header className="dx-top" style={compact ? { padding: '14px 18px' } : null}>
      <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 0 : 36 }}>
        <Logo scale={compact ? 0.82 : 1} />
      </div>
      {nav && !compact && (
        <nav className="dx-nav">
          {links.map((l) => (
            <a key={l.id} href="#" className={l.id === active ? 'active' : ''}>
              <span className="ic" style={{ opacity: .85, display: 'flex' }}>{l.icon({ size: 18, color: l.id === active ? '#fff' : 'currentColor' })}</span>
              {l.label}
            </a>
          ))}
        </nav>
      )}
      <div className="dx-top-actions">
        <button className="dx-iconbtn" style={compact ? { width: 38, height: 38 } : null}>{Icon.search({ size: 19 })}</button>
        {!compact && <button className="dx-iconbtn">{Icon.gear({ size: 19 })}</button>}
        <button className="dx-iconbtn" style={compact ? { width: 38, height: 38 } : null}>{Icon.user({ size: 19 })}</button>
      </div>
    </header>
  );
}

// Mobile bottom tab bar
function BottomNav({ active = 'home' }) {
  const links = [
    { id: 'home', label: 'Home', icon: Icon.home },
    { id: 'closet', label: 'Closet', icon: Icon.grid },
    { id: 'add', label: 'Add', icon: Icon.plus, fab: true },
    { id: 'outfits', label: 'Outfits', icon: Icon.layers },
    { id: 'you', label: 'You', icon: Icon.user },
  ];
  return (
    <nav style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '10px 12px 18px', background: 'rgba(248,243,232,.92)', backdropFilter: 'blur(8px)',
      borderTop: '1px solid var(--border)' }}>
      {links.map((l) => l.fab ? (
        <button key={l.id} style={{ width: 50, height: 50, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'var(--clay)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 18px rgba(190,111,74,.32)', marginTop: -6 }}>{l.icon({ size: 24, color: '#fff' })}</button>
      ) : (
        <div key={l.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: l.id === active ? 'var(--ink)' : 'var(--muted)', cursor: 'pointer' }}>
          {l.icon({ size: 22, color: l.id === active ? 'var(--clay)' : 'var(--muted)' })}
          <span style={{ fontSize: 10.5, fontWeight: 600, fontFamily: 'var(--body)' }}>{l.label}</span>
        </div>
      ))}
    </nav>
  );
}

/* ---------------------------------------------------------------- doodles */
// Refined celestial motif — curated scatter of sparkles / stars / moons /
// dots. `items` is an array of [type, x%, y%, size, rotate, opacity].
function Sparkle4({ s = 16, c }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 0c.7 6.6 4.7 10.6 12 11.3-7.3.7-11.3 4.7-12 12-.7-7.3-4.7-11.3-12-12C7.3 10.6 11.3 6.6 12 0Z"/></svg>;
}
function StarOutline({ s = 16, c }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinejoin="round"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.9z"/></svg>;
}
function Moon({ s = 16, c }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>;
}
function Dot({ s = 6, c }) { return <svg width={s} height={s} viewBox="0 0 8 8"><circle cx="4" cy="4" r="3.4" fill="none" stroke={c} strokeWidth="1"/></svg>; }

function Doodles({ items, color = 'var(--clay)', style }) {
  const map = { sp: Sparkle4, st: StarOutline, mn: Moon, dt: Dot };
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>
      {items.map(([t, x, y, s, rot = 0, op = .5], i) => {
        const C = map[t];
        return <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: `rotate(${rot}deg)`, opacity: op }}><C s={s} c={color} /></span>;
      })}
    </div>
  );
}

/* a vertical ribbon of doodles, used to flank panels like the original home */
function DoodleColumn({ height = 360, color = 'var(--clay)', seed = 0 }) {
  const set = [
    ['st', 18, 14], ['dt', 60, 22], ['sp', 30, 30], ['mn', 66, 40],
    ['st', 22, 50], ['sp', 58, 58], ['dt', 30, 67], ['st', 64, 76], ['sp', 26, 86],
  ];
  return (
    <div style={{ position: 'relative', width: 44, height }}>
      {set.map(([t, x, y], i) => {
        const C = { sp: Sparkle4, st: StarOutline, mn: Moon, dt: Dot }[t];
        const s = t === 'dt' ? 6 : t === 'mn' ? 14 : 13 + ((i + seed) % 3) * 3;
        return <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, opacity: .42 + (i % 3) * .12 }}><C s={s} c={color} /></span>;
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- garment tile */
// Placeholder for a background-removed garment photo. Tinted by the item's
// real color, faint hatch, a color swatch, and a monospace caption. Drop a
// real cutout in here later. radius + showCap configurable.
function GarmentTile({ item, radius = 16, showCap = true, showSwatch = true, label, iconOnly = false, iconSize = 26, style }) {
  const tint = `color-mix(in srgb, ${item.color} 20%, var(--surface))`;
  const tint2 = `color-mix(in srgb, ${item.color} 8%, var(--surface))`;
  return (
    <div className="dx-tile" style={{ borderRadius: radius, background: `linear-gradient(150deg, ${tint}, ${tint2})`, ...style }}>
      <span className="hatch" style={{ borderRadius: radius }}></span>
      {showSwatch && <span className="swatch" style={{ background: item.color }}></span>}
      {showCap && (
        <div className="cap-stack">
          {Icon.image({ size: iconSize, color: 'rgba(63,58,49,.3)' })}
          {!iconOnly && <span className="cap-lbl">{label || item.cat}</span>}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- data */
const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Headwear', 'Accessories'];

const ITEMS = [
  { id: 'burgundy-tee', name: 'Burgundy Tee', cat: 'Tops', color: '#7d2230', tags: ['casual', 'vintage'] },
  { id: 'olive-sweater', name: 'Olive Sweater', cat: 'Tops', color: '#5b6033', tags: ['winter', 'chic'] },
  { id: 'airism-white', name: 'Uniqlo Airism White', cat: 'Tops', color: '#e9e6df', tags: ['summer', 'basic'] },
  { id: 'airism-black', name: 'Uniqlo Airism Black', cat: 'Tops', color: '#2b2b2d', tags: ['summer', 'basic'] },
  { id: 'black-collar', name: 'Black Collar Shirt', cat: 'Tops', color: '#26262a', tags: ['formal', 'work'] },
  { id: 'vintage-tee', name: 'Vintage Tee', cat: 'Tops', color: '#3a3631', tags: ['vintage', 'casual'] },
  { id: 'stay-cool-tee', name: 'Stay Cool Tee', cat: 'Tops', color: '#2746b8', tags: ['summer', 'y2k'] },
  { id: 'dune-pant', name: 'Dune Pant', cat: 'Bottoms', color: '#2c2b29', tags: ['chic', 'work'] },
  { id: 'light-wash', name: 'Light Wash Jeans', cat: 'Bottoms', color: '#7fa3c8', tags: ['casual', 'summer'] },
  { id: 'vintage-wash', name: 'Vintage Wash Jeans', cat: 'Bottoms', color: '#6d8099', tags: ['vintage', 'y2k'] },
  { id: 'baggy-jeans', name: 'Baggy Neutral Jeans', cat: 'Bottoms', color: '#9a9384', tags: ['y2k', 'casual'] },
  { id: 'petrol-jacket', name: 'Petrol Jacket', cat: 'Outerwear', color: '#5a4636', tags: ['work', 'winter'] },
  { id: 'leather-jacket', name: 'Leather Jacket', cat: 'Outerwear', color: '#3b332c', tags: ['chic', 'winter'] },
  { id: 'black-loafers', name: 'Black Loafers', cat: 'Footwear', color: '#1f1f22', tags: ['formal', 'chic'] },
  { id: 'onika', name: 'Onika', cat: 'Footwear', color: '#d8cdb8', tags: ['casual', 'summer'] },
  { id: 'chelsea-boots', name: 'Brown Chelsea Boots', cat: 'Footwear', color: '#7a5234', tags: ['chic', 'winter'] },
  { id: 'timberlands', name: 'Timberlands', cat: 'Footwear', color: '#bd8438', tags: ['casual', 'winter'] },
  { id: 'yankees-cap', name: 'Yankees Grey Cap', cat: 'Headwear', color: '#3a4759', tags: ['casual', 'y2k'] },
  { id: 'black-cap', name: 'Black Cap', cat: 'Headwear', color: '#262629', tags: ['casual', 'basic'] },
  { id: 'carhartt-beanie', name: 'Carhartt Beanie', cat: 'Headwear', color: '#9c6a36', tags: ['winter', 'casual'] },
  { id: 'silver-necklace', name: 'Silver Necklace', cat: 'Accessories', color: '#b9bcc0', tags: ['chic', 'formal'] },
  { id: 'silver-bracelet', name: 'Silver Bracelet', cat: 'Accessories', color: '#aeb2b6', tags: ['chic', 'y2k'] },
];
const byId = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

const OUTFITS = [
  { id: 'all-black', name: 'All Black', items: ['black-cap', 'leather-jacket', 'airism-black', 'dune-pant'], tags: ['chic', 'work'], fav: true },
  { id: 'night-out', name: 'Night Out', items: ['petrol-jacket', 'burgundy-tee', 'vintage-wash', 'black-loafers'], tags: ['formal', 'chic'] },
  { id: 'casual-outting', name: 'Casual Outting', items: ['burgundy-tee', 'dune-pant', 'onika'], tags: ['casual', 'summer'] },
  { id: 'nuevayol', name: 'NuevaYol', items: ['yankees-cap', 'airism-white', 'light-wash', 'chelsea-boots'], tags: ['casual', 'y2k'] },
];

const ALL_TAGS = ['casual', 'formal', 'chic', 'winter', 'summer', 'vintage', 'y2k', 'work', 'basic'];

Object.assign(window, {
  Icon, HangerMark, Logo, TopBar, BottomNav, Doodles, DoodleColumn,
  Sparkle4, StarOutline, Moon, Dot, GarmentTile,
  CATEGORIES, ITEMS, byId, OUTFITS, ALL_TAGS,
});
