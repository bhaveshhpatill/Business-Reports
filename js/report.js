/**
 * report.js
 * Renders a single report on reports/report.html, driven by ?id=BI-001
 */
import { getReportById } from './dataService.js';
import { formatPublishedDate, escapeHtml, getQueryParam, renderStampBadge, resolveAssetPath } from './utils.js';

const root = document.getElementById('report-root');
const stateMessage = document.getElementById('report-state');

async function renderReport() {
  const id = getQueryParam('id');

  if (!id) {
    showState('No report was specified.');
    return;
  }

  try {
    const report = await getReportById(id);

    if (!report) {
      showState(`No report found for "${id}".`);
      return;
    }

    document.title = `${report.title} — Business Reports`;
    root.innerHTML = reportTemplate(report);
    stateMessage.hidden = true;
  } catch (err) {
    console.error(err);
    showState('This report could not be loaded. Please refresh the page.');
  }
}

function showState(message) {
  stateMessage.textContent = message;
  stateMessage.hidden = false;
  root.innerHTML = '';
}

function reportTemplate(report) {
  const lessons = (report.businessLessons || [])
    .map((lesson) => `<li>${escapeHtml(lesson)}</li>`)
    .join('');

  const pdfPath = resolveAssetPath(report.pdf);

  return `
    <header class="report-header">
      ${renderStampBadge(report.id)}
      <h1 class="report-title">${escapeHtml(report.title)}</h1>
      <ul class="report-meta" aria-label="Report details">
        <li><span class="report-meta__label">Company</span>${escapeHtml(report.company)}</li>
        <li><span class="report-meta__label">Industry</span>${escapeHtml(report.industry)}</li>
        <li><span class="report-meta__label">Topic</span>${escapeHtml(report.topic)}</li>
        <li><span class="report-meta__label">Published</span>${formatPublishedDate(report.published)}</li>
      </ul>
    </header>

    <section class="report-section" aria-labelledby="exec-summary-heading">
      <h2 id="exec-summary-heading" class="report-section__label">Executive Summary</h2>
      <p class="report-summary">${escapeHtml(report.executiveSummary)}</p>
    </section>

    ${lessons ? `
    <section class="report-section report-lessons" aria-labelledby="lessons-heading">
      <h2 id="lessons-heading" class="report-section__label">📌 Business Lessons</h2>
      <ul class="report-lessons__list">${lessons}</ul>
    </section>
    ` : ''}

    <section class="report-section" aria-labelledby="pdf-heading">
      <div class="report-pdf__header">
        <h2 id="pdf-heading" class="report-section__label">Full Report</h2>
        <a class="button" href="${pdfPath}" download>Download PDF</a>
      </div>
      <div class="report-pdf__frame">
        <iframe
          src="${pdfPath}"
          title="${escapeHtml(report.title)} — full PDF report"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  `;
}

renderReport();
