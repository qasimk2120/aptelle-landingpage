# Aptelle waitlist + email setup

The landing page captures waitlist emails into Firebase Firestore, and a Cloud Function sends an acknowledgement email through Resend. The code and config are all in this repo. The steps below need your Google and Resend accounts, so they are yours to run. I cannot create the Firebase project or enable billing on your behalf.

## Do I need a new email address for Aptelle?

No new mailbox is required. Sending is done at the domain level: you verify aptelle.com with an email provider (Resend below) and then send as `hello@aptelle.com` (or `noreply@aptelle.com`). Replies come back to `hello@aptelle.com`, which already forwards to your Gmail through the Cloudflare Email Routing you set up. If you prefer a no-reply sender, add `noreply@aptelle.com` as a routing address in Cloudflare too. That is optional.

## 1. Firebase project

1. console.firebase.google.com, Add project (e.g. `aptelle`).
2. Build, Firestore Database, Create database, Production mode, pick a region.
3. Project settings, General, scroll to "Your apps", add a Web app. Copy the config values. They map to the GitHub secrets in step 4.
4. Upgrade the project to the Blaze plan (Cloud Functions need it). Low waitlist volume stays within the free allowance.

## 2. Email provider (Resend)

1. resend.com, create an account.
2. Domains, add `aptelle.com`. Resend shows DKIM, SPF, and return-path records.
3. Add those records in Cloudflare DNS (DNS only / grey cloud). Wait for Resend to mark the domain Verified.
4. API Keys, create one. Keep it for step 3.

This is what lets the function send from `hello@aptelle.com`. No mailbox needed.

## 3. Deploy Firestore rules + the function

Install the Firebase CLI once: `npm install -g firebase-tools`.

```bash
cd F:\COGNIELEVATE-PRODUCTS\APTELLE\aptelle-landingpage
firebase login
firebase use --add            # pick your aptelle project
cd functions && npm install && cd ..
firebase functions:secrets:set RESEND_API_KEY    # paste the Resend key
firebase deploy --only firestore:rules,functions
```

## 4. GitHub Actions build secrets

The site reads Firebase config at build time. In the GitHub repo, Settings, Secrets and variables, Actions, add these six (values from step 1):

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`

Until these exist, the form still works and confirms to the visitor, it just does not store the email yet. Once set, sign-ups write to the `waitlist` collection and trigger the acknowledgement email.

## 5. Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview    # serve the built site
```

For local Firebase testing, create a `.env` with the same `PUBLIC_FIREBASE_*` values (it is gitignored).
