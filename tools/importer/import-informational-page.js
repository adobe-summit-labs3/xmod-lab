/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - All parsers needed for the informational-page template
import heroParser from './parsers/hero-full.js';
import columnsAboutParser from './parsers/columns-about.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import tabsTeamParser from './parsers/tabs-team.js';
import columnsPromoParser from './parsers/columns-promo.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS - All transformers for WKND site
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (informational-page)
const PAGE_TEMPLATE = {
  name: 'informational-page',
  description: 'Informational page with hero, structured content such as team profiles and FAQ categories',
  urls: [
    'https://gabrielwalt.github.io/wknd/about.html',
    'https://gabrielwalt.github.io/wknd/faq.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.hero-section'],
    },
    {
      name: 'columns-about',
      instances: ['.grid-layout.grid-gap-xxl.tablet-1-column'],
    },
    {
      name: 'cards-feature',
      instances: ['.inverse-section .grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)'],
    },
    {
      name: 'tabs-team',
      instances: ['section.section:has(.tab-menu)'],
    },
    {
      name: 'columns-promo',
      instances: ['.accent-section .grid-layout.tablet-1-column:has(.card)'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'],
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
      selector: 'section.section.accent-section:first-of-type',
      style: 'accent',
      blocks: ['columns-promo'],
      defaultContent: ['h2.h2-heading', 'p.paragraph-xl'],
    },
    {
      id: 'section-3',
      name: 'Content Body',
      selector: 'section.section:not(.accent-section):not(.inverse-section):not(.secondary-section)',
      style: null,
      blocks: ['columns-about', 'tabs-team', 'accordion-faq', 'cards-article'],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg'],
    },
    {
      id: 'section-4',
      name: 'Dark Content',
      selector: 'section.section.inverse-section',
      style: 'dark',
      blocks: ['cards-feature'],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg'],
    },
    {
      id: 'section-5',
      name: 'Secondary Content',
      selector: 'section.section.secondary-section',
      style: 'secondary',
      blocks: ['accordion-faq'],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg'],
    },
    {
      id: 'section-6',
      name: 'CTA',
      selector: ['section.section.accent-section:last-of-type', 'section.section.inverse-section:last-of-type'],
      style: 'accent',
      blocks: [],
      defaultContent: ['h2.h2-heading', 'p.paragraph-lg', '.button-group'],
    },
  ],
};

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero': heroParser,
  'columns-about': columnsAboutParser,
  'cards-feature': cardsFeatureParser,
  'tabs-team': tabsTeamParser,
  'columns-promo': columnsPromoParser,
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
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
