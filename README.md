# Business Reports

Independent research on companies, industries, business models, value chains, and global markets — published by Bhavesh Patil.

This is **Version 1**: a static, no-framework website that renders reports from a local JSON file. It's built so that Version 2 (Supabase, auth, an admin dashboard) can be layered on without touching the HTML/CSS or the page-rendering code.

---

## Folder structure

```
Business-Reports/
├── index.html              # Homepage — hero + report grid
├── style.css               # Entire design system (tokens, layout, components)
├── data/
│   └── reports.json        # The database, for now. One object per report.
├── js/
│   ├── dataService.js      # The ONLY file that knows where data comes from
│   ├── utils.js            # Shared helpers (date formatting, HTML escaping, stamp badge)
│   ├── home.js              # Renders the homepage grid
│   └── report.js            # Renders a single report page
├── reports/
│   └── report.html          # One template, reused for every report via ?id=
└── assets/
    ├── images/
    │   ├── favicon.svg
    │   └── asml-cover.svg   # Placeholder cover for BI-001 — see note below
    └── pdf/
        └── asml-value-chain.pdf   # Placeholder PDF for BI-001 — see note below
```

There's no build step. Every file is plain HTML, CSS, or vanilla JS (ES modules), so it deploys to GitHub Pages as-is.

## How a report page works

There's only one `report.html`. It's a template, not a per-report file. When you open:

```
reports/report.html?id=BI-001
```

`report.js` reads `id` from the URL, asks `dataService.js` for the matching report from `data/reports.json`, and fills the page in. To add a second report, you don't touch `report.html` at all — you add a new object to `reports.json` and link to it as `reports/report.html?id=BI-002`.

## Why `dataService.js` is the seam for Version 2

`home.js` and `report.js` never read `reports.json` directly. They only ever call two functions:

```js
getAllReports()       // -> array of reports, newest first
getReportById(id)     // -> a single report, or null
```

Right now those functions `fetch()` the local JSON file. When you're ready to move to Supabase, you rewrite the *inside* of those two functions to query Supabase instead and keep the same return shape. `home.js`, `report.js`, and all the HTML/CSS stay exactly as they are. That's the whole migration.

## Design system

- **Colors:** navy (`#0b1e36`) for authority and headings, a muted antique gold (`#a67c27`) as the sole accent, a cool near-white paper background — no gradients, no shadows, no dark mode.
- **Type:** Source Serif 4 for headlines, Inter for body and UI text, IBM Plex Mono for report IDs, dates, and metadata labels — the mono type is what gives report IDs their "case file" feel.
- **Signature element:** the **stamp badge** — a small navy tag with a report's ID in mono type, tilted slightly, like something physically stamped onto a case file. It appears on every card and at the top of every report page. This is the one deliberately distinctive element; everything else is kept quiet on purpose, in line with the "research library, not a portfolio" brief.

All tokens (colors, radii, fonts) live at the top of `style.css` as CSS custom properties — change them once, and the whole site updates.

---

## Manual steps before this looks "real" (do these before publishing)

1. **Replace the BI-001 cover image.** `assets/images/asml-cover.svg` is a placeholder abstract graphic (concentric rings, no real ASML branding) so the homepage isn't blank. Swap in your actual cover image — keep the filename or update the path in `reports.json`.
2. **Replace the BI-001 PDF.** `assets/pdf/asml-value-chain.pdf` is a one-page placeholder generated for this build so the embed and download button work out of the box. Drop your real report PDF in at the same path (or update the `pdf` field in `reports.json` if you rename it).
3. **Fill in the placeholder text** in `data/reports.json` — `summary`, `executiveSummary`, and `businessLessons` are all marked `PLACEHOLDER` and need your real copy for BI-001.
4. **Point `brand__author` at your real LinkedIn.** Both `index.html` and `reports/report.html` currently link to a placeholder LinkedIn URL — update the `href` on the `.brand__author` link in each file.

## Adding your next report (e.g. BI-002)

1. Add the cover image to `assets/images/` and the PDF to `assets/pdf/`.
2. Add a new object to the `reports` array in `data/reports.json` with a new `id` (e.g. `"BI-002"`) and the fields shown in the BI-001 entry.
3. That's it — it will appear on the homepage automatically, sorted by `published` date, and be reachable at `reports/report.html?id=BI-002`.

---

## Deploying to GitHub Pages

1. Push this folder's contents to the root of your `Business-Reports` repository on the `main` branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Set **Branch** to `main` and the folder to `/ (root)`, then **Save**.
5. GitHub will publish the site at `https://<your-username>.github.io/Business-Reports/` within a minute or two (the exact URL is shown on the same Pages settings screen once it's live).
6. Any future push to `main` redeploys automatically — no separate build step.

If you'd rather serve reports from a `docs/` folder instead of the repo root, move everything into `docs/` and set the Pages folder to `/docs` in step 4; nothing else changes.

## Running it locally

Because `dataService.js` uses `fetch()` to load `reports.json`, opening `index.html` directly via `file://` will fail in most browsers (CORS blocks local `fetch` of JSON). Serve the folder over HTTP instead, for example:

```bash
cd Business-Reports
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
