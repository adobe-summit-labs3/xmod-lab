var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-editorial-section-page.js
  var import_editorial_section_page_exports = {};
  __export(import_editorial_section_page_exports, {
    default: () => import_editorial_section_page_default
  });

  // tools/importer/parsers/hero-full.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".hero-bg img");
    const eyebrow = element.querySelector(".hero-eyebrow");
    const heading = element.querySelector("h1, .h1-heading");
    const description = element.querySelector(".hero-lead, .paragraph-xl");
    const ctaLinks = element.querySelectorAll(".button-group a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    ctaLinks.forEach((link) => {
      const label = link.querySelector(".button-label");
      if (label) {
        link.textContent = label.textContent.trim();
      }
      contentCell.push(link);
    });
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".featured-article-image img, :scope > a img");
    const tag = element.querySelector(".tag");
    const heading = element.querySelector("h2, .h2-heading");
    const description = element.querySelector(".paragraph-lg");
    const avatar = element.querySelector(".avatar img");
    const bylineName = element.querySelector(".article-byline-name");
    const bylineMeta = element.querySelector(".article-byline-meta");
    const contentCol = [];
    if (tag) contentCol.push(tag);
    if (heading) contentCol.push(heading);
    if (description) contentCol.push(description);
    if (avatar || bylineName || bylineMeta) {
      const bylineP = document2.createElement("p");
      if (avatar) bylineP.append(avatar);
      if (bylineName) bylineP.append(document2.createTextNode(" " + bylineName.textContent));
      if (bylineMeta) {
        bylineP.append(document2.createElement("br"));
        bylineP.append(document2.createTextNode(bylineMeta.textContent));
      }
      contentCol.push(bylineP);
    }
    const ctaLink = element.querySelector(".featured-article-footer > a, .article-byline + a");
    if (ctaLink) {
      const label = ctaLink.querySelector(".button-label");
      if (label) ctaLink.textContent = label.textContent.trim();
      contentCol.push(ctaLink);
    }
    const cells = [
      [image || "", contentCol]
    ];
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-featured)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const cards = element.querySelectorAll(".card");
    if (cards.length > 0) {
      const row = [];
      cards.forEach((card) => {
        const col = document2.createElement("div");
        const eyebrow = card.querySelector(".hero-eyebrow");
        if (eyebrow) {
          const p = document2.createElement("p");
          p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
          col.appendChild(p);
        }
        const heading = card.querySelector("h3");
        if (heading) {
          const h3 = document2.createElement("h3");
          h3.textContent = heading.textContent.trim();
          col.appendChild(h3);
        }
        const desc = card.querySelector(".paragraph-lg");
        if (desc) {
          const p = document2.createElement("p");
          p.textContent = desc.textContent.trim();
          col.appendChild(p);
        }
        const link = card.querySelector('a[class*="button"]');
        if (link) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
          a.href = link.getAttribute("href");
          const label = link.querySelector(".button-label");
          a.textContent = label ? label.textContent.trim() : link.textContent.trim();
          p.appendChild(a);
          col.appendChild(p);
        }
        row.push(col);
      });
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-promo)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-activity.js
  function parse4(element, { document: document2 }) {
    const tabButtons = element.querySelectorAll(".tab-menu-link");
    const tabPanes = element.querySelectorAll(".tab-pane");
    const cells = [];
    tabButtons.forEach((btn, i) => {
      const pane = tabPanes[i];
      if (!pane) return;
      const label = btn.textContent.trim();
      cells.push([label, pane]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Tabs",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-numbered.js
  function parse5(element, { document: document2 }) {
    const items = element.querySelectorAll(".editorial-index-item");
    const cells = [];
    items.forEach((item) => {
      const number = item.querySelector(".editorial-index-number");
      const content = item.querySelector(":scope > div");
      cells.push([number || "", content || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-numbered)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        ".footer",
        ".skip-link",
        "noscript",
        "link",
        "iframe"
      ]);
      const sourceUrl = payload.params && payload.params.originalURL;
      if (sourceUrl) {
        element.querySelectorAll("img").forEach((img) => {
          const src = img.getAttribute("src");
          if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("blob:")) {
            try {
              img.setAttribute("src", new URL(src, sourceUrl).href);
            } catch (e) {
            }
          }
        });
      }
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-editorial-section-page.js
  var PAGE_TEMPLATE = {
    name: "editorial-section-page",
    description: "Editorial section page with hero, featured story, editorial philosophy, and engagement CTAs",
    urls: [
      "https://gabrielwalt.github.io/wknd/field-notes",
      "https://gabrielwalt.github.io/wknd/community.html",
      "https://gabrielwalt.github.io/wknd/sustainability.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["section.hero-section"]
      },
      {
        name: "columns-featured",
        instances: [".featured-article"]
      },
      {
        name: "columns-promo",
        instances: [".grid-layout.grid-layout--2col"]
      },
      {
        name: "tabs-activity",
        instances: [".tab-container.tab-container--wide"]
      },
      {
        name: "columns-numbered",
        instances: [".editorial-index"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "section.hero-section",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Statement",
        selector: "section.section.inverse-section:first-of-type:not(:has(.editorial-index))",
        style: "dark",
        blocks: [],
        defaultContent: ["h2.h2-heading", "p.paragraph-xl"]
      },
      {
        id: "section-2b",
        name: "Numbered Principles",
        selector: "section.section:has(.editorial-index)",
        style: null,
        blocks: ["columns-numbered"],
        defaultContent: ["h2.section-heading", "h2.h2-heading"]
      },
      {
        id: "section-3",
        name: "Featured Article",
        selector: "section.section.secondary-section:has(.featured-article)",
        style: "secondary",
        blocks: ["columns-featured"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Editorial Content",
        selector: "section.section.inverse-section:has(.container--narrow)",
        style: "dark",
        blocks: [],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg"]
      },
      {
        id: "section-5",
        name: "Promo Cards",
        selector: "section.section.secondary-section:has(.grid-layout--2col)",
        style: "secondary",
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Essential Reading",
        selector: "section.section:has(.tab-container)",
        style: null,
        blocks: ["tabs-activity"],
        defaultContent: ["h2.h2-heading"]
      },
      {
        id: "section-7",
        name: "CTA",
        selector: "section.section.inverse-section:last-of-type",
        style: "dark",
        blocks: [],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg", "a.button"]
      }
    ]
  };
  var parsers = {
    "hero": parse,
    "columns-featured": parse2,
    "columns-promo": parse3,
    "tabs-activity": parse4,
    "columns-numbered": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_editorial_section_page_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_editorial_section_page_exports);
})();
