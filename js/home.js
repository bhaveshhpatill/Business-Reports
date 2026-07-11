/**
 * home.js
 * Renders the report card grid on index.html.
 */
import { getAllReports } from './dataService.js';
import { formatPublishedDate, escapeHtml, renderStampBadge } from './utils.js';

const grid = document.getElementById('report-grid');
const stateMessage = document.getElementById('grid-state');

async function renderHome() {
  try {
    const reports = await getAllReports();

    if (reports.length === 0) {
      showState('No reports published yet. Check back soon.');
      return;
    }

    grid.innerHTML = reports.map(reportCardTemplate).join('');
    stateMessage.hidden = true;
  } catch (err) {
    console.error(err);
    showState('Reports could not be loaded. Please refresh the page.');
  }
}

function showState(message) {
  stateMessage.textContent = message;
  stateMessage.hidden = false;
  grid.innerHTML = '';
}

function reportCardTemplate(report) {
  const href = `reports/report.html?id=${encodeURIComponent(report.id)}`;
  return `
    <article class="card">
      <a class="card__link" href="${href}" aria-label="Read report: ${escapeHtml(report.title)}">
        <div class="card__cover">
          <img src="${report.coverImage}" alt="" loading="lazy" />
          ${renderStampBadge(report.id)}
        </div>
        <div class="card__body">
          <p class="card__meta">${escapeHtml(report.company)} &middot; ${escapeHtml(report.topic)}</p>
          <h2 class="card__title">${escapeHtml(report.title)}</h2>
          <p class="card__summary">${escapeHtml(report.summary)}</p>
          <div class="card__footer">
            <time class="card__date">${formatPublishedDate(report.published)}</time>
            <span class="card__cta">Read report&nbsp;→</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

renderHome();
