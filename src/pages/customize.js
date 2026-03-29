import { navigateTo } from '../utils/transitions.js';
import { setState, toggleTopping, getState, isComplete } from '../utils/state.js';
import { initCakePreview } from '../components/cakePreview.js';

const OPTIONS = {
  shape: [
    { value: 'round', label: 'Round', emoji: '⭕' },
    { value: 'heart', label: 'Heart', emoji: '❤️' },
  ],
  flavor: [
    { value: 'vanilla', label: 'Vanilla', emoji: '🍦', color: '#FFF3CD' },
    { value: 'chocolate', label: 'Chocolate', emoji: '🍫', color: '#D2691E' },
    { value: 'strawberry', label: 'Strawberry', emoji: '🍓', color: '#FFB6C1' },
  ],
  cream: [
    { value: 'whipped', label: 'Whipped Cream', emoji: '🤍' },
    { value: 'buttercream', label: 'Buttercream', emoji: '💛' },
    { value: 'ganache', label: 'Choc Ganache', emoji: '🍫' },
    { value: 'cream-cheese', label: 'Cream Cheese', emoji: '🧀' },
  ],
  tiers: [
    { value: '1', label: '1 Tier', emoji: '1️⃣' },
    { value: '2', label: '2 Tiers', emoji: '2️⃣' },
    { value: '3', label: '3 Tiers', emoji: '3️⃣' },
  ],
};

const TOPPINGS = [
  { value: 'strawberry', label: 'Strawberry', img: '/images/strawberry.png' },
  { value: 'choc-strawberry', label: 'Choc Strawberry', img: '/images/chocolate-strawberry.png' },
  { value: 'icing', label: 'Icing', img: '/images/icing.png' },
  { value: 'macaron', label: 'Macaron', img: '/images/macaron.png' },
];

function buildOptionGroup(key, items, isMulti = false) {
  const group = document.createElement('div');
  group.className = 'option-group';
  group.innerHTML = `<h3 class="option-group-title">${key.charAt(0).toUpperCase() + key.slice(1)}</h3>`;
  const tiles = document.createElement('div');
  tiles.className = 'option-tiles';

  items.forEach((item) => {
    const tile = document.createElement('button');
    tile.className = 'option-tile';
    tile.dataset.value = item.value;
    tile.dataset.key = key;

    tile.innerHTML = `<span class="tile-label">${item.label}</span>`;

    tile.addEventListener('click', () => {
      if (isMulti) {
        tile.classList.toggle('selected');
        toggleTopping(item.value);
      } else {
        tiles.querySelectorAll('.option-tile').forEach((t) => t.classList.remove('selected'));
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

  // Build option groups
  Object.entries(OPTIONS).forEach(([key, items]) => {
    optionsPanel.appendChild(buildOptionGroup(key, items, false));
  });

  // Toppings (multi-select)
  optionsPanel.appendChild(buildOptionGroup('toppings', TOPPINGS, true));

  // Complete button
  const btn = document.createElement('button');
  btn.id = 'complete-btn';
  btn.className = 'complete-btn';
  btn.textContent = '🎂 Complete the Cake!';
  btn.disabled = true;
  btn.addEventListener('click', () => navigateTo('page-envelope'));
  optionsPanel.appendChild(btn);

  // Live preview
  initCakePreview(previewPanel);

  updateCompleteBtn();
}
