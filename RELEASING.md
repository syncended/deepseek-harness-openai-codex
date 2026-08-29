# Releasing

Releases use tag-driven npm publication with provenance.

## One-time setup

1. Create an npm granular access token for `@syncended/dsh-codex` with package read/write access and CI-compatible 2FA bypass.
2. Store it in the GitHub Actions repository secret `NPM_REGISTRY_TOKEN`.
3. Confirm the release workflow has npm provenance permissions.

Manage tokens at <https://www.npmjs.com/settings/syncended/tokens>.

## Every release

Start from a clean release branch and run:

```bash
npm test
npm pack --dry-run
```

Inspect the tarball to confirm it includes runtime files, `cordis.patch.yml`, README, and LICENSE. Then create and push a version commit and matching `v<version>` tag:

```bash
npm version patch   # or minor, major, or an explicit version
git push --follow-tags
```

The release workflow must verify that the tag matches `package.json`, rerun tests, inspect package contents, and publish with npm provenance.

Package page: <https://www.npmjs.com/package/@syncended/dsh-codex>

Verify installation and login in a disposable Web profile:

```bash
dsh plugin --profile web add -w @syncended/dsh-codex
dsh web --no-open
```

Confirm **Settings → OpenAI Codex**, the `/codex` interactive command, model selection, and the limits popup.
