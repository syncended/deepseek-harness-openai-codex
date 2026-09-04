import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const bundleUrl = new URL("../cordis.patch.yml", import.meta.url);

test("bundle preserves the Codex catalog and adds GPT-6 Astra", async () => {
  const bundle = await readFile(bundleUrl, "utf8");
  const modelIds = [...bundle.matchAll(/^ {10}- id: (\S+)$/gm)].map((match) => match[1]);

  assert.deepEqual(modelIds, [
    "gpt-5.3-codex-spark",
    "gpt-5.4",
    "gpt-5.4-mini",
    "gpt-5.5",
    "gpt-5.6-luna",
    "gpt-5.6-sol",
    "gpt-5.6-terra",
    "gpt-6-astra",
  ]);
  assert.match(bundle, /defaultMaxTokens: 128000/);
  assert.match(bundle, /- id: gpt-6-astra\n {12}name: GPT-6 Astra\n {12}contextWindow: 272000/);
  assert.match(bundle, /reasoningEfforts:\n {14}low: low\n {14}medium: medium\n {14}high: high\n {14}xhigh: xhigh\n {14}max: max/);
});
