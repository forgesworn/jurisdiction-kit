# Contributing

## Getting started

```bash
git clone https://github.com/forgesworn/jurisdiction-kit.git
cd jurisdiction-kit
npm install
npm test
```

## How jurisdiction data is structured

All jurisdiction data lives in `src/jurisdictions.ts`. Each jurisdiction is an entry in the `JURISDICTIONS` record, keyed by ISO 3166-1 alpha-2 code. The record is frozen at module scope to prevent accidental mutation.

A jurisdiction entry contains:

- **Core metadata** — code, English name, local name, legal system, languages, currency.
- **Professional bodies** — an array of `ProfessionalBody` objects (id, name, nameEn, profession type, website, public register, digital credentials).
- **Data protection law** — a `DataProtectionLaw` object (law name, year enacted, consent rules, breach notification, erasure/portability rights, cross-border restrictions, supervisory authority).
- **Child protection** — a `ChildProtectionLaw` object (digital consent age, age of majority, parental consent, enhanced protections, profiling restrictions).
- **Mutual recognition** — ISO codes of jurisdictions with formal credential recognition agreements.
- **E-signature status** — boolean flag for whether electronic signatures are legally recognised.

Professional body arrays are defined as constants above the `JURISDICTIONS` record (e.g. `UK_BODIES`, `US_BODIES`) and referenced in jurisdiction entries.

## Adding a new jurisdiction

1. Define a typed professional bodies array for the country.
2. Define `DataProtectionLaw` and `ChildProtectionLaw` objects.
3. Add the entry to `JURISDICTIONS` using the ISO 3166-1 alpha-2 code as key.
4. Run `npm run typecheck` — the compiler will catch any missing required fields.
5. Add a row for the new jurisdiction to the **Covered jurisdictions** table in `README.md`.
6. Run `npm test` — the data integrity test automatically validates all jurisdictions.

## Code style

- **TypeScript strict mode** — all code must pass `tsc --noEmit` with strict enabled.
- **British English** — use colour, normalise, licence, recognise, authorise in comments, docs, and identifiers.
- **Zero runtime dependencies** — do not add any. The library must remain dependency-free.
- **Single source file** — all types, data, and query functions live in `src/jurisdictions.ts`. The barrel export is `src/index.ts`.
- **Frozen exports** — `JURISDICTIONS` is frozen with `Object.freeze`. Do not remove this safeguard.

## Commit conventions

Commits follow the `type: description` format. The type determines whether a release is triggered:

| Type | Purpose | Triggers release? |
|------|---------|-------------------|
| `feat:` | New feature or jurisdiction | Yes (minor) |
| `fix:` | Bug fix | Yes (patch) |
| `docs:` | Documentation only | No |
| `refactor:` | Code restructuring, no behaviour change | No |
| `chore:` | Tooling, CI, housekeeping | No |
| `test:` | Test additions or changes | No |

Do **not** include `Co-Authored-By` lines in commit messages.

## Pull request workflow

1. Create a feature branch from `main` (e.g. `feat/add-pl-jurisdiction`).
2. Make your changes and ensure all checks pass:
   ```bash
   npm run typecheck
   npm test
   ```
3. Commit with a descriptive message following the conventions above.
4. Open a PR against `main`. The CI pipeline runs build, typecheck, and tests automatically.
5. Once approved and merged, semantic-release handles versioning and npm publication.

## Testing expectations

- All 54 existing tests must continue to pass.
- New jurisdictions are automatically covered by the data integrity test, which validates all required fields on every jurisdiction entry.
- New query functions should have dedicated test cases covering happy path, edge cases, and unknown jurisdiction handling.
- Run the full suite with `npm test` before pushing.

## Licence

By contributing, you agree that your contributions will be licensed under the MIT licence.
