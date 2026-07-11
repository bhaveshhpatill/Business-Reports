/**
 * utils.js
 * Small, reusable helpers shared across pages.
 */

/**
 * Formats an ISO date string ("2026-07-01") as "July 2026" style text.
 * @param {string} isoDate
 * @returns {string}
 */
export function formatPublishedDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

/**
 * Escapes HTML special characters to prevent markup injection when
 * inserting report data (title, company, etc.) into the DOM as text.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}

/**
 * Resolves a root-relative asset path (as stored in reports.json, e.g.
 * "assets/pdf/asml-value-chain.pdf") so it works correctly regardless
 * of how deep the current page is nested. reports.json always stores
 * paths relative to the site root; this makes them work from
 * reports/report.html too.
 * @param {string} rootRelativePath
 * @returns {string}
 */
export function resolveAssetPath(rootRelativePath) {
  const depth = window.location.pathname.includes('/reports/') ? '../' : '';
  return `${depth}${rootRelativePath}`;
}

/**
 * Reads a query parameter from the current URL.
 * @param {string} name
 * @returns {string|null}
 */
export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Renders a small "case file" stamp badge for a report ID.
 * This is the shared visual signature used on both the card and the
 * report page header, so it lives in one place.
 * @param {string} id
 * @returns {string} HTML string
 */
export function renderStampBadge(id) {
  return `<span class="stamp" aria-hidden="false">${escapeHtml(id)}</span>`;
}
