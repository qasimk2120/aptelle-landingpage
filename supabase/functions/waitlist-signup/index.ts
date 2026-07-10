// waitlist-signup: the only write path into public.waitlist.
//
// Security model:
// - The table revokes all direct access from anon/authenticated (see the
//   create_waitlist migration), so the browser cannot write to it at all.
// - This function verifies a Cloudflare Turnstile token server-side before
//   inserting. TURNSTILE_SECRET lives in Supabase secrets, never in the repo
//   or the browser.
// - Fail closed: if TURNSTILE_SECRET is missing the function rejects signups
//   unless ALLOW_UNVERIFIED_SIGNUPS=true is set explicitly (local dev only).
// - Duplicate emails are ignored server-side and every accepted request gets
//   the same generic response, so responses never reveal list membership.
// - Best-effort per-IP rate limit on top of Turnstile (per-instance memory).
// - Acknowledgement email via Resend goes to NEW signups only, so repeat
//   submissions cannot be used to spam an inbox. Sending is best effort and
//   skipped entirely while RESEND_API_KEY is unset.

const ALLOWED_ORIGINS = new Set([
  "https://aptelle.com",
  "https://www.aptelle.com",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
]);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const LANGS = new Set(["en", "fr", "de", "ar"]);

type AckStrings = {
  subject: string;
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  ignore: string;
};

const ACK: Record<string, AckStrings> = {
  en: {
    subject: "You are on the Aptelle waitlist",
    eyebrow: "FIT INTELLIGENCE, LAUNCHING SOON",
    heading: "You are on the list",
    body: "One email when early access opens and nothing else lands in your inbox until then. Your right size in any brand is on its way.",
    cta: "Visit aptelle.com",
    ignore: "If this was not you, ignore this email.",
  },
  fr: {
    subject: "Vous êtes sur la liste d'attente Aptelle",
    eyebrow: "INTELLIGENCE D'AJUSTEMENT, BIENTÔT DISPONIBLE",
    heading: "Vous êtes sur la liste",
    body: "Un seul e-mail à l'ouverture de l'accès anticipé, rien d'autre d'ici là. Votre bonne taille dans chaque marque arrive.",
    cta: "Visiter aptelle.com",
    ignore: "Si ce n'était pas vous, ignorez cet e-mail.",
  },
  de: {
    subject: "Du stehst auf der Aptelle Warteliste",
    eyebrow: "PASSFORM-INTELLIGENZ, BALD VERFÜGBAR",
    heading: "Du stehst auf der Liste",
    body: "Genau eine E-Mail, sobald der frühe Zugang startet, bis dahin nichts weiter. Deine richtige Größe in jeder Marke ist unterwegs.",
    cta: "aptelle.com besuchen",
    ignore: "Falls du das nicht warst, ignoriere diese E-Mail.",
  },
  ar: {
    subject: "أنت على قائمة انتظار Aptelle",
    eyebrow: "ذكاء المقاسات، قريبًا",
    heading: "أنت على القائمة",
    body: "رسالة واحدة عند فتح الوصول المبكر ولا شيء آخر قبل ذلك. مقاسك الصحيح في أي علامة تجارية في الطريق.",
    cta: "زيارة aptelle.com",
    ignore: "إذا لم تكن أنت من سجّل، تجاهل هذه الرسالة.",
  },
};

// Black and gold, table based, all styles inline so it renders the same in
// Gmail, Outlook and Apple Mail. No remote images, so nothing to block.
function ackHtml(t: AckStrings, dir: "ltr" | "rtl"): string {
  const font = "Arial, Helvetica, sans-serif";
  return `<!doctype html>
<html dir="${dir}">
<body style="margin:0;padding:0;background-color:#08080b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08080b;background-image:radial-gradient(90% 40% at 50% 0%, #191307 0%, #08080b 60%);">
    <tr><td align="center" style="padding:44px 16px 36px;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;" dir="${dir}">
        <tr><td align="center" style="padding-bottom:26px;font-family:${font};font-size:26px;font-weight:bold;color:#ffe8b3;" dir="ltr">Apt<em>Elle</em></td></tr>
        <tr><td style="border:1px solid #4a3a1e;border-radius:14px;background-color:#14110c;background-image:radial-gradient(120% 90% at 50% 0%, #2a2113 0%, #14110c 55%);padding:42px 36px;" align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr><td align="center" style="padding-bottom:18px;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="height:1px;width:44px;background-color:#c09047;font-size:0;line-height:0;">&nbsp;</td></tr></table>
            </td></tr>
            <tr><td align="center" style="font-family:${font};font-size:11px;letter-spacing:2px;color:#f2d592;padding-bottom:16px;">${t.eyebrow}</td></tr>
            <tr><td align="center" style="font-family:${font};font-size:30px;line-height:1.2;font-weight:bold;color:#ffffff;padding-bottom:16px;">${t.heading}</td></tr>
            <tr><td align="center" style="font-family:${font};font-size:15px;line-height:1.7;color:#b8b2a6;padding-bottom:30px;">${t.body}</td></tr>
            <tr><td align="center" style="padding-bottom:28px;">
              <a href="https://aptelle.com" style="display:inline-block;background-color:#c09047;color:#08080b;font-family:${font};font-size:15px;font-weight:bold;text-decoration:none;padding:14px 30px;border-radius:8px;">${t.cta}</a>
            </td></tr>
            <tr><td align="center" style="font-family:${font};font-size:12px;line-height:1.6;color:#6f6a60;">${t.ignore}</td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding-top:22px;font-family:${font};font-size:12px;color:#6f6a60;">
          <a href="https://aptelle.com" style="color:#f2d592;text-decoration:none;">aptelle.com</a> &middot; A <a href="https://cognielevate.co" style="color:#f2d592;text-decoration:none;">CogniElevate</a> project
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendAcknowledgement(email: string, lang: string): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return; // dormant until Resend is configured

  const t = ACK[lang] || ACK.en;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const text = `${t.heading}. ${t.body}\n\n${t.ignore}\n\nAptelle\nhttps://aptelle.com`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Aptelle <hello@aptelle.com>",
        to: [email],
        subject: t.subject,
        text,
        html: ackHtml(t, dir),
      }),
    });
    if (!res.ok) console.error("ack email failed", res.status);
  } catch (err) {
    console.error("ack email failed", err);
  }
}
const MAX_EMAIL_LENGTH = 253;
const RATE_LIMIT = 5; // requests per window per IP, per instance
const RATE_WINDOW_MS = 60_000;

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear(); // bound memory
  return recent.length > RATE_LIMIT;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://aptelle.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    Vary: "Origin",
  };
}

function respond(status: number, ok: boolean, headers: Record<string, string>): Response {
  // One generic body for every outcome in each class. Never echo input or
  // reveal whether an email was already on the list.
  return new Response(JSON.stringify({ ok }), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET");
  if (!secret) {
    return Deno.env.get("ALLOW_UNVERIFIED_SIGNUPS") === "true";
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}

// New API-key projects inject SUPABASE_SECRET_KEYS (sb_secret, possibly a
// JSON array or comma list); legacy projects inject SUPABASE_SERVICE_ROLE_KEY.
// Prefer the new format because the legacy JWT can be disabled.
function resolveServiceKey(): string | null {
  const plural = (Deno.env.get("SUPABASE_SECRET_KEYS") || "").trim();
  if (plural) {
    if (plural.startsWith("sb_secret_")) return plural.split(",")[0].trim();
    try {
      const parsed = JSON.parse(plural);
      if (Array.isArray(parsed) && parsed.length) {
        const first = parsed[0];
        if (typeof first === "string") return first;
        if (first && typeof first.api_key === "string") return first.api_key;
        if (first && typeof first.secret === "string") return first.secret;
      }
    } catch {
      // fall through to legacy
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || null;
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req.headers.get("Origin"));

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  if (req.method !== "POST") {
    return respond(405, false, headers);
  }

  const ip = req.headers.get("CF-Connecting-IP") || req.headers.get("X-Forwarded-For");
  if (ip && rateLimited(ip)) {
    return respond(429, false, headers);
  }

  let payload: { email?: string; lang?: string; token?: string };
  try {
    payload = await req.json();
  } catch {
    return respond(400, false, headers);
  }

  const email = String(payload.email || "").trim().toLowerCase();
  const lang = LANGS.has(String(payload.lang)) ? String(payload.lang) : "en";

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return respond(400, false, headers);
  }

  if (!(await verifyTurnstile(String(payload.token || ""), ip))) {
    return respond(400, false, headers);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = resolveServiceKey();
  if (!supabaseUrl || !serviceKey) {
    return respond(500, false, headers);
  }

  // Server owns the source field; duplicates are silently ignored so the
  // response is identical for new and existing emails. return=representation
  // tells us whether a row was actually created (new signup) or skipped
  // (duplicate) without changing what the caller sees.
  const insert = await fetch(`${supabaseUrl}/rest/v1/waitlist?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=representation",
    },
    body: JSON.stringify({ email, lang, source: "landing" }),
  });

  if (!insert.ok) {
    console.error("waitlist insert failed", insert.status, await insert.text());
    return respond(500, false, headers);
  }

  let isNew = false;
  try {
    const rows = await insert.json();
    isNew = Array.isArray(rows) && rows.length > 0;
  } catch {
    // Treat parse issues as duplicate: worst case a new signup misses the
    // ack email, which is better than mailing on every resubmission.
  }

  if (isNew) {
    await sendAcknowledgement(email, lang);
  }

  return respond(200, true, headers);
});
