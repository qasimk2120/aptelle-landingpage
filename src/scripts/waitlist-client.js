function cleanBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

export function buildSupabaseInsertRequest({ email, lang, env }) {
  const supabaseUrl = cleanBaseUrl(env.PUBLIC_SUPABASE_URL);
  const anonKey = String(env.PUBLIC_SUPABASE_ANON_KEY || "").trim();

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  return {
    url: `${supabaseUrl}/rest/v1/waitlist`,
    init: {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email,
        lang,
        source: "landing",
      }),
    },
  };
}

export async function submitWaitlist({ email, lang, env, fetchImpl = fetch }) {
  const request = buildSupabaseInsertRequest({ email, lang, env });

  if (!request) {
    return { stored: false, skipped: true };
  }

  const response = await fetchImpl(request.url, request.init);
  if (!response.ok) {
    const body = typeof response.text === "function" ? await response.text() : "";
    throw new Error(`Supabase waitlist insert failed: ${response.status} ${body}`.trim());
  }

  return { stored: true, skipped: false };
}
