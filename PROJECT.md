# WKND Adventures — Project State

**Original site:** https://gabrielwalt.github.io/wknd/
**Local preview:** http://localhost:3000/content/wknd/{page}

---

## Blocks (10 total)

Blocks use EDS variant convention: `Block (variant)` in authoring → `class="block variant"` in HTML.
All variants share a single CSS/JS file under the base block folder.

| Block | Variants | CSS Notes |
|-------|----------|-----------|
| `hero` | `hero-full`, `hero-article` | Full-bleed overlay hero. `hero-full` = landing pages, `hero-article` = blog posts with breadcrumbs. No-image fallback via `.no-image` class. |
| `cards` | `cards-article`, `cards-feature` | `cards-article` = image+body grid with hover effects. `cards-feature` = glass text-only cards (dark section). Shared internal classes: `cards-card-image`, `cards-card-body`. |
| `columns` | `columns-about`, `columns-editorial`, `columns-featured`, `columns-promo`, `columns-sidebar` | 5 variants in one file. `columns-promo` uses `:has()` for narrow container. `columns-sidebar` has pull-quote dark panel. Shared internal class: `columns-img-col`. |
| `tabs` | `tabs-team` | Base = activity browser (card grid panels). `tabs-team` = profile layout with circular avatars. Generic classes: `tabs-list`, `tabs-panel`, `tabs-tab`. |
| `gallery` | _(none)_ | Standalone block (renamed from columns-gallery). Photo grid. |
| `accordion-faq` | _(none)_ | Uses native `<details>/<summary>`. |
| `ticker` | _(none)_ | Horizontal scrolling tag ticker. |
| `header` | _(none)_ | Site header (nav not yet migrated). |
| `footer` | _(none)_ | Site footer (nav not yet migrated). |
| `fragment` | _(none)_ | EDS boilerplate fragment loader. |

### Block variant CSS selectors

```
.hero.hero-full { ... }           /* compound selector for variant */
.hero.hero-article { ... }
.cards.cards-article { ... }
.cards.cards-feature { ... }
.columns.columns-about { ... }
.columns.columns-editorial { ... }
.columns.columns-featured { ... }
.columns.columns-promo { ... }
.columns.columns-sidebar { ... }
.tabs.tabs-team { ... }
```

### Container-level variant targeting

EDS generates `{block}-container` and `{block}-wrapper` divs using the **base** block name only. To target container/wrapper for a specific variant, use `:has()`:

```css
.columns-wrapper:has(.columns-promo) { max-width: var(--container-narrow-max-width); }
```

---

## Section Styles

Three section style variants used across the site:

| Style | CSS Class | Background | Text |
|-------|-----------|------------|------|
| `dark` | `.section.dark` | `var(--dark-color)` (#0f1a14) | white |
| `accent` | `.section.accent` | `var(--accent-color)` (#e8651a) | white |
| `secondary` | `.section.secondary` | `var(--light-color)` (#f0ece4) | default |

Usage counts: dark (20), secondary (11), accent (9).

---

## Design Tokens (styles.css)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--background-color` | `#fff` | Page background |
| `--text-color` | `#0f1a14` | Body text |
| `--text-color-muted` | `#7a8a80` | Gray-500, secondary text |
| `--text-color-subtle` | `#3d4f45` | Gray-400 |
| `--accent-color` | `#e8651a` | Orange accent, buttons |
| `--light-color` | `#f0ece4` | Secondary section bg |
| `--dark-color` | `#0f1a14` | Dark section bg, headings |
| `--cream-color` | `#f5f0e8` | Card hover bg |
| `--forest-color` | `#1a3a2e` | Deep green accent |
| `--border-color` | `#c8c2b8` | Gray-300, hover borders |
| `--border-color-light` | `#ddd8cf` | Gray-200, default borders |

### Typography
| Token | Value |
|-------|-------|
| `--body-font-family` | Instrument Sans |
| `--heading-font-family` | Syncopate |
| `--button-font-family` | Syncopate |

### Spacing
| Token | Value |
|-------|-------|
| `--container-max-width` | 1200px |
| `--container-narrow-max-width` | 768px |
| `--container-padding` | 0 24px |
| `--section-padding` | 48px 0 (mobile), 64px 0 (desktop) |

### Shared Component Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--card-border-radius` | `20px` | Cards, columns-promo, sidebar, gallery, tabs panels |
| `--card-hover-shadow` | `0 4px 20px rgb(0 0 0 / 8%)` | Hover shadow on cards, promo, tab cards |
| `--card-hover-transition` | `background-color 0.15s, border-color 0.15s, box-shadow 0.15s` | Shared card hover transition |
| `--tag-padding` | `4px 12px` | Tag pill padding (cards, columns-featured, hero-article) |
| `--tag-font-size` | `12px` | Tag pill font size |
| `--tag-letter-spacing` | `0.6px` | Tag pill letter spacing |
| `--text-on-dark` | `rgb(255 255 255 / 85%)` | Paragraph text on dark backgrounds |
| `--text-on-dark-muted` | `rgb(255 255 255 / 55%)` | Secondary text on dark backgrounds |
| `--glass-bg` | `rgb(255 255 255 / 6%)` | Glass card background (dark sections) |
| `--glass-border` | `rgb(255 255 255 / 12%)` | Glass card border (dark sections) |
| `--transition-fast` | `0.15s` | Quick interactions (hover, border) |
| `--transition-normal` | `0.3s ease` | Standard transitions (transform, accordion) |

### Buttons
Primary (black + amber shadow), Ghost (outline + amber shadow), Accent (amber + black shadow). All use offset `box-shadow` with hover lift and active press-down transitions.

---

## Pages (16 total)

### Landing pages (import-homepage.js)
| Page | Blocks |
|------|--------|
| `index` | hero-full, columns-featured, tabs, ticker, columns-editorial, gallery, accordion-faq |

### Hub/landing pages (import-hub-landing-page.js)
| Page | Blocks |
|------|--------|
| `adventures` | hero-full, columns-featured, tabs, columns-editorial, cards-article, columns-promo |
| `expeditions` | hero-full, columns-editorial, tabs, cards-article, columns-promo |
| `destinations` | hero-full, columns-featured, columns-editorial, cards-article, columns-promo |
| `gear` | hero-full, columns-featured, tabs, columns-editorial, cards-article |

### Editorial/section pages (import-editorial-section-page.js)
| Page | Blocks |
|------|--------|
| `field-notes` | hero-full, columns-featured, tabs, columns-promo |
| `community` | hero-full, columns-featured |
| `sustainability` | hero-full, columns-featured |

### Informational pages (import-informational-page.js)
| Page | Blocks |
|------|--------|
| `about` | hero-full, columns-about, cards-feature, tabs-team, cards-article |
| `faq` | hero-full, accordion-faq, columns-promo, cards-article |

### Blog articles (import-blog-article.js)
| Page | Blocks |
|------|--------|
| `blog/patagonia-trek` | hero-article, columns-sidebar, gallery, cards-article |
| `blog/alpine-cycling` | hero-article, columns-sidebar, gallery, cards-article |
| `blog/kayaking-norway` | hero-article, columns-sidebar, gallery, cards-article |
| `blog/mountain-photography` | hero-article, columns-sidebar, gallery, cards-article |
| `blog/ultralight-backpacking` | hero-article, columns-sidebar, gallery, cards-article |
| `blog/yosemite-rock-climbing` | hero-article, columns-sidebar, gallery, cards-article |

---

## Import Infrastructure

### Import Scripts (tools/importer/)
| Script | Template | Pages |
|--------|----------|-------|
| `import-homepage.js` | homepage | index |
| `import-hub-landing-page.js` | hub-landing-page | adventures, expeditions, destinations, gear |
| `import-editorial-section-page.js` | editorial-section-page | field-notes, community, sustainability |
| `import-informational-page.js` | informational-page | about, faq |
| `import-blog-article.js` | blog-article | 6 blog posts |

### Parsers (tools/importer/parsers/) — 14 files
`hero-full.js`, `hero-article.js`, `columns-featured.js`, `columns-editorial.js`, `columns-gallery.js`, `columns-about.js`, `columns-sidebar.js`, `columns-promo.js`, `cards-article.js`, `cards-feature.js`, `tabs-activity.js`, `tabs-team.js`, `accordion-faq.js`, `ticker.js`

Parser output names (what goes into content HTML):
- `Hero (hero-full)` → `class="hero hero-full"`
- `Hero (hero-article)` → `class="hero hero-article"`
- `Cards (cards-article)` → `class="cards cards-article"`
- `Cards (cards-feature)` → `class="cards cards-feature"`
- `Columns (columns-about)` → `class="columns columns-about"`
- `Columns (columns-editorial)` → `class="columns columns-editorial"`
- `Columns (columns-featured)` → `class="columns columns-featured"`
- `Columns (columns-promo)` → `class="columns columns-promo"`
- `Columns (columns-sidebar)` → `class="columns columns-sidebar"`
- `Gallery` → `class="gallery"`
- `Tabs` → `class="tabs"`
- `Tabs (tabs-team)` → `class="tabs tabs-team"`

### Transformers (tools/importer/transformers/)
- `wknd-cleanup.js` — removes nav, footer, scripts, etc.
- `wknd-sections.js` — creates section boundaries with section-metadata

### Bundling
```bash
npx esbuild tools/importer/import-{name}.js \
  --bundle --format=iife --global-name=CustomImportScript \
  --platform=browser --outfile=tools/importer/import-{name}.bundle.js
```
**Critical:** Must use `--format=iife --global-name=CustomImportScript`. ESM format will fail.

### Running imports
```bash
node /home/node/.excat-marketplace/excat/skills/excat-content-import/scripts/run-bulk-import.js \
  --import-script tools/importer/import-{name}.bundle.js \
  --urls tools/importer/urls-{name}.txt
```

---

## Known Issues / Notes

- **Header/footer 404:** Nav content not yet migrated. Header/footer blocks error on every page — expected.
- **Hero selector:** Original source uses `section.hero-section.hero-section--full` on some pages and `section.hero-section` on others. Import scripts now use both selectors as fallback: `['section.hero-section.hero-section--full', 'section.hero-section']`.
- **Bundle files in lint:** `.bundle.js` files are generated by esbuild and excluded from eslint via `.eslintignore`.
- **Consolidated CSS specificity:** Merged variant CSS files use `/* stylelint-disable no-descending-specificity */` because variant selectors naturally follow base selectors with different specificity chains.
- **`moveInstrumentation`:** This function does not exist in this project's `scripts.js`. Do NOT import it in block JS files.
- **Blog pages all use same block set:** All 6 blog articles share identical block structure.
