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

    a.title = a.title || text;
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
 * Decorates consecutive sections with style=tabs into a tabbed container.
 * Each tabs section becomes a tab panel; the first heading in each becomes the tab label.
 * Runs after all sections are loaded so blocks inside panels are fully decorated.
 * @param {Element} main The main element
 */
function decorateTabSections(main) {
  const sections = [...main.querySelectorAll(':scope > .section.tabs')];
  if (!sections.length) return;

  // Group consecutive .tabs sections
  const groups = [];
  let current = [];
  sections.forEach((section) => {
    if (current.length && current[current.length - 1].nextElementSibling !== section) {
      groups.push(current);
      current = [];
    }
    current.push(section);
  });
  if (current.length) groups.push(current);

  groups.forEach((group) => {
    // Find the section heading that precedes the tab group
    // (e.g., "Browse by Activity" in a default-content-wrapper right before the first tab section)
    const firstTab = group[0];

    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';

    // Insert before the first tab section
    firstTab.parentNode.insertBefore(tabsContainer, firstTab);

    // Check for a heading section immediately before the tab group
    const prevSection = tabsContainer.previousElementSibling;
    if (prevSection && prevSection.classList.contains('section')
      && !prevSection.classList.contains('tabs')) {
      // Check if this section only has a heading (section title for the tabs)
      const wrappers = prevSection.querySelectorAll(':scope > .default-content-wrapper');
      const blocks = prevSection.querySelectorAll(':scope > [class*="-wrapper"]:not(.default-content-wrapper)');
      if (wrappers.length === 1 && blocks.length === 0) {
        const h2 = wrappers[0].querySelector('h2');
        if (h2 && wrappers[0].children.length === 1) {
          tabsContainer.append(wrappers[0]);
          prevSection.remove();
        }
      }
    }

    // Build tab list
    const tablist = document.createElement('div');
    tablist.className = 'tabs-list';
    tablist.setAttribute('role', 'tablist');

    // Sliding indicator element
    const indicator = document.createElement('div');
    indicator.className = 'tabs-indicator';
    let activeIndex = 0;

    function moveIndicator(targetBtn, animate = true) {
      const listRect = tablist.getBoundingClientRect();
      const btnRect = targetBtn.getBoundingClientRect();
      const newLeft = btnRect.left - listRect.left + tablist.scrollLeft;
      const newRight = listRect.width - (newLeft + btnRect.width);
      const newIndex = [...tablist.querySelectorAll('button')].indexOf(targetBtn);
      const movingRight = newIndex > activeIndex;

      if (animate) {
        // Asymmetric animation: leading edge moves first, trailing edge follows
        if (movingRight) {
          indicator.style.transition = 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.08s, right 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
          indicator.style.transition = 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), right 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.08s';
        }
      } else {
        indicator.style.transition = 'none';
      }

      indicator.style.left = `${newLeft}px`;
      indicator.style.right = `${newRight}px`;
      activeIndex = newIndex;
    }

    // Build tab panels
    group.forEach((section, i) => {
      // Extract tab label from the first heading or first element
      const heading = section.querySelector(':scope > .default-content-wrapper > h2, :scope > .default-content-wrapper > h3');
      const label = heading ? heading.textContent.trim() : `Tab ${i + 1}`;
      const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Remove the heading from the section (it becomes the tab button)
      if (heading) heading.remove();

      // Create tab button
      const button = document.createElement('button');
      button.className = 'tabs-tab';
      button.id = `tab-${id}`;
      button.textContent = label;
      button.setAttribute('aria-controls', `tabpanel-${id}`);
      button.setAttribute('aria-selected', !i);
      button.setAttribute('role', 'tab');
      button.setAttribute('type', 'button');
      button.addEventListener('click', () => {
        tabsContainer.querySelectorAll('[role=tabpanel]').forEach((panel) => {
          panel.setAttribute('aria-hidden', true);
        });
        tablist.querySelectorAll('button').forEach((btn) => {
          btn.setAttribute('aria-selected', false);
        });
        section.setAttribute('aria-hidden', false);
        button.setAttribute('aria-selected', true);
        moveIndicator(button);
      });
      tablist.append(button);

      // Convert section into tab panel
      section.setAttribute('role', 'tabpanel');
      section.setAttribute('aria-hidden', !!i);
      section.setAttribute('aria-labelledby', `tab-${id}`);
      section.id = `tabpanel-${id}`;
      section.classList.add('tabs-panel');
      tabsContainer.append(section);
    });

    tablist.append(indicator);
    // Insert tablist after heading wrapper (if present), otherwise at the start
    const headingWrapper = tabsContainer.querySelector(':scope > .default-content-wrapper');
    if (headingWrapper) {
      headingWrapper.after(tablist);
    } else {
      tabsContainer.prepend(tablist);
    }

    // Position indicator on the first tab after layout
    requestAnimationFrame(() => {
      const firstBtn = tablist.querySelector('button');
      if (firstBtn) moveIndicator(firstBtn, false);
    });
  });
}

/**
 * Post-decoration: fix button variants and group adjacent buttons.
 * Runs after all sections/blocks are loaded.
 * @param {Element} main The main element
 */
function decorateButtonVariants(main) {
  // 1. In dark and accent sections, make the second consecutive button secondary
  main.querySelectorAll(':scope > .section.dark, :scope > .section.accent').forEach((section) => {
    section.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
      const btnWrappers = [...wrapper.querySelectorAll(':scope > p.button-wrapper')];
      for (let i = 1; i < btnWrappers.length; i += 1) {
        if (btnWrappers[i].previousElementSibling === btnWrappers[i - 1]) {
          const btn = btnWrappers[i].querySelector('a.button.primary');
          if (btn) {
            btn.classList.remove('primary');
            btn.classList.add('secondary');
          }
        }
      }
    });
  });

  // 2. Group adjacent button-wrappers into a flex container
  main.querySelectorAll('p.button-wrapper').forEach((wrapper) => {
    if (wrapper.parentElement.classList.contains('button-group')) return;
    const next = wrapper.nextElementSibling;
    if (next && next.classList.contains('button-wrapper')) {
      const group = document.createElement('div');
      group.className = 'button-group';
      wrapper.parentNode.insertBefore(group, wrapper);
      group.append(wrapper);
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
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  // Post-load decorations
  decorateTabSections(main);
  decorateButtonVariants(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
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
