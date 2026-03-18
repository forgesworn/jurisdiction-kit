export {
  // Types
  type LegalSystem,
  type ProfessionType,
  type ProfessionalBody,
  type DataProtectionLaw,
  type ChildProtectionLaw,
  type Jurisdiction,
  type JurisdictionConfidence,
  // Data
  JURISDICTIONS,
  // Functions
  getJurisdiction,
  getJurisdictionCodes,
  getProfessionalBodies,
  getMutualRecognitionPartners,
  isProfessionRegulated,
  findJurisdictionsForProfession,
  getDigitalConsentAge,
  getAgeOfMajority,
  canTransferData,
  getAllLanguages,
  getJurisdictionsByLanguage,
  computeJurisdictionConfidence,
  getJurisdictionConfidence,
  rankJurisdictionsByConfidence,
} from './jurisdictions.js';
