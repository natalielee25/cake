import { launchConfetti } from '../components/confetti.js';
import { attachClickHints } from '../components/throbClick.js';
import { navigateTo } from '../utils/transitions.js';
import { resetState } from '../utils/state.js';

export function initEnvelope() {
  const envelopeBtn    = document.getElementById('envelope-btn');
  const envelopeSection = document.getElementById('envelope-section');
  const letterSection  = document.getElementById('letter-section');
  if (!envelopeBtn) return;

  attachClickHints(envelopeBtn);

  envelopeBtn.addEventListener('click', () => {
    envelopeBtn.classList.add('opening');
    envelopeSection.classList.add('fade-out');

    setTimeout(() => {
      envelopeSection.style.display = 'none';
      letterSection.style.display = 'flex';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          letterSection.classList.add('letter-visible');
        });
      });
      launchConfetti(6000);
    }, 700);
  });

  document.getElementById('restart-btn')?.addEventListener('click', () => {
    // Reset envelope UI state
    envelopeSection.style.display = 'flex';
    envelopeSection.classList.remove('fade-out');
    letterSection.style.display = 'none';
    letterSection.classList.remove('letter-visible');
    envelopeBtn.classList.remove('opening');
    resetState();
    navigateTo('page-home');
  });
}
