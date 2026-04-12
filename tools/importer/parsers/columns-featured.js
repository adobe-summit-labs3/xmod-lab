/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-featured variant.
 * Base: columns. Source: https://wknd-adventures.com/index.html
 * Selector: .featured-article
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  // Col 1: Featured article image (found in captured DOM: a.featured-article-image > img)
  const image = element.querySelector('.featured-article-image img, :scope > a img');

  // Col 2: Content elements
  const tag = element.querySelector('.tag');
  const heading = element.querySelector('h2, .h2-heading');
  const description = element.querySelector('.paragraph-lg');

  // Build byline: avatar + name + meta
  const avatar = element.querySelector('.avatar img');
  const bylineName = element.querySelector('.article-byline-name');
  const bylineMeta = element.querySelector('.article-byline-meta');

  const contentCol = [];
  if (tag) contentCol.push(tag);
  if (heading) contentCol.push(heading);
  if (description) contentCol.push(description);

  // Combine byline into a paragraph
  if (avatar || bylineName || bylineMeta) {
    const bylineP = document.createElement('p');
    if (avatar) bylineP.append(avatar);
    if (bylineName) bylineP.append(document.createTextNode(' ' + bylineName.textContent));
    if (bylineMeta) {
      bylineP.append(document.createElement('br'));
      bylineP.append(document.createTextNode(bylineMeta.textContent));
    }
    contentCol.push(bylineP);
  }

  // CTA button
  const ctaLink = element.querySelector('.featured-article-footer > a, .article-byline + a');
  if (ctaLink) {
    const label = ctaLink.querySelector('.button-label');
    if (label) ctaLink.textContent = label.textContent.trim();
    contentCol.push(ctaLink);
  }

  // Single row with 2 columns: image | content
  const cells = [
    [image || '', contentCol],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns (columns-featured)',
    cells,
  });
  element.replaceWith(block);
}
