import { launchConfetti } from '../components/confetti.js';
import { attachClickHints } from '../components/throbClick.js';

export function initEnvelope() {
  const envelopeBtn = document.getElementById('envelope-btn');
  const envelopeSection = document.getElementById('envelope-section');
  const letterSection = document.getElementById('letter-section');
  if (!envelopeBtn) return;

  attachClickHints(envelopeBtn);

  envelopeBtn.addEventListener('click', () => {
    // Open animation
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
}
