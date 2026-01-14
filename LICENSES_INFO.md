# License Template - Official Sources

## Summary

Your **license_template** repository now uses official license texts from **SPDX** (Software Package Data Exchange), maintained by the Linux Foundation. This is the canonical/authoritative source for OSI-approved open source licenses.

## Verification

### MIT License
✅ **Perfect match** with SPDX official text
- Source: https://github.com/spdx/license-list-data/blob/main/text/MIT.txt
- Placeholders (`<year>`, `<copyright holders>`) correctly replaced with:
  - Year: 2026
  - Author: Jack Chidley

### Apache 2.0 License
✅ **Content matches** SPDX official text
- Source: https://github.com/spdx/license-list-data/blob/main/text/Apache-2.0.txt
- Note: Different line wrapping/formatting, but **legal text is identical**
- Both the compact (SPDX) and wrapped (common) formats are valid

## About SPDX

[SPDX](https://spdx.dev/) is:
- Maintained by the **Linux Foundation**
- The **ISO/IEC standard** (ISO/IEC 5962:2021) for software bill of materials
- Used by the **Open Source Initiative (OSI)** as the authoritative license text source
- Trusted by GitHub, npm, Maven Central, and other package repositories

## Files in license_template

1. **COPYRIGHT** - Your dual-license statement
2. **LICENSE-MIT** - Official MIT license from SPDX (with your details)
3. **LICENSE-APACHE** - Official Apache 2.0 license from SPDX
4. **README.md** - Copy of COPYRIGHT (as requested)

## Using the Template

```bash
# Create new repo from template
node github-manager.js create-from-template license_template my-new-project

# Or add dual-license to existing repo
node github-manager.js setup-dual-license my-existing-repo "Your Name"
```

## Why This Matters

1. **Legal certainty** - Using official texts ensures no accidental modifications
2. **Automation** - Can programmatically fetch latest license texts
3. **Recognition** - GitHub and other platforms recognize official license texts
4. **Best practice** - Following standards used by major projects (Rust, Linux, etc.)

## References

- SPDX License List: https://spdx.org/licenses/
- SPDX GitHub: https://github.com/spdx/license-list-data
- MIT License: https://opensource.org/licenses/MIT
- Apache 2.0: https://www.apache.org/licenses/LICENSE-2.0
