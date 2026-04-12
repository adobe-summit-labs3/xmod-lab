/*
 * Accordion FAQ Block
 * Recreate an accordion for FAQ sections
 * https://www.hlx.live/developer/block-collection/accordion
 */

function animateAccordion(details, summary) {
  let animation = null;

  function open() {
    details.style.overflow = 'hidden';
    const startHeight = `${details.offsetHeight}px`;
    details.open = true;
    const endHeight = `${details.offsetHeight}px`;

    if (animation) animation.cancel();
    animation = details.animate(
      { height: [startHeight, endHeight] },
      { duration: 300, easing: 'ease' },
    );
    animation.onfinish = () => {
      details.style.overflow = '';
      animation = null;
    };
  }

  function close() {
    details.style.overflow = 'hidden';
    const startHeight = `${details.offsetHeight}px`;
    const endHeight = `${summary.offsetHeight}px`;

    if (animation) animation.cancel();
    animation = details.animate(
      { height: [startHeight, endHeight] },
      { duration: 300, easing: 'ease' },
    );
    animation.onfinish = () => {
      details.open = false;
      details.style.overflow = '';
      animation = null;
    };
  }

  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (details.open) close();
    else open();
  });
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-faq-item-body';
    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);

    animateAccordion(details, summary);
  });
}
