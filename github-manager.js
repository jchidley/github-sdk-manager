#!/usr/bin/env node

/**
 * GitHub Repository Manager - SDK-based alternative to gh CLI
 * Uses Octokit (official GitHub SDK) for programmatic repo management
 * 
 * Usage:
 *   node github-manager.js create-repo my-new-repo "Description here"
 *   node github-manager.js clone-settings rust_template my-new-repo
 *   node github-manager.js setup-rust-project my-new-repo
 * 
 * Requires: npm install @octokit/rest
 * Setup: export GITHUB_TOKEN=ghp_your_token_here
 */

const { Octokit } = require("@octokit/rest");
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

class GitHubManager {
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
    this.username = null;
  }

  /**
   * Fetch official license text from SPDX (authoritative source)
   */
  async fetchOfficialLicense(licenseId) {
    return new Promise((resolve, reject) => {
      const url = `https://raw.githubusercontent.com/spdx/license-list-data/main/text/${licenseId}.txt`;
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  async init() {
    const { data } = await this.octokit.users.getAuthenticated();
    this.username = data.login;
    console.log(`Authenticated as: ${this.username}`);
    return this;
  }

  /**
   * Create a new repository with sensible defaults
   */
  async createRepo(name, description = '', options = {}) {
    const defaults = {
      name,
      description,
      private: false,
      auto_init: true,
      gitignore_template: null,
      license_template: null,
      has_issues: true,
      has_projects: false,
      has_wiki: false,
      delete_branch_on_merge: true,
      allow_squash_merge: true,
      allow_merge_commit: false,
      allow_rebase_merge: true,
      ...options
    };

    console.log(`Creating repository: ${name}`);
    const { data } = await this.octokit.repos.createForAuthenticatedUser(defaults);
    console.log(`✓ Created: ${data.html_url}`);
    return data;
  }

  /**
   * Clone settings from one repo to another
   */
  async cloneSettings(sourceRepo, targetRepo) {
    console.log(`Cloning settings from ${sourceRepo} to ${targetRepo}`);
    
    // Get source repo settings
    const { data: source } = await this.octokit.repos.get({
      owner: this.username,
      repo: sourceRepo
    });

    // Update target repo with source settings
    await this.octokit.repos.update({
      owner: this.username,
      repo: targetRepo,
      description: source.description,
      homepage: source.homepage,
      private: source.private,
      has_issues: source.has_issues,
      has_projects: source.has_projects,
      has_wiki: source.has_wiki,
      allow_squash_merge: source.allow_squash_merge,
      allow_merge_commit: source.allow_merge_commit,
      allow_rebase_merge: source.allow_rebase_merge,
      delete_branch_on_merge: source.delete_branch_on_merge
    });

    console.log(`✓ Settings cloned`);

    // Clone topics if any
    if (source.topics && source.topics.length > 0) {
      await this.octokit.repos.replaceAllTopics({
        owner: this.username,
        repo: targetRepo,
        names: source.topics
      });
      console.log(`✓ Topics cloned: ${source.topics.join(', ')}`);
    }

    return source;
  }

  /**
   * Set up a minimal dual-licensed template (Apache-2.0 + MIT)
   * Fetches official license texts from SPDX (Linux Foundation's authoritative source)
   */
  async setupDualLicense(repoName, author = 'Jack Chidley') {
    const year = new Date().getFullYear();
    
    console.log(`Setting up dual-license template: ${repoName}`);
    console.log('Fetching official licenses from SPDX...');

    // Fetch official license texts from SPDX
    const mitTemplate = await this.fetchOfficialLicense('MIT');
    const apacheTemplate = await this.fetchOfficialLicense('Apache-2.0');

    // README.md (following Rust ecosystem style)
    const readme = `# ${repoName}

[Your project description here]

## License

This project is dual-licensed under the terms of both the MIT license and the
Apache License (Version 2.0).

See [LICENSE-APACHE](LICENSE-APACHE) and [LICENSE-MIT](LICENSE-MIT) for details.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this project by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.
`;

    await this.createFile(repoName, 'README.md', 'Update README with dual-license info', readme);

    // LICENSE-MIT (replace placeholders with actual values)
    const mitLicense = mitTemplate
      .replace('<year>', year.toString())
      .replace('<copyright holders>', author);

    await this.createFile(repoName, 'LICENSE-MIT', 'Add official MIT license from SPDX', mitLicense);

    // LICENSE-APACHE (use official text as-is)
    await this.createFile(repoName, 'LICENSE-APACHE', 'Add official Apache 2.0 license from SPDX', apacheTemplate);

    console.log(`✓ Dual-license template created with official SPDX licenses`);
  }

  /**
   * Set up a Rust project like rust_template
   */
  async setupRustProject(repoName, projectName = null) {
    const name = projectName || repoName.replace(/-/g, '_');
    
    console.log(`Setting up Rust project: ${repoName}`);

    // Create Cargo.toml
    const cargoToml = `[package]
name = "${name}"
version = "0.1.0"
edition = "2021"

[dependencies]

[[bin]]
name = "${name}"
path = "src/main.rs"

[lib]
name = "${name}"
path = "src/lib.rs"
`;

    await this.createFile(repoName, 'Cargo.toml', 'Initial Cargo.toml', cargoToml);

    // Create src/main.rs
    const mainRs = `fn main() {
    println!("Hello from ${name}!");
}
`;
    await this.createFile(repoName, 'src/main.rs', 'Initial main.rs', mainRs);

    // Create src/lib.rs
    const libRs = `pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
`;
    await this.createFile(repoName, 'src/lib.rs', 'Initial lib.rs', libRs);

    // Create README.md
    const readme = `# ${repoName}

${projectName ? `Project: ${projectName}` : ''}

## Build Configuration

Add this to \`~/.cargo/config.toml\`:

\`\`\`toml
[build]
rustflags = ["-C", "link-arg=-fuse-ld=mold","-C", "target-cpu=native"]
\`\`\`

## Usage

\`\`\`bash
cargo build
cargo run
cargo test
\`\`\`
`;
    await this.createFile(repoName, 'README.md', 'Update README', readme);

    // Create .gitignore
    const gitignore = `/target/
Cargo.lock
**/*.rs.bk
*.pdb
`;
    await this.createFile(repoName, '.gitignore', 'Add Rust .gitignore', gitignore);

    console.log(`✓ Rust project structure created`);
  }

  /**
   * Create or update a file in a repository
   */
  async createFile(repo, filePath, message, content, branch = 'main') {
    try {
      // Try to get existing file (to update instead of create)
      const { data: existing } = await this.octokit.repos.getContent({
        owner: this.username,
        repo,
        path: filePath,
        ref: branch
      });

      // File exists, update it
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.username,
        repo,
        path: filePath,
        message,
        content: Buffer.from(content).toString('base64'),
        branch,
        sha: existing.sha
      });
      console.log(`✓ Updated: ${filePath}`);
    } catch (error) {
      if (error.status === 404) {
        // File doesn't exist, create it
        await this.octokit.repos.createOrUpdateFileContents({
          owner: this.username,
          repo,
          path: filePath,
          message,
          content: Buffer.from(content).toString('base64'),
          branch
        });
        console.log(`✓ Created: ${filePath}`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Get repository information
   */
  async getRepo(repo) {
    const { data } = await this.octokit.repos.get({
      owner: this.username,
      repo
    });
    return data;
  }

  /**
   * List all repositories
   */
  async listRepos(options = {}) {
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
      ...options
    });
    return data;
  }

  /**
   * Add topics/tags to a repository
   */
  async addTopics(repo, topics) {
    await this.octokit.repos.replaceAllTopics({
      owner: this.username,
      repo,
      names: topics
    });
    console.log(`✓ Topics added: ${topics.join(', ')}`);
  }

  /**
   * Create a repository from template (like rust_template)
   */
  async createFromTemplate(templateRepo, newRepoName, description = '') {
    console.log(`Creating ${newRepoName} from template ${templateRepo}`);
    
    const { data } = await this.octokit.repos.createUsingTemplate({
      template_owner: this.username,
      template_repo: templateRepo,
      name: newRepoName,
      description,
      private: false
    });
    
    console.log(`✓ Created from template: ${data.html_url}`);
    return data;
  }

  /**
   * Make a repository a template
   */
  async makeTemplate(repo) {
    await this.octokit.repos.update({
      owner: this.username,
      repo,
      is_template: true
    });
    console.log(`✓ ${repo} is now a template repository`);
  }
}

// CLI Interface
async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable not set');
    console.error('Get a token from: https://github.com/settings/tokens');
    console.error('Then: export GITHUB_TOKEN=ghp_your_token_here');
    process.exit(1);
  }

  const manager = await new GitHubManager(token).init();
  const [,, command, ...args] = process.argv;

  try {
    switch (command) {
      case 'create-repo':
        const [name, description] = args;
        await manager.createRepo(name, description);
        break;

      case 'clone-settings':
        const [source, target] = args;
        await manager.cloneSettings(source, target);
        break;

      case 'setup-dual-license':
        const [licenseRepo, author] = args;
        await manager.setupDualLicense(licenseRepo, author || 'Jack Chidley');
        break;

      case 'setup-rust':
        const [repoName, projectName] = args;
        await manager.setupRustProject(repoName, projectName);
        break;

      case 'create-from-template':
        const [template, newName, desc] = args;
        await manager.createFromTemplate(template, newName, desc);
        break;

      case 'make-template':
        await manager.makeTemplate(args[0]);
        break;

      case 'add-topics':
        const [repo, ...topics] = args;
        await manager.addTopics(repo, topics);
        break;

      case 'list':
        const repos = await manager.listRepos();
        repos.forEach(r => console.log(`${r.name.padEnd(30)} ${r.description || ''}`));
        break;

      case 'info':
        const info = await manager.getRepo(args[0]);
        console.log(JSON.stringify(info, null, 2));
        break;

      default:
        console.log(`
GitHub Repository Manager

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

Examples:
  node github-manager.js create-repo my-rust-project "My new Rust project"
  node github-manager.js setup-dual-license my-license-template
  node github-manager.js setup-rust my-rust-project
  node github-manager.js clone-settings rust_template my-new-project
  node github-manager.js make-template rust_template
  node github-manager.js create-from-template rust_template new-project
  node github-manager.js add-topics my-project rust cli template
        `);
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.status) {
      console.error('HTTP Status:', error.status);
    }
    process.exit(1);
  }
}

// Export for programmatic use
if (require.main === module) {
  main();
} else {
  module.exports = GitHubManager;
}
