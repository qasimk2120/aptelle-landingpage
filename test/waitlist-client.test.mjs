import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSupabaseInsertRequest,
  submitWaitlist,
} from "../src/scripts/waitlist-client.js";

const env = {
  PUBLIC_SUPABASE_URL: "https://aptelle.supabase.co",
  PUBLIC_SUPABASE_ANON_KEY: "anon-key",
};

test("builds a Supabase REST insert request for waitlist signups", () => {
  const request = buildSupabaseInsertRequest({
    email: "qasim@example.com",
    lang: "en",
    env,
  });

  assert.equal(request.url, "https://aptelle.supabase.co/rest/v1/waitlist");
  assert.equal(request.init.method, "POST");
  assert.equal(request.init.headers.apikey, "anon-key");
  assert.equal(request.init.headers.Authorization, "Bearer anon-key");
  assert.equal(request.init.headers.Prefer, "return=minimal");
  assert.deepEqual(JSON.parse(request.init.body), {
    email: "qasim@example.com",
    lang: "en",
    source: "landing",
  });
});

test("skips remote storage when Supabase env vars are not configured", async () => {
  let called = false;

  const result = await submitWaitlist({
    email: "qasim@example.com",
    lang: "en",
    env: {},
    fetchImpl: async () => {
      called = true;
      return { ok: true };
    },
  });

  assert.equal(called, false);
  assert.deepEqual(result, { stored: false, skipped: true });
});

test("throws when Supabase rejects the waitlist insert", async () => {
  await assert.rejects(
    submitWaitlist({
      email: "qasim@example.com",
      lang: "en",
      env,
      fetchImpl: async () => ({ ok: false, status: 403, text: async () => "denied" }),
    }),
    /Supabase waitlist insert failed: 403 denied/,
  );
});
