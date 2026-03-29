export function attachClickHints(target) {
  const hints = [];
  const texts = ['click!', 'click!', '👆', 'click!'];
  const positions = [
    { top: '-36px', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', right: '-60px', transform: 'translateY(-50%)' },
    { bottom: '-36px', left: '50%', transform: 'translateX(-50%)' },
    { top: '50%', left: '-60px', transform: 'translateY(-50%)' },
  ];

  target.style.position = 'relative';

  positions.forEach((pos, i) => {
    const span = document.createElement('span');
    span.className = 'click-hint';
    span.textContent = texts[i];
    Object.assign(span.style, {
      position: 'absolute',
      animationDelay: `${i * 0.25}s`,
      ...pos,
    });
    target.appendChild(span);
    hints.push(span);
  });

  return () => hints.forEach((h) => h.remove());
}
