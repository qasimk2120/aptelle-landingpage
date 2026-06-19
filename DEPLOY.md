# Deploy the Aptelle landing page

Polyrepo layout, mirroring CogniFocus. Each part of Aptelle gets its own GitHub repo. This folder is its own repo, `aptelle-landingpage`, and the landing page files sit at the repo root (`index.html`, `CNAME`, `robots.txt`, `sitemap.xml`, `llms.txt`, `favicon.svg`, `og-image.png`). It deploys to GitHub Pages on aptelle.com through Cloudflare DNS.

## One time: make this a landing-page-only repo

The GitHub repo first received the whole monorepo, and the `APTELLE` root is currently a git repo too. For polyrepo, `APTELLE` should be a plain folder and only `aptelle-landingpage` is a repo, with the page files at its root. Run in PowerShell.

```powershell
# 1. APTELLE root should not be a repo in polyrepo - remove it (working files stay on disk)
Remove-Item -Recurse -Force "F:\COGNIELEVATE-PRODUCTS\APTELLE\.git" -ErrorAction SilentlyContinue

# 2. remove the broken .git a sandbox left in the landing page folder
Remove-Item -Recurse -Force "F:\COGNIELEVATE-PRODUCTS\APTELLE\aptelle-landingpage\.git" -ErrorAction SilentlyContinue

# 3. init the landing-page-only repo, root = the page files
Set-Location "F:\COGNIELEVATE-PRODUCTS\APTELLE\aptelle-landingpage"
git init -b main
git add .
git commit -m "Aptelle landing page: animated parked page with 2026 SEO"
git remote add origin https://github.com/qasimk2120/aptelle-landingpage.git
git push -u origin main --force
```

The app, backend, assets, and docs folders stay on disk in `APTELLE\` and become their own repos (`aptelle-app`, `aptelle-backend`, etc.) when you build them.

## GitHub Pages

1. Repo Settings, Pages: Source `Deploy from a branch`, branch `main`, folder `/ (root)`.
2. Custom domain: enter `aptelle.com` and save. The `CNAME` file is already at root. Tick `Enforce HTTPS` once the cert is issued.

## Cloudflare DNS

In Cloudflare for aptelle.com, add the GitHub Pages apex records:
```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
CNAME   www   qasimk2120.github.io
```
- Keep these `DNS only` (grey cloud) until GitHub issues the TLS cert, then proxy if you want.
- SSL/TLS mode: `Full`. Not `Flexible` (causes redirect loops with Pages HTTPS).

## Verify after DNS propagates
- https://aptelle.com loads the page
- /robots.txt, /sitemap.xml, /llms.txt resolve
- Social card shows og-image.png (test in a card validator)
- Submit the sitemap in Google Search Console

## Before launch
- Wire the waitlist form to a real endpoint (Formspree, Buttondown, ConvertKit, or your backend). It currently confirms on the front end only and does not store emails.
