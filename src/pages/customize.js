import { navigateTo } from '../utils/transitions.js';
import { setState, toggleTopping, getState, isComplete } from '../utils/state.js';
import { initCakePreview } from '../components/cakePreview.js';

const FLAVOR_SWATCHES = {
  vanilla:    '#F5E0A0',
  chocolate:  '#7B3F2E',
  strawberry: '#FF9DB5',
};

const CREAM_SWATCHES = {
  whipped:        '#FFFAFA',
  buttercream:    '#F5EC90',
  ganache:        '#2A1005',
  'cream-cheese': '#FFF4EA',
};

const OPTIONS = {
  flavor: [
    { value: 'vanilla',    label: 'Vanilla',    color: FLAVOR_SWATCHES.vanilla },
    { value: 'chocolate',  label: 'Chocolate',  color: FLAVOR_SWATCHES.chocolate },
    { value: 'strawberry', label: 'Strawberry', color: FLAVOR_SWATCHES.strawberry },
  ],
  cream: [
    { value: 'whipped',      label: 'Whipped Cream',  color: CREAM_SWATCHES.whipped },
    { value: 'buttercream',  label: 'Buttercream',     color: CREAM_SWATCHES.buttercream },
    { value: 'ganache',      label: 'Choc Ganache',    color: CREAM_SWATCHES.ganache },
    { value: 'cream-cheese', label: 'Cream Cheese',    color: CREAM_SWATCHES['cream-cheese'] },
  ],
  tiers: [
    { value: '1', label: '1 Tier',  emoji: '1️⃣' },
    { value: '2', label: '2 Tiers', emoji: '2️⃣' },
    { value: '3', label: '3 Tiers', emoji: '3️⃣' },
  ],
};

const TOPPINGS = [
  { value: 'strawberry',       label: 'Strawberry',      img: '/images/strawberry.png' },
  { value: 'choc-strawberry',  label: 'Choc Strawberry', img: '/images/chocolate-strawberry.png' },
  { value: 'icing',            label: 'Icing',           img: '/images/icing.png' },
  { value: 'macaron',          label: 'Macaron',         img: '/images/macaron.png' },
];

function getTileInner(key, item) {
  if (key === 'flavor') {
    const border = item.value === 'chocolate' ? 'border:2px solid rgba(255,255,255,0.3)' : 'border:2px solid rgba(180,100,80,0.15)';
    return `<span class="tile-swatch" style="background:${item.color};${border}"></span>
            <span class="tile-label">${item.label}</span>`;
  }
  if (key === 'cream') {
    const isDark = item.value === 'ganache';
    const border = isDark ? 'border:2px solid rgba(255,255,255,0.2)' : 'border:2px solid rgba(160,80,100,0.2)';
    return `<span class="tile-swatch" style="background:${item.color};${border}"></span>
            <span class="tile-label">${item.label}</span>`;
  }
  if (key === 'tiers') {
    const n = parseInt(item.value);
    const bars = Array.from({length: n}, (_, i) =>
      `<span class="tier-dot" style="width:${22 - i*5}px"></span>`
    ).join('');
    return `<span class="tile-tier-stack">${bars}</span>
            <span class="tile-label">${item.label}</span>`;
  }
  if (key === 'toppings') {
    return `<img class="tile-topping-img" src="${item.img}" alt="${item.label}">
            <span class="tile-label">${item.label}</span>`;
  }
  return `<span class="tile-label">${item.label}</span>`;
}

function buildOptionGroup(key, items, isMulti = false) {
  const LABELS = {
    flavor: '✦ Sponge Flavour',
    cream: '✦ Cream', tiers: '✦ Tiers', toppings: '✦ Toppings',
  };
  const group = document.createElement('div');
  group.className = 'option-group';
  group.innerHTML = `<h3 class="option-group-title">${LABELS[key] || key}</h3>`;

  const tiles = document.createElement('div');
  tiles.className = `option-tiles${isMulti ? ' multi' : ''}`;

  items.forEach((item) => {
    const tile = document.createElement('button');
    tile.className = 'option-tile';
    tile.dataset.value = item.value;
    tile.dataset.key = key;
    tile.innerHTML = getTileInner(key, item);

    tile.addEventListener('click', () => {
      if (isMulti) {
        tile.classList.toggle('selected');
        toggleTopping(item.value);
      } else {
        tiles.querySelectorAll('.option-tile').forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        setState(key, item.value);
      }
      updateCompleteBtn();
    });

    tiles.appendChild(tile);
  });

  group.appendChild(tiles);
  return group;
}

function updateCompleteBtn() {
  const btn = document.getElementById('complete-btn');
  if (!btn) return;
  if (isComplete()) {
    btn.disabled = false;
    btn.classList.add('ready');
  } else {
    btn.disabled = true;
    btn.classList.remove('ready');
  }
}

export function initCustomize() {
  const optionsPanel = document.getElementById('options-panel');
  const previewPanel = document.getElementById('preview-panel');
  if (!optionsPanel || !previewPanel) return;

  Object.entries(OPTIONS).forEach(([key, items]) => {
    optionsPanel.appendChild(buildOptionGroup(key, items, false));
  });
  optionsPanel.appendChild(buildOptionGroup('toppings', TOPPINGS, true));

  const btn = document.createElement('button');
  btn.id = 'complete-btn';
  btn.className = 'complete-btn';
  btn.innerHTML = '🎂 Complete the Cake!';
  btn.disabled = true;
  btn.addEventListener('click', () => navigateTo('page-envelope'));
  optionsPanel.appendChild(btn);

  initCakePreview(previewPanel);
  updateCompleteBtn();
}
