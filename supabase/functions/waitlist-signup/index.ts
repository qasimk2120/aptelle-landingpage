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

const ACK: Record<string, { subject: string; text: string }> = {
  en: {
    subject: "You are on the Aptelle waitlist",
    text: "You are on the list. We will email you once when early access opens and nothing else lands in your inbox until then.\n\nIf this was not you, ignore this email and the address is removed from any further contact.\n\nAptelle\nhttps://aptelle.com",
  },
  fr: {
    subject: "Vous êtes sur la liste d'attente Aptelle",
    text: "Vous êtes sur la liste. Nous vous écrirons une seule fois à l'ouverture de l'accès anticipé, rien d'autre d'ici là.\n\nSi ce n'était pas vous, ignorez cet e-mail.\n\nAptelle\nhttps://aptelle.com",
  },
  de: {
    subject: "Du stehst auf der Aptelle Warteliste",
    text: "Du bist auf der Liste. Wir schreiben dir genau einmal, sobald der frühe Zugang startet, bis dahin nichts weiter.\n\nFalls du das nicht warst, ignoriere diese E-Mail.\n\nAptelle\nhttps://aptelle.com",
  },
  ar: {
    subject: "أنت على قائمة انتظار Aptelle",
    text: "أنت الآن على القائمة. سنراسلك مرة واحدة فقط عند فتح الوصول المبكر ولن يصلك شيء آخر قبل ذلك.\n\nإذا لم تكن أنت من سجّل، تجاهل هذه الرسالة.\n\nAptelle\nhttps://aptelle.com",
  },
};

async function sendAcknowledgement(email: string, lang: string): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return; // dormant until Resend is configured

  const t = ACK[lang] || ACK.en;
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
        text: t.text,
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
