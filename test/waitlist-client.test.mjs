import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWaitlistRequest,
  submitWaitlist,
} from "../src/scripts/waitlist-client.js";

const env = {
  PUBLIC_SUPABASE_URL: "https://aptelle.supabase.co",
  PUBLIC_SUPABASE_ANON_KEY: "anon-key",
};

test("builds an Edge Function request for waitlist signups", () => {
  const request = buildWaitlistRequest({
    email: "qasim@example.com",
    lang: "en",
    token: "turnstile-token",
    env,
  });

  assert.equal(
    request.url,
    "https://aptelle.supabase.co/functions/v1/waitlist-signup",
  );
  assert.equal(request.init.method, "POST");
  assert.equal(request.init.headers["Content-Type"], "application/json");
  assert.equal(request.init.headers.apikey, "anon-key");
  assert.deepEqual(JSON.parse(request.init.body), {
    email: "qasim@example.com",
    lang: "en",
    token: "turnstile-token",
  });
});

test("omits the apikey header when no anon key is configured", () => {
  const request = buildWaitlistRequest({
    email: "qasim@example.com",
    lang: "en",
    token: "t",
    env: { PUBLIC_SUPABASE_URL: "https://aptelle.supabase.co" },
  });

  assert.equal(request.init.headers.apikey, undefined);
});

test("skips remote storage when the Supabase URL is not configured", async () => {
  let called = false;

  const result = await submitWaitlist({
    email: "qasim@example.com",
    lang: "en",
    token: "t",
    env: {},
    fetchImpl: async () => {
      called = true;
      return { ok: true };
    },
  });

  assert.equal(called, false);
  assert.deepEqual(result, { stored: false, skipped: true });
});

test("throws when the waitlist function rejects the signup", async () => {
  await assert.rejects(
    submitWaitlist({
      email: "qasim@example.com",
      lang: "en",
      token: "t",
      env,
      fetchImpl: async () => ({ ok: false, status: 403, text: async () => "denied" }),
    }),
    /Waitlist signup failed: 403 denied/,
  );
});
