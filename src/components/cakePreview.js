import { subscribe, getState } from '../utils/state.js';

const FLAVOR_LABELS = {
  vanilla: 'Vanilla Sponge',
  chocolate: 'Chocolate Sponge',
  strawberry: 'Strawberry Sponge',
};
const CREAM_LABELS = {
  whipped: 'Whipped Cream',
  buttercream: 'Buttercream',
  ganache: 'Choc Ganache',
  'cream-cheese': 'Cream Cheese',
};
const TOPPING_LABELS = {
  strawberry: '🍓 Strawberry',
  'choc-strawberry': '🍫 Choc Strawberry',
  icing: '🍦 Icing',
  macaron: '🌸 Macaron',
};

export function initCakePreview(container) {
  container.innerHTML = `
    <div class="cake-preview-wrap">
      <div class="cake-img-frame">
        <img src="/images/cake-reference.png" alt="Your cake" class="cake-img" />
        <div class="cake-overlay"></div>
      </div>
      <div class="cake-tags" id="cake-tags">
        <span class="cake-tag placeholder-tag">Choose your options →</span>
      </div>
    </div>
  `;

  function render(s) {
    const tags = container.querySelector('#cake-tags');
    const parts = [];

    if (s.shape)  parts.push({ icon: s.shape === 'heart' ? '❤️' : '⭕', text: s.shape === 'heart' ? 'Heart Shape' : 'Round Shape' });
    if (s.flavor) parts.push({ icon: '🍰', text: FLAVOR_LABELS[s.flavor] || s.flavor });
    if (s.cream)  parts.push({ icon: '🍦', text: CREAM_LABELS[s.cream] || s.cream });
    if (s.tiers)  parts.push({ icon: '🎂', text: `${s.tiers} Tier${s.tiers > 1 ? 's' : ''}` });
    s.toppings.forEach(t => parts.push({ icon: '', text: TOPPING_LABELS[t] || t }));

    if (parts.length === 0) {
      tags.innerHTML = `<span class="cake-tag placeholder-tag">Choose your options →</span>`;
    } else {
      tags.innerHTML = parts.map(p =>
        `<span class="cake-tag">${p.icon ? p.icon + ' ' : ''}${p.text}</span>`
      ).join('');
    }
  }

  subscribe(render);
  render(getState());
}
