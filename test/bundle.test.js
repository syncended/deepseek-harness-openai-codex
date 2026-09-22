import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const bundleUrl = new URL("../cordis.patch.yml", import.meta.url);

test("bundle declares the Codex route without pinning a model list", async () => {
  const bundle = await readFile(bundleUrl, "utf8");

  assert.match(
    bundle,
    /openai-codex:\n {8}displayName: OpenAI Codex\n {8}apiKeyEnv: OPENAI_CODEX_TOKEN/,
  );
  assert.match(bundle, /defaultMaxTokens: 128000/);

  // dsh-llm-pi-ai resolves `entries = configured.length > 0 ? configured : catalog`,
  // so any configured `models` list replaces the installed pi-ai catalog and
  // freezes the Codex catalog at this package's release. Pin nothing.
  assert.doesNotMatch(bundle, /^\s*models:/m);
  assert.doesNotMatch(bundle, /- id: gpt-/);
});

test("bundle registers the plugin row", async () => {
  const bundle = await readFile(bundleUrl, "utf8");
  assert.match(
    bundle,
    /- insert:\n {4}- id: openai-codex\n {6}name: "@syncended\/dsh-codex"/,
  );
});

test("bundle excludes no models by default", async () => {
  const bundle = await readFile(bundleUrl, "utf8");
  assert.doesNotMatch(bundle, /modelCatalogExclude:/);
});
