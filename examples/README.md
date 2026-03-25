# Examples

## basic-lookup.ts

Demonstrates the core jurisdiction-kit API:

- Looking up a jurisdiction by ISO code
- Finding professional bodies by country and profession type
- Checking cross-border data transfer mechanisms (GDPR adequacy, SCCs, mutual recognition)
- Retrieving digital consent ages and age of majority per jurisdiction
- Finding all jurisdictions where a profession is regulated
- Checking mutual recognition partners
- Confidence scoring and ranking jurisdictions
- Language-based jurisdiction lookup

### Run

```bash
# From the repository root
npm run build
npx tsx examples/basic-lookup.ts
```

Or with a local build already in place:

```bash
node --input-type=module < examples/basic-lookup.ts
```
