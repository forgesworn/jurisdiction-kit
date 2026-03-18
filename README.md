# jurisdiction-kit

Professional body registries and jurisdiction intelligence for 30+ countries.

Compliance checking, data protection rules, mutual recognition, cross-border data transfer analysis, and professional body lookups — all in a zero-dependency TypeScript package.

## Install

```bash
npm install jurisdiction-kit
```

## Use cases

- **Legal-tech compliance checking** — determine which professional bodies are authorised to practice in a given jurisdiction
- **KYC jurisdictional intelligence** — look up data protection law, digital consent age, and breach notification requirements by country
- **Cross-border data transfer analysis** — check whether a data transfer is permitted under GDPR adequacy decisions, mutual recognition agreements, or requires additional safeguards
- **Professional body lookups** — find regulated bodies by country and profession (legal, medical, accounting, architecture, and more)
- **Age verification rules** — retrieve digital consent age and age of majority per jurisdiction
- **Mutual recognition** — discover which jurisdictions have formal credential recognition agreements

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
console.log(gb.name);                          // 'United Kingdom'
console.log(gb.dataProtection.name);           // 'UK GDPR'
console.log(gb.dataProtection.digitalConsentAge); // 13

// Find professional bodies
const ukLawyers = getProfessionalBodies('GB', 'legal');
// → [{ name: 'The Law Society of England and Wales', ... }, ...]

// Check data transfer legality
const transfer = canTransferData('FR', 'GB');
// → { allowed: true, mechanism: 'adequacy-decision' }

// Jurisdictions where a profession is regulated
const medJurisdictions = findJurisdictionsForProfession('medical');
// → Array of 15+ Jurisdiction objects

// Age rules
console.log(getDigitalConsentAge('DE')); // 16
```

## Covered jurisdictions

30+ countries including: GB, US, AU, CA, NZ, IE, FR, DE, IT, ES, NL, BE, PT, AT, SE, DK, FI, NO, CH, JP, KR, SG, HK, IN, AE, IL, BR, MX, ZA.

## API

| Function | Returns |
|---|---|
| `getJurisdiction(code)` | `Jurisdiction \| undefined` |
| `getJurisdictionCodes()` | `string[]` |
| `getProfessionalBodies(code, profession?)` | `ProfessionalBody[]` |
| `getMutualRecognitionPartners(code)` | `Jurisdiction[]` |
| `isProfessionRegulated(code, profession)` | `boolean` |
| `findJurisdictionsForProfession(profession)` | `Jurisdiction[]` |
| `getDigitalConsentAge(code)` | `number` |
| `getAgeOfMajority(code)` | `number` |
| `canTransferData(from, to)` | `{ allowed: boolean; mechanism: string; notes?: string }` |
| `getAllLanguages()` | `string[]` |
| `getJurisdictionsByLanguage(lang)` | `Jurisdiction[]` |
| `getJurisdictionConfidence(code, context)` | `JurisdictionConfidence` |
| `rankJurisdictionsByConfidence(codes, context)` | `JurisdictionConfidence[]` |

## Profession types

`legal` · `medical` · `accounting` · `architecture` · `engineering` · `financial` · `education` · `notary` · `social-work`

## Data protection mechanisms (canTransferData)

| Mechanism | Meaning |
|---|---|
| `domestic` | Same jurisdiction — no transfer |
| `eu-internal` | Both parties are EU member states |
| `adequacy-decision` | Destination has EU adequacy status |
| `mutual-recognition` | Formal bilateral recognition agreement |
| `safeguards-required` | Transfer allowed but additional safeguards needed |
| `no-restrictions` | Source jurisdiction has no outbound restrictions |

## Licence

MIT
