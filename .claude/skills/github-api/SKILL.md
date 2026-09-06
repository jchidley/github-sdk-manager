---
name: github-api
description: Octokit (official GitHub SDK) best practices, common operations, and code examples for GitHub API automation. Use when creating repos, updating files, managing issues/PRs, or any GitHub API interaction.
---

# GitHub API / Octokit Skill

This skill provides Octokit examples for GitHub API work. For repository-specific commands and effects, read the [README](../../../README.md#approval-and-data-boundaries).

## Scope and approval

Reviews and discovery stay read-only. Complete authorized local preparation autonomously, but obtain confirmation of the owner, visibility, branch/base, exact paths/payloads or settings, and side effects before remote writes. Deletion, visibility changes, merges, releases, and bulk operations need their concrete effects stated explicitly. Recheck identity and expected file/branch SHAs immediately before writing; stop on drift or partial failure and preserve completed results.

Examples below are API fragments, not approved actions or executable preview/apply workflows. Before adapting a fragment, carry an explicit branch/ref and approved expected SHA through both read and write calls; defaults and a newly fetched latest SHA do not protect an approved base. The manager's licence command re-fetches mutable content instead of applying a reviewed snapshot, so do not run it when exact approved payloads cannot be enforced. Its list is only one page and may include other owners, while its methods target the authenticated username. Do not turn displayed names into a bulk-write list. The current manager writes immediately; it has no dry-run or confirmation gate. Do not run a write command to discover its effects. `clone-settings` can change visibility, licence setup overwrites README/licence files, and topic updates replace the topic set. Follow the README's complete effect table. Never enable writes, install dependencies, or change authentication merely because this skill was loaded.

## When to Use This Skill

Use this skill when you need to:
- Create, update, or manage GitHub repositories
- Update files in repositories programmatically
- Manage issues, pull requests, or discussions
- Work with GitHub Actions, releases, or webhooks
- Automate GitHub operations via the API
- Implement GitHub integrations or bots

## Authentication

### Environment Variable (Recommended)

```javascript
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});
```

### Personal Access Token Requirements

Generate at: https://github.com/settings/tokens

Use an already provisioned, least-privilege credential with access only to the required repositories and operations. Fine-grained tokens and GitHub App credentials do not share one prefix or scope model; verify the authenticated identity and endpoint permissions rather than guessing from a token prefix. Classic scopes such as `repo`, `workflow`, or `admin:org` are broad and are not a default requirement for read-only work. Credential creation or permission expansion requires separate approval.

Load approved credentials into the consuming process without printing values or persisting them in dotfiles. Do not log request headers, authentication objects, or private response bodies.

### Checking Authentication

```javascript
// Test if token is valid
const { data: user } = await octokit.users.getAuthenticated();
console.log(`Authenticated as: ${user.login}`);
```

## Common Operations

### 1. Repository Operations

#### Create Repository

```javascript
const { data: repo } = await octokit.repos.createForAuthenticatedUser({
  name: 'my-new-repo',
  description: 'Repository description',
  private: false,
  auto_init: true, // Initialize with README
  license_template: 'mit', // Optional: add license
});

console.log(`Created: ${repo.html_url}`);
```

#### Get Repository Info

```javascript
const { data: repo } = await octokit.repos.get({
  owner: 'username',
  repo: 'repo-name'
});

console.log(`Stars: ${repo.stargazers_count}`);
console.log(`Forks: ${repo.forks_count}`);
console.log(`Default branch: ${repo.default_branch}`);
```

#### Update Repository Settings

```javascript
await octokit.repos.update({
  owner: 'username',
  repo: 'repo-name',
  description: 'Updated description',
  homepage: 'https://example.com',
  has_issues: true,
  has_wiki: false,
  has_projects: true,
});
```

#### Delete Repository

```javascript
await octokit.repos.delete({
  owner: 'username',
  repo: 'repo-name'
});
```

### 2. File Operations

#### Get File Contents

```javascript
const { data: file } = await octokit.repos.getContent({
  owner: 'username',
  repo: 'repo-name',
  path: 'path/to/file.md',
  ref: 'main' // branch name
});

// Decode base64 content
const content = Buffer.from(file.content, 'base64').toString('utf8');
console.log(content);
```

#### Create or Update File

```javascript
const { data } = await octokit.repos.createOrUpdateFileContents({
  owner: 'username',
  repo: 'repo-name',
  path: 'path/to/file.md',
  message: 'Commit message',
  content: Buffer.from('file content here').toString('base64'),
  sha: file.sha, // Required for updates, omit for new files
  branch: 'main'
});

console.log(`Commit: ${data.commit.html_url}`);
```

**Important:** Content must be base64 encoded!

#### Delete File

```javascript
await octokit.repos.deleteFile({
  owner: 'username',
  repo: 'repo-name',
  path: 'path/to/file.md',
  message: 'Delete file',
  sha: file.sha, // Required - get from getContent first
  branch: 'main'
});
```

#### Get Multiple Files (Directory)

```javascript
const { data: contents } = await octokit.repos.getContent({
  owner: 'username',
  repo: 'repo-name',
  path: 'src',
  ref: 'main'
});

// contents is an array if path is a directory
contents.forEach(item => {
  console.log(`${item.type}: ${item.path}`);
});
```

### 3. Branch Operations

#### List Branches

```javascript
const { data: branches } = await octokit.repos.listBranches({
  owner: 'username',
  repo: 'repo-name'
});

branches.forEach(branch => {
  console.log(`${branch.name}: ${branch.commit.sha}`);
});
```

#### Create Branch

```javascript
// First, get the SHA of the commit you want to branch from
const { data: ref } = await octokit.git.getRef({
  owner: 'username',
  repo: 'repo-name',
  ref: 'heads/main'
});

// Create new branch
await octokit.git.createRef({
  owner: 'username',
  repo: 'repo-name',
  ref: 'refs/heads/new-branch-name',
  sha: ref.object.sha
});
```

#### Delete Branch

```javascript
await octokit.git.deleteRef({
  owner: 'username',
  repo: 'repo-name',
  ref: 'heads/branch-to-delete'
});
```

### 4. Issues and Pull Requests

#### Create Issue

```javascript
const { data: issue } = await octokit.issues.create({
  owner: 'username',
  repo: 'repo-name',
  title: 'Issue title',
  body: 'Issue description',
  labels: ['bug', 'help wanted'],
  assignees: ['username']
});

console.log(`Issue #${issue.number}: ${issue.html_url}`);
```

#### Update Issue

```javascript
await octokit.issues.update({
  owner: 'username',
  repo: 'repo-name',
  issue_number: 123,
  state: 'closed',
  body: 'Updated description'
});
```

#### List Issues

```javascript
const { data: issues } = await octokit.issues.listForRepo({
  owner: 'username',
  repo: 'repo-name',
  state: 'open', // 'open', 'closed', 'all'
  labels: 'bug',
  sort: 'created',
  direction: 'desc',
  per_page: 100
});
```

#### Create Pull Request

```javascript
const { data: pr } = await octokit.pulls.create({
  owner: 'username',
  repo: 'repo-name',
  title: 'PR title',
  body: 'PR description',
  head: 'feature-branch', // branch with changes
  base: 'main' // target branch
});

console.log(`PR #${pr.number}: ${pr.html_url}`);
```

### 5. Releases

#### Create Release

```javascript
const { data: release } = await octokit.repos.createRelease({
  owner: 'username',
  repo: 'repo-name',
  tag_name: 'v1.0.0',
  name: 'Version 1.0.0',
  body: 'Release notes here',
  draft: false,
  prerelease: false
});
```

#### List Releases

```javascript
const { data: releases } = await octokit.repos.listReleases({
  owner: 'username',
  repo: 'repo-name'
});
```

### 6. Organization Operations

#### List Repositories

```javascript
const { data: repos } = await octokit.repos.listForOrg({
  org: 'organization-name',
  type: 'all', // 'all', 'public', 'private'
  sort: 'updated',
  per_page: 100
});
```

#### Create Organization Repository

```javascript
const { data: repo } = await octokit.repos.createInOrg({
  org: 'organization-name',
  name: 'repo-name',
  description: 'Description',
  private: false
});
```

### 7. User Operations

#### Get Authenticated User

```javascript
const { data: user } = await octokit.users.getAuthenticated();
console.log(`Username: ${user.login}`);
console.log(`Name: ${user.name}`);
// Avoid printing personal account fields unless the task actually needs them.
```

#### List User Repositories

```javascript
const { data: repos } = await octokit.repos.listForAuthenticatedUser({
  visibility: 'all', // 'all', 'public', 'private'
  sort: 'updated',
  per_page: 100
});
```

## Pagination

For endpoints that return many results, use pagination:

```javascript
const iterator = octokit.paginate.iterator(octokit.repos.listForAuthenticatedUser, {
  per_page: 100
});

for await (const { data: repos } of iterator) {
  for (const repo of repos) {
    console.log(repo.name);
  }
}
```

Or get all at once:

```javascript
const allRepos = await octokit.paginate(octokit.repos.listForAuthenticatedUser);
console.log(`Total repos: ${allRepos.length}`);
```

## Error Handling

### Basic Error Handling

```javascript
try {
  const { data } = await octokit.repos.get({
    owner: 'username',
    repo: 'repo-name'
  });
} catch (error) {
  console.error('Error:', error.message);
  
  if (error.status === 404) {
    console.error('Repository not found');
  } else if (error.status === 401) {
    console.error('Authentication failed - check your token');
  } else if (error.status === 403) {
    console.error('Forbidden - insufficient permissions');
  }
  
  if (error.response) {
    console.error('HTTP status:', error.status); // Do not dump private response data.
  }
}
```

### Common Error Codes

- `401` - Bad credentials / invalid token
- `403` - Forbidden / rate limited / insufficient permissions
- `404` - Not found
- `422` - Validation failed / unprocessable entity
- `500` - Server error

### Rate Limiting

Check rate limit status:

```javascript
const { data: rateLimit } = await octokit.rateLimit.get();
console.log(`Remaining: ${rateLimit.rate.remaining}/${rateLimit.rate.limit}`);
console.log(`Reset: ${new Date(rateLimit.rate.reset * 1000)}`);
```

## Best Practices

### 1. Verify identity before authorized API execution

Offline review, parsing and stubbed tests need no token or authentication request. On the real CLI, even help/unknown commands authenticate first. For authorized API work, compare the returned login to the expected owner; a valid token alone is not the ownership check.

```javascript
async function verifyAuth(octokit) {
  try {
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login}`);
    return true;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    return false;
  }
}
```

### 2. Get SHA Before Updating Files

```javascript
async function updateFile(owner, repo, path, content, message) {
  // Get current file to get SHA
  const { data: currentFile } = await octokit.repos.getContent({
    owner,
    repo,
    path
  });
  
  // Update with SHA
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha: currentFile.sha
  });
}
```

### 3. Use Environment Variables for Tokens

**Never hardcode tokens!**

```javascript
// ✅ Good
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// ❌ Bad
const octokit = new Octokit({
  auth: 'ghp_hardcoded_token_here' // NEVER DO THIS!
});
```

### 4. Handle Pagination for Large Result Sets

```javascript
async function getAllRepos(octokit) {
  return await octokit.paginate(octokit.repos.listForAuthenticatedUser, {
    per_page: 100
  });
}
```

### 5. Batch Operations with Error Recovery

```javascript
async function updateMultipleFiles(files) {
  const results = [];
  
  for (const file of files) {
    try {
      const result = await updateFile(file.owner, file.repo, file.path, file.content, file.message);
      results.push({ success: true, file: file.path, result });
    } catch (error) {
      results.push({ success: false, file: file.path, status: error.status });
      // Stop: inspect partial results and revalidate the remaining approved plan.
      return results;
    }
  }
  
  return results;
}
```

## Complete Example Script

```javascript
#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');
const fs = require('fs');

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = 'username';
const repo = 'repo-name';
const filePath = 'README.md';

async function main() {
  try {
    // 1. Verify authentication
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login}`);
    
    // 2. Get current file
    console.log(`\n📥 Getting ${filePath}...`);
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath
    });
    console.log(`Current SHA: ${currentFile.sha}`);
    
    // 3. Read new content from local file
    const newContent = fs.readFileSync('./new-readme.md', 'utf8');
    
    // 4. Update file
    console.log(`\n📤 Updating ${filePath}...`);
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: 'Update README with new content',
      content: Buffer.from(newContent).toString('base64'),
      sha: currentFile.sha
    });
    
    console.log(`\n✅ Successfully updated ${filePath}`);
    console.log(`Commit: ${data.commit.html_url}`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('HTTP status:', error.status); // Do not dump private response data.
    }
    process.exit(1);
  }
}

main();
```

## Installation

Separate authorized setup only: inspect the repository's existing manifest and runtime compatibility first; do not install or upgrade dependencies to perform a documentation review. The alternative package commands below are examples, not a request to change the declared package manager or dependency range.

```bash
npm install @octokit/rest
# or
yarn add @octokit/rest
```

## TypeScript Support

Octokit has full TypeScript support:

```typescript
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Type-safe API calls
const { data: repo } = await octokit.repos.get({
  owner: 'username',
  repo: 'repo-name'
});

// repo is fully typed
console.log(repo.stargazers_count);
```

## Useful Links

- **Octokit Documentation:** https://octokit.github.io/rest.js/
- **GitHub REST API Docs:** https://docs.github.com/en/rest
- **Generate Token:** https://github.com/settings/tokens
- **Rate Limits:** https://docs.github.com/en/rest/rate-limit
- **Octokit GitHub:** https://github.com/octokit/rest.js

## Common Patterns

### Pattern: Update File in Repository

```javascript
async function updateRepoFile(owner, repo, path, content, message) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
  // Get current file for SHA
  const { data: currentFile } = await octokit.repos.getContent({
    owner,
    repo,
    path
  });
  
  // Update
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha: currentFile.sha
  });
  
  return data.commit.html_url;
}
```

### Pattern: Clone Repository Settings

```javascript
async function cloneSettings(sourceRepo, targetRepo) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
  // Get source repo settings
  const { data: source } = await octokit.repos.get({
    owner: 'username',
    repo: sourceRepo
  });
  
  // Apply to target
  await octokit.repos.update({
    owner: 'username',
    repo: targetRepo,
    description: source.description,
    homepage: source.homepage,
    has_issues: source.has_issues,
    has_wiki: source.has_wiki,
    has_projects: source.has_projects
  });
}
```

### Pattern: Bulk File Operations

```javascript
async function updateMultipleFiles(owner, repo, files) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const results = [];
  
  for (const file of files) {
    try {
      const url = await updateRepoFile(
        owner,
        repo,
        file.path,
        file.content,
        file.message
      );
      results.push({ success: true, path: file.path, url });
    } catch (error) {
      results.push({ success: false, path: file.path, status: error.status });
      // Stop: do not silently continue remote writes after a partial failure.
      return results;
    }
  }
  
  return results;
}
```

## Troubleshooting

### "Bad credentials" Error

- Check presence without printing the value: `node -e "console.log(process.env.GITHUB_TOKEN ? 'GITHUB_TOKEN is set' : 'GITHUB_TOKEN is missing')"`
- Verify the authenticated owner with a read-only request and check the required repository permissions.
- Do not infer validity from a prefix, print the token, or rotate/expand access automatically. Request the precise missing credential permission when needed.

### "Not Found" Error (404)

- Verify repository exists
- Check spelling of owner/repo names
- Ensure token has access to private repos (if applicable)
- Check if repository is in an organization you don't have access to

### "Validation Failed" Error (422)

- For file updates: Ensure SHA is provided and correct
- For branch creation: Check branch name doesn't already exist
- For PRs: Verify head and base branches exist

### Rate Limiting (403)

- Check rate limit: `octokit.rateLimit.get()`
- Limits vary by authentication and endpoint; inspect the actual rate-limit and retry headers.
- Respect reset/Retry-After and secondary limits. Stop or wait within the authorized task budget; do not rotate tokens or accounts to evade limits.

## Resources

- [github-manager.js](../../../github-manager.js) - Full implementation example
- [Octokit REST API Docs](https://octokit.github.io/rest.js/)
- [GitHub REST API Reference](https://docs.github.com/en/rest)
