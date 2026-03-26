/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the homepage template
import heroParser from './parsers/hero-full.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import tickerParser from './parsers/ticker.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsNumberedParser from './parsers/columns-numbered.js';
import columnsGalleryParser from './parsers/columns-gallery.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (homepage)
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage with hero, featured content, activity browser, stories gallery, FAQ, and onboarding sections',
  urls: [
    'https://gabrielwalt.github.io/wknd/index.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.hero-section.hero-section--full', 'section.hero-section'],
    },
    {
      name: 'columns-featured',
      instances: ['.featured-article'],
    },
    {
      name: 'tabs-activity',
      instances: ['.tab-container.tab-container--wide'],
    },
    {
      name: 'ticker',
      instances: ['.ticker-strip'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'columns-numbered',
      instances: ['.editorial-index'],
    },
    {
      name: 'columns-gallery',
      instances: ['.inverse-section .grid-layout.desktop-3-column'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'section.hero-section.hero-section--full',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Article',
      selector: 'section.section.secondary-section:has(.featured-article)',
      style: 'secondary',
      blocks: ['columns-featured'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Browse by Activity',
      selector: 'section.section:has(.tab-container)',
      style: null,
      blocks: ['tabs-activity'],
      defaultContent: ['.section-heading h2'],
    },
    {
      id: 'section-4',
      name: 'Ticker Strip',
      selector: '.ticker-strip',
      style: 'dark',
      blocks: ['ticker'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Start Here',
      selector: 'section.section.inverse-section:has(.hero-eyebrow)',
      style: 'dark',
      blocks: [],
      defaultContent: ['.hero-eyebrow', 'h2.h2-heading', 'p.paragraph-lg', '.button-group'],
    },
    {
      id: 'section-6',
      name: 'Quick Answers',
      selector: 'section.section:has(.faq-list)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['.section-heading h2', '.section-heading .text-button'],
    },
    {
      id: 'section-7',
      name: 'How We Work',
      selector: 'section.section.secondary-section:has(.editorial-index)',
      style: 'secondary',
      blocks: ['columns-numbered'],
      defaultContent: ['.section-heading h2'],
    },
    {
      id: 'section-8',
      name: 'In the Field',
      selector: 'section.section.inverse-section:has(.gallery-img)',
      style: 'dark',
      blocks: ['columns-gallery'],
      defaultContent: ['.section-heading h2', '.section-heading .text-button', '.utility-margin-top-lg .gallery-img--wide'],
    },
    {
      id: 'section-9',
      name: 'CTA Banner',
      selector: 'section.section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-xl', '.button-group'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-featured': columnsFeaturedParser,
  'tabs-activity': tabsActivityParser,
  'ticker': tickerParser,
  'accordion-faq': accordionFaqParser,
  'columns-numbered': columnsNumberedParser,
  'columns-gallery': columnsGalleryParser,
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
