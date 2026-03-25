/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND cleanup.
 * Removes non-authorable site chrome from the WKND source pages.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No cookie banners or overlays detected in WKND source
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (header nav, footer, skip link)
    // Found in captured DOM: <div class="navbar">, <footer class="footer">, <a class="skip-link">
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      '.footer',
      '.skip-link',
      'noscript',
      'link',
      'iframe',
    ]);

    // Resolve all relative image URLs to absolute using the source page URL
    const sourceUrl = payload.params && payload.params.originalURL;
    if (sourceUrl) {
      element.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('blob:')) {
          try {
            img.setAttribute('src', new URL(src, sourceUrl).href);
          } catch (e) {
            // skip malformed URLs
          }
        }
      });
    }
  }
}
