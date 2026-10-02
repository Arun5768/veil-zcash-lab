# Veil / Zcash integration lab

A local-first, five-page Zcash payment-request diagnostics prototype by Arun Pratap Singh Chandel / The Origin Guild, developed with AI assistance. Designed as pre-application proof of work, not as a grant-funded result.

Public source: [Arun5768/veil-zcash-lab](https://github.com/Arun5768/veil-zcash-lab).

Web demo: [Veil on GitHub Pages](https://arun5768.github.io/veil-zcash-lab/).

## What it does

- Inspects a public transparent, Sapling or revision-0 Unified Address.
- Parses the ZEC subset of ZIP-321: multiple recipients, labels, messages, exact zatoshi amounts and base64url memos.
- Composes requests and renders QR codes locally, with no wallet-launch action.
- Rehearses receiver selection (Orchard, Sapling, transparent) against explicitly hypothetical sender capabilities.
- Runs reproducible reference/negative tests and exports actual diagnostic evidence.

Routes: `#inspect`, `#compose`, `#receivers`, `#tests`, `#about`.

## Run locally

Requires Node.js 20.19+ (tested with 24.13). Dependencies are pinned in package-lock.json.

```sh
npm ci
npm test
npm run build
npm run dev
```

Open http://127.0.0.1:8797. `node scripts/report.mjs` writes a timestamped test report. `dist/` is the self-contained static output. No external API, wallet, authentication or analytics required. A hosted demo runs exactly the same client-side checks; hosting does not add chain connectivity or wallet functionality.

## Scope and evidence

The shared Node/browser suite has 116 checks: 60 official Unified Address fixtures, 12 F4Jumble forward/inverse reference checks and 44 specification-example, composition, policy, boundary and negative checks. See `evidence/test-report.json` for the actual latest local run.

Official fixture source: https://github.com/zcash/zcash-test-vectors at commit `78321beacb0e0477e33cd002b56585a107c2708c`. Only public receiver/address fields are retained; seed/key fields are omitted. Upstream licenses are in `src/fixtures/`. `scripts/import-vectors.mjs` reproduces this import from the pinned commit.

Encoding/checksum success does **not** verify curve-point validity, key ownership, funds, wallet interoperability, transaction privacy or settlement. Receiver selection is a simulation, not a test of named wallets. No signing, broadcast, zk-SNARK verification, indexer, mainnet transaction or on-chain traction is implemented or claimed.

Version 0.1 intentionally does not support revision-2 Unified Addresses, custom assets (`req-asset`), Sprout or viewing keys. Unknown optional query parameters are reported and ignored; unknown required parameters are rejected. Unknown receiver types are displayed and never selected. Resource limits are 32 KB/request, 32 parsed recipients, 8 composed recipients and 4096 F4Jumble bytes. It is a bounded ZIP-316/321 subset, not a full current-spec implementation.

## Architecture and privacy

`src/core.js` contains the pure decoder/parser/policy functions. Hashing and base encodings use @noble/hashes and @scure/base; F4Jumble orchestration is implemented here and checked against reference vectors. `src/suite.js` is shared by Node and browser. `src/app.js` renders the five routes with escaped user data. QR creation uses the local qrcode package. Optional WebMCP actions share visible app state and cannot pay or publish.

All request inputs remain in memory. No browser storage, remote address submission or telemetry. Clear resets the inspector; reload resets all state. Explicit downloads/clipboard actions may contain addresses and memo text. Public reference addresses must never be funded. Do not paste seed phrases or keys.

The local server applies a restrictive Content Security Policy, no-referrer and nosniff headers. `dist/_headers` carries policies for hosts that support that format. GitHub Pages does not apply this file; the HTML therefore also includes a restrictive CSP and no-referrer policy. Header-only protections such as `frame-ancestors` and Permissions-Policy are not provided by that meta tag. The app does not use camera, microphone or location APIs.

The app does not transmit entered requests. GitHub receives the ordinary static-page/asset requests and may log visitor IP addresses for security, as described in [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection).

Deployment uses the root of the `gh-pages` branch, which contains only the built `dist/` files. Three additional hosting checks validate project-path assets, HTML policies and the no-Jekyll marker. Updates are published deliberately, not on every source change. Public deployment and grant submission remain separate approvals.

## Suggested 5-minute demonstration

1. Inspect the published Sapling testnet request and show exact zatoshis/memo bytes.
2. Click Broken checksum: the decoder stops and explains why.
3. Switch to Unified Address, then inspect the receiver bytes.
4. In Receiver paths, disable Orchard and Sapling: strict mode blocks transparent fallback.
5. In Request studio, build a small test request and inspect the result; do not pay it.
6. Run Proof lab and export the actual test evidence.

## Next validation gates

Obtain review from an experienced Zcash implementer; expand adversarial address-structure coverage; compare against independent maintained implementations; test named wallets on testnet with consenting testers; validate the workflow need with developers. None of those outcomes are claimed as complete. A qualified Zcash technical lead is still required for transaction-building workshops in the grant programme.

Primary specifications: https://zips.z.cash/zip-0316 and https://zips.z.cash/zip-0321. Independent work, not endorsed by Zcash, ZCG or a wallet team. No security audit.
