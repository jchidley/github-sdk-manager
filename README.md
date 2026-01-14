# GitHub SDK Manager

SDK-based GitHub repository manager - a better alternative to `gh` CLI for automation and LLM integration.

Uses the official [Octokit](https://github.com/octokit/rest.js) SDK with programmatic APIs that return structured data, making it perfect for:
- LLM-driven automation
- CI/CD workflows
- Batch repository operations
- Custom GitHub integrations

## Why This Instead of `gh` CLI?

| Feature | `gh` CLI | GitHub SDK Manager |
|---------|----------|-------------------|
| Output format | Text strings | Structured JSON |
| Automation-friendly | ❌ Requires parsing | ✅ Direct API access |
| LLM integration | ❌ String parsing | ✅ Clean objects |
| Extensibility | Limited | Full GitHub API |
| License source | Manual | SPDX (official) |
| Custom workflows | Hard | Easy |

## Features

- ✅ **Repository Management**: Create, configure, and manage repositories
- ✅ **Dual-License Setup**: Rust ecosystem best practices (MIT + Apache-2.0)
- ✅ **Official Licenses**: Fetched from SPDX (Linux Foundation)
- ✅ **Template Support**: Create and use GitHub templates
- ✅ **Settings Cloning**: Copy configuration between repos
- ✅ **Topics/Tags**: Manage repository topics
- ✅ **Rust Projects**: Set up Rust project structure (Cargo.toml, src/, etc.)
- ✅ **Full API Access**: Complete GitHub REST API through Octokit

## Installation

```bash
npm install
```

## Setup

1. Create a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens/new
   - Select scopes: `repo` (full repository access)
   - Generate token

2. Set the token:
   ```bash
   export GITHUB_TOKEN=ghp_your_token_here
   
   # Make it permanent (add to ~/.bashrc or ~/.zshrc):
   echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.bashrc
   ```

## Usage

### Repository Management

```bash
# Create a new repository
node github-manager.js create-repo my-project "Project description"

# List all your repositories
node github-manager.js list

# Get detailed repository info
node github-manager.js info my-project
```

### Dual-License Setup (Rust Ecosystem Standard)

```bash
# Add MIT + Apache-2.0 dual-licensing to any repository
node github-manager.js setup-dual-license my-project "Your Name"
```

This creates:
- `LICENSE-MIT` - Official SPDX MIT license
- `LICENSE-APACHE` - Official SPDX Apache 2.0 license
- `COPYRIGHT` - Dual-license explanation (Rust project style)
- `README.md` - License section with contribution clause

Follows the pattern used by:
- [rust-lang/rust](https://github.com/rust-lang/rust)
- [serde-rs/serde](https://github.com/serde-rs/serde)
- [clap-rs/clap](https://github.com/clap-rs/clap)

### Rust Project Setup

```bash
# Set up complete Rust project structure
node github-manager.js setup-rust my-rust-project

# Optionally specify project name (for Cargo.toml)
node github-manager.js setup-rust my-rust-cli my_rust_cli
```

Creates:
- `Cargo.toml` with bin and lib targets
- `src/main.rs`
- `src/lib.rs` with tests
- `README.md` with build configuration
- `.gitignore` for Rust

### Template Management

```bash
# Make a repository a GitHub template
node github-manager.js make-template my-template-repo

# Create new repository from template
node github-manager.js create-from-template my-template-repo new-project "Description"
```

### Settings and Configuration

```bash
# Clone all settings from one repo to another
node github-manager.js clone-settings source-repo target-repo

# Add topics/tags to a repository
node github-manager.js add-topics my-project rust cli automation
```

### All Commands

```bash
node github-manager.js <command> [arguments]

Commands:
  create-repo <name> [description]           Create a new repository
  clone-settings <source> <target>           Clone settings from one repo to another
  setup-dual-license <repo> [author]         Set up dual-license template (Apache-2.0 + MIT)
  setup-rust <repo> [project-name]           Set up Rust project structure
  create-from-template <template> <name>     Create repo from template
  make-template <repo>                       Make repo a template
  add-topics <repo> <topic1> [topic2...]     Add topics/tags
  list                                       List all repositories
  info <repo>                                Get repository info
```

## Programmatic Usage

Import and use as a library in your Node.js code:

```javascript
const GitHubManager = require('./github-manager.js');

async function example() {
  const manager = await new GitHubManager(process.env.GITHUB_TOKEN).init();
  
  // Create repository
  await manager.createRepo('my-project', 'My awesome project');
  
  // Set up dual-licensing
  await manager.setupDualLicense('my-project', 'Your Name');
  
  // Add topics
  await manager.addTopics('my-project', ['rust', 'cli', 'automation']);
  
  // Clone settings from another repo
  await manager.cloneSettings('template-repo', 'my-project');
  
  // Get repository info
  const info = await manager.getRepo('my-project');
  console.log(info);
}
```

## For LLM Integration

This tool is designed to be LLM-friendly:

```javascript
// Your LLM can generate code like this:
const manager = await new GitHubManager(process.env.GITHUB_TOKEN).init();

// Natural language: "Create a new Rust project with dual-licensing"
await manager.createRepo('my-rust-cli', 'A command-line tool in Rust');
await manager.setupRustProject('my-rust-cli');
await manager.setupDualLicense('my-rust-cli', 'Jack Chidley');
await manager.addTopics('my-rust-cli', ['rust', 'cli', 'command-line']);

// All methods return structured JSON, easy for LLMs to process
```

## License Sources

All licenses are fetched from **SPDX** (Software Package Data Exchange):
- Maintained by the Linux Foundation
- ISO/IEC 5962:2021 standard
- Used by GitHub, npm, Maven Central
- Repository: https://github.com/spdx/license-list-data

## Examples

### Complete Workflow: New Rust CLI Project

```bash
# 1. Create repository
node github-manager.js create-repo awesome-cli "An awesome command-line tool"

# 2. Set up Rust project structure
node github-manager.js setup-rust awesome-cli

# 3. Add dual-licensing (Rust ecosystem standard)
node github-manager.js setup-dual-license awesome-cli "Jack Chidley"

# 4. Add relevant topics
node github-manager.js add-topics awesome-cli rust cli tool command-line

# Done! Repository is ready with:
# - Cargo.toml with bin + lib
# - src/main.rs and src/lib.rs
# - LICENSE-MIT and LICENSE-APACHE
# - COPYRIGHT file
# - README with license section
# - Proper .gitignore
```

### Batch Operations

```bash
# Create multiple similar repos
for name in project1 project2 project3; do
  node github-manager.js create-repo $name "Description"
  node github-manager.js setup-dual-license $name "Your Name"
  node github-manager.js add-topics $name rust library
done
```

## API Coverage

The underlying Octokit SDK provides access to the full GitHub REST API:

- Repositories (create, update, delete, archive, transfer)
- Issues and Pull Requests
- Branch protection rules
- Webhooks and GitHub Apps
- Actions workflows and secrets
- Releases and tags
- Teams and organizations
- Discussions
- And much more...

See [Octokit REST API docs](https://octokit.github.io/rest.js) for the complete API.

## Extending

Add new commands by extending the `GitHubManager` class:

```javascript
class GitHubManager {
  // Add your custom methods
  async setupMyWorkflow(repo) {
    // Your custom automation
    await this.createFile(repo, 'file.txt', 'commit message', 'content');
    await this.octokit.repos.update({
      owner: this.username,
      repo,
      has_wiki: false
    });
  }
}
```

## Requirements

- Node.js 14+
- GitHub Personal Access Token with `repo` scope

## Dependencies

- `@octokit/rest` - Official GitHub SDK

## License

This project is dual-licensed under the terms of both the MIT license and the
Apache License (Version 2.0).

See [LICENSE-APACHE](LICENSE-APACHE), [LICENSE-MIT](LICENSE-MIT), and
[COPYRIGHT](COPYRIGHT) for details.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this project by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.

## Links

- **Repository**: https://github.com/jchidley/github-sdk-manager
- **Octokit**: https://github.com/octokit/rest.js
- **SPDX**: https://spdx.org/licenses/
- **GitHub API**: https://docs.github.com/en/rest
