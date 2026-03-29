import { subscribe, getState } from '../utils/state.js';

const FLAVOR_COLORS = {
  vanilla:    { light: '#FFF6DA', main: '#F5E0A0', dark: '#D4B860' },
  chocolate:  { light: '#A0623A', main: '#7B3F2E', dark: '#4A2218' },
  strawberry: { light: '#FFCDD8', main: '#FFAABB', dark: '#DD7799' },
};

const CREAM_COLORS = {
  whipped:       { top: '#FFFAFA', mid: '#F5F0F0', border: '#E8E0E0' },
  buttercream:   { top: '#FFFDE0', mid: '#F5EC90', border: '#D9C850' },
  ganache:       { top: '#2A1005', mid: '#4A2010', border: '#1A0805' },
  'cream-cheese':{ top: '#FFF4EA', mid: '#F0D8BC', border: '#D8B890' },
};

// [totalTiers] → array of tier configs, index 0 = top tier (smallest)
const TIER_CONFIG = {
  1: [{ w: 200, sh: 80, ch: 24 }],
  2: [{ w: 150, sh: 68, ch: 20 }, { w: 200, sh: 80, ch: 24 }],
  3: [{ w: 108, sh: 58, ch: 16 }, { w: 154, sh: 68, ch: 20 }, { w: 200, sh: 80, ch: 24 }],
};

const TOPPING_IMGS = {
  strawberry:       '/images/strawberry.png',
  'choc-strawberry':'/images/chocolate-strawberry.png',
  icing:            '/images/icing.png',
  macaron:          '/images/macaron.png',
};

export function initCakePreview(container) {
  container.innerHTML = `<div id="live-cake-wrap" class="live-cake-wrap"></div>`;

  function render(s) {
    const wrap = container.querySelector('#live-cake-wrap');

    if (!s.flavor && !s.cream && !s.tiers && !s.shape) {
      wrap.innerHTML = `
        <div class="cake-empty-state">
          <div class="cake-empty-icon">🎂</div>
          <p>Your cake will appear here!</p>
        </div>`;
      return;
    }

    const tiers    = parseInt(s.tiers) || 1;
    const flavor   = FLAVOR_COLORS[s.flavor]  || FLAVOR_COLORS.vanilla;
    const cream    = CREAM_COLORS[s.cream]    || CREAM_COLORS.whipped;
    const isHeart  = s.shape === 'heart';
    const configs  = TIER_CONFIG[tiers];

    // Toppings
    const toppingHtml = (s.toppings && s.toppings.length > 0)
      ? `<div class="cake-toppings-layer">${s.toppings.map(t =>
          `<img src="${TOPPING_IMGS[t]}" class="topping-img" alt="${t}">`
        ).join('')}</div>`
      : '';

    // Tiers HTML (top → bottom in DOM order)
    const tiersHtml = configs.map((c, i) => `
      <div class="cake-tier${i === 0 ? ' tier-top' : ''}" style="width:${c.w}px">
        <div class="tier-cream" style="
          height:${c.ch}px;
          background: linear-gradient(to bottom, ${cream.top}, ${cream.mid});
          box-shadow: inset 0 -2px 0 ${cream.border};
        "></div>
        <div class="tier-sponge" style="
          height:${c.sh}px;
          background: linear-gradient(to bottom, ${flavor.light} 0%, ${flavor.main} 60%, ${flavor.dark} 100%);
        "></div>
      </div>
    `).join('');

    wrap.innerHTML = `
      <div class="live-cake-scene">
        <div class="cake-stack${isHeart ? ' heart-shaped' : ''}">
          ${toppingHtml}
          ${tiersHtml}
        </div>
        <div class="cake-stand">
          <div class="stand-plate"></div>
          <div class="stand-stem"></div>
          <div class="stand-base"></div>
        </div>
        ${isHeart ? '<div class="shape-badge">❤️ Heart</div>' : '<div class="shape-badge">⭕ Round</div>'}
      </div>`;
  }

  subscribe(render);
  render(getState());
}
