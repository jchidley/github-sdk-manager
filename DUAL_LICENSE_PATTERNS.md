# Dual-License Patterns in Major Open Source Projects

## Summary of Research

Analyzed how major Rust and open source projects handle dual-licensing (MIT/Apache-2.0).

## Common Patterns

### Files Structure

Most projects use these files:
- `LICENSE-MIT` - Full MIT license text
- `LICENSE-APACHE` - Full Apache 2.0 license text  
- `COPYRIGHT` - Optional, used by Rust project to explain licensing
- `README.md` - License section at bottom

### Cargo.toml Convention

```toml
license = "MIT OR Apache-2.0"
```

This is the standard Rust ecosystem format (SPDX expression).

## Examples from Major Projects

### 1. **Rust Lang** (rust-lang/rust)

**Files:** `LICENSE-MIT`, `LICENSE-APACHE`, `COPYRIGHT`

**COPYRIGHT** (their approach):
```
Short version for non-lawyers:

The Rust Project is dual-licensed under Apache 2.0 and MIT terms.

Longer version:

Copyrights in the Rust project are retained by their contributors...
[Details about copyright retention and contribution]

Except as otherwise noted, Rust is licensed under the Apache License, Version
2.0 <LICENSE-APACHE> or <http://www.apache.org/licenses/LICENSE-2.0> or the MIT
license <LICENSE-MIT> or <http://opensource.org/licenses/MIT>, at your option.
```

**README.md:**
```markdown
## License

Rust is primarily distributed under the terms of both the MIT license and the
Apache License (Version 2.0), with portions covered by various BSD-like
licenses.

See [LICENSE-APACHE](LICENSE-APACHE), [LICENSE-MIT](LICENSE-MIT), and
[COPYRIGHT](COPYRIGHT) for details.
```

### 2. **Serde** (serde-rs/serde)

**Files:** `LICENSE-MIT`, `LICENSE-APACHE`

**README.md:**
```markdown
#### License

Licensed under either of Apache License, Version 2.0 or MIT license at your option.

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in Serde by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
```

**Cargo.toml:** `license = "MIT OR Apache-2.0"`

### 3. **Clap** (clap-rs/clap)

**Files:** `LICENSE-MIT`, `LICENSE-APACHE`

**Cargo.toml:** `license = "MIT OR Apache-2.0"`

### 4. **Tokio** (tokio-rs/tokio)

**Files:** Single `LICENSE` file (MIT only, interestingly)

**Cargo.toml:** `license = "MIT"`

(Tokio is MIT-only, not dual-licensed)

### 5. **Ripgrep** (BurntSushi/ripgrep)

**README.md:**
```markdown
Dual-licensed under MIT or the UNLICENSE.
```

(Uses UNLICENSE instead of Apache-2.0 - a more permissive choice)

### 6. **Alacritty** (alacritty/alacritty)

**Files:** `LICENSE-MIT`, `LICENSE-APACHE`

**Cargo.toml:** `license = "Apache-2.0"` (only lists Apache in Cargo.toml, but has both files)

**README.md:**
```markdown
## License

Alacritty is released under the Apache License, Version 2.0.
```

## Key Insights

### What's Standard:

1. **Files:**
   - `LICENSE-MIT` - Official SPDX MIT text
   - `LICENSE-APACHE` - Official SPDX Apache 2.0 text
   - Optional `COPYRIGHT` file (Rust project uses this)

2. **Cargo.toml:**
   - `license = "MIT OR Apache-2.0"` (SPDX expression)

3. **README.md License Section:**
   - Brief statement about dual-licensing
   - Links to license files
   - Contribution clause (from Apache-2.0 Section 5)

### Best Practice (Rust Ecosystem):

Following the **Rust project's style** is most respected:

**COPYRIGHT:**
```
Short version for non-lawyers:

This project is dual-licensed under Apache 2.0 and MIT terms.

Longer version:

Copyright (c) [YEAR] [AUTHOR]

Except as otherwise noted (below and/or in individual files), this project is
licensed under the Apache License, Version 2.0 <LICENSE-APACHE> or
<http://www.apache.org/licenses/LICENSE-2.0> or the MIT license <LICENSE-MIT>
or <http://opensource.org/licenses/MIT>, at your option.
```

**README.md:**
```markdown
## License

This project is dual-licensed under the terms of both the MIT license and the
Apache License (Version 2.0).

See [LICENSE-APACHE](LICENSE-APACHE), [LICENSE-MIT](LICENSE-MIT), and
[COPYRIGHT](COPYRIGHT) for details.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this project by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.
```

## Why Dual-License MIT/Apache-2.0?

This combination is popular in Rust because:

1. **MIT** - Simple, permissive, compatible with everything
2. **Apache-2.0** - Provides patent protection and explicit contribution terms
3. **User Choice** - Downstream users pick which license works better for them
4. **Rust Convention** - It's the standard in the ecosystem

## Implementation

Our `github-manager.js` now follows this best practice:

```bash
# Creates COPYRIGHT, README.md, LICENSE-MIT, LICENSE-APACHE
node github-manager.js setup-dual-license my-project "Your Name"
```

All license texts are fetched from **SPDX** (official source).
