# github-sdk-manager

SDK-based GitHub repository manager using Octokit (official GitHub SDK).

## Features

- Create and manage GitHub repositories
- Update files programmatically via GitHub API
- Dual-license setup (MIT + Apache-2.0)
- Clone repository settings between repos
- Octokit best practices and examples

## Approval and data boundaries

The manager has **no dry-run, confirmation, or transactional rollback**. `list` and `info` are read-only; other CLI commands write immediately. A documentation review or example is not authorization to run them. Prepare the exact owner, visibility, branch/base, file payloads/settings, and exclusions for approval first. Revalidate identity and expected state before writes; stop on drift or partial failure and inspect completed writes before retrying.

| Command | Effects requiring review |
|---|---|
| `create-repo` | Creates a **public** repository with auto-initialization and the source-defined settings; CLI exposes no private flag. |
| `create-from-template` | Creates a **public** repository from the selected template. |
| `clone-settings` | Changes target description, homepage, **visibility**, feature/merge settings, and replaces topics when the source has topics. |
| `setup-rust` | Creates or overwrites `Cargo.toml`, `src/main.rs`, `src/lib.rs`, `README.md`, and `.gitignore` on `main`. |
| `setup-dual-license` | Fetches SPDX text and creates or overwrites `README.md`, `LICENSE-MIT`, and `LICENSE-APACHE` on `main`; it does not merge an existing README or create COPYRIGHT. |
| `make-template` | Changes the repository's template setting. |
| `add-topics` | Replaces the topic set; it does not append safely to existing topics. |

Setup commands produce separate remote file commits and can stop partially applied. Rust setup replaces the README; licence setup later replaces it again, rather than merging build/licence sections. It writes no COPYRIGHT file. Generated Cargo/README snippets are examples, not a portable build or legal certification.

**Approval is not enforced by this implementation.** `fetchOfficialLicense` reads mutable SPDX `main` without validating status, content, redirect, size or timeout, then immediately uses the result. It does not apply a previously approved snapshot. `createFile` fetches the latest file SHA at write time, not a caller-supplied approved base; its 404 catch also covers a failed update and may attempt creation. Prechecking a target does not remove that race or prove a 404 means absence. Do not use these commands where exact approved payload/base or no-Actions requirements cannot be maintained; stop for a separately scoped implementation change rather than weakening approval. This manager does not disable Actions or enforce an account policy automatically.

All manager targets use the authenticated user's login, not a verified expected owner or an arbitrary organization. `list` reads one page (up to 100), potentially including repositories owned by others; passing those displayed names back to a write method loses owner identity. `clone-settings` copies only its enumerated settings, not permissions, secrets, Actions policy or branch protection; empty source topics leave target topics unchanged. Project names/authors are interpolated into generated content without comprehensive validation. No transactional recovery or manager-level throttling/retry policy is implemented.

Use approved least-privilege credentials only inside the consuming process. Never print tokens, put them in shell history or dotfiles, or dump private response bodies. Do not rotate credentials to bypass rate limits. See [QUICKSTART.md](QUICKSTART.md) for read-only entry and review preparation.

## Usage

See [github-manager.js](github-manager.js) for full implementation.

### Basic Example

```javascript
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Update a file
const { data } = await octokit.repos.createOrUpdateFileContents({
  owner: 'username',
  repo: 'repo-name',
  path: 'README.md',
  message: 'Update README',
  content: Buffer.from('content').toString('base64'),
  sha: currentFileSha
});
```

## Setup

Start offline from the repository root with `node --check github-manager.js` and `node --test test-guidance.cjs`. The latter uses a fake SDK to check generated guidance, not installed Octokit or remote behavior. `npm test` is a deliberate failing placeholder; no lockfile is tracked. Dependency installation is separate setup work, not a review prerequisite.

Once actual API inspection is authorized and installed runtime/credentials are available, `node github-manager.js list` and `node github-manager.js info REPOSITORY_NAME` are read-only. Both authenticate and print a banner; list is text, not JSON, and info is not clean JSON stdout. Even no arguments, `--help` or an unknown command authenticates first; use source inspection or stubbed tests for offline help. Missing arguments are not comprehensively validated.

## Retained API skill

This repository includes a **GitHub API / Octokit skill** at `.claude/skills/github-api/`. Its location is retained; do not infer automatic discovery by every agent harness or install it globally as part of a review.

The skill provides:
- Octokit setup and authentication patterns
- Common GitHub API operations (repos, files, issues, PRs)
- Best practices and error handling
- Code examples for all major operations
- Troubleshooting guide

### Using the Skill

Read the linked skill directly for scoped API work. Harness discovery depends on that harness's configuration; the examples below describe requests, not publication approval:

```
"Use the GitHub API skill to update LICENSE-MIT in my repository"
"Help me create a new repository using Octokit best practices"
"Show me how to bulk update files in a GitHub repo"
```

Or reference it directly:
```
"@github-api how do I handle pagination in Octokit?"
```

See [.claude/skills/github-api/SKILL.md](.claude/skills/github-api/SKILL.md) for complete documentation.

## Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [GITHUB_SDK_TOOLS_RESEARCH.md](GITHUB_SDK_TOOLS_RESEARCH.md) - Historical SDK research, not a current capability contract
- [WHY_NO_MCP.md](WHY_NO_MCP.md) - Historical design discussion, not executable batch guidance
- [LICENSES_INFO.md](LICENSES_INFO.md) - Historical licence verification context; recheck actual payloads before reuse

## License

This project is dual-licensed under the terms of both the MIT license and the
Apache License (Version 2.0).

See [LICENSE-APACHE](LICENSE-APACHE) and [LICENSE-MIT](LICENSE-MIT) for details.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this project by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.
