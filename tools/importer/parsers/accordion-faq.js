/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq variant.
 * Base: accordion. Source: https://wknd-adventures.com/index.html
 * Selector: .faq-list
 * Generated: 2026-03-25
 */
export default function parse(element, { document }) {
  // FAQ items from .faq-list (found in captured DOM)
  const faqItems = element.querySelectorAll('.faq-item');

  const cells = [];

  faqItems.forEach((item) => {
    // Question: extract text from .faq-question, excluding .faq-icon
    // Live DOM has question text as a text node (not in a span), with .faq-icon as sibling
    const questionEl = item.querySelector('.faq-question');
    let questionText = '';
    if (questionEl) {
      const clone = questionEl.cloneNode(true);
      const icon = clone.querySelector('.faq-icon');
      if (icon) icon.remove();
      questionText = clone.textContent.trim();
    }

    // Answer: .faq-answer contains text and may include links (e.g. mailto)
    const answer = item.querySelector('.faq-answer');

    // Wrap question text in a container div with a nested paragraph
    // Plain text and bare <p> elements get lost in DOM→MD→HTML serialization
    const questionDiv = document.createElement('div');
    const questionP = document.createElement('p');
    questionP.textContent = questionText;
    questionDiv.appendChild(questionP);
    cells.push([questionDiv, answer || '']);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'accordion-faq',
    cells,
  });
  element.replaceWith(block);
}
