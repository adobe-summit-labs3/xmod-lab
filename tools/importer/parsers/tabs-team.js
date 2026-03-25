/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-team variant.
 * Base: tabs. Source: https://gabrielwalt.github.io/wknd/about.html
 * Selector: section.section:has(.tab-menu)
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find tab buttons and tab panes
  const tabButtons = element.querySelectorAll('.tab-menu .tab-menu-link');
  const tabPanes = element.querySelectorAll('.tab-pane');

  tabButtons.forEach((button, i) => {
    const tabLabel = document.createElement('div');
    tabLabel.textContent = button.textContent.trim();

    const tabContent = document.createElement('div');
    const pane = tabPanes[i];
    if (pane) {
      // Profile image
      const profileImg = pane.querySelector('.profile-circle img');
      if (profileImg) {
        const img = profileImg.cloneNode(true);
        tabContent.appendChild(img);
      }

      // Name
      const name = pane.querySelector('.profile-name');
      if (name) {
        const h3 = document.createElement('h3');
        h3.textContent = name.textContent.trim();
        tabContent.appendChild(h3);
      }

      // Role
      const role = pane.querySelector('.profile-name + p');
      if (role) {
        const em = document.createElement('em');
        em.textContent = role.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(em);
        tabContent.appendChild(p);
      }

      // Bio paragraphs
      const bioContainer = pane.querySelector('.team-profile-bio');
      if (bioContainer) {
        const paragraphs = bioContainer.querySelectorAll('p');
        paragraphs.forEach((para) => {
          const newP = document.createElement('p');
          newP.textContent = para.textContent.trim();
          tabContent.appendChild(newP);
        });
      }
    }

    cells.push([tabLabel, tabContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Tabs (tabs-team)',
    cells,
  });
  element.replaceWith(block);
}
