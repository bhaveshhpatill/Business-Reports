/**
 * dataService.js
 *
 * This is the ONLY module that knows where report data lives.
 *
 * Version 1: reads from a local JSON file (data/reports.json).
 * Version 2 (future): swap the internals of these two functions to
 * call Supabase instead. Nothing in home.js or report.js needs to
 * change, because both files only ever talk to this interface:
 *
 *   getAllReports()      -> Promise<Report[]>
 *   getReportById(id)     -> Promise<Report | null>
 *
 * Keep that contract stable and the rest of the site is untouched
 * by the migration.
 */

// Simple in-memory cache so a page that calls this twice
// (e.g. list + lookup) doesn't fetch the file twice.
let _cache = null;

async function _loadAll() {
  if (_cache) return _cache;

  const response = await fetch(resolveDataUrl());
  if (!response.ok) {
    throw new Error(`Failed to load report data (${response.status})`);
  }

  const json = await response.json();
  _cache = Array.isArray(json.reports) ? json.reports : [];
  return _cache;
}

// Resolves the data URL relative to whatever depth the current page
// lives at (root for index.html, one level down for reports/report.html).
// This keeps fetch() working whether the site is served from a domain
// root or a GitHub Pages project path like username.github.io/repo/.
function resolveDataUrl() {
  const depth = window.location.pathname.includes('/reports/') ? '../' : '';
  return `${depth}data/reports.json`;
}

/**
 * Returns every report, sorted newest-published first.
 * @returns {Promise<Array<Object>>}
 */
export async function getAllReports() {
  const reports = await _loadAll();
  return [...reports].sort((a, b) => new Date(b.published) - new Date(a.published));
}

/**
 * Returns a single report by its ID (e.g. "BI-001"), or null if not found.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getReportById(id) {
  const reports = await _loadAll();
  return reports.find((r) => r.id === id) ?? null;
}
