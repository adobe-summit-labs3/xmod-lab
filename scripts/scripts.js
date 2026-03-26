import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');

    // In styled sections (dark/accent), standalone links become buttons
    const styledSection = p.closest('.section.dark, .section.accent');
    if (!strong && !em && !styledSection) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else if (em) {
      a.classList.add('secondary');
      em.replaceWith(a);
    } else {
      // Bare link in styled section → primary button
      a.classList.add('primary');
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Fixes button variants and groups adjacent button-wrappers.
 * Runs after sections are loaded so all buttons are in the DOM.
 */
function decorateButtonVariants() {
  // 1. In dark and accent sections, make the second button secondary
  document.querySelectorAll('main > .section.dark, main > .section.accent').forEach((section) => {
    const wrappers = [...section.querySelectorAll('.default-content-wrapper')];
    wrappers.forEach((wrapper) => {
      const btnWrappers = [...wrapper.querySelectorAll(':scope > p.button-wrapper')];
      // Second button in a group → secondary
      for (let i = 1; i < btnWrappers.length; i += 1) {
        const prevWrapper = btnWrappers[i - 1];
        // Check if this wrapper immediately follows the previous one
        if (btnWrappers[i].previousElementSibling === prevWrapper) {
          const btn = btnWrappers[i].querySelector('a.button.primary');
          if (btn) {
            btn.classList.remove('primary');
            btn.classList.add('secondary');
          }
        }
      }
    });
  });

  // 2. Convert "Full FAQ" and "Field Notes" buttons to text-links
  document.querySelectorAll('a.button').forEach((btn) => {
    const text = btn.textContent.trim();
    if (text === 'Full FAQ' || text === 'Field Notes') {
      btn.classList.remove('button', 'primary', 'secondary');
      btn.classList.add('text-link');
      const wrapper = btn.closest('p.button-wrapper');
      if (wrapper) {
        wrapper.classList.remove('button-wrapper');
      }
    }
  });

  // 3. Group adjacent button-wrappers into a flex container
  document.querySelectorAll('p.button-wrapper').forEach((wrapper) => {
    // Skip if already in a group
    if (wrapper.parentElement.classList.contains('button-group')) return;

    const next = wrapper.nextElementSibling;
    if (next && next.classList.contains('button-wrapper')) {
      const group = document.createElement('div');
      group.className = 'button-group';
      wrapper.parentNode.insertBefore(group, wrapper);
      group.append(wrapper);
      // Collect all consecutive button-wrappers
      let sibling = group.nextElementSibling;
      while (sibling && sibling.classList.contains('button-wrapper')) {
        const nextSibling = sibling.nextElementSibling;
        group.append(sibling);
        sibling = nextSibling;
      }
    }
  });
}

/**
 * Splits the combined dark section so "Quick Answers" and "How We Work"
 * get their own visual backgrounds instead of inheriting the dark section.
 */
function splitDarkSection() {
  const darkSection = document.querySelector('main > .section.dark.accordion-faq-container');
  if (!darkSection) return;

  const accWrapper = darkSection.querySelector('.accordion-faq-wrapper');
  const colsWrapper = darkSection.querySelector('.columns-wrapper');
  if (!accWrapper || !colsWrapper) return;

  // Find heading wrappers by text content
  const allDCW = darkSection.querySelectorAll('.default-content-wrapper');
  let qaHeadingDCW = null;
  let hwwHeadingDCW = null;
  allDCW.forEach((dcw) => {
    const h2 = dcw.querySelector('h2');
    if (h2 && h2.textContent.includes('Quick Answers')) qaHeadingDCW = dcw;
    if (h2 && h2.textContent.includes('How We Work')) hwwHeadingDCW = dcw;
  });

  // Create "Quick Answers" subsection (white/default background)
  if (qaHeadingDCW) {
    const qaSubsection = document.createElement('div');
    qaSubsection.className = 'subsection subsection-default';
    darkSection.insertBefore(qaSubsection, qaHeadingDCW);
    qaSubsection.append(qaHeadingDCW);
    qaSubsection.append(accWrapper);
  }

  // Create "How We Work" subsection (light/secondary background)
  if (hwwHeadingDCW) {
    const hwwSubsection = document.createElement('div');
    hwwSubsection.className = 'subsection subsection-secondary';
    darkSection.insertBefore(hwwSubsection, hwwHeadingDCW);
    hwwSubsection.append(hwwHeadingDCW);
    hwwSubsection.append(colsWrapper);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  splitDarkSection();

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  decorateButtonVariants();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
