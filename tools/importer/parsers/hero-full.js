/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-full variant.
 * Base: hero. Source: https://gabrielwalt.github.io/wknd/index.html
 * Selector: section.hero-section.hero-section--full
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  // Extract background image from .hero-bg (found in captured DOM)
  const bgImage = element.querySelector('.hero-bg img');

  // Extract content from .hero-content-inner
  const eyebrow = element.querySelector('.hero-eyebrow');
  const heading = element.querySelector('h1, .h1-heading');
  const description = element.querySelector('.hero-lead, .paragraph-xl');
  const ctaLinks = element.querySelectorAll('.button-group a');

  const cells = [];

  // Row 1: Background image (per hero library pattern)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content - eyebrow, heading, description, CTAs
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  ctaLinks.forEach((link) => {
    // Simplify button labels - unwrap inner div.button-label
    const label = link.querySelector('.button-label');
    if (label) {
      link.textContent = label.textContent.trim();
    }
    contentCell.push(link);
  });
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero',
    cells,
  });
  element.replaceWith(block);
}
