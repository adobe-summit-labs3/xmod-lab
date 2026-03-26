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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
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

  // tools/importer/parsers/tabs-activity.js
  function parse3(element, { document: document2 }) {
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

  // tools/importer/parsers/ticker.js
  function parse4(element, { document: document2 }) {
    const track = element.querySelector(".ticker-track");
    const seen = /* @__PURE__ */ new Set();
    const items = [];
    if (track) {
      const allText = track.textContent;
      const parts = allText.split("\xB7").map((s) => s.trim()).filter(Boolean);
      parts.forEach((text) => {
        if (!seen.has(text)) {
          seen.add(text);
          items.push(text);
        }
      });
    }
    const wrapper = document2.createElement("div");
    items.forEach((item) => {
      const p = document2.createElement("p");
      p.textContent = item;
      wrapper.appendChild(p);
    });
    const cells = [[wrapper]];
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "ticker",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document: document2 }) {
    const faqItems = element.querySelectorAll(".faq-item");
    const cells = [];
    faqItems.forEach((item) => {
      const questionEl = item.querySelector(".faq-question");
      let questionText = "";
      if (questionEl) {
        const clone = questionEl.cloneNode(true);
        const icon = clone.querySelector(".faq-icon");
        if (icon) icon.remove();
        questionText = clone.textContent.trim();
      }
      const answer = item.querySelector(".faq-answer");
      const questionDiv = document2.createElement("div");
      const questionP = document2.createElement("p");
      questionP.textContent = questionText;
      questionDiv.appendChild(questionP);
      cells.push([questionDiv, answer || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "accordion-faq",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-numbered.js
  function parse6(element, { document: document2 }) {
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

  // tools/importer/parsers/columns-gallery.js
  function parse7(element, { document: document2 }) {
    const images = element.querySelectorAll(".gallery-img, :scope > img");
    const row = [];
    images.forEach((img) => {
      row.push(img);
    });
    const cells = [];
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Gallery",
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

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage with hero, featured content, activity browser, stories gallery, FAQ, and onboarding sections",
    urls: [
      "https://gabrielwalt.github.io/wknd/index.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["section.hero-section.hero-section--full", "section.hero-section"]
      },
      {
        name: "columns-featured",
        instances: [".featured-article"]
      },
      {
        name: "tabs-activity",
        instances: [".tab-container.tab-container--wide"]
      },
      {
        name: "ticker",
        instances: [".ticker-strip"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "columns-numbered",
        instances: [".editorial-index"]
      },
      {
        name: "columns-gallery",
        instances: [".inverse-section .grid-layout.desktop-3-column"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "section.hero-section.hero-section--full",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "section.section.secondary-section:has(.featured-article)",
        style: "secondary",
        blocks: ["columns-featured"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Browse by Activity",
        selector: "section.section:has(.tab-container)",
        style: null,
        blocks: ["tabs-activity"],
        defaultContent: [".section-heading h2"]
      },
      {
        id: "section-4",
        name: "Ticker Strip",
        selector: ".ticker-strip",
        style: "dark",
        blocks: ["ticker"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Start Here",
        selector: "section.section.inverse-section:has(.hero-eyebrow)",
        style: "dark",
        blocks: [],
        defaultContent: [".hero-eyebrow", "h2.h2-heading", "p.paragraph-lg", ".button-group"]
      },
      {
        id: "section-6",
        name: "Quick Answers",
        selector: "section.section:has(.faq-list)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [".section-heading h2", ".section-heading .text-button"]
      },
      {
        id: "section-7",
        name: "How We Work",
        selector: "section.section.secondary-section:has(.editorial-index)",
        style: "secondary",
        blocks: ["columns-numbered"],
        defaultContent: [".section-heading h2"]
      },
      {
        id: "section-8",
        name: "In the Field",
        selector: "section.section.inverse-section:has(.gallery-img)",
        style: "dark",
        blocks: ["columns-gallery"],
        defaultContent: [".section-heading h2", ".section-heading .text-button", ".utility-margin-top-lg .gallery-img--wide"]
      },
      {
        id: "section-9",
        name: "CTA Banner",
        selector: "section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: ["h2.h2-heading", "p.paragraph-xl", ".button-group"]
      }
    ]
  };
  var parsers = {
    "hero": parse,
    "columns-featured": parse2,
    "tabs-activity": parse3,
    "ticker": parse4,
    "accordion-faq": parse5,
    "columns-numbered": parse6,
    "columns-gallery": parse7
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
