function cleanBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

// The browser never writes to the waitlist table directly. All signups go
// through the waitlist-signup Edge Function, which verifies the Turnstile
// token server-side and owns the only insert path.
export function buildWaitlistRequest({ email, lang, token, env }) {
  const supabaseUrl = cleanBaseUrl(env.PUBLIC_SUPABASE_URL);
  const anonKey = String(env.PUBLIC_SUPABASE_ANON_KEY || "").trim();

  if (!supabaseUrl) {
    return null;
  }

  const headers = { "Content-Type": "application/json" };
  if (anonKey) {
    headers.apikey = anonKey;
  }

  return {
    url: `${supabaseUrl}/functions/v1/waitlist-signup`,
    init: {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        lang,
        token: token || "",
      }),
    },
  };
}

export async function submitWaitlist({ email, lang, token, env, fetchImpl = fetch }) {
  const request = buildWaitlistRequest({ email, lang, token, env });

  if (!request) {
    return { stored: false, skipped: true };
  }

  const response = await fetchImpl(request.url, request.init);
  if (!response.ok) {
    const body = typeof response.text === "function" ? await response.text() : "";
    throw new Error(`Waitlist signup failed: ${response.status} ${body}`.trim());
  }

  return { stored: true, skipped: false };
}
