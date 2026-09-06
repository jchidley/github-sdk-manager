// Offline generated-guidance checks: SDK calls and network access are forbidden.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, 'github-manager.js'), 'utf8');
function load({ cli = false, token } = {}) {
  const output = [];
  const module = { exports: {} };
  const requireStub = (id) => {
    if (id === '@octokit/rest') return { Octokit: class {
      constructor() { this.users = { getAuthenticated: async () => ({ data: { login: 'synthetic-owner' } }) }; }
    } };
    if (['fs', 'path', 'https'].includes(id)) return new Proxy({}, {
      get() { throw new Error(`Unexpected ${id} access`); },
    });
    throw new Error(`Unexpected import: ${id}`);
  };
  // The module reads fs.promises at load time but never uses it in these cases.
  const requireSafe = (id) => id === 'fs' ? { promises: {} } : requireStub(id);
  requireSafe.main = cli ? module : {};
  const context = { require: requireSafe, module, Buffer, console: {
    log: (...args) => output.push(args.join(' ')),
    error: (...args) => output.push(args.join(' ')),
  }, process: { env: { GITHUB_TOKEN: token }, argv: ['node', 'github-manager.js'],
    exit: (code) => { throw new Error(`exit:${code}`); } } };
  vm.runInNewContext(source, context);
  return { Manager: module.exports, output, context };
}

test('generated Rust README does not direct global machine configuration', async () => {
  const { Manager } = load();
  const manager = new Manager('synthetic-not-a-secret');
  const files = new Map();
  manager.createFile = async (_repo, path, _message, content) => files.set(path, content);
  await manager.setupRustProject('synthetic-project');
  assert.equal(files.size, 5);
  assert.match(files.get('README.md'), /project-local/);
  assert.match(files.get('README.md'), /do not change global Cargo settings automatically/);
  assert.doesNotMatch(files.get('README.md'), /~\/\.cargo\/config/);
});

test('CLI help names immediate writes and visibility/overwrite effects', async () => {
  const { output } = load({ cli: true, token: 'synthetic-not-a-secret' });
  await new Promise((resolve) => setImmediate(resolve));
  const text = output.join('\n');
  assert.match(text, /write immediately without preview/);
  assert.match(text, /Creation defaults to public/);
  assert.match(text, /setup overwrites/);
  assert.doesNotMatch(text, /synthetic-not-a-secret/);
});
