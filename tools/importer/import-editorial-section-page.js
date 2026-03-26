/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the editorial-section-page template
import heroParser from './parsers/hero-full.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import columnsPromoParser from './parsers/columns-promo.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import columnsNumberedParser from './parsers/columns-numbered.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (editorial-section-page)
const PAGE_TEMPLATE = {
  name: 'editorial-section-page',
  description: 'Editorial section page with hero, featured story, editorial philosophy, and engagement CTAs',
  urls: [
    'https://gabrielwalt.github.io/wknd/field-notes',
    'https://gabrielwalt.github.io/wknd/community.html',
    'https://gabrielwalt.github.io/wknd/sustainability.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.hero-section'],
    },
    {
      name: 'columns-featured',
      instances: ['.featured-article'],
    },
    {
      name: 'columns-promo',
      instances: ['.grid-layout.grid-layout--2col'],
    },
    {
      name: 'tabs-activity',
      instances: ['.tab-container.tab-container--wide'],
    },
    {
      name: 'columns-numbered',
      instances: ['.editorial-index'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'section.hero-section',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Statement',
      selector: 'section.section.inverse-section:first-of-type:not(:has(.editorial-index))',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-xl'],
    },
    {
      id: 'section-2b',
      name: 'Numbered Principles',
      selector: 'section.section:has(.editorial-index)',
      style: null,
      blocks: ['columns-numbered'],
      defaultContent: ['h2.section-heading', 'h2.h2-heading'],
    },
    {
      id: 'section-3',
      name: 'Featured Article',
      selector: 'section.section.secondary-section:has(.featured-article)',
      style: 'secondary',
      blocks: ['columns-featured'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Editorial Content',
      selector: 'section.section.inverse-section:has(.container--narrow)',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg'],
    },
    {
      id: 'section-5',
      name: 'Promo Cards',
      selector: 'section.section.secondary-section:has(.grid-layout--2col)',
      style: 'secondary',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Essential Reading',
      selector: 'section.section:has(.tab-container)',
      style: null,
      blocks: ['tabs-activity'],
      defaultContent: ['h2.h2-heading'],
    },
    {
      id: 'section-7',
      name: 'CTA',
      selector: 'section.section.inverse-section:last-of-type',
      style: 'dark',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg', 'a.button'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-featured': columnsFeaturedParser,
  'columns-promo': columnsPromoParser,
  'tabs-activity': tabsActivityParser,
  'columns-numbered': columnsNumberedParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  wkndCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [wkndSectionsTransformer] : []),
];

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

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url);

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
