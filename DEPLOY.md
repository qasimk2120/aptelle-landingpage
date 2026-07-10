# Deploy the Aptelle landing page

This is now an Astro project (static output, multilingual: en, fr, de, ar). It builds with GitHub Actions and deploys to GitHub Pages on aptelle.com through Cloudflare. The repo is `qasimk2120/aptelle-landingpage`.

## Important: Pages source changes to GitHub Actions

The first version was static HTML served from a branch. Astro needs a build step, so GitHub Pages must switch to the Actions source.

GitHub repo, Settings, Pages, Build and deployment, Source: select **GitHub Actions** (not "Deploy from a branch"). The included workflow at `.github/workflows/deploy.yml` builds and publishes `dist/`.

## Build before you push

```powershell
Set-Location "F:\COGNIELEVATE-PRODUCTS\APTELLE\aptelle-landingpage"
npm install
npm run build      # confirms it compiles, outputs dist/
npm run preview    # optional local check at http://localhost:4321
```

If the build is clean, commit and push. The Action rebuilds and deploys.

```powershell
git add .
git commit -m "Rebuild Aptelle landing as multilingual Astro site"
git push
```

Notes:
- `public/CNAME` (aptelle.com) and `public/.nojekyll` are copied into `dist/` automatically, so the custom domain keeps working.
- `node_modules`, `dist`, `.astro`, and `.legacy-static` are gitignored. The old static files live in `.legacy-static/` and are not committed. You can delete that folder anytime.
- Add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` in the repo (see SETUP.md) so the waitlist stores emails. Without them the form still confirms to the visitor.

## DNS (already configured, no change)

- Apex A records to GitHub Pages IPs, www CNAME to qasimk2120.github.io.
- For Full (Strict) TLS, keep the one-time grey-cloud bootstrap result. Currently proxied with a valid origin cert.
- Email: MX, SPF, DKIM, DMARC via Cloudflare Email Routing.

## Waitlist + acknowledgement email

See SETUP.md. Short version: create and link the Supabase project, run `npx supabase db push` to apply the tracked migration, then add `PUBLIC_SUPABASE_URL` plus `PUBLIC_SUPABASE_ANON_KEY` to GitHub Actions secrets.

## Multilingual

- en at `/`, fr at `/fr/`, de at `/de/`, ar at `/ar/` (right-to-left).
- hreflang alternates and a localized sitemap are generated automatically.
- Privacy (`/privacy`) and Terms (`/terms`) are English for now and linked from every footer.
