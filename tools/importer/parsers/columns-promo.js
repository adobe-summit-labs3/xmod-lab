/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo variant.
 * Base: columns. Source: https://wknd-adventures.com/adventures.html
 * Selector: .grid-layout.grid-layout--2col
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  const cells = [];
  const cards = element.querySelectorAll('.card');

  if (cards.length > 0) {
    // Build one row with each card as a column
    const row = [];
    cards.forEach((card) => {
      const col = document.createElement('div');

      const eyebrow = card.querySelector('.hero-eyebrow');
      if (eyebrow) {
        const p = document.createElement('p');
        p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
        col.appendChild(p);
      }

      const heading = card.querySelector('h3');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        col.appendChild(h3);
      }

      const desc = card.querySelector('.paragraph-lg');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        col.appendChild(p);
      }

      const link = card.querySelector('a[class*="button"]');
      if (link) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        const label = link.querySelector('.button-label');
        a.textContent = label ? label.textContent.trim() : link.textContent.trim();
        p.appendChild(a);
        col.appendChild(p);
      }

      row.push(col);
    });
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns (columns-promo)',
    cells,
  });
  element.replaceWith(block);
}
