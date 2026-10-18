# jurisdiction-kit

**Nostr:** [`npub1mgvlrnf5hm9yf0n5mf9nqmvarhvxkc6remu5ec3vf8r0txqkuk7su0e7q2`](https://njump.me/npub1mgvlrnf5hm9yf0n5mf9nqmvarhvxkc6remu5ec3vf8r0txqkuk7su0e7q2)

[![npm version](https://img.shields.io/npm/v/jurisdiction-kit)](https://www.npmjs.com/package/jurisdiction-kit)
[![CI](https://github.com/forgesworn/jurisdiction-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/forgesworn/jurisdiction-kit/actions/workflows/ci.yml)
[![licence](https://img.shields.io/npm/l/jurisdiction-kit)](./LICENSE)
![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/TheCryptoDonkey?logo=githubsponsors&color=ea4aaa&label=Sponsor)](https://github.com/sponsors/TheCryptoDonkey)

Professional body registries, data protection law details, and jurisdiction intelligence for 28 countries — zero dependencies, fully typed.

## Why this exists

Building compliance-aware software means tracking professional body registrations, data protection laws, digital consent ages, breach notification deadlines, and cross-border data transfer rules across dozens of jurisdictions. That information is scattered across government registries, regulatory authority websites, and expensive compliance APIs — and it changes constantly.

**jurisdiction-kit** packages that data into a single, curated, zero-dependency TypeScript library. Query it like a database: look up a country's professional bodies, look up the recorded data transfer mechanism between two jurisdictions, or rank jurisdictions by how well they support credential verification.

This is a **developer tool, not a compliance oracle**. The data is static, compiled from publicly available sources, and will lag behind legislative changes. Always verify current requirements with the relevant regulatory authority or a qualified legal professional before making production compliance decisions.

## Install

```bash
npm install jurisdiction-kit
```

ESM only, with no CommonJS build: use `import`, not `require()`. The compiled output uses nothing newer than ES2020 syntax, so it runs on Node 14 or later (`engines` in `package.json` says the same) or through a bundler. It is developed and tested on Node 24, and the test tooling needs Node 22.12 or later, so older versions are untested.

## Quick start

```typescript
import {
  getJurisdiction,
  getProfessionalBodies,
  canTransferData,
  getDigitalConsentAge,
  findJurisdictionsForProfession,
} from 'jurisdiction-kit';

// Look up a jurisdiction. The return type is Jurisdiction | undefined,
// so narrow it before use (required under `strict`).
const gb = getJurisdiction('GB');
if (!gb) throw new Error('GB is not in the dataset');
console.log(gb.name);                    // 'United Kingdom'
console.log(gb.dataProtection.name);     // 'UK GDPR + DPA 2018'
console.log(gb.legalSystem);             // 'common-law'

// Find professional bodies by country and profession
const ukLawyers = getProfessionalBodies('GB', 'legal');
// → [
//     { name: 'The Law Society of England and Wales', hasPublicRegister: true, ... },
//     { name: 'Law Society of Scotland', hasPublicRegister: true, ... },
//     { name: 'Law Society of Northern Ireland', hasPublicRegister: true, ... },
//     { name: 'Bar Standards Board', hasPublicRegister: true, ... },
//   ]

// Look up the data transfer mechanism between two jurisdictions.
// `allowed: true` means the dataset has a mechanism for the pair, not that
// the transfer is lawful. See canTransferData below.
const transfer = canTransferData('FR', 'GB');
// → { allowed: true, mechanism: 'adequacy-decision' }

const transferToIndia = canTransferData('DE', 'IN');
// → { allowed: true, mechanism: 'safeguards-required',
//     notes: 'Requires Standard Contractual Clauses (SCCs) or equivalent safeguards.' }

// Digital consent age for age-gating
console.log(getDigitalConsentAge('DE'));  // 16
console.log(getDigitalConsentAge('BR'));  // 12
console.log(getDigitalConsentAge('GB'));  // 13

// Find all jurisdictions where a profession is regulated
const medJurisdictions = findJurisdictionsForProfession('medical');
// → Array of Jurisdiction objects (most countries regulate medicine)
```

## Covered jurisdictions

| Code | Country | Legal system | Data protection law | Bodies |
|------|---------|-------------|-------------------|--------|
| AE | United Arab Emirates | mixed | PDPL (2021) | 7 |
| AR | Argentina | civil-law | PDPL (2000) | 6 |
| AU | Australia | common-law | Privacy Act 1988 | 8 |
| BR | Brazil | civil-law | LGPD (2018) | 9 |
| CA | Canada | common-law | PIPEDA (2000) | 9 |
| CN | China | civil-law | PIPL (2021) | 7 |
| DE | Germany | civil-law | GDPR (2016) | 8 |
| ES | Spain | civil-law | GDPR (2016) | 8 |
| FR | France | civil-law | GDPR (2016) | 9 |
| GB | United Kingdom | common-law | UK GDPR + DPA 2018 | 21 |
| HK | Hong Kong | common-law | PDPO (1996) | 7 |
| ID | Indonesia | civil-law | PDP Law (2022) | 6 |
| IE | Ireland | common-law | GDPR (2016) | 8 |
| IL | Israel | mixed | PPL (1981) | 6 |
| IN | India | common-law | DPDPA 2023 | 9 |
| IT | Italy | civil-law | GDPR (2016) | 8 |
| JP | Japan | civil-law | APPI (2003) | 8 |
| KE | Kenya | mixed | DPA 2019 | 6 |
| KR | South Korea | civil-law | PIPA (2011) | 7 |
| MX | Mexico | civil-law | LFPDPPP (2010) | 7 |
| NG | Nigeria | mixed | NDPA 2023 | 7 |
| NL | Netherlands | civil-law | GDPR (2016) | 7 |
| NZ | New Zealand | common-law | Privacy Act 2020 | 7 |
| SA | Saudi Arabia | religious | PDPL (2021) | 6 |
| SG | Singapore | common-law | PDPA (2012) | 8 |
| TR | Turkey | civil-law | KVKK (2016) | 6 |
| US | United States | common-law | CCPA/CPRA (2018) | 9 |
| ZA | South Africa | mixed | POPIA (2013) | 8 |

## API reference

All functions accept ISO 3166-1 alpha-2 codes and are **case-insensitive**. Unknown jurisdiction codes return `undefined`, empty arrays, or safe defaults — never throw.

### Data lookup

#### `getJurisdiction(code: string): Jurisdiction | undefined`

Returns the full jurisdiction object, or `undefined` for unknown codes. The object is the live entry in `JURISDICTIONS`, not a copy: see [`JURISDICTIONS`](#jurisdictions-recordstring-jurisdiction) for what is and is not frozen.

```typescript
const sg = getJurisdiction('SG');
if (sg) {
  // sg.name === 'Singapore'
  // sg.currency === 'SGD'
  // sg.eSignatureRecognised === true
}
```

#### `getJurisdictionCodes(): string[]`

Returns all available jurisdiction codes.

```typescript
const codes = getJurisdictionCodes();
// → ['GB', 'US', 'FR', 'DE', 'ES', 'IT', 'NL', 'CA', ...]
```

#### `getProfessionalBodies(code: string, profession?: ProfessionType): ProfessionalBody[]`

Returns professional bodies for a jurisdiction, optionally filtered by profession. Returns `[]` for unknown codes.

```typescript
const accountants = getProfessionalBodies('GB', 'accounting');
// → [{ name: 'Institute of Chartered Accountants in England and Wales', ... },
//    { name: 'Association of Chartered Certified Accountants', ... }]
```

#### `getMutualRecognitionPartners(code: string): Jurisdiction[]`

Returns jurisdictions that have mutual recognition agreements with the given jurisdiction. This is the professional credential recognition list. Two things to know: the lists are one-directional (a jurisdiction can list a partner that does not list it back), and a list can name codes that are not among the 28 covered jurisdictions, which this function drops. `canTransferData` also reads this list, see below.

```typescript
const partners = getMutualRecognitionPartners('AU');
// → [Jurisdiction(NZ), Jurisdiction(GB), Jurisdiction(CA), Jurisdiction(SG), Jurisdiction(HK)]
```

#### `isProfessionRegulated(code: string, profession: ProfessionType): boolean`

Checks whether a profession type has any registered bodies in the jurisdiction.

```typescript
isProfessionRegulated('GB', 'notary');  // true
isProfessionRegulated('US', 'notary');  // true
```

#### `findJurisdictionsForProfession(profession: ProfessionType): Jurisdiction[]`

Returns all jurisdictions where a profession is regulated.

```typescript
const architectureJurisdictions = findJurisdictionsForProfession('architecture');
// → Array of Jurisdiction objects
```

### Age and consent

#### `getDigitalConsentAge(code: string): number`

Minimum age for digital services without parental consent. Returns **16** for unknown jurisdictions (the GDPR default).

This reads `childProtection.minAgeDigitalConsent`. It does not read `dataProtection.digitalConsentAge`, which is a separate field with the same description. In this release the two hold the same value for all 28 jurisdictions, but nothing in the types or tests forces that, so they could diverge in a later data update. Use this function, or `childProtection.minAgeDigitalConsent`, when you need the figure that `getDigitalConsentAge` would return.

```typescript
getDigitalConsentAge('GB');  // 13
getDigitalConsentAge('DE');  // 16
getDigitalConsentAge('IN');  // 18
getDigitalConsentAge('XX');  // 16 (unknown — defaults to GDPR baseline)
```

#### `getAgeOfMajority(code: string): number`

Legal age of majority. Returns **18** for unknown jurisdictions.

```typescript
getAgeOfMajority('GB');  // 18
getAgeOfMajority('KR');  // 19
getAgeOfMajority('SG');  // 21
getAgeOfMajority('XX');  // 18 (unknown — safe default)
```

### Data transfer

#### `canTransferData(from: string, to: string): { allowed: boolean; mechanism?: string; notes?: string }`

Looks up the mechanism the dataset associates with moving personal data from `from` to `to`.

**This is a lookup, not legal clearance.** `allowed` is `false` only when either code is unknown. For every pair of known jurisdictions it is `true`, including `safeguards-required`, where a transfer is lawful only if the safeguards are actually in place. Read `mechanism` for the information, treat `allowed` as "the dataset has an answer for this pair", and verify with the relevant regulatory authority or a qualified legal professional before relying on it.

**Direction matters.** The rules are read from the source jurisdiction, so swapping the arguments can change the result (`canTransferData('FR', 'GB')` is `adequacy-decision`, `canTransferData('GB', 'FR')` is `safeguards-required`).

**Precedence.** The first rule that matches wins:

1. Either code unknown: `{ allowed: false, notes: 'Unknown jurisdiction' }`, whichever argument is the unknown one.
2. Same code: `domestic`.
3. The source's `dataProtection.crossBorderRestrictions` is `false`: `no-restrictions`. The destination is not consulted. In this release only `US` and `CA` have no restrictions recorded.
4. Both codes are EU/EEA members: `eu-internal`.
5. The source is an EU/EEA member and the destination is on the dataset's EU adequacy list (annotated in the source as of 2024): `adequacy-decision`. Adequacy is only checked for EU/EEA sources.
6. The destination appears in the source's `mutualRecognition` list: `mutual-recognition`.
7. Anything else: `safeguards-required`, with `notes` set to `'Requires Standard Contractual Clauses (SCCs) or equivalent safeguards.'`.

```typescript
canTransferData('FR', 'DE');  // { allowed: true, mechanism: 'eu-internal' }
canTransferData('FR', 'GB');  // { allowed: true, mechanism: 'adequacy-decision' }
canTransferData('GB', 'FR');  // { allowed: true, mechanism: 'safeguards-required', notes: '...' }
canTransferData('GB', 'AU');  // { allowed: true, mechanism: 'mutual-recognition' }
canTransferData('US', 'BR');  // { allowed: true, mechanism: 'no-restrictions' }
canTransferData('BR', 'US');  // { allowed: true, mechanism: 'safeguards-required', notes: '...' }
canTransferData('DE', 'IN');  // { allowed: true, mechanism: 'safeguards-required', notes: '...' }
canTransferData('GB', 'GB');  // { allowed: true, mechanism: 'domestic' }
canTransferData('GB', 'XX');  // { allowed: false, notes: 'Unknown jurisdiction' }
canTransferData('XX', 'GB');  // { allowed: false, notes: 'Unknown jurisdiction' }
```

| Mechanism | Meaning |
|-----------|---------|
| `domestic` | Same jurisdiction, so no cross-border transfer |
| `eu-internal` | Both parties are EU/EEA member states |
| `adequacy-decision` | Source is an EU/EEA member and the destination is on the dataset's EU adequacy list |
| `mutual-recognition` | The destination is in the source's `mutualRecognition` list. That list records professional credential recognition arrangements; it is not a data-transfer treaty. The dataset reuses it as a middle tier, so this value is a heuristic and not evidence of any data-transfer instrument |
| `no-restrictions` | The dataset records no outbound transfer restrictions for the source jurisdiction. The destination is ignored |
| `safeguards-required` | Fallback: a transfer needs SCCs or equivalent safeguards |

The return type declares `mechanism` as `string | undefined`. No union type for it is exported, so the compiler will not check a comparison against a misspelt mechanism. The six values above are the complete set the function can return today; `mechanism` is `undefined` only when `allowed` is `false`.

### Language

#### `getAllLanguages(): string[]`

Returns a sorted array of all unique ISO 639-1 language codes across jurisdictions.

```typescript
getAllLanguages();
// → ['af', 'ar', 'ca', 'de', 'en', 'es', 'eu', 'fr', 'ga', 'gl', ...]
```

#### `getJurisdictionsByLanguage(lang: string): Jurisdiction[]`

Returns jurisdictions that list the given language. Case-insensitive.

```typescript
const frenchSpeaking = getJurisdictionsByLanguage('fr');
// → [Jurisdiction(FR), Jurisdiction(CA)]
```

### Confidence scoring

Score jurisdictions by how well their professional bodies and legal framework support credential verification. Scale: 0–100.

#### `computeJurisdictionConfidence(code: string): JurisdictionConfidence | undefined`

Returns a full breakdown with sub-scores. Returns `undefined` for unknown codes.

```typescript
const confidence = computeJurisdictionConfidence('GB');
// → {
//     code: 'GB',
//     score: 80,
//     breakdown: {
//       professionalBodyCoverage: 20,
//       publicRegisterAvailability: 20,
//       digitalCredentialIssuance: 0,
//       dataProtectionMaturity: 15,
//       mutualRecognition: 5,
//       eSignatureRecognition: 10,
//       legalSystemScore: 10,
//     }
//   }
```

#### `getJurisdictionConfidence(code: string): number`

Returns just the numeric score. Returns **0** for unknown jurisdictions.

```typescript
getJurisdictionConfidence('GB');  // 80
getJurisdictionConfidence('XX');  // 0
```

#### `rankJurisdictionsByConfidence(): JurisdictionConfidence[]`

Returns all jurisdictions ranked by confidence score, highest first.

```typescript
const ranked = rankJurisdictionsByConfidence();
// ranked[0].code === 'GB', ranked[0].score === 80
```

### Exported constants

#### `JURISDICTIONS: Record<string, Jurisdiction>`

The full jurisdiction dataset. The top-level record is frozen with `Object.freeze`, which is **shallow**. Adding, removing or reassigning a country entry fails (a `TypeError` in strict mode, silently ignored otherwise), but each `Jurisdiction` and everything inside it (`professionalBodies`, `dataProtection`, `childProtection`, `mutualRecognition`, `languages`) is **not** frozen.

`getJurisdiction`, `getProfessionalBodies` (without a profession filter) and the other lookups return those same live objects, not copies. Mutating a result changes the data every other caller in the same process sees, and nothing prevents it. Treat everything the library returns as read-only, and take a copy before changing anything.

```typescript
import { JURISDICTIONS } from 'jurisdiction-kit';

Object.keys(JURISDICTIONS).length;  // 28
JURISDICTIONS['GB'].name;           // 'United Kingdom'
// With `noUncheckedIndexedAccess` enabled, JURISDICTIONS['GB'] is possibly undefined: narrow it first.
```

## Types

### `Jurisdiction`

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | ISO 3166-1 alpha-2 code |
| `name` | `string` | Country name in English |
| `nameLocal` | `string` | Country name in local language |
| `legalSystem` | `LegalSystem` | Legal system classification |
| `languages` | `string[]` | ISO 639-1 language codes |
| `currency` | `string` | ISO 4217 currency code |
| `professionalBodies` | `ProfessionalBody[]` | Regulated professional bodies |
| `dataProtection` | `DataProtectionLaw` | Data protection legislation |
| `childProtection` | `ChildProtectionLaw` | Child data protection rules |
| `eSignatureRecognised` | `boolean` | Whether e-signatures are legally recognised |
| `mutualRecognition` | `string[]` | ISO codes of jurisdictions with professional credential recognition agreements. One-directional, and may name codes outside the 28 covered. Also read by `canTransferData` (see above) |
| `notes` | `string?` | Additional context |

### `ProfessionalBody`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Short identifier (e.g. `'law-society-ew'`) |
| `name` | `string` | Full name in original language |
| `nameEn` | `string?` | Full name in English (if different) |
| `profession` | `ProfessionType` | Profession type |
| `website` | `string` | Official website URL |
| `hasPublicRegister` | `boolean` | Whether the body maintains a searchable public register |
| `registerUrl` | `string?` | URL of the public register |
| `issuesDigitalCredentials` | `boolean` | Whether the body issues digital credentials |
| `notes` | `string?` | Additional context |

### `DataProtectionLaw`

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Short name (e.g. `'GDPR'`) |
| `fullName` | `string` | Full legislative name |
| `year` | `number` | Year enacted |
| `requiresExplicitConsent` | `boolean` | Whether explicit consent is required for data processing |
| `digitalConsentAge` | `number` | Minimum age for digital consent without parental approval. Not read by `getDigitalConsentAge`, which uses `ChildProtectionLaw.minAgeDigitalConsent`. Equal to it for every jurisdiction in this release, but not enforced |
| `breachNotificationHours` | `number` | Breach notification deadline in hours (`0` = no requirement) |
| `rightToErasure` | `boolean` | Right to erasure / right to be forgotten |
| `rightToPortability` | `boolean` | Data portability right |
| `crossBorderRestrictions` | `boolean` | Whether cross-border transfers are restricted |
| `maxRetentionDays` | `number` | Maximum retention period in days (`0` = no specific limit) |
| `supervisoryAuthority` | `string` | Supervisory authority name |
| `notes` | `string?` | Additional context |

### `ChildProtectionLaw`

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Law name |
| `minAgeDigitalConsent` | `number` | Minimum age for digital services without parental consent. This is the field `getDigitalConsentAge` returns |
| `ageOfMajority` | `number` | Legal age of majority |
| `requiresParentalConsent` | `boolean` | Whether verifiable parental consent is required |
| `enhancedProtections` | `boolean` | Whether child data requires enhanced protections |
| `profilingRestrictions` | `boolean` | Whether there are specific rules about profiling children |

### `JurisdictionConfidence`

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | ISO 3166-1 alpha-2 code |
| `score` | `number` | Overall confidence score (0–100) |
| `breakdown.professionalBodyCoverage` | `number` | 0–20 points (1 per body, capped) |
| `breakdown.publicRegisterAvailability` | `number` | 0–20 points (proportion with public registers) |
| `breakdown.digitalCredentialIssuance` | `number` | 0–15 points (proportion issuing digital credentials) |
| `breakdown.dataProtectionMaturity` | `number` | 0–15 points (composite of data protection features) |
| `breakdown.mutualRecognition` | `number` | 0–10 points (1 per partner, capped) |
| `breakdown.eSignatureRecognition` | `number` | 0 or 10 points |
| `breakdown.legalSystemScore` | `number` | 0–10 points (common-law/civil-law score highest) |

### Union types

```typescript
type LegalSystem = 'common-law' | 'civil-law' | 'mixed' | 'religious' | 'customary';

type ProfessionType =
  | 'legal'        // lawyers, solicitors, barristers
  | 'medical'      // doctors, dentists, nurses, opticians, osteopaths, chiropractors
  | 'notary'       // notaries public
  | 'accounting'   // chartered accountants, CPAs, auditors
  | 'engineering'  // chartered/professional engineers
  | 'teaching'     // teachers, educators
  | 'financial'    // financial advisers, actuaries
  | 'veterinary'   // veterinary surgeons
  | 'pharmacy'     // pharmacists
  | 'architecture' // architects
  | 'social-work'; // social workers
```

## Data methodology and limitations

- **Sources**: publicly available government registries, official regulatory authority websites, and legal databases.
- **Currency**: data was compiled in 2025 and reflects legislation as of then. No exact as-of date is stored in the data, and entries carry no per-entry verification date. The one dated marker in the code is the EU adequacy list behind `canTransferData`, annotated in the source as of 2024. Laws change, bodies merge, consent ages get amended, so always verify with the relevant regulatory authority for production decisions.
- **Releases**: [CHANGELOG.md](./CHANGELOG.md) (included in the npm package) lists each release with its date. It is generated from commit subjects, so it tells you which release you have and when it was made; it is not a field-by-field record of data changes.
- **Coverage**: 28 countries, weighted towards common-law and EU/EEA jurisdictions. Not exhaustive — if you need a jurisdiction that isn't here, contributions are welcome.
- **Professional bodies**: covers 11 profession types across major regulated professions. Smaller or jurisdiction-specific professions may be absent.
- **Bundle size**: the full dataset is always included (~3,400 lines of source). This is not tree-shakeable: the data IS the library.

## Law notes

Alongside the dataset, [`law/`](./law/README.md) holds written-up research on the law that applies to publishing software and running online services. Each note is dated, marks every claim by how it was checked, and lists what to watch.

| Jurisdiction | Note |
|--------------|------|
| GB | [Running an online service](./law/gb/online-services.md): Online Safety Act, data protection, device storage, investigatory powers, export control, trading rules |

The notes are not part of the npm package. They are research, not legal advice.

### Agent skill

[`skill/`](./skill/SKILL.md) is a skill for Claude Code and Codex that applies the notes to a project, so the research is read and not repeated. It inventories what a project runs and ships, says which regimes apply, drafts or checks the project's legal documents, and updates a note when one is due.

Install it from a checkout of this repository, by symlink, so it stays beside the notes it reads:

```bash
ln -s "$(pwd)/skill" ~/.claude/skills/legal-cover
ln -s "$(pwd)/skill" ~/.codex/skills/legal-cover
ln -s "$(pwd)/skill/assets/claude-agent/legal-cover-opus.md" ~/.claude/agents/legal-cover-opus.md
```

The last line gives Claude Code an agent that runs the skill on Opus at medium effort, which is the tier the skill was tried on and is written for.

Without an agent, the script is useful on its own:

```bash
skill/scripts/law-notes.sh status                          # every note, its dates, whether it is due
skill/scripts/law-notes.sh section gb/online-services 2.6  # one section
skill/scripts/project-inventory.sh /path/to/project        # what a project runs, ships and contacts
```

## Disclaimer

This library is provided for **informational purposes only** and does not constitute legal advice. Regulatory frameworks, professional body registrations, data protection laws, and mutual recognition agreements change frequently. Always verify current requirements with the relevant regulatory authority or qualified legal professional before making compliance decisions. The maintainers accept no liability for actions taken based on this data.

## Contributing

Adding a new jurisdiction is straightforward — define the professional bodies, data protection law, and child protection objects, add the entry to the `JURISDICTIONS` record, and the data integrity tests catch any missing fields automatically. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

## Part of the ForgeSworn Toolkit

[ForgeSworn](https://forgesworn.dev) builds open-source cryptographic identity, payments, and coordination tools for Nostr.

| Library | What it does |
|---------|-------------|
| [nsec-tree](https://github.com/forgesworn/nsec-tree) | Deterministic sub-identity derivation |
| [ring-sig](https://github.com/forgesworn/ring-sig) | SAG/LSAG ring signatures on secp256k1 |
| [range-proof](https://github.com/forgesworn/range-proof) | Pedersen commitment range proofs |
| [canary-kit](https://github.com/forgesworn/canary-kit) | Coercion-resistant spoken verification |
| [spoken-token](https://github.com/forgesworn/spoken-token) | Human-speakable verification tokens |
| [toll-booth](https://github.com/forgesworn/toll-booth) | L402 payment middleware |
| [geohash-kit](https://github.com/forgesworn/geohash-kit) | Geohash toolkit with polygon coverage |
| [nostr-attestations](https://github.com/forgesworn/nostr-attestations) | NIP-VA verifiable attestations |
| [dominion](https://github.com/forgesworn/dominion) | Epoch-based encrypted access control |
| [nostr-veil](https://github.com/forgesworn/nostr-veil) | Privacy-preserving Web of Trust |

## Licence

MIT
