/**
 * Basic jurisdiction-kit usage examples.
 *
 * Run: npx tsx examples/basic-lookup.ts
 */

import {
  getJurisdiction,
  getProfessionalBodies,
  canTransferData,
  getDigitalConsentAge,
  getAgeOfMajority,
  findJurisdictionsForProfession,
  getMutualRecognitionPartners,
  isProfessionRegulated,
  computeJurisdictionConfidence,
  rankJurisdictionsByConfidence,
  getAllLanguages,
  getJurisdictionsByLanguage,
  getJurisdictionCodes,
} from 'jurisdiction-kit'

// ---------------------------------------------------------------------------
// 1. Look up a jurisdiction
// ---------------------------------------------------------------------------

const gb = getJurisdiction('GB')
if (gb) {
  console.log('=== United Kingdom ===')
  console.log('Legal system:', gb.legalSystem)                       // 'common-law'
  console.log('Data protection:', gb.dataProtection.name)            // 'UK GDPR + DPA 2018'
  console.log('Breach notification:', gb.dataProtection.breachNotificationHours, 'hours') // 72
  console.log('E-signature recognised:', gb.eSignatureRecognised)    // true
  console.log('Professional bodies:', gb.professionalBodies.length)  // 21
  console.log()
}

// ---------------------------------------------------------------------------
// 2. Find professional bodies by country and profession
// ---------------------------------------------------------------------------

console.log('=== UK Legal Bodies ===')
const ukLawyers = getProfessionalBodies('GB', 'legal')
for (const body of ukLawyers) {
  console.log(`- ${body.name} (public register: ${body.hasPublicRegister})`)
}
console.log()

console.log('=== UK Accounting Bodies ===')
const ukAccountants = getProfessionalBodies('GB', 'accounting')
for (const body of ukAccountants) {
  console.log(`- ${body.name}`)
}
console.log()

// ---------------------------------------------------------------------------
// 3. Cross-border data transfer analysis
// ---------------------------------------------------------------------------

console.log('=== Data Transfer Mechanisms ===')

const transfers: [string, string][] = [
  ['FR', 'DE'],  // EU-internal
  ['FR', 'GB'],  // adequacy decision
  ['GB', 'AU'],  // mutual recognition
  ['US', 'BR'],  // no restrictions
  ['DE', 'IN'],  // safeguards required
  ['GB', 'GB'],  // domestic
]

for (const [from, to] of transfers) {
  const result = canTransferData(from, to)
  const notes = result.notes ? ` — ${result.notes}` : ''
  console.log(`${from} → ${to}: ${result.mechanism}${notes}`)
}
console.log()

// ---------------------------------------------------------------------------
// 4. Digital consent age and age of majority
// ---------------------------------------------------------------------------

console.log('=== Digital Consent Ages ===')
const jurisdictionsToCheck = ['GB', 'DE', 'US', 'IN', 'BR', 'KR', 'JP']
for (const code of jurisdictionsToCheck) {
  console.log(`${code}: digital consent ${getDigitalConsentAge(code)}, majority ${getAgeOfMajority(code)}`)
}
console.log()

// ---------------------------------------------------------------------------
// 5. Find all jurisdictions where a profession is regulated
// ---------------------------------------------------------------------------

console.log('=== Jurisdictions with Regulated Architecture ===')
const archJurisdictions = findJurisdictionsForProfession('architecture')
console.log(archJurisdictions.map(j => j.code).join(', '))
console.log()

// ---------------------------------------------------------------------------
// 6. Mutual recognition partners
// ---------------------------------------------------------------------------

console.log('=== Australia\'s Mutual Recognition Partners ===')
const auPartners = getMutualRecognitionPartners('AU')
console.log(auPartners.map(j => `${j.code} (${j.name})`).join(', '))
console.log()

// ---------------------------------------------------------------------------
// 7. Check if a specific profession is regulated
// ---------------------------------------------------------------------------

console.log('=== Profession Regulation Check ===')
const professions = ['legal', 'notary', 'social-work', 'veterinary'] as const
const codes = ['GB', 'US', 'AE', 'SA']
for (const code of codes) {
  for (const profession of professions) {
    const regulated = isProfessionRegulated(code, profession)
    if (regulated) {
      console.log(`${code}: ${profession} is regulated`)
    }
  }
}
console.log()

// ---------------------------------------------------------------------------
// 8. Jurisdiction confidence scoring
// ---------------------------------------------------------------------------

console.log('=== Top 5 Jurisdictions by Confidence Score ===')
const ranked = rankJurisdictionsByConfidence()
for (const entry of ranked.slice(0, 5)) {
  console.log(`${entry.code}: ${entry.score}/100`)
  console.log(`  bodies: ${entry.breakdown.professionalBodyCoverage}, registers: ${entry.breakdown.publicRegisterAvailability}, digital: ${entry.breakdown.digitalCredentialIssuance}`)
}
console.log()

const gbConfidence = computeJurisdictionConfidence('GB')
if (gbConfidence) {
  console.log('=== GB Confidence Breakdown ===')
  console.log('Overall score:', gbConfidence.score)
  console.log('Breakdown:', gbConfidence.breakdown)
  console.log()
}

// ---------------------------------------------------------------------------
// 9. Language lookup
// ---------------------------------------------------------------------------

console.log('=== Spanish-Speaking Jurisdictions ===')
const spanishJurisdictions = getJurisdictionsByLanguage('es')
console.log(spanishJurisdictions.map(j => `${j.code} (${j.name})`).join(', '))
console.log()

console.log('=== All Covered Languages ===')
const languages = getAllLanguages()
console.log(languages.join(', '))
console.log()

// ---------------------------------------------------------------------------
// 10. All jurisdiction codes
// ---------------------------------------------------------------------------

console.log('=== All Jurisdiction Codes ===')
console.log(getJurisdictionCodes().join(', '))
console.log(`Total: ${getJurisdictionCodes().length} jurisdictions`)
