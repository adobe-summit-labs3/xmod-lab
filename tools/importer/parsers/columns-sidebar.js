/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-sidebar variant.
 * Base: columns. Source: https://gabrielwalt.github.io/wknd/blog/patagonia-trek.html
 * Selector: .secondary-section .grid-layout.desktop-3-column.grid-align-center
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  const cells = [];

  // The grid has children divs — first child is gear list, second (span-2) is pull quote
  const children = element.children;

  // Column 1: heading + gear list
  const col1 = document.createElement('div');
  const firstChild = children[0];
  if (firstChild) {
    const heading = firstChild.querySelector('h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      col1.appendChild(h3);
    }
    const list = firstChild.querySelector('ul');
    if (list) {
      col1.appendChild(list.cloneNode(true));
    }
  }

  // Column 2: pull quote with attribution
  const col2 = document.createElement('div');
  const secondChild = children[1];
  if (secondChild) {
    const pullQuote = secondChild.querySelector('.pull-quote');
    if (pullQuote) {
      const blockquote = document.createElement('blockquote');
      const quoteBody = pullQuote.querySelector('.pull-quote-body');
      if (quoteBody) {
        blockquote.textContent = quoteBody.textContent.trim();
      }
      col2.appendChild(blockquote);
      const attribution = pullQuote.querySelector('.pull-quote-attribution');
      if (attribution) {
        const cite = document.createElement('p');
        cite.innerHTML = `<em>${attribution.textContent.trim()}</em>`;
        col2.appendChild(cite);
      }
    }
  }

  cells.push([col1, col2]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns (columns-sidebar)',
    cells,
  });
  element.replaceWith(block);
}
