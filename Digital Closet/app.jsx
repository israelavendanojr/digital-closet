// app.jsx — compose the three redesigned screens onto the design canvas.

function App() {
  return (
    <DesignCanvas>
      <DCSection id="home" title="1 · Home Dashboard" subtitle="A personal lookbook — greeting, stats, recently added, outfit of the day.">
        <DCArtboard id="home-d" label="Desktop · 1440" width={1440} height={980}><HomeDesktop /></DCArtboard>
        <DCArtboard id="home-m" label="Mobile · 390" width={390} height={860}><HomeMobile /></DCArtboard>
      </DCSection>

      <DCSection id="closet" title="2 · Closet Grid" subtitle="Masonry of floating, background-removed pieces. Category tabs + inline tag filters.">
        <DCArtboard id="closet-d" label="Desktop · 1440" width={1440} height={1925}><ClosetDesktop /></DCArtboard>
        <DCArtboard id="closet-m" label="Mobile · 390" width={390} height={860}><ClosetMobile /></DCArtboard>
      </DCSection>

      <DCSection id="outfit" title="3 · Outfit Builder" subtitle="Freeform mood-board canvas — drag pieces from the closet, layer & arrange.">
        <DCArtboard id="outfit-d" label="Desktop · 1440" width={1440} height={940}><OutfitDesktop /></DCArtboard>
        <DCArtboard id="outfit-m" label="Mobile · 390" width={390} height={844}><OutfitMobile /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
