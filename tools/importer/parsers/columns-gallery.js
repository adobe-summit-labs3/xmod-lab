/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-gallery variant.
 * Base: columns. Source: https://gabrielwalt.github.io/wknd/index.html
 * Selector: .inverse-section .grid-layout.desktop-3-column
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  // Gallery images from the 3-column grid (found in captured DOM)
  const images = element.querySelectorAll('.gallery-img, :scope > img');

  // Single row with one column per image (columns block pattern)
  const row = [];
  images.forEach((img) => {
    row.push(img);
  });

  const cells = [];
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Gallery',
    cells,
  });
  element.replaceWith(block);
}
