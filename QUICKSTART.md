# GitHub SDK Manager: Inspect Before Writing

Start with read-only inspection. The [README effect table](README.md#approval-and-data-boundaries) is the command and approval reference. Write commands run immediately, with no built-in preview, confirmation, or rollback.

## Local prerequisites

Use the canonical checkout. If setting up a new checkout is authorized, clone it on the intended OS's normal Git filesystem, inspect `package.json`, and install its declared dependencies with `npm install`. Do not install dependencies merely to review documentation. The declared `npm test` is a failing placeholder, not a passing test suite.

The source uses CommonJS `require('@octokit/rest')` while the manifest selects `^21.0.2`. Verify the installed package/runtime combination before claiming CLI compatibility; this guide does not establish a successful installed-runtime test.

## Offline guidance checks

Run `node --check github-manager.js` and `node --test test-guidance.cjs` from this repository's root. Even `--help` or an unknown command enters authentication in the real CLI, so neither is an offline check. These checks load the source with a fake SDK and forbidden network access, then inspect generated README/help text. They require no token or installed Octokit and do not validate real API behavior. The placeholder `npm test` remains separate and failing.

## Authentication and read-only checks

Use an already approved `GITHUB_TOKEN` provisioned into the consuming process by the machine's credential helper. Do not paste tokens into commands, save them in `.bashrc`, print them, or assume a particular prefix proves validity. Credential creation and expanded permissions need separate approval.

```bash
# Shows presence only, not the value.
node -e "console.log(process.env.GITHUB_TOKEN ? 'GITHUB_TOKEN is set' : 'GITHUB_TOKEN is missing')"

# Read-only API calls, once prerequisites and authentication are available.
node github-manager.js list
node github-manager.js info REPOSITORY_NAME
```

Replace `REPOSITORY_NAME` with the intended repository. Both commands print an authentication banner. `list` prints human-readable lines, not JSON; `info` prints a banner followed by JSON. Do not pipe either directly into a JSON parser or derive a bulk-write target list from its display text. Listing currently reads at most one page of 100 repositories and may include repositories owned by other accounts. Methods target the authenticated username; copying names from that display can target the wrong owner. A successful login is not verification of the intended owner.

## Prepare a write plan

Before running a write command or generated SDK script:

1. Establish the authenticated owner and explicit target repositories, visibility, and branches. CLI creation defaults to public; `clone-settings` also copies visibility.
2. Inspect the exact implementation and current target contents/settings. Prepare intended payloads and expected base/file SHAs without writing. Rust/licence setup overwrites files, not just missing sections; topics are replaced.
3. Present the concrete plan and exclusions for approval. Include remote commits, settings changes, licence choice, and any partial-failure risk. For bulk work, enumerate the batch instead of executing a loop over every discovered repository.
4. Recheck expected identity and state, then verify that the chosen execution path can enforce the approved payload/base and account policy. The current manager cannot pin an approved SPDX payload, accepts the latest file SHA rather than an approved base, and does not disable Actions. If those requirements apply, do not run its mutating CLI: stop for separately scoped implementation work. Stop on drift, missing prerequisites or partial failure; preserve completed results before preparing any retry.
5. Verify the remote result. A command's output alone does not establish that all requested files/settings are correct.

Do not execute a setup command just to learn which files it writes. The README lists those files. `setup-dual-license` re-fetches mutable upstream text after any manual preflight; independent prior inspection does not bind what the command writes. Both setup commands replace README wholesale, so chaining them loses the earlier README contents. Empty source topics in `clone-settings` do not clear target topics. A 404 from `createFile` is not a proven absence check; its catch also covers failed updates.

## Troubleshooting

- **Authentication failure:** check token presence without revealing it, then verify account/repository permissions through a read-only call. Request the precise missing access; do not silently create or rotate credentials.
- **404:** verify owner, repository, branch/path, and access. Do not treat every 404 as permission to create or overwrite something.
- **Rate limiting:** inspect actual rate-limit/Retry-After headers; respect reset and secondary limits. Stop or wait within the task budget, rather than switch tokens or accounts to evade limits.
- **Partial setup:** inspect the actual remote files/settings and prepare an updated, bounded plan. Do not repeat all writes blindly.

## References

- [README](README.md): effect table and implementation entrypoint
- [API skill](.claude/skills/github-api/SKILL.md): illustrative Octokit fragments and safety boundaries
- [Licence context](LICENSES_INFO.md): retained historical verification, not a live payload check
- [Octokit documentation](https://octokit.github.io/rest.js/)
- [GitHub API documentation](https://docs.github.com/en/rest)
