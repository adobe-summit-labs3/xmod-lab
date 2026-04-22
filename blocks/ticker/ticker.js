export default function decorate(block) {
  // Extract items from <p> tags inside the first cell (EDS block structure)
  const cell = block.querySelector(':scope > div > div');
  const paragraphs = cell ? [...cell.querySelectorAll('p')] : [];
  const items = paragraphs.length > 0
    ? paragraphs.map((p) => p.textContent.trim()).filter(Boolean)
    : [...block.children].map((row) => row.textContent.trim()).filter(Boolean);
  block.textContent = '';
  block.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.className = 'ticker-track';

  // Build individual spans with separator spans, duplicated for seamless loop
  function appendItems(container) {
    items.forEach((item, i) => {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'ticker-sep';
        sep.textContent = '·';
        container.append(sep);
      }
      const span = document.createElement('span');
      span.textContent = item;
      container.append(span);
    });
    // Trailing separator for seamless loop
    const sep = document.createElement('span');
    sep.className = 'ticker-sep';
    sep.textContent = '·';
    container.append(sep);
  }

  // Duplicate content for seamless infinite scroll
  appendItems(track);
  appendItems(track);

  block.append(track);

  // Marquee lights around the border
  const LIGHT_SPACING = 28;
  const lightsContainer = document.createElement('div');
  lightsContainer.className = 'marquee-lights';

  function createLight(x, y, delay) {
    const dot = document.createElement('span');
    dot.className = 'marquee-bulb';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.animationDelay = `${delay}s`;
    lightsContainer.append(dot);
  }

  // Wait for layout so we can measure
  requestAnimationFrame(() => {
    const w = block.offsetWidth;
    const h = block.offsetHeight;
    const topCount = Math.floor(w / LIGHT_SPACING);
    const sideCount = Math.floor(h / LIGHT_SPACING);
    const total = (topCount + sideCount) * 2;
    const delayStep = 2 / total;
    let idx = 0;

    // Top edge (left to right)
    for (let i = 0; i < topCount; i += 1) {
      createLight(i * LIGHT_SPACING + LIGHT_SPACING / 2, -4, idx * delayStep);
      idx += 1;
    }
    // Right edge (top to bottom)
    for (let i = 0; i < sideCount; i += 1) {
      createLight(w - 4, i * LIGHT_SPACING + LIGHT_SPACING / 2, idx * delayStep);
      idx += 1;
    }
    // Bottom edge (right to left)
    for (let i = topCount - 1; i >= 0; i -= 1) {
      createLight(i * LIGHT_SPACING + LIGHT_SPACING / 2, h - 4, idx * delayStep);
      idx += 1;
    }
    // Left edge (bottom to top)
    for (let i = sideCount - 1; i >= 0; i -= 1) {
      createLight(0, i * LIGHT_SPACING + LIGHT_SPACING / 2, idx * delayStep);
      idx += 1;
    }

    block.append(lightsContainer);
  });
}
