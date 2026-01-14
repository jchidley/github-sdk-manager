# Quick Start Guide

Get up and running with GitHub SDK Manager in 5 minutes.

## 1. Clone and Install

```bash
git clone https://github.com/jchidley/github-sdk-manager.git
cd github-sdk-manager
npm install
```

## 2. Set Up GitHub Token

```bash
# Get token from: https://github.com/settings/tokens/new
# Required scope: repo (full repository access)

export GITHUB_TOKEN=ghp_your_token_here

# Make it permanent:
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.bashrc
source ~/.bashrc
```

## 3. Test It

```bash
# List your repositories
node github-manager.js list
```

## 4. Common Workflows

### Create a New Rust Project

```bash
# Complete setup in 3 commands
node github-manager.js create-repo my-rust-cli "My CLI tool"
node github-manager.js setup-rust my-rust-cli
node github-manager.js setup-dual-license my-rust-cli "Your Name"

# Add topics for discoverability
node github-manager.js add-topics my-rust-cli rust cli command-line
```

Result:
- ✅ Repository created on GitHub
- ✅ Cargo.toml with bin + lib targets
- ✅ src/main.rs and src/lib.rs
- ✅ LICENSE-MIT and LICENSE-APACHE (from SPDX)
- ✅ COPYRIGHT file (Rust project style)
- ✅ README with license section
- ✅ .gitignore for Rust
- ✅ Topics for GitHub search

### Add Dual-License to Existing Repo

```bash
node github-manager.js setup-dual-license existing-repo "Your Name"
```

Creates proper MIT/Apache-2.0 dual-licensing following Rust ecosystem standards.

### Create from Template

```bash
# Make a repository a template (one time)
node github-manager.js make-template my-template

# Create new repos from it
node github-manager.js create-from-template my-template new-project "Description"
```

### Clone Repository Settings

```bash
# Copy all settings from one repo to another
node github-manager.js clone-settings source-repo target-repo
```

Copies:
- Repository settings (wikis, issues, projects)
- Merge strategies
- Topics/tags
- Description and homepage

## 5. Programmatic Usage

```javascript
const GitHubManager = require('./github-manager.js');

async function myAutomation() {
  const manager = await new GitHubManager(process.env.GITHUB_TOKEN).init();
  
  // Create and configure repository
  await manager.createRepo('my-project', 'Description');
  await manager.setupDualLicense('my-project', 'Your Name');
  await manager.addTopics('my-project', ['tag1', 'tag2']);
  
  // Get repo info
  const info = await manager.getRepo('my-project');
  console.log(info.html_url);
}

myAutomation();
```

## Troubleshooting

### "Bad credentials" error

Your token is expired or incorrect:
```bash
# Check if set
echo $GITHUB_TOKEN

# Get new token: https://github.com/settings/tokens/new
export GITHUB_TOKEN=ghp_new_token_here
```

### "Not Found" error

Repository doesn't exist or you don't have access:
```bash
# List all your repos
node github-manager.js list
```

### Rate limiting

GitHub API has rate limits (5000 requests/hour for authenticated users):
```bash
# Check your rate limit
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq '.rate'
```

## Next Steps

- Read [README.md](README.md) for complete documentation
- See [COMPARISON.md](COMPARISON.md) for before/after examples
- Check [DUAL_LICENSE_PATTERNS.md](DUAL_LICENSE_PATTERNS.md) for licensing research
- Review [LICENSES_INFO.md](LICENSES_INFO.md) for SPDX verification

## Examples Repository

All documentation files in this repo were created using this tool!

```bash
# This project's setup was automated:
node github-manager.js create-repo github-sdk-manager "Description"
node github-manager.js setup-dual-license github-sdk-manager "Jack Chidley"
node github-manager.js add-topics github-sdk-manager github sdk octokit automation
```

## Links

- **Repository**: https://github.com/jchidley/github-sdk-manager
- **Issues**: https://github.com/jchidley/github-sdk-manager/issues
- **Octokit Docs**: https://octokit.github.io/rest.js
- **GitHub API**: https://docs.github.com/en/rest
