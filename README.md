# github-sdk-manager

SDK-based GitHub repository manager using Octokit (official GitHub SDK).

## Features

- Create and manage GitHub repositories
- Update files programmatically via GitHub API
- Dual-license setup (MIT + Apache-2.0)
- Clone repository settings between repos
- Octokit best practices and examples

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

```bash
npm install
export GITHUB_TOKEN=ghp_your_token_here
node github-manager.js list
```

## Claude Code Skill

This repository includes a **GitHub API / Octokit skill** at `.claude/skills/github-api/`.

The skill provides:
- Octokit setup and authentication patterns
- Common GitHub API operations (repos, files, issues, PRs)
- Best practices and error handling
- Code examples for all major operations
- Troubleshooting guide

### Using the Skill

Claude Code automatically discovers skills in `.claude/skills/`. Just ask:

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
- [GITHUB_SDK_TOOLS_RESEARCH.md](GITHUB_SDK_TOOLS_RESEARCH.md) - SDK research
- [WHY_NO_MCP.md](WHY_NO_MCP.md) - Design decisions
- [LICENSES_INFO.md](LICENSES_INFO.md) - License information

## License

This project is dual-licensed under the terms of both the MIT license and the
Apache License (Version 2.0).

See [LICENSE-APACHE](LICENSE-APACHE) and [LICENSE-MIT](LICENSE-MIT) for details.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this project by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.
