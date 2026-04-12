/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-about variant.
 * Base: columns. Source: https://wknd-adventures.com/about.html
 * Selector: .grid-layout.grid-gap-xxl.tablet-1-column
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  const cells = [];

  // Column 1: text content (heading + paragraphs)
  const col1 = document.createElement('div');
  const children = element.children;
  if (children[0]) {
    const heading = children[0].querySelector('h2');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      col1.appendChild(h2);
    }
    const paragraphs = children[0].querySelectorAll('p');
    paragraphs.forEach((p) => {
      const newP = document.createElement('p');
      newP.textContent = p.textContent.trim();
      col1.appendChild(newP);
    });
  }

  // Column 2: image
  const col2 = document.createElement('div');
  if (children[1]) {
    const img = children[1].querySelector('img');
    if (img) {
      col2.appendChild(img.cloneNode(true));
    }
  }

  cells.push([col1, col2]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns (columns-about)',
    cells,
  });
  element.replaceWith(block);
}
