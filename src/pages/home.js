import { navigateTo } from '../utils/transitions.js';
import { launchConfetti } from '../components/confetti.js';
import { attachClickHints } from '../components/throbClick.js';

export function initHome() {
  const btn = document.getElementById('start-btn');
  if (!btn) return;

  attachClickHints(btn);

  btn.addEventListener('click', () => {
    navigateTo('page-how');
  });

  // Fire confetti after a short delay on load
  setTimeout(() => launchConfetti(5000), 600);
}
