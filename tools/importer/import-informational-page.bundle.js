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

  // tools/importer/import-informational-page.js
  var import_informational_page_exports = {};
  __export(import_informational_page_exports, {
    default: () => import_informational_page_default
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

  // tools/importer/parsers/columns-about.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const col1 = document2.createElement("div");
    const children = element.children;
    if (children[0]) {
      const heading = children[0].querySelector("h2");
      if (heading) {
        const h2 = document2.createElement("h2");
        h2.textContent = heading.textContent.trim();
        col1.appendChild(h2);
      }
      const paragraphs = children[0].querySelectorAll("p");
      paragraphs.forEach((p) => {
        const newP = document2.createElement("p");
        newP.textContent = p.textContent.trim();
        col1.appendChild(newP);
      });
    }
    const col2 = document2.createElement("div");
    if (children[1]) {
      const img = children[1].querySelector("img");
      if (img) {
        col2.appendChild(img.cloneNode(true));
      }
    }
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-about)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const cards = element.querySelectorAll(".feature-card");
    cards.forEach((card) => {
      const row = document2.createElement("div");
      const heading = card.querySelector("h3");
      if (heading) {
        const h3 = document2.createElement("h3");
        h3.textContent = heading.textContent.trim();
        row.appendChild(h3);
      }
      const desc = card.querySelector("p");
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        row.appendChild(p);
      }
      const link = card.querySelector("a");
      if (link) {
        const a = document2.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        row.appendChild(a);
      }
      cells.push([row]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Cards (cards-feature)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-team.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    const tabButtons = element.querySelectorAll(".tab-menu .tab-menu-link");
    const tabPanes = element.querySelectorAll(".tab-pane");
    tabButtons.forEach((button, i) => {
      const tabLabel = document2.createElement("div");
      tabLabel.textContent = button.textContent.trim();
      const tabContent = document2.createElement("div");
      const pane = tabPanes[i];
      if (pane) {
        const profileImg = pane.querySelector(".profile-circle img");
        if (profileImg) {
          const img = profileImg.cloneNode(true);
          tabContent.appendChild(img);
        }
        const name = pane.querySelector(".profile-name");
        if (name) {
          const h3 = document2.createElement("h3");
          h3.textContent = name.textContent.trim();
          tabContent.appendChild(h3);
        }
        const role = pane.querySelector(".profile-name + p");
        if (role) {
          const em = document2.createElement("em");
          em.textContent = role.textContent.trim();
          const p = document2.createElement("p");
          p.appendChild(em);
          tabContent.appendChild(p);
        }
        const bioContainer = pane.querySelector(".team-profile-bio");
        if (bioContainer) {
          const paragraphs = bioContainer.querySelectorAll("p");
          paragraphs.forEach((para) => {
            const newP = document2.createElement("p");
            newP.textContent = para.textContent.trim();
            tabContent.appendChild(newP);
          });
        }
      }
      cells.push([tabLabel, tabContent]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Tabs (tabs-team)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse5(element, { document: document2 }) {
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

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-article.js
  function parse7(element, { document: document2 }) {
    const cards = element.querySelectorAll(".article-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img");
      const col1 = document2.createElement("div");
      if (img) {
        col1.appendChild(img.cloneNode(true));
      }
      const col2 = document2.createElement("div");
      const tag = card.querySelector(".tag");
      if (tag) {
        const tagP = document2.createElement("p");
        tagP.textContent = tag.textContent.trim();
        col2.appendChild(tagP);
      }
      const title = card.querySelector("h3, h5");
      if (title) {
        const h3 = document2.createElement("h3");
        h3.textContent = title.textContent.trim();
        col2.appendChild(h3);
      }
      const desc = card.querySelector(".paragraph-sm");
      if (desc) {
        const descP = document2.createElement("p");
        descP.textContent = desc.textContent.trim();
        col2.appendChild(descP);
      }
      const authorDate = card.querySelector(".utility-text-secondary");
      if (authorDate) {
        const authorP = document2.createElement("p");
        authorP.innerHTML = `<em>${authorDate.textContent.trim()}</em>`;
        col2.appendChild(authorP);
      }
      const href = card.getAttribute("href");
      if (href) {
        const linkP = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = "Read More";
        linkP.appendChild(a);
        col2.appendChild(linkP);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Cards (cards-article)",
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

  // tools/importer/import-informational-page.js
  var PAGE_TEMPLATE = {
    name: "informational-page",
    description: "Informational page with hero, structured content such as team profiles and FAQ categories",
    urls: [
      "https://gabrielwalt.github.io/wknd/about.html",
      "https://gabrielwalt.github.io/wknd/faq.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["section.hero-section"]
      },
      {
        name: "columns-about",
        instances: [".grid-layout.grid-gap-xxl.tablet-1-column"]
      },
      {
        name: "cards-feature",
        instances: [".inverse-section .grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)"]
      },
      {
        name: "tabs-team",
        instances: ["section.section:has(.tab-menu)"]
      },
      {
        name: "columns-promo",
        instances: [".accent-section .grid-layout.tablet-1-column:has(.card)"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "cards-article",
        instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)"]
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
        selector: "section.section.accent-section:first-of-type",
        style: "accent",
        blocks: ["columns-promo"],
        defaultContent: ["h2.h2-heading", "p.paragraph-xl"]
      },
      {
        id: "section-3",
        name: "Content Body",
        selector: "section.section:not(.accent-section):not(.inverse-section):not(.secondary-section)",
        style: null,
        blocks: ["columns-about", "tabs-team", "accordion-faq", "cards-article"],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg"]
      },
      {
        id: "section-4",
        name: "Dark Content",
        selector: "section.section.inverse-section",
        style: "dark",
        blocks: ["cards-feature"],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg"]
      },
      {
        id: "section-5",
        name: "Secondary Content",
        selector: "section.section.secondary-section",
        style: "secondary",
        blocks: ["accordion-faq"],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg"]
      },
      {
        id: "section-6",
        name: "CTA",
        selector: ["section.section.accent-section:last-of-type", "section.section.inverse-section:last-of-type"],
        style: "accent",
        blocks: [],
        defaultContent: ["h2.h2-heading", "p.paragraph-lg", ".button-group"]
      }
    ]
  };
  var parsers = {
    "hero": parse,
    "columns-about": parse2,
    "cards-feature": parse3,
    "tabs-team": parse4,
    "columns-promo": parse5,
    "accordion-faq": parse6,
    "cards-article": parse7
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
  var import_informational_page_default = {
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
  return __toCommonJS(import_informational_page_exports);
})();
