# Dual-Licensing in Major Non-Rust Projects

## Summary of Findings

Most major non-Rust projects are **NOT dual-licensed**. They typically use a single license:
- **MIT**: React, Vue.js, Angular, .NET Core, Electron
- **Apache-2.0**: TensorFlow, Kubernetes, Django (BSD)
- **BSD-3-Clause**: Go, PyTorch, Django
- **GPL/LGPL**: MySQL, MariaDB
- **MPL**: Servo (Mozilla Public License)

The **MIT + Apache-2.0 dual-licensing** pattern is **uniquely popular in the Rust ecosystem**.

## Exceptions: Projects with Dual-Licensing

### 1. **Qt** (GPL/LGPL + Commercial)

**Model:** Open-source (GPL-3.0/LGPL-3.0) OR Commercial License

**Structure:**
```
LICENSES/
  ├── GPL-3.0-only.txt
  ├── LGPL-3.0-only.txt
  ├── LicenseRef-Qt-Commercial.txt
  └── [many other third-party licenses]
```

**How it works:**
- Open source version: GPL-3.0 or LGPL-3.0 (user's choice)
- Commercial version: Proprietary Qt Company license
- Users choose based on their needs (GPL restrictions vs commercial terms)

**Commercial License Reference:**
```
Licensees holding valid commercial Qt licenses may use this software in
accordance with the terms contained in a written agreement between
you and The Qt Company.

For the latest licensing terms: https://www.qt.io/terms-conditions.
```

**Why this model:**
- GPL requires derivative works to also be GPL (copyleft)
- Companies unwilling to open-source can buy commercial license
- Sustains Qt Company's business model

### 2. **MySQL** (GPL + Commercial with FOSS Exception)

**Model:** GPL-2.0 with FOSS Exception OR Commercial License

**License file excerpt:**
```
This release of MySQL is released under version 2 of the GNU
General Public License (GPLv2), with the following additional
permissions:

This Connector is subject to the Universal FOSS Exception, version 1.0.

Copyright (c) 1997, 2025, Oracle and/or its affiliates.
```

**How it works:**
- Open source: GPL-2.0 + FOSS Exception (allows linking with other FOSS)
- Commercial: Oracle commercial license for proprietary use
- MySQL client library has additional FOSS Exception

**Why this model:**
- GPL ensures open-source stays open
- Commercial license for closed-source products
- Oracle's revenue model (acquired from Sun Microsystems)

### 3. **MariaDB** (Similar to MySQL)

**Model:** GPL-2.0 + Commercial

**How it works:**
- Fork of MySQL with similar licensing
- GPL for open source
- Commercial licenses available from MariaDB Corporation

## Single-License Projects (The Majority)

### Permissive Licenses (Most Common)

**MIT License:**
- **React** (Meta/Facebook)
- **Vue.js** (Evan You)
- **Angular** (Google)
- **.NET Core** (Microsoft)
- **Electron** (GitHub/Microsoft)

**Apache-2.0:**
- **TensorFlow** (Google)
- **Kubernetes** (CNCF/Google)

**BSD-3-Clause:**
- **Go** (Google)
- **PyTorch** (Meta/Facebook)
- **Django** (Django Software Foundation)

### Copyleft Licenses

**GPL/MPL:**
- **Servo** (Mozilla Public License 2.0)
- **Firefox** (Mozilla Public License)
- **MariaDB** (GPL-2.0)

## Key Insights

### 1. Rust Ecosystem is Unique

**MIT + Apache-2.0 dual-licensing is overwhelmingly Rust-specific:**

- rust-lang/rust
- serde
- clap
- tokio (actually MIT-only, but many use dual)
- Most Rust crates on crates.io

**Why Rust does this:**
- MIT: Simple, permissive, universally compatible
- Apache-2.0: Patent protection, explicit contribution terms
- User choice: Pick whichever fits your needs
- Historical: Influenced by Mozilla's practices

**Other ecosystems don't follow this pattern:**
- JavaScript: Usually just MIT
- Python: Usually just MIT or Apache-2.0
- Go: Usually BSD-3-Clause
- .NET: Usually just MIT

### 2. Commercial Dual-Licensing is Different

**Qt and MySQL use dual-licensing for business models:**

```
GPL/LGPL (free, but copyleft)
    OR
Commercial License (proprietary, paid)
```

**Purpose:**
- Protect open-source with copyleft
- Generate revenue from companies who can't/won't use GPL
- Sustainable business model

**Rust's dual-licensing is different:**

```
MIT (permissive)
    OR
Apache-2.0 (permissive with patent grant)
```

**Purpose:**
- Both licenses are permissive (no copyleft)
- User convenience (pick what works legally)
- Patent protection option (Apache-2.0)
- No commercial distinction

### 3. How Non-Rust Projects Document Licensing

**Single LICENSE file (most common):**
```
PROJECT/
├── LICENSE          # Contains the one license text
└── README.md        # Mentions license briefly
```

**Examples:**
- React: Just `LICENSE` (MIT)
- TensorFlow: Just `LICENSE` (Apache-2.0)
- Go: `LICENSE` (BSD-3-Clause)

**Multiple licenses (complex projects like Qt):**
```
PROJECT/
├── LICENSES/
│   ├── GPL-3.0-only.txt
│   ├── LGPL-3.0-only.txt
│   ├── MIT.txt
│   ├── Apache-2.0.txt
│   └── [many more for third-party code]
└── README
```

### 4. Rust's Pattern is More User-Friendly

**Rust ecosystem (dual MIT + Apache-2.0):**
- ✅ Both licenses are permissive
- ✅ No copyleft restrictions
- ✅ User can pick whichever fits their legal needs
- ✅ No money involved
- ✅ Patent protection available (Apache-2.0)

**Qt/MySQL (dual GPL + Commercial):**
- ⚠️ GPL is copyleft (restricts proprietary use)
- ⚠️ Must pay for commercial license if can't use GPL
- ⚠️ Creates two-tier user base
- ✅ Sustainable business model

## Comparison Table

| Project | License | Dual? | Purpose |
|---------|---------|-------|---------|
| **Rust** | MIT + Apache-2.0 | ✅ | User choice, patent protection |
| **Qt** | GPL/LGPL + Commercial | ✅ | Business model |
| **MySQL** | GPL + Commercial | ✅ | Business model |
| React | MIT | ❌ | Simple permissive |
| TensorFlow | Apache-2.0 | ❌ | Simple permissive |
| Go | BSD-3-Clause | ❌ | Simple permissive |
| PyTorch | BSD-3-Clause | ❌ | Simple permissive |
| Kubernetes | Apache-2.0 | ❌ | Simple permissive |
| .NET Core | MIT | ❌ | Simple permissive |
| Vue.js | MIT | ❌ | Simple permissive |
| Angular | MIT | ❌ | Simple permissive |
| Electron | MIT | ❌ | Simple permissive |
| Django | BSD-3-Clause | ❌ | Simple permissive |

## Why This Matters for Your Tool

### Your Implementation is Rust-Standard

Your `github-sdk-manager` follows the Rust ecosystem pattern:
- MIT + Apache-2.0 dual-licensing
- COPYRIGHT file with "Short version for non-lawyers"
- README with contribution clause
- Official SPDX license texts

**This is appropriate because:**
1. It's the standard in modern Rust projects
2. Both licenses are fully permissive
3. Users get patent protection option
4. Widely understood in the community

### If Targeting Other Ecosystems

**For JavaScript/Node.js projects:** Most use just MIT
**For Python projects:** Mix of MIT and Apache-2.0 (usually single)
**For Go projects:** Usually BSD-3-Clause
**For Commercial projects:** GPL + Commercial (like Qt/MySQL)

**Recommendation for github-sdk-manager:**

Keep the dual MIT + Apache-2.0 licensing because:
- ✅ It's a Node.js tool for Rust workflows
- ✅ You researched Rust projects (the target audience)
- ✅ It's more permissive than single-license
- ✅ Gives users legal flexibility
- ✅ Includes patent protection

## File Structure Comparison

### Rust Projects (Your Pattern)
```
LICENSE-MIT
LICENSE-APACHE
COPYRIGHT              # Explains dual-licensing
README.md              # License section + contribution clause
```

### Qt (Commercial Dual-License)
```
LICENSES/
  ├── GPL-3.0-only.txt
  ├── LGPL-3.0-only.txt
  ├── LicenseRef-Qt-Commercial.txt
  └── [many others]
README (minimal licensing info)
```

### Most Other Projects (Single License)
```
LICENSE               # One file, one license
README.md            # Brief mention
```

## Conclusion

**Rust's MIT + Apache-2.0 dual-licensing is relatively unique:**

1. **Not common** in other major ecosystems
2. **Different purpose** than commercial dual-licensing (Qt/MySQL)
3. **Both permissive** (unlike GPL + Commercial)
4. **User convenience** rather than business model
5. **Growing trend** but mostly in Rust

**Your implementation is correct for:**
- Rust ecosystem projects
- Tools that interact with Rust projects
- Modern open-source with patent protection concerns

**Commercial dual-licensing (GPL + Commercial) is appropriate for:**
- Companies selling software/support
- Projects needing copyleft protection
- Sustainable business models (Qt, MySQL)

Your choice of MIT + Apache-2.0 for `github-sdk-manager` is spot-on for a Rust ecosystem tool!
