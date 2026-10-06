/**
 * Fills structural chrome — brand, hero, ticker, about, contact, footer —
 * from site-config.json and label-info.json.
 */

import { SOCIALS, STAT_LABELS, isHexColor } from '../config.js';
import { store } from '../data/store.js';
import { appendLink, clear, el, getPath, isSafeUrl, telHref } from '../dom.js';

const THEME_VARS = {
  primary: '--color-primary',
  primaryDim: '--color-primary-dim',
  background: '--color-bg',
  surface: '--color-surface',
  surfaceRaised: '--color-surface-raised',
  text: '--color-text'
};

function applyTheme(theme) {
  if (!theme || typeof theme !== 'object') return;
  const root = document.documentElement;
  Object.entries(THEME_VARS).forEach(([key, cssVar]) => {
    if (isHexColor(theme[key])) root.style.setProperty(cssVar, theme[key].trim());
  });
}

function applyMeta(config) {
  const meta = config.meta || {};
  if (meta.title) document.title = meta.title;
  if (meta.description) {
    const node = document.querySelector('meta[name="description"]');
    if (node) node.setAttribute('content', meta.description);
  }
}

function bindText(root, context) {
  root.querySelectorAll('[data-bind], [data-text]').forEach((node) => {
    const path = node.getAttribute('data-bind') || node.getAttribute('data-text');
    const value = getPath(context, path);
    if (value == null || value === '') return;
    node.textContent = String(value);
  });

  root.querySelectorAll('[data-href]').forEach((node) => {
    const value = getPath(context, node.getAttribute('data-href'));
    if (typeof value === 'string' && isSafeUrl(value)) node.setAttribute('href', value);
  });

  root.querySelectorAll('[data-mail]').forEach((node) => {
    const value = getPath(context, node.getAttribute('data-mail'));
    if (typeof value === 'string' && value.includes('@')) node.setAttribute('href', `mailto:${value.trim()}`);
  });

  root.querySelectorAll('[data-tel]').forEach((node) => {
    const href = telHref(getPath(context, node.getAttribute('data-tel')));
    if (href) node.setAttribute('href', href);
  });
}

function fillLogo(anchor, brand) {
  if (!anchor || !brand) return;
  const mark = el('span', { text: brand.logoMark || '●' });
  anchor.replaceChildren(
    document.createTextNode(brand.logoLead || 'GOAT'),
    mark,
    document.createTextNode(brand.logoTail || 'REC')
  );
}

function renderLinks(list, links, itemTag) {
  if (!list || !Array.isArray(links) || !links.length) return;
  clear(list);
  links.forEach((link) => {
    if (!link || !link.label) return;
    const item = itemTag ? el(itemTag) : null;
    const parent = item || list;
    const className = list.classList.contains('mobile-menu') ? 'mobile-menu-link' : '';
    const anchor = el('a', { className, text: link.label });
    anchor.href = isSafeUrl(link.href) ? link.href : '#';
    parent.append(anchor);
    if (item) list.append(item);
  });
}

function renderNav(config) {
  const nav = config.navigation || {};
  const desktop = document.querySelector('[data-render="nav-links"]');
  const mobile = document.querySelector('[data-render="mobile-links"]');
  if (Array.isArray(nav.links) && nav.links.length) {
    renderLinks(desktop, nav.links, 'li');
    renderLinks(mobile, nav.links, null);
  }
  const cta = document.querySelector('[data-render="nav-cta"]');
  if (cta && nav.cta?.label) {
    cta.textContent = nav.cta.label;
    if (isSafeUrl(nav.cta.href)) cta.href = nav.cta.href;
  }
}

function renderHero(config) {
  const hero = config.hero || {};
  document.querySelectorAll('[data-glitch]').forEach((node) => {
    node.setAttribute('data-text', node.textContent);
  });
  const primary = document.querySelector('[data-hero-cta="primary"]');
  const secondary = document.querySelector('[data-hero-cta="secondary"]');
  if (primary && hero.primaryCta?.label) {
    const span = primary.querySelector('span') || primary;
    span.textContent = hero.primaryCta.label;
    if (isSafeUrl(hero.primaryCta.href)) primary.href = hero.primaryCta.href;
  }
  if (secondary && hero.secondaryCta?.label) {
    const span = secondary.querySelector('span') || secondary;
    span.textContent = hero.secondaryCta.label;
    if (isSafeUrl(hero.secondaryCta.href)) secondary.href = hero.secondaryCta.href;
  }
}

function renderTicker(config) {
  const root = document.querySelector('[data-render="ticker"]');
  const items = Array.isArray(config.ticker) ? config.ticker.filter(Boolean) : [];
  if (!root || !items.length) return;
  clear(root);
  const sequence = items.concat(items);
  sequence.forEach((item) => {
    root.append(el('span', { text: item }), el('span', { text: '★', attrs: { 'aria-hidden': 'true' } }));
  });
}

function renderAbout(label) {
  const copy = document.querySelector('[data-render="about-copy"]');
  if (copy) {
    const paragraphs = [label.description, label.description2, label.description3].filter(Boolean);
    if (paragraphs.length) {
      clear(copy);
      paragraphs.forEach((text) => copy.append(el('p', { text })));
    }
  }

  const stats = document.querySelector('[data-render="about-stats"]');
  const values = label.stats;
  if (stats && values && typeof values === 'object') {
    const entries = Object.entries(values).filter(([, value]) => value != null && value !== '');
    if (entries.length) {
      clear(stats);
      entries.forEach(([key, value]) => {
        const block = el('div');
        block.append(
          el('div', { className: 'stat-num', text: value }),
          el('div', { className: 'stat-label', text: STAT_LABELS[key] || key })
        );
        stats.append(block);
      });
    }
  }

  const years = document.querySelector('[data-years]');
  if (years && label.yearsStrong != null && label.yearsStrong !== '') {
    const text = String(label.yearsStrong);
    years.textContent = text.endsWith('+') ? text : `${text}+`;
  }
}

function renderBooking(config, label) {
  const intro = document.querySelector('[data-render="booking-intro"]');
  const paragraphs = config.bookings?.intro;
  if (intro && Array.isArray(paragraphs) && paragraphs.length) {
    clear(intro);
    paragraphs.forEach((text) => intro.append(el('p', { text })));
  }

  const features = document.querySelector('[data-render="booking-features"]');
  const items = Array.isArray(label.bookingFeatures) ? label.bookingFeatures : [];
  if (features && items.length) {
    clear(features);
    items.forEach((feature) => {
      if (!feature) return;
      const row = el('div', { className: 'booking-feature' });
      row.append(el('div', { className: 'bf-icon', text: feature.icon || '●', attrs: { 'aria-hidden': 'true' } }));
      const text = el('div');
      text.append(
        el('div', { className: 'bf-title', text: feature.title || '' }),
        el('div', { className: 'bf-desc', text: feature.description || '' })
      );
      row.append(text);
      features.append(row);
    });
  }

  const submit = document.querySelector('.form-submit');
  if (submit && config.bookings?.submitLabel) {
    submit.textContent = config.bookings.submitLabel;
    submit.dataset.label = config.bookings.submitLabel;
  }
  if (submit && config.bookings?.successLabel) submit.dataset.success = config.bookings.successLabel;
}

function locationLines(contact) {
  const explicitPrimary = contact.locationPrimary;
  const explicitRegion = contact.locationRegion;
  if (explicitPrimary || explicitRegion) {
    return {
      primary: explicitPrimary || '',
      region: explicitRegion || ''
    };
  }
  const parts = String(contact.location || '').split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return { primary: `${parts[0]}, ${parts[parts.length - 1]}`, region: parts.slice(1, -1).join(', ') };
  }
  if (parts.length === 2) return { primary: parts[0], region: parts[1] };
  return { primary: parts[0] || '', region: '' };
}

function renderContact(label) {
  const socials = document.querySelector('[data-render="social-links"]');
  const networks = label.socials;
  if (socials && networks && typeof networks === 'object') {
    clear(socials);
    SOCIALS.forEach((network) => {
      const entry = networks[network.key];
      if (!entry) return;
      const anchor = el('a', { className: 'social-link' });
      const href = entry.url || '#';
      anchor.href = isSafeUrl(href) ? href : '#';
      if (/^https?:\/\//i.test(anchor.href)) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
      anchor.append(
        el('div', { className: 'social-link-icon', text: entry.icon || network.label }),
        el('div', { className: 'social-link-name', text: entry.handle || network.name })
      );
      socials.append(anchor);
    });
  }

  const lines = locationLines(label.contact || {});
  const primary = document.querySelector('[data-location="primary"]');
  const region = document.querySelector('[data-location="region"]');
  if (primary && lines.primary) primary.textContent = lines.primary;
  if (region) region.textContent = lines.region;

  const hours = label.officeHours || {};
  const weekdays = document.querySelector('[data-hours="weekdays"]');
  const saturday = document.querySelector('[data-hours="saturday"]');
  const sunday = document.querySelector('[data-hours="sunday"]');
  if (weekdays && hours.monday_friday) weekdays.textContent = `Monday – Friday: ${hours.monday_friday}`;
  if (saturday && hours.saturday) saturday.textContent = `Saturday: ${hours.saturday}`;
  if (sunday && hours.sunday) sunday.textContent = `Sunday: ${hours.sunday}`;
}

function renderFooter(config, label) {
  const columns = document.querySelector('[data-render="footer-links"]');
  const groups = config.footer?.columns;
  if (columns && Array.isArray(groups) && groups.length) {
    clear(columns);
    groups.forEach((group) => {
      const col = el('div', { className: 'footer-links-col' });
      col.append(el('h4', { text: group.title || '' }));
      const list = el('ul');
      (group.links || []).forEach((link) => {
        if (!link?.label) return;
        const item = el('li');
        appendLink(item, link.href || '#', '', link.label);
        list.append(item);
      });
      col.append(list);
      columns.append(col);
    });
  }

  const copy = document.querySelector('[data-render="footer-copy"]');
  if (copy) {
    const year = config.brand?.copyrightYear || new Date().getFullYear();
    const name = config.brand?.name || label.name || 'GOAT RECORDS';
    const location = label.contact?.location || '';
    copy.textContent = `© ${year} ${name}. All rights reserved.${location ? ` ${location}.` : ''}`;
  }
}

function renderNewsletter(config) {
  const newsletter = config.newsletter || {};
  const title = document.querySelector('[data-render="newsletter-title"]');
  if (title && newsletter.title) {
    clear(title);
    String(newsletter.title).split('\n').forEach((line, index) => {
      if (index) title.append(el('br'));
      title.append(document.createTextNode(line));
    });
  }
  const input = document.querySelector('.nl-input');
  if (input && newsletter.placeholder) input.placeholder = newsletter.placeholder;
  const button = document.querySelector('.nl-btn');
  if (button && newsletter.button) {
    button.textContent = newsletter.button;
    button.dataset.label = newsletter.button;
    if (newsletter.success) button.dataset.success = newsletter.success;
  }
}

export function applyChrome() {
  const config = store.state.config || {};
  const label = store.state.label || {};
  applyTheme(config.theme);
  applyMeta(config);
  bindText(document, { ...config, label });
  document.querySelectorAll('[data-brand-logo]').forEach((node) => fillLogo(node, config.brand));
  renderNav(config);
  renderHero(config);
  renderTicker(config);
  renderAbout(label);
  renderBooking(config, label);
  renderContact(label);
  renderFooter(config, label);
  renderNewsletter(config);
}
