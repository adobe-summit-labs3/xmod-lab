/* eslint-disable */
/* global WebImporter */

/**
 * Parser for gallery block.
 * Source: https://wknd-adventures.com/index.html
 * Selector: .inverse-section .grid-layout.desktop-3-column (excluding card grids)
 */
export default function parse(element, { document }) {
  // Row 1: Gallery images from the 3-column grid
  const gridImages = element.querySelectorAll('.gallery-img, :scope > img');
  const row1 = [];
  gridImages.forEach((img) => {
    row1.push(img);
  });

  const cells = [];
  if (row1.length > 0) {
    cells.push(row1);
  }

  // Row 2: Wide image sibling (.gallery-img--wide) — spans full width
  const parent = element.parentElement;
  if (parent) {
    const wideImgWrapper = parent.querySelector('.gallery-img--wide')
      || parent.querySelector('.utility-margin-top-lg .gallery-img--wide')
      || parent.querySelector('.utility-margin-top-lg > img');
    // Also check next sibling directly
    let nextEl = element.nextElementSibling;
    while (nextEl) {
      const wideImg = nextEl.querySelector('.gallery-img--wide')
        || (nextEl.classList && nextEl.classList.contains('gallery-img--wide') ? nextEl : null)
        || (nextEl.tagName === 'IMG' ? nextEl : null);
      if (wideImg) {
        cells.push([wideImg]);
        nextEl.remove();
        break;
      }
      nextEl = nextEl.nextElementSibling;
    }
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Gallery',
    cells,
  });
  element.replaceWith(block);
}
