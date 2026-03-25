var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-blog-article.js
  var import_blog_article_exports = {};
  __export(import_blog_article_exports, {
    default: () => import_blog_article_default
  });

  // tools/importer/parsers/hero-article.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const bgImg = element.querySelector(".hero-bg img");
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentWrapper = document2.createElement("div");
    const breadcrumbs = element.querySelector(".breadcrumbs");
    if (breadcrumbs) {
      const breadcrumbP = document2.createElement("p");
      const links = breadcrumbs.querySelectorAll("a");
      const spans = breadcrumbs.querySelectorAll("span:not(:empty)");
      const parts = [];
      breadcrumbs.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
          const text = node.textContent.trim();
          if (text) parts.push(text);
        } else if (node.tagName === "A") {
          const a = node.cloneNode(true);
          parts.push(a.outerHTML);
        } else if (node.tagName === "SPAN" && node.textContent.trim()) {
          parts.push(node.textContent.trim());
        }
      });
      breadcrumbP.innerHTML = parts.join(" ");
      contentWrapper.appendChild(breadcrumbP);
    }
    const tagEl = element.querySelector(".tag.blog-hero-tag");
    if (tagEl) {
      const tagP = document2.createElement("p");
      tagP.textContent = tagEl.textContent.trim();
      contentWrapper.appendChild(tagP);
    }
    const h1 = element.querySelector("h1");
    if (h1) {
      const heading = document2.createElement("h1");
      heading.textContent = h1.textContent.trim();
      contentWrapper.appendChild(heading);
    }
    const byline = element.querySelector(".article-byline");
    if (byline) {
      const bylineDiv = document2.createElement("div");
      const avatar = byline.querySelector(".avatar img");
      if (avatar) {
        bylineDiv.appendChild(avatar.cloneNode(true));
      }
      const name = byline.querySelector(".article-byline-name");
      if (name) {
        const nameP = document2.createElement("p");
        nameP.innerHTML = `<strong>${name.textContent.trim()}</strong>`;
        bylineDiv.appendChild(nameP);
      }
      const meta = byline.querySelector(".article-byline-meta");
      if (meta) {
        const metaP = document2.createElement("p");
        metaP.textContent = meta.textContent.trim();
        bylineDiv.appendChild(metaP);
      }
      contentWrapper.appendChild(bylineDiv);
    }
    cells.push([contentWrapper]);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Hero (hero-article)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-sidebar.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const children = element.children;
    const col1 = document2.createElement("div");
    const firstChild = children[0];
    if (firstChild) {
      const heading = firstChild.querySelector("h3");
      if (heading) {
        const h3 = document2.createElement("h3");
        h3.textContent = heading.textContent.trim();
        col1.appendChild(h3);
      }
      const list = firstChild.querySelector("ul");
      if (list) {
        col1.appendChild(list.cloneNode(true));
      }
    }
    const col2 = document2.createElement("div");
    const secondChild = children[1];
    if (secondChild) {
      const pullQuote = secondChild.querySelector(".pull-quote");
      if (pullQuote) {
        const blockquote = document2.createElement("blockquote");
        const quoteBody = pullQuote.querySelector(".pull-quote-body");
        if (quoteBody) {
          blockquote.textContent = quoteBody.textContent.trim();
        }
        col2.appendChild(blockquote);
        const attribution = pullQuote.querySelector(".pull-quote-attribution");
        if (attribution) {
          const cite = document2.createElement("p");
          cite.innerHTML = `<em>${attribution.textContent.trim()}</em>`;
          col2.appendChild(cite);
        }
      }
    }
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-sidebar)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-gallery.js
  function parse3(element, { document: document2 }) {
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

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document: document2 }) {
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

  // tools/importer/import-blog-article.js
  var PAGE_TEMPLATE = {
    name: "blog-article",
    description: "Long-form blog article with hero image, metadata tags, day-by-day narrative, inline images, author attribution, and related links",
    urls: [
      "https://gabrielwalt.github.io/wknd/blog/patagonia-trek.html",
      "https://gabrielwalt.github.io/wknd/blog/kayaking-norway.html",
      "https://gabrielwalt.github.io/wknd/blog/alpine-cycling.html",
      "https://gabrielwalt.github.io/wknd/blog/yosemite-rock-climbing.html",
      "https://gabrielwalt.github.io/wknd/blog/mountain-photography.html",
      "https://gabrielwalt.github.io/wknd/blog/ultralight-backpacking.html"
    ],
    blocks: [
      {
        name: "hero-article",
        instances: ["section.hero-section"]
      },
      {
        name: "columns-sidebar",
        instances: [".secondary-section .grid-layout.desktop-3-column.grid-align-center"]
      },
      {
        name: "columns-gallery",
        instances: [".inverse-section .grid-layout.desktop-3-column"]
      },
      {
        name: "cards-article",
        instances: ["section.section:last-of-type:not(.inverse-section) .grid-layout.desktop-3-column"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Article Hero",
        selector: "section.hero-section",
        style: "dark",
        blocks: ["hero-article"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Article Body",
        selector: "section.section.blog-article-section",
        style: null,
        blocks: [],
        defaultContent: [".blog-content.blog-content-body"]
      },
      {
        id: "section-3",
        name: "Sidebar Summary",
        selector: "section.section.secondary-section",
        style: "secondary",
        blocks: ["columns-sidebar"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "In the Field Gallery",
        selector: "section.section.inverse-section",
        style: "dark",
        blocks: ["columns-gallery"],
        defaultContent: [".section-heading h2", ".section-heading .text-button", ".utility-margin-top-lg .gallery-img--wide"]
      },
      {
        id: "section-5",
        name: "More Stories",
        selector: "section.section:last-of-type:not(.inverse-section)",
        style: null,
        blocks: ["cards-article"],
        defaultContent: ["h2.section-heading"]
      }
    ]
  };
  var parsers = {
    "hero-article": parse,
    "columns-sidebar": parse2,
    "columns-gallery": parse3,
    "cards-article": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
  var import_blog_article_default = {
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
  return __toCommonJS(import_blog_article_exports);
})();
