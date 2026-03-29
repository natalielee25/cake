import './style.css';
import { initNavigation } from './utils/transitions.js';
import { initHome } from './pages/home.js';
import { initHowToPay } from './pages/howToPay.js';
import { initCustomize } from './pages/customize.js';
import { initEnvelope } from './pages/envelope.js';

// Boot
initNavigation('page-home');
initHome();
initHowToPay();
initCustomize();
initEnvelope();
