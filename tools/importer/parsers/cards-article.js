/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article variant.
 * Base: cards. Source: https://wknd-adventures.com/blog/patagonia-trek.html
 * Selector: .grid-layout.desktop-3-column:has(.article-card)
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.article-card');
  const cells = [];

  cards.forEach((card) => {
    // Column 1: card image
    const img = card.querySelector('.article-card-image img');
    const col1 = document.createElement('div');
    if (img) {
      col1.appendChild(img.cloneNode(true));
    }

    // Column 2: card body content (tag, title, description, author/date)
    const col2 = document.createElement('div');

    const tag = card.querySelector('.tag');
    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      col2.appendChild(tagP);
    }

    const title = card.querySelector('h3, h5');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      col2.appendChild(h3);
    }

    const desc = card.querySelector('.paragraph-sm');
    if (desc) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      col2.appendChild(descP);
    }

    const authorDate = card.querySelector('.utility-text-secondary');
    if (authorDate) {
      const authorP = document.createElement('p');
      authorP.innerHTML = `<em>${authorDate.textContent.trim()}</em>`;
      col2.appendChild(authorP);
    }

    // If the card is a link, wrap in an anchor
    const href = card.getAttribute('href');
    if (href) {
      const linkP = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = 'Read More';
      linkP.appendChild(a);
      col2.appendChild(linkP);
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards (cards-article)',
    cells,
  });
  element.replaceWith(block);
}
