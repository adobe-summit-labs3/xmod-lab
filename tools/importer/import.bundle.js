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

  // tools/importer/import.js
  var import_exports = {};
  __export(import_exports, {
    default: () => import_default
  });

  // tools/importer/parsers/hero-full.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".hero-bg img");
    const inner = element.querySelector(".hero-content-inner") || element.querySelector(".hero-content");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    const eyebrow = inner && (inner.querySelector(".tag") || inner.querySelector(".hero-eyebrow"));
    if (eyebrow) {
      const p = document2.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      contentCell.push(p);
    }
    const heading = element.querySelector("h1, .h1-heading");
    if (heading) contentCell.push(heading);
    const lead = element.querySelector(".hero-lead, .paragraph-xl");
    if (lead) contentCell.push(lead);
    const btnGroup = element.querySelector(".button-group");
    if (btnGroup) {
      const links = btnGroup.querySelectorAll("a");
      links.forEach((link, i) => {
        const label = link.querySelector(".button-label");
        if (label) link.textContent = label.textContent.trim();
        const p = document2.createElement("p");
        const wrapper = document2.createElement(i === 0 ? "strong" : "em");
        wrapper.appendChild(link.cloneNode(true));
        p.appendChild(wrapper);
        contentCell.push(p);
      });
    } else {
      const splitButtons = element.querySelectorAll("p > strong > a, p > em > a");
      splitButtons.forEach((link) => {
        contentCell.push(link.closest("p"));
      });
    }
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-article.js
  function parse2(element, { document: document2 }) {
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
      name: "Hero (article)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/featured-article.js
  function parse3(element, { document: document2 }) {
    const image = element.querySelector(".featured-article-image img, :scope > a img");
    const tag = element.querySelector(".tag");
    const heading = element.querySelector("h2, .h2-heading");
    const description = element.querySelector(".paragraph-lg");
    const contentCol = [];
    if (tag) contentCol.push(tag);
    if (heading) contentCol.push(heading);
    if (description) contentCol.push(description);
    const ctaLink = element.querySelector(".featured-article-footer > a, .featured-article-footer .button, a.button");
    if (ctaLink) {
      const label = ctaLink.querySelector(".button-label");
      if (label) ctaLink.textContent = label.textContent.trim();
      contentCol.push(ctaLink);
    }
    const cells = [
      [image || "", contentCol]
    ];
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Featured Article",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-gallery.js
  function parse4(element, { document: document2 }) {
    const gridImages = element.querySelectorAll(".gallery-img, :scope > img");
    const row1 = [];
    gridImages.forEach((img) => {
      row1.push(img);
    });
    const cells = [];
    if (row1.length > 0) {
      cells.push(row1);
    }
    const parent = element.parentElement;
    if (parent) {
      const wideImgWrapper = parent.querySelector(".gallery-img--wide") || parent.querySelector(".utility-margin-top-lg .gallery-img--wide") || parent.querySelector(".utility-margin-top-lg > img");
      let nextEl = element.nextElementSibling;
      while (nextEl) {
        const wideImg = nextEl.querySelector(".gallery-img--wide") || (nextEl.classList && nextEl.classList.contains("gallery-img--wide") ? nextEl : null) || (nextEl.tagName === "IMG" ? nextEl : null);
        if (wideImg) {
          cells.push([wideImg]);
          nextEl.remove();
          break;
        }
        nextEl = nextEl.nextElementSibling;
      }
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Gallery",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/editorial-index.js
  function parse5(element, { document: document2 }) {
    const items = element.querySelectorAll(".editorial-index-item");
    const cells = [];
    items.forEach((item) => {
      const number = item.querySelector(".editorial-index-number");
      const content = item.querySelector(":scope > div");
      cells.push([number || "", content || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Editorial Index",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse6(element, { document: document2 }) {
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

  // tools/importer/parsers/columns-sidebar.js
  function parse7(element, { document: document2 }) {
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
      name: "Columns (columns-pullquote)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-about.js
  function parse8(element, { document: document2 }) {
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
      const img = children[1].tagName === "IMG" ? children[1] : children[1].querySelector("img");
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

  // tools/importer/parsers/tabs-activity.js
  function parse9(element, { document: document2 }) {
    const tabButtons = element.querySelectorAll(".tab-menu-link");
    const tabPanes = element.querySelectorAll(".tab-pane");
    const fragment = document2.createDocumentFragment();
    const parentSection = element.closest(".section, section");
    if (parentSection) {
      const sectionHeading = parentSection.querySelector(".section-heading");
      if (sectionHeading) {
        const h2 = document2.createElement("h2");
        h2.textContent = sectionHeading.textContent.trim();
        fragment.appendChild(h2);
        fragment.appendChild(document2.createElement("hr"));
        sectionHeading.remove();
      }
    }
    tabButtons.forEach((btn, i) => {
      const pane = tabPanes[i];
      if (!pane) return;
      const label = btn.textContent.trim();
      const section = document2.createElement("div");
      const h3 = document2.createElement("h3");
      h3.textContent = label;
      section.appendChild(h3);
      const articleCards = pane.querySelectorAll(".article-card");
      const cardCells = [];
      articleCards.forEach((card) => {
        const img = card.querySelector(".article-card-image img");
        const bodyCol = document2.createElement("div");
        const tag = card.querySelector(".tag");
        if (tag) {
          const tagP = document2.createElement("p");
          tagP.textContent = tag.textContent.trim();
          bodyCol.appendChild(tagP);
        }
        const heading = card.querySelector("h3, h4, h5, h6");
        if (heading) {
          const h = document2.createElement("h3");
          const href = card.getAttribute("href");
          if (href) {
            const a = document2.createElement("a");
            a.href = href;
            a.textContent = heading.textContent.trim();
            h.appendChild(a);
          } else {
            h.textContent = heading.textContent.trim();
          }
          bodyCol.appendChild(h);
        }
        const desc = card.querySelector(".article-card-body > p");
        if (desc) {
          const p = document2.createElement("p");
          p.textContent = desc.textContent.trim();
          bodyCol.appendChild(p);
        }
        cardCells.push([img || "", bodyCol]);
      });
      if (cardCells.length > 0) {
        const cardsBlock = WebImporter.Blocks.createBlock(document2, {
          name: "Cards (cards-article)",
          cells: cardCells
        });
        section.appendChild(cardsBlock);
      }
      const metaTable = WebImporter.Blocks.createBlock(document2, {
        name: "Section Metadata",
        cells: [["style", "tabs"]]
      });
      section.appendChild(metaTable);
      section.appendChild(document2.createElement("hr"));
      fragment.appendChild(section);
    });
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/tabs-team.js
  function parse10(element, { document: document2 }) {
    const tabButtons = element.querySelectorAll(".tab-menu .tab-menu-link");
    const tabPanes = element.querySelectorAll(".tab-pane");
    const fragment = document2.createDocumentFragment();
    const sectionHeading = element.querySelector(".section-heading");
    if (sectionHeading) {
      const h2 = document2.createElement("h2");
      h2.textContent = sectionHeading.textContent.trim();
      fragment.appendChild(h2);
      fragment.appendChild(document2.createElement("hr"));
      sectionHeading.remove();
    }
    tabButtons.forEach((btn, i) => {
      const pane = tabPanes[i];
      if (!pane) return;
      const label = btn.textContent.trim();
      const section = document2.createElement("div");
      const h3 = document2.createElement("h3");
      h3.textContent = label;
      section.appendChild(h3);
      const profileCells = [];
      const avatarCol = document2.createElement("div");
      const profileImg = pane.querySelector(".profile-circle img");
      if (profileImg) {
        avatarCol.appendChild(profileImg.cloneNode(true));
      }
      const name = pane.querySelector(".profile-name");
      if (name) {
        const nameP = document2.createElement("p");
        nameP.textContent = name.textContent.trim();
        avatarCol.appendChild(nameP);
      }
      const textCol = document2.createElement("div");
      const role = pane.querySelector(".profile-name + p");
      if (role) {
        const em = document2.createElement("em");
        em.textContent = role.textContent.trim();
        const p = document2.createElement("p");
        p.appendChild(em);
        textCol.appendChild(p);
      }
      const bioContainer = pane.querySelector(".team-profile-bio");
      if (bioContainer) {
        const paragraphs = bioContainer.querySelectorAll("p");
        paragraphs.forEach((para) => {
          const newP = document2.createElement("p");
          newP.textContent = para.textContent.trim();
          textCol.appendChild(newP);
        });
      }
      profileCells.push([avatarCol, textCol]);
      const profileBlock = WebImporter.Blocks.createBlock(document2, {
        name: "Team Profile",
        cells: profileCells
      });
      section.appendChild(profileBlock);
      const metaTable = WebImporter.Blocks.createBlock(document2, {
        name: "Section Metadata",
        cells: [["style", "tabs"]]
      });
      section.appendChild(metaTable);
      section.appendChild(document2.createElement("hr"));
      fragment.appendChild(section);
    });
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/ticker.js
  function parse11(element, { document: document2 }) {
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

  // tools/importer/parsers/faq-list.js
  function parse12(element, { document: document2 }) {
    const items = element.querySelectorAll(".faq-item");
    const cells = [];
    items.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      cells.push([question || "", answer || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Faq List",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse13(element, { document: document2 }) {
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
        const descText = desc ? desc.textContent.trim() : "";
        const utilityText = authorDate.textContent.trim();
        if (utilityText && utilityText !== descText) {
          const authorP = document2.createElement("p");
          authorP.innerHTML = `<em>${utilityText}</em>`;
          col2.appendChild(authorP);
        }
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

  // tools/importer/parsers/cards-feature.js
  function parse14(element, { document: document2 }) {
    const cells = [];
    const cards = element.querySelectorAll(".card.card-body");
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

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        ".footer",
        ".skip-link",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll(".button-group").forEach((group) => {
        const links = group.querySelectorAll("a");
        const { document: document2 } = payload;
        const fragment = document2.createDocumentFragment();
        links.forEach((link, i) => {
          const label = link.querySelector(".button-label");
          if (label) link.textContent = label.textContent.trim();
          const p = document2.createElement("p");
          const wrapper = document2.createElement(i === 0 ? "strong" : "em");
          wrapper.appendChild(link.cloneNode(true));
          p.appendChild(wrapper);
          fragment.appendChild(p);
        });
        group.replaceWith(fragment);
      });
    }
    if (hookName === TransformHook.afterTransform) {
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
  var STYLE_MAP = {
    "inverse-section": "dark",
    "secondary-section": "secondary",
    "accent-section": "accent",
    "hero-section": "dark"
  };
  var COMPOUND_MAP = {
    "container--narrow": "narrow",
    "utility-text-align-center": "center"
  };
  function detectSectionStyle(sectionEl) {
    const classes = sectionEl.className || "";
    let style = null;
    for (const [cssClass, edsStyle] of Object.entries(STYLE_MAP)) {
      if (classes.includes(cssClass)) {
        style = edsStyle;
        break;
      }
    }
    if (!style) return null;
    const compounds = [];
    for (const [childClass, modifier] of Object.entries(COMPOUND_MAP)) {
      if (sectionEl.querySelector(`.${childClass}`)) {
        compounds.push(modifier);
      }
    }
    if (compounds.length > 0) {
      return `${style}, ${compounds.join(", ")}`;
    }
    return style;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const sections = element.querySelectorAll("section");
    if (sections.length === 0) return;
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = sections[i];
      const style = detectSectionStyle(sectionEl);
      if (style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style }
        });
        sectionEl.after(metaBlock);
      }
      if (i > 0) {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import.js
  var BLOCK_REGISTRY = [
    // Hero variants — article-specific first (has .article-byline inside hero)
    { name: "hero-article", selectors: ["section.hero-section:has(.article-byline)"], parser: parse2 },
    { name: "hero", selectors: ["section.hero-section"], parser: parse },
    // Tabs — containers first so descendant filter excludes nested cards
    { name: "tabs-activity", selectors: [".tab-container.tab-container--wide"], parser: parse9 },
    { name: "tabs-team", selectors: ["section:has(.tab-menu):has(.profile-circle)"], parser: parse10 },
    { name: "tabs", selectors: ["section:has(.tab-menu):not(:has(.tab-container)):not(:has(.profile-circle))"], parser: parse9 },
    // Featured article (standalone block, was columns-featured)
    { name: "featured-article", selectors: [".featured-article"], parser: parse3 },
    // Editorial index (standalone block, was columns-numbered)
    { name: "editorial-index", selectors: [".editorial-index"], parser: parse5 },
    // Columns variants
    { name: "columns-promo", selectors: [".grid-layout.grid-layout--2col", ".accent-section .grid-layout.tablet-1-column:has(.card)"], parser: parse6 },
    { name: "columns-pullquote", selectors: [".secondary-section .grid-layout.desktop-3-column.grid-align-center"], parser: parse7 },
    { name: "columns-about", selectors: [".grid-layout.grid-gap-xl.tablet-1-column"], parser: parse8 },
    // Cards — before columns-gallery to prevent false matches on .desktop-3-column grids
    { name: "cards-feature", selectors: [".grid-layout.desktop-3-column.grid-gap-lg:has(.card.card-body)"], parser: parse14 },
    { name: "cards-article", selectors: [".grid-layout.desktop-3-column:has(.article-card)"], parser: parse13 },
    // Gallery must come after cards to avoid matching card grids
    { name: "gallery", selectors: [".inverse-section .grid-layout.desktop-3-column:not(:has(.article-card)):not(:has(.card.card-body))"], parser: parse4 },
    // Standalone blocks
    { name: "ticker", selectors: [".ticker-strip"], parser: parse11 },
    { name: "faq-list", selectors: [".faq-list"], parser: parse12 }
  ];
  function isDescendantOfMatched(el, matched) {
    let parent = el.parentElement;
    while (parent) {
      if (matched.has(parent)) return true;
      parent = parent.parentElement;
    }
    return false;
  }
  function findBlocksOnPage(document2) {
    const pageBlocks = [];
    const matched = /* @__PURE__ */ new Set();
    for (const entry of BLOCK_REGISTRY) {
      for (const selector of entry.selectors) {
        try {
          const elements = document2.querySelectorAll(selector);
          elements.forEach((el) => {
            if (!matched.has(el) && !isDescendantOfMatched(el, matched)) {
              matched.add(el);
              pageBlocks.push({ name: entry.name, element: el, parser: entry.parser });
            }
          });
        } catch (e) {
          console.warn(`Invalid selector for ${entry.name}: ${selector}`, e);
        }
      }
    }
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function executeTransformers(hookName, element, payload) {
    const transformers = [transform, transform2];
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, payload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const originalURL = params.originalURL || url;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2);
      pageBlocks.forEach((block) => {
        try {
          block.parser(block.element, { document: document2, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name}:`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_exports);
})();
