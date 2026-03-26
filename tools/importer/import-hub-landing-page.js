/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the hub-landing-page template
import heroParser from './parsers/hero-full.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import columnsNumberedParser from './parsers/columns-numbered.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (hub-landing-page)
const PAGE_TEMPLATE = {
  name: 'hub-landing-page',
  description: 'Category hub page with hero, featured spotlight, category cards/grid, educational content, and cross-promotion links',
  urls: [
    'https://gabrielwalt.github.io/wknd/adventures.html',
    'https://gabrielwalt.github.io/wknd/expeditions.html',
    'https://gabrielwalt.github.io/wknd/destinations.html',
    'https://gabrielwalt.github.io/wknd/gear.html',
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
      name: 'columns-numbered',
      instances: ['.editorial-index'],
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'],
    },
    {
      name: 'columns-promo',
      instances: ['.grid-layout.grid-layout--2col'],
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
      name: 'Accent Banner',
      selector: 'section.section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-xl'],
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
      name: 'Browse by Activity',
      selector: 'section.section:has(.tab-container)',
      style: null,
      blocks: ['tabs-activity'],
      defaultContent: ['h2.section-heading'],
    },
    {
      id: 'section-5',
      name: 'Choosing Your Adventure',
      selector: 'section.section.secondary-section:has(.container--narrow):not(:has(.featured-article)):not(:has(.editorial-index))',
      style: 'secondary',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg'],
    },
    {
      id: 'section-6',
      name: 'Recent Reports',
      selector: 'section.section:has(.grid-gap-lg > .article-card)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['h2.section-heading'],
    },
    {
      id: 'section-7',
      name: 'Adventure by Skill Level',
      selector: 'section.section.secondary-section:has(.editorial-index)',
      style: 'secondary',
      blocks: ['columns-numbered', 'columns-promo'],
      defaultContent: ['h2.section-heading'],
    },
    {
      id: 'section-8',
      name: 'Gear CTA',
      selector: 'section.section.inverse-section',
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
  'tabs-activity': tabsActivityParser,
  'columns-numbered': columnsNumberedParser,
  'cards-article': cardsArticleParser,
  'columns-promo': columnsPromoParser,
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
