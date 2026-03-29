import { navigateTo } from '../utils/transitions.js';

export function initHowToPay() {
  const btn = document.getElementById('how-next-btn');
  if (!btn) return;
  btn.addEventListener('click', () => navigateTo('page-customize'));
}
