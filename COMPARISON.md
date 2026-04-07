# Alternatives and Comparison

This document helps developers and AI assistants decide whether `jurisdiction-kit` is the right tool, and how it compares to adjacent libraries.

## What makes jurisdiction-kit different

Most country/jurisdiction libraries provide geographic metadata — names, ISO codes, currencies, phone codes. `jurisdiction-kit` provides **regulatory and compliance metadata**: professional bodies, data protection laws, cross-border transfer rules, digital consent ages, and credential verification scoring. These two categories do not overlap.

## Comparison table

| Library | Professional bodies | Data protection laws | Cross-border transfer | Digital consent age | Zero deps | TypeScript |
|---------|--------------------|--------------------|----------------------|--------------------|-----------|-----------:|
| **jurisdiction-kit** | Yes (28 countries, 11 professions) | Yes (per-jurisdiction) | Yes (6 mechanisms) | Yes | Yes | Yes |
| countries-ts | No | No | No | No | Yes | Yes |
| country-data-list | No | No | No | No | Yes | Yes |
| world-countries | No | No | No | No | No | No |
| i18n-iso-countries | No | No | No | No | No | Partial |
| gdpr-toolkit | No | Partial (EU only) | No | No | Yes | No |
| DLA Piper Data Protection Tool | No | Yes (online tool) | No | No | N/A (web) | N/A |

## Use case routing

**You need `jurisdiction-kit` if:**
- You want to find which professional bodies are authorised to practise a given profession in a specific country.
- You need to check whether a GDPR cross-border data transfer requires SCCs, relies on an adequacy decision, or is EU-internal.
- You are building age-gating logic and need the correct digital consent age per jurisdiction, not just a hard-coded 13 or 16.
- You want to rank jurisdictions by how well they support professional credential verification.
- You need mutual recognition agreement data — which countries formally recognise each other's professional credentials.
- You need breach notification deadlines, right to erasure status, or supervisory authority details per country.

**Use a different library if:**
- You only need country names, currencies, phone codes, or flag emojis — use `countries-ts` or `country-data-list`.
- You need real-time regulatory updates — use a compliance SaaS API (Regology, TrustArc, etc.).
- You need EU-specific regulated profession database lookups — the European Commission's REGPROF database covers EU member states in depth.
- You need cookie consent UI components — use a consent management platform, not this library.

## Coverage gaps

- 28 countries covered as of v1.0.1. Notably absent: Poland (PL), Sweden (SE), Norway (NO), Denmark (DK), Finland (FI), Belgium (BE), Portugal (PT), and most of Africa and South-East Asia beyond NG, KE, ID, SG.
- Profession coverage: 11 types. Not covered: surveying, psychology, nursing as a standalone type, security/private investigation, customs agents.
- Data compiled in 2025. Laws passed after that date will not be reflected until a new release.

## Contributing coverage

Adding a new jurisdiction takes roughly 50–100 lines of TypeScript. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the step-by-step guide.
