# CLAUDE.md — jurisdiction-kit

## What this is

Zero-dependency TypeScript library providing professional body registries, data protection law details, and jurisdiction intelligence for 28 countries. Published as `jurisdiction-kit` on npm via semantic-release.

## Architecture

Single-source-file library:

- `src/jurisdictions.ts` — all types, data, and query functions in one file. The `JURISDICTIONS` constant is a frozen `Record<string, Jurisdiction>` containing 28 country entries, each with professional bodies, data protection laws, child protection rules, mutual recognition partners, and metadata.
- `src/index.ts` — re-exports everything from `jurisdictions.ts`.
- `tests/jurisdictions.test.ts` — 54 tests (vitest) covering all query functions and data integrity.

## How jurisdiction data is structured

Each jurisdiction entry contains:
- **Core metadata:** ISO 3166-1 alpha-2 code, English name, local name, legal system type, languages (ISO 639-1), currency (ISO 4217).
- **Professional bodies:** Array of `ProfessionalBody` objects — id, name, abbreviation, profession type, website, public register availability, digital credential issuance.
- **Data protection law:** `DataProtectionLaw` object — law name, year, consent requirements, breach notification hours, erasure/portability rights, cross-border restrictions, supervisory authority.
- **Child protection:** `ChildProtectionLaw` object — digital consent age, age of majority, parental consent requirements, enhanced protections, profiling restrictions.
- **Mutual recognition:** Array of ISO codes for jurisdictions with formal credential recognition agreements.
- **E-signature recognition:** Boolean flag.

Professional body definitions are declared as typed arrays (e.g. `UK_BODIES`, `US_BODIES`) above the `JURISDICTIONS` constant, then referenced in jurisdiction entries.

## Build and test

```bash
npm install
npm run build        # tsc → dist/
npm run typecheck    # tsc --noEmit
npm test             # vitest run (54 tests)
```

## Conventions

- **British English** — colour, normalise, licence, recognise, authorise.
- **Commit messages** — `type: description` format (e.g. `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
- **No Co-Authored-By lines** in commits.
- **Branching** — work on feature/fix branches, merge to main only when complete. Semantic-release auto-publishes on push to main.
- **Zero runtime dependencies** — the library must stay dependency-free.
- **Single source file** — all jurisdiction data and query functions live in `src/jurisdictions.ts`. Do not split into multiple files unless there is a strong reason.
- **JURISDICTIONS is frozen** — `Object.freeze(JURISDICTIONS)` is called at module scope. Do not remove this.

## Adding a new jurisdiction

1. Define the professional bodies array (e.g. `const XX_BODIES: ProfessionalBody[] = [...]`).
2. Define data protection and child protection objects.
3. Add the entry to the `JURISDICTIONS` record.
4. Add test coverage in `tests/jurisdictions.test.ts` — at minimum, verify the jurisdiction loads and has required fields (the data integrity test covers this automatically).

## Query functions

All query functions accept ISO 3166-1 alpha-2 codes and are case-insensitive. Unknown jurisdiction codes return `undefined`, empty arrays, or safe defaults (never throw).

## GitHub

- **Org:** forgesworn
- **Repo:** `https://github.com/forgesworn/jurisdiction-kit`
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — build, typecheck, test on Node 24.
- **Publishing:** semantic-release with OIDC npm provenance.
