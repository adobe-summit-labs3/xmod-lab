/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-activity variant.
 * Base: tabs. Source: https://gabrielwalt.github.io/wknd/index.html
 * Selector: .tab-container.tab-container--wide
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  // Tab buttons from .tab-menu (found in captured DOM)
  const tabButtons = element.querySelectorAll('.tab-menu-link');
  // Tab panes containing article card grids
  const tabPanes = element.querySelectorAll('.tab-pane');

  const cells = [];

  tabButtons.forEach((btn, i) => {
    const pane = tabPanes[i];
    if (!pane) return;

    // Tab label text
    const label = btn.textContent.trim();

    // Tab content - pass the pane content directly
    // Each pane contains a grid of article cards with images, tags, titles, descriptions
    cells.push([label, pane]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs',
    cells,
  });
  element.replaceWith(block);
}
