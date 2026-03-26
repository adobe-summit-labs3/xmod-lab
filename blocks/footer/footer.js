import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Label sections
  const sections = footer.querySelectorAll(':scope > .section');
  if (sections.length >= 2) {
    sections[0].classList.add('footer-top');
    sections[sections.length - 1].classList.add('footer-bottom');
  }

  // Restructure brand column: add logo icon
  const footerTop = footer.querySelector('.footer-top');
  const firstCol = footerTop?.querySelector(':scope > div:first-child');
  if (firstCol) {
    const brandLink = firstCol.querySelector('a');
    if (brandLink) {
      brandLink.className = 'footer-brand-link';
      brandLink.innerHTML = `<span class="footer-logo-icon" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet">
          <path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="currentColor"/>
        </svg>
      </span><span class="footer-logo-text">WKND<br>Adventures</span>`;
      // Remove button-wrapper styling
      const wrapper = brandLink.closest('.button-container');
      if (wrapper) wrapper.className = '';
    }
  }

  block.append(footer);
}
