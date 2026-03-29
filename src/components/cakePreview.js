import { subscribe, getState } from '../utils/state.js';

const FLAVOR = {
  vanilla:    { light: '#FFF8E0', mid: '#F5DC8A', dark: '#C8A840', shadow: '#A08020' },
  chocolate:  { light: '#9A6040', mid: '#7B3F2E', dark: '#4A2218', shadow: '#2A1008' },
  strawberry: { light: '#FFD8E0', mid: '#FF99B0', dark: '#E06080', shadow: '#B04060' },
};

const CREAM = {
  whipped:       { hi: '#FFFFFF', base: '#F5EFEF', edge: '#DEDAD8' },
  buttercream:   { hi: '#FFFEF5', base: '#F0E870', edge: '#C8C840' },
  ganache:       { hi: '#6A3A20', base: '#2A1005', edge: '#180800' },
  'cream-cheese':{ hi: '#FFFFFF', base: '#FEF0E0', edge: '#E0C8A8' },
};

// [totalTiers] → top→bottom order, index 0 = top (narrowest)
const TIERS = {
  1: [{ w: 210, sh: 90, ch: 24 }],
  2: [{ w: 152, sh: 76, ch: 20 }, { w: 210, sh: 90, ch: 24 }],
  3: [{ w: 108, sh: 60, ch: 16 }, { w: 156, sh: 76, ch: 20 }, { w: 210, sh: 90, ch: 24 }],
};

const TOPPING_IMGS = {
  strawberry:       '/images/strawberry.png',
  'choc-strawberry':'/images/chocolate-strawberry.png',
  icing:            '/images/icing.png',
  macaron:          '/images/macaron.png',
};

function buildTier(c, f, cr) {
  const halfW = Math.round(c.w / 2);
  const fw    = c.w + 14; // frosting disc overhangs 7px per side
  const fml   = -Math.round((fw - c.w) / 2); // negative margin to centre overflow
  const spongeUp = Math.round(c.ch * 0.42); // sponge tucks up into frosting

  return `
  <div class="cake-tier" style="width:${c.w}px">
    <div class="tier-frosting" style="
      width:${fw}px;
      height:${c.ch}px;
      margin:0 ${fml}px;
      background: radial-gradient(ellipse 60% 55% at 40% 30%, ${cr.hi} 0%, ${cr.base} 55%, ${cr.edge} 100%);
      border-radius:50%;
      position:relative;
      z-index:2;
    "></div>
    <div class="tier-sponge" style="
      height:${c.sh}px;
      background: linear-gradient(175deg, ${f.light} 0%, ${f.mid} 45%, ${f.dark} 82%, ${f.shadow} 100%);
      border-radius:${halfW}px / 18px;
      box-shadow: inset -12px 0 24px rgba(0,0,0,0.14), inset 10px 0 18px rgba(255,255,255,0.07);
      margin-top:-${spongeUp}px;
      margin-bottom:-18px;
      position:relative;
      z-index:1;
    "></div>
  </div>`;
}

function buildCake(s) {
  const numTiers = parseInt(s.tiers) || 1;
  const f  = FLAVOR[s.flavor]  || FLAVOR.vanilla;
  const cr = CREAM[s.cream]    || CREAM.whipped;
  const configs = TIERS[numTiers];

  const tiersHtml = configs.map(c => buildTier(c, f, cr)).join('');

  // Bottom cap so last sponge's rounded bottom doesn't float
  const bottomW   = configs[configs.length - 1].w;
  const bottomCap = `<div class="cake-base-cap" style="
    width:${bottomW}px;
    height:18px;
    background:linear-gradient(180deg, ${f.dark}, ${f.shadow});
    border-radius:${Math.round(bottomW/2)}px / 9px;
    margin-top:16px;
  "></div>`;

  // Toppings — each clipped into a circle so the lavender bg is hidden
  const toppingHtml = (s.toppings && s.toppings.length)
    ? `<div class="cake-toppings-row">
        ${s.toppings.map(t =>
          `<div class="topping-bubble">
            <img src="${TOPPING_IMGS[t]}" class="topping-img" alt="${t}">
           </div>`
        ).join('')}
       </div>`
    : `<div class="cake-toppings-row"></div>`;

  return `
    <div class="live-cake-scene">
      <div class="cake-column">
        ${toppingHtml}
        <div class="cake-stack">
          ${tiersHtml}
          ${bottomCap}
        </div>
      </div>

      <div class="cake-stand">
        <div class="stand-plate"><div class="stand-plate-shine"></div></div>
        <div class="stand-stem"></div>
        <div class="stand-knob"></div>
        <div class="stand-base"><div class="stand-base-shine"></div></div>
      </div>
    </div>`;
}

export function initCakePreview(container) {
  container.innerHTML = `<div id="live-cake-wrap" class="live-cake-wrap"></div>`;

  function render(s) {
    const wrap = container.querySelector('#live-cake-wrap');
    if (!s.flavor && !s.cream && !s.tiers) {
      wrap.innerHTML = `
        <div class="cake-empty-state">
          <div class="cake-empty-icon">🎂</div>
          <p>Your cake will<br>appear here!</p>
        </div>`;
      return;
    }
    wrap.innerHTML = buildCake(s);
  }

  subscribe(render);
  render(getState());
}
