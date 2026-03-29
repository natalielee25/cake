import { subscribe, getState } from '../utils/state.js';

// Flavor: light (top highlight), main (mid), dark (depth strip)
const FLAVOR = {
  vanilla:    { light: '#FFF8E1', main: '#F5DC90', dark: '#C8AA50', rim: '#B09040' },
  chocolate:  { light: '#A0622A', main: '#7B3F2E', dark: '#4A2218', rim: '#331508' },
  strawberry: { light: '#FFCDD8', main: '#FF9DB5', dark: '#E06080', rim: '#C04060' },
};

// Cream: top highlight, base color, border for depth
const CREAM = {
  whipped:       { hi: '#FFFFFF', base: '#F8F4F4', edge: '#E8DEDE' },
  buttercream:   { hi: '#FFFEF0', base: '#F5EC90', edge: '#D8D060' },
  ganache:       { hi: '#5A3020', base: '#2A1005', edge: '#1A0800' },
  'cream-cheese':{ hi: '#FFFFFF', base: '#FFF0E0', edge: '#E8D0B8' },
};

// [totalTiers] → array of tier configs, index 0 = top (narrowest)
const TIERS = {
  1: [{ w: 200, sh: 80, ch: 26, dh: 12 }],
  2: [{ w: 148, sh: 68, ch: 22, dh: 10 }, { w: 200, sh: 80, ch: 26, dh: 12 }],
  3: [{ w: 106, sh: 56, ch: 18, dh:  8 }, { w: 152, sh: 68, ch: 22, dh: 10 }, { w: 200, sh: 80, ch: 26, dh: 12 }],
};

const TOPPING_IMGS = {
  strawberry:       '/images/strawberry.png',
  'choc-strawberry':'/images/chocolate-strawberry.png',
  icing:            '/images/icing.png',
  macaron:          '/images/macaron.png',
};

function buildCake(s) {
  const numTiers = parseInt(s.tiers) || 1;
  const f  = FLAVOR[s.flavor]  || FLAVOR.vanilla;
  const cr = CREAM[s.cream]    || CREAM.whipped;
  const isHeart = s.shape === 'heart';
  const configs = TIERS[numTiers];

  // Toppings — rendered OUTSIDE cake-stack so clip-path doesn't cut them off
  const toppingHtml = (s.toppings && s.toppings.length)
    ? `<div class="cake-toppings-layer">
        ${s.toppings.map(t =>
          `<img src="${TOPPING_IMGS[t]}" class="topping-img" alt="${t}">`
        ).join('')}
       </div>`
    : '<div class="cake-toppings-layer"></div>';

  // Build tiers top→bottom
  const tiersHtml = configs.map((c) => {
    const creamW = c.w + 8; // cream bleeds 4px each side for drip illusion
    return `
    <div class="cake-tier" style="width:${c.w}px">
      <div class="tier-cream-wrap" style="width:${creamW}px; margin:0 -4px">
        <div class="tier-cream" style="
          height:${c.ch}px;
          background: radial-gradient(ellipse at 35% 30%, ${cr.hi}, ${cr.base} 60%, ${cr.edge} 100%);
        "></div>
      </div>
      <div class="tier-sponge" style="
        height:${c.sh}px;
        background: linear-gradient(180deg, ${f.light} 0%, ${f.main} 55%, ${f.dark} 100%);
        box-shadow: inset -10px 0 22px rgba(0,0,0,0.13), inset 8px 0 16px rgba(255,255,255,0.07);
      "></div>
      <div class="tier-depth" style="
        height:${c.dh}px;
        background: linear-gradient(180deg, ${f.dark}, ${f.rim});
        box-shadow: inset -6px 0 12px rgba(0,0,0,0.18);
      "></div>
    </div>`;
  }).join('');

  return `
    <div class="live-cake-scene">
      <div class="cake-with-toppings">
        ${toppingHtml}
        <div class="cake-stack${isHeart ? ' heart-shaped' : ''}">
          ${tiersHtml}
        </div>
      </div>

      <div class="cake-stand">
        <div class="stand-plate">
          <div class="stand-plate-shine"></div>
        </div>
        <div class="stand-stem"></div>
        <div class="stand-knob"></div>
        <div class="stand-base">
          <div class="stand-base-shine"></div>
        </div>
      </div>

      <div class="shape-badge">${isHeart ? '❤️ Heart' : '⭕ Round'}</div>
    </div>`;
}

export function initCakePreview(container) {
  container.innerHTML = `<div id="live-cake-wrap" class="live-cake-wrap"></div>`;

  function render(s) {
    const wrap = container.querySelector('#live-cake-wrap');
    if (!s.flavor && !s.cream && !s.tiers && !s.shape) {
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
