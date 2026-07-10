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

const ALLOWED_ORIGINS = new Set([
  "https://aptelle.com",
  "https://www.aptelle.com",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
]);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const LANGS = new Set(["en", "fr", "de", "ar"]);
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
  // Legacy projects inject SUPABASE_SERVICE_ROLE_KEY; new API-key projects
  // inject the sb_secret equivalent under SUPABASE_SECRET_KEY.
  const serviceKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SECRET_KEY");
  if (!supabaseUrl || !serviceKey) {
    return respond(500, false, headers);
  }

  // Server owns the source field; duplicates are silently ignored so the
  // response is identical for new and existing emails.
  const insert = await fetch(`${supabaseUrl}/rest/v1/waitlist?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({ email, lang, source: "landing" }),
  });

  if (!insert.ok) {
    console.error("waitlist insert failed", insert.status);
    return respond(500, false, headers);
  }

  return respond(200, true, headers);
});
