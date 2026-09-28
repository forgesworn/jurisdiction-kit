# Law notes

Written-up research on the law that applies to publishing software and
running online services, one note per jurisdiction and subject. They exist
so that the same research is done once, kept current in one place, and
linked from each project that relies on it.

These notes sit beside the typed dataset in `src/jurisdictions.ts`. They are
not part of the npm package and nothing in the library reads them.

**They are research notes, not legal advice.** No lawyer has reviewed them.
Use them to find the right question and the right statute, then check the
statute or ask a solicitor before relying on an answer.

## Index

| Jurisdiction | Note | Verified | Review by |
|---|---|---|---|
| GB | [Running an online service](gb/online-services.md) | 28 September 2026 | 28 March 2027 |

## Evidence marks

Every claim of law carries a mark saying how it was checked.

| Mark | Meaning |
|---|---|
| `[P]` | Primary. The statute on legislation.gov.uk, or the regulator's own page, read on the verified date |
| `[S]` | Secondary. A law firm, press report or parliamentary summary |
| `[U]` | Unchecked. General knowledge or a reading of the text, not confirmed against a source for this note |

A `[P]` mark says the text was read. It does not say the reading is right.
Where a note interprets a provision, it says so.

## Using a note in a project

1. Answer the scoping questions at the top of the note. They decide which
   sections apply.
2. Read those sections, and the watch list.
3. Write the project's own position in the project's repository: what it
   runs, which regimes it treats as applying, and what it has done about
   each. Link to the note for the law; do not copy the law across.
4. Keep facts about the project out of these notes. A note says what the
   law is. A project's documents say how the project meets it.

## Keeping a note current

- Re-read a section's sources before changing its verified date. Change the
  date only for what was re-read.
- When a watch list item moves, update the section it belongs to and remove
  it from the list.
- Add a line to the note's change log for every change of substance.
- A note past its review date is still the best starting point. Treat its
  `[S]` and `[U]` claims as leads, and its `[P]` claims as likely but dated.

## Adding a note

One file per jurisdiction and subject, at `law/<iso code>/<subject>.md`,
with the code in lower case. Follow the shape of the GB note: a header table
with the dates, scoping questions, one section per regime, thresholds,
watch list, what is not covered, change log, sources.
