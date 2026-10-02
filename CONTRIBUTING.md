# Contributing to Veil

Veil is an independent JavaScript education prototype, not a Zcash-maintained wallet. Review the scope in README.md and SECURITY.md before proposing work.

Our primary contribution-process reference is [librustzcash CONTRIBUTING](https://github.com/zcash/librustzcash/blob/main/CONTRIBUTING.md#styleguides). Apply its emphasis on reproducibility, focused reviewable changes, clear commit history and careful handling of security findings. Its Rust-specific style rules are not claimed to apply directly to this JavaScript project. Contributions to an upstream project must follow that project's own rules.

## Before changing code

- Describe a real user problem and a minimal reproduction using public test data.
- Check existing behavior and known limitations. Unsupported revisions must not be silently treated as supported.
- Cite the applicable ZIP section and preserve the distinction between encoding, ownership, receiver policy and settlement.
- Do not submit secrets or private transaction data. Follow SECURITY.md for sensitive findings.

## Implementation and review

- Keep protocol functions pure in src/core.js; use established dependencies for hash/base primitives.
- Add a failing regression case before changing parser behavior. Include boundaries, invalid encodings, network mismatches and resource limits as relevant.
- Document fixture provenance, pin the reference commit, and retain upstream license notices. Do not import unnecessary seed/key fields.
- Preserve exact integer arithmetic for amounts. Do not convert zatoshis through floating point.
- Escape untrusted content. No hidden network requests, analytics, transaction actions or persistent input storage.
- Use descriptive names and focused commits. Keep refactors separate from behavior changes. Explain AI assistance and what was independently tested.

## Before a proposed release

Run npm ci, npm test, npm run build, and node scripts/report.mjs. Test the visible input/error/export flows, verify any browser-native tools, check keyboard and responsive layouts, and retain actual test evidence. A reviewer should reproduce results from a clean checkout. Protocol support expansion requires experienced Zcash review and independent interoperability checks, not only self-authored tests.

All changes need owner review. Public deployment, repository publication and grant submission require Arun's explicit approval. A passing test suite is not a security audit or release approval. Preserve MIT licensing for original work and all dependency/fixture notices.
