/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the blog-article template
import heroArticleParser from './parsers/hero-article.js';
import columnsSidebarParser from './parsers/columns-sidebar.js';
import columnsGalleryParser from './parsers/columns-gallery.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (blog-article)
const PAGE_TEMPLATE = {
  name: 'blog-article',
  description: 'Long-form blog article with hero image, metadata tags, day-by-day narrative, inline images, author attribution, and related links',
  urls: [
    'https://gabrielwalt.github.io/wknd/blog/patagonia-trek.html',
    'https://gabrielwalt.github.io/wknd/blog/kayaking-norway.html',
    'https://gabrielwalt.github.io/wknd/blog/alpine-cycling.html',
    'https://gabrielwalt.github.io/wknd/blog/yosemite-rock-climbing.html',
    'https://gabrielwalt.github.io/wknd/blog/mountain-photography.html',
    'https://gabrielwalt.github.io/wknd/blog/ultralight-backpacking.html',
  ],
  blocks: [
    {
      name: 'hero-article',
      instances: ['section.hero-section'],
    },
    {
      name: 'columns-sidebar',
      instances: ['.secondary-section .grid-layout.desktop-3-column.grid-align-center'],
    },
    {
      name: 'columns-gallery',
      instances: ['.inverse-section .grid-layout.desktop-3-column'],
    },
    {
      name: 'cards-article',
      instances: ['section.section:last-of-type:not(.inverse-section) .grid-layout.desktop-3-column'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Article Hero',
      selector: 'section.hero-section',
      style: 'dark',
      blocks: ['hero-article'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Article Body',
      selector: 'section.section.blog-article-section',
      style: null,
      blocks: [],
      defaultContent: ['.blog-content.blog-content-body'],
    },
    {
      id: 'section-3',
      name: 'Sidebar Summary',
      selector: 'section.section.secondary-section',
      style: 'secondary',
      blocks: ['columns-sidebar'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'In the Field Gallery',
      selector: 'section.section.inverse-section',
      style: 'dark',
      blocks: ['columns-gallery'],
      defaultContent: ['.section-heading h2', '.section-heading .text-button', '.utility-margin-top-lg .gallery-img--wide'],
    },
    {
      id: 'section-5',
      name: 'More Stories',
      selector: 'section.section:last-of-type:not(.inverse-section)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['h2.section-heading'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-article': heroArticleParser,
  'columns-sidebar': columnsSidebarParser,
  'columns-gallery': columnsGalleryParser,
  'cards-article': cardsArticleParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Cleanup runs first, section transformer conditionally included for templates with 2+ sections
const transformers = [
  wkndCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [wkndSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
