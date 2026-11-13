# Dashboard guide

## Open locally

The dashboard is fully static and does not require Supabase, Netlify, Power BI, or package installation.

1. Open `dashboard/index.html` in a current browser; or
2. from the repository root, run `node analysis/serve.js`, then open `http://127.0.0.1:4173/dashboard/`.

The local server is recommended for the same behavior as a hosted site. Stop it with `Ctrl+C`.

## Reproduce the analysis

Run:

```powershell
node analysis/analyze.js
```

This reads the three CSV files in `dashboard/data/` and regenerates:

- `analysis/summary.json`;
- `analysis/SUMMARY.md`; and
- `dashboard/data/data.js`, the embedded static dashboard dataset.

## Filters and interaction

- **Sequence** filters every dashboard section to S1, S2, S3, or S4.
- **Condition** filters task-response performance charts to manual or AI-assisted responses.
- Hover or focus chart marks to see exact values in browser tooltips.
- Filter status text reports the number of sessions and task responses currently displayed.

## GitHub Pages

This repository includes a Pages workflow that publishes only the `dashboard/` directory. In GitHub, open **Settings → Pages**, choose **GitHub Actions** as the source, and run the **Publish portfolio dashboard** workflow from `main` if it has not already run automatically.

## Netlify alternative

Create a new site for the portfolio branch and set the publish directory to `dashboard`. Do not attach the experiment application's environment variables: this dashboard uses static exports and makes no database requests.
