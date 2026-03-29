const state = {
  shape: null,
  flavor: null,
  cream: null,
  tiers: null,
  toppings: [],
};

const listeners = [];

export function getState() {
  return { ...state, toppings: [...state.toppings] };
}

export function setState(key, value) {
  state[key] = value;
  listeners.forEach((fn) => fn(getState()));
}

export function toggleTopping(topping) {
  const idx = state.toppings.indexOf(topping);
  if (idx >= 0) {
    state.toppings.splice(idx, 1);
  } else {
    state.toppings.push(topping);
  }
  listeners.forEach((fn) => fn(getState()));
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function isComplete() {
  const s = getState();
  return s.shape && s.flavor && s.cream && s.tiers;
}
