# Nexus Digital website

Static site (HTML/CSS/JS, no build step). Deploys as-is to Netlify, GitHub Pages or any host.

```
index.html          page
css/style.css       all styles (brand colours/fonts are variables at the top)
js/works.js         the work gallery data: one entry per piece
js/main.js          header, filters, lightbox, animations
assets/logo/        logo SVGs, favicons, app icon
assets/work/        portfolio images (webp)
```

## Adding work (for now)
Drop the image in `assets/work/`, then add one line to `js/works.js`:

```js
{ title: "Launch poster", client: "Brand name", category: "Social Media", tags: [], sort: 21, image: "assets/work/file.webp" },
```

Add `link: "https://..."` to make it open an external case study instead of the on-page viewer.
New categories become filter buttons automatically, and the gallery re-flows by itself.

## Next: Supabase
`works.js` fields match the planned Supabase `works` table, so the gallery can switch to a live
query (with image uploads) without changing the page design.
