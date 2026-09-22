import assert from "node:assert/strict";
import test from "node:test";

import { codexModelCatalogEntries } from "../lib/index.js";

/** One catalog entry shaped like `/backend-api/codex/models` returns. */
function model(overrides) {
  return {
    slug: "gpt-6-astra",
    display_name: "GPT-6-Astra",
    visibility: "list",
    supported_in_api: true,
    context_window: 272000,
    input_modalities: ["text", "image"],
    supported_reasoning_levels: [
      { effort: "low" },
      { effort: "medium" },
      { effort: "high" },
      { effort: "xhigh" },
      { effort: "max" },
      { effort: "ultra" },
    ],
    ...overrides,
  };
}

test("maps the live Codex catalog to llm-pi-ai model entries", () => {
  const entries = codexModelCatalogEntries({
    models: [
      model({}),
      model({ slug: "gpt-6-sol", display_name: "GPT-6-Sol" }),
      model({
        slug: "gpt-5.5",
        display_name: "GPT-5.5",
        supported_reasoning_levels: [{ effort: "low" }, { effort: "xhigh" }],
      }),
    ],
  });

  assert.deepEqual(entries, [
    {
      id: "gpt-6-astra",
      name: "GPT-6-Astra",
      contextWindow: 272000,
      input: ["text", "image"],
      reasoningEfforts: { low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max" },
    },
    {
      id: "gpt-6-sol",
      name: "GPT-6-Sol",
      contextWindow: 272000,
      input: ["text", "image"],
      reasoningEfforts: { low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max" },
    },
    {
      id: "gpt-5.5",
      name: "GPT-5.5",
      contextWindow: 272000,
      input: ["text", "image"],
      reasoningEfforts: { low: "low", xhigh: "xhigh" },
    },
  ]);
});

test("drops hidden, non-API, duplicate, and malformed catalog rows", () => {
  const entries = codexModelCatalogEntries({
    models: [
      model({ slug: "gpt-reserve", visibility: "hide" }),
      model({ slug: "codex-auto-review", visibility: "hide" }),
      model({ slug: "gpt-6-sol", supported_in_api: false }),
      model({ slug: "gpt-6-luna" }),
      model({ slug: "gpt-6-luna" }),
      model({ slug: "   " }),
      model({ slug: 42 }),
      { display_name: "no slug" },
    ],
  });

  assert.deepEqual(entries.map((entry) => entry.id), ["gpt-6-luna"]);
});

test("keeps a bare entry when the catalog omits optional fields", () => {
  const entries = codexModelCatalogEntries({
    models: [
      {
        slug: "gpt-5.5",
        visibility: "list",
        supported_in_api: true,
        supported_reasoning_levels: [],
        input_modalities: ["audio"],
      },
    ],
  });

  assert.deepEqual(entries, [{ id: "gpt-5.5", name: "gpt-5.5" }]);
});

test("returns nothing for a payload without a models array", () => {
  assert.deepEqual(codexModelCatalogEntries(undefined), []);
  assert.deepEqual(codexModelCatalogEntries({}), []);
  assert.deepEqual(codexModelCatalogEntries({ models: "nope" }), []);
});
