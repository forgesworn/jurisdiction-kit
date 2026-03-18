# jurisdiction-kit

[![npm version](https://img.shields.io/npm/v/jurisdiction-kit)](https://www.npmjs.com/package/jurisdiction-kit)
[![CI](https://github.com/forgesworn/jurisdiction-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/forgesworn/jurisdiction-kit/actions/workflows/ci.yml)
[![licence](https://img.shields.io/npm/l/jurisdiction-kit)](./LICENSE)
![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

Professional body registries, data protection law details, and jurisdiction intelligence for 28 countries — zero dependencies, fully typed.

## Why this exists

Building compliance-aware software means tracking professional body registrations, data protection laws, digital consent ages, breach notification deadlines, and cross-border data transfer rules across dozens of jurisdictions. That information is scattered across government registries, regulatory authority websites, and expensive compliance APIs — and it changes constantly.

**jurisdiction-kit** packages that data into a single, curated, zero-dependency TypeScript library. Query it like a database: look up a country's professional bodies, check whether a data transfer between two jurisdictions is permitted, or rank jurisdictions by how well they support credential verification.

This is a **developer tool, not a compliance oracle**. The data is static, compiled from publicly available sources, and will lag behind legislative changes. Always verify current requirements with the relevant regulatory authority or a qualified legal professional before making production compliance decisions.

## Install

```bash
npm install jurisdiction-kit
```

ESM only — requires Node 14+ or a bundler.

## Quick start

```typescript
import {
  getJurisdiction,
  getProfessionalBodies,
  canTransferData,
  getDigitalConsentAge,
  findJurisdictionsForProfession,
} from 'jurisdiction-kit';

// Look up a jurisdiction
const gb = getJurisdiction('GB');
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

// Check cross-border data transfer mechanism
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

Returns the full jurisdiction object, or `undefined` for unknown codes.

```typescript
const sg = getJurisdiction('SG');
// sg.name === 'Singapore'
// sg.currency === 'SGD'
// sg.eSignatureRecognised === true
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

Returns jurisdictions that have mutual recognition agreements with the given jurisdiction.

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

Determines the legal mechanism for a cross-border data transfer. Returns `{ allowed: false }` only for unknown jurisdictions — all known transfers have a mechanism, though some require additional safeguards.

```typescript
canTransferData('FR', 'DE');  // { allowed: true, mechanism: 'eu-internal' }
canTransferData('FR', 'GB');  // { allowed: true, mechanism: 'adequacy-decision' }
canTransferData('GB', 'AU');  // { allowed: true, mechanism: 'mutual-recognition' }
canTransferData('US', 'BR');  // { allowed: true, mechanism: 'no-restrictions' }
canTransferData('DE', 'IN');  // { allowed: true, mechanism: 'safeguards-required', notes: '...' }
```

| Mechanism | Meaning |
|-----------|---------|
| `domestic` | Same jurisdiction — no transfer |
| `eu-internal` | Both parties are EU/EEA member states |
| `adequacy-decision` | Destination has an EU adequacy decision |
| `mutual-recognition` | Formal bilateral recognition agreement |
| `no-restrictions` | Source jurisdiction has no outbound data transfer restrictions |
| `safeguards-required` | Transfer permitted but requires SCCs or equivalent safeguards |

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

The full jurisdiction dataset. Frozen with `Object.freeze` — read-only at runtime.

```typescript
import { JURISDICTIONS } from 'jurisdiction-kit';

Object.keys(JURISDICTIONS).length;  // 28
JURISDICTIONS['GB'].name;           // 'United Kingdom'
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
| `mutualRecognition` | `string[]` | ISO codes of jurisdictions with recognition agreements |
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
| `digitalConsentAge` | `number` | Minimum age for digital consent without parental approval |
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
| `minAgeDigitalConsent` | `number` | Minimum age for digital services without parental consent |
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
- **Currency**: data was compiled in 2025 and reflects legislation as of that date. Laws change, bodies merge, consent ages get amended — always verify with the relevant regulatory authority for production decisions.
- **Coverage**: 28 countries, weighted towards common-law and EU/EEA jurisdictions. Not exhaustive — if you need a jurisdiction that isn't here, contributions are welcome.
- **Professional bodies**: covers 11 profession types across major regulated professions. Smaller or jurisdiction-specific professions may be absent.
- **Bundle size**: the full frozen dataset is always included (~3,400 lines of source). This is not tree-shakeable — the data IS the library.

## Disclaimer

This library is provided for **informational purposes only** and does not constitute legal advice. Regulatory frameworks, professional body registrations, data protection laws, and mutual recognition agreements change frequently. Always verify current requirements with the relevant regulatory authority or qualified legal professional before making compliance decisions. The maintainers accept no liability for actions taken based on this data.

## Contributing

Adding a new jurisdiction is straightforward — define the professional bodies, data protection law, and child protection objects, add the entry to the `JURISDICTIONS` record, and the data integrity tests catch any missing fields automatically. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

## Licence

MIT
