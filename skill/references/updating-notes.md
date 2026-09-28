# Updating a law note

Read `law/README.md` in the repository first. It sets the evidence marks and the shape of a note. This file is the working method.

## When

- A note is past its review date.
- A watch list item has moved.
- A project needs a subject or jurisdiction the notes do not cover.
- A claim marked `[S]` or `[U]` matters to a decision and should be checked.

Update only what the occasion needs. A full re-read is for the review date.

## Sources, in order of preference

1. The statute or regulation on the official legislation site.
2. The regulator's own guidance.
3. A government announcement.
4. A law firm, parliamentary library or press summary.

1 to 3 earn `[P]`. 4 earns `[S]`. Anything you did not read for this update stays or becomes `[U]`.

## The quoting rule

A claim may be marked `[P]` only if you fetched the source in this update and the note's wording follows the source's own words. Where the note quotes, quote exactly. Where a fetch tool summarises a page for you, ask it for the text verbatim, and do not mark `[P]` on a paraphrase you cannot trace to quoted words.

If two sources disagree, say so in the note and mark the claim by the weaker source.

If a source cannot be fetched, leave the claim's mark as it was and record the failure in your report. Do not guess.

## Interpretation

Reading a provision is not the same as applying it. Where the note draws a conclusion the text does not state, it says "on a plain reading" or "open question" and marks it `[U]`. Keep that discipline. Do not turn an open question into a settled one because a secondary source sounded confident.

## What to change

- The section's text and marks.
- The watch list: remove what has happened, add what is now expected.
- The thresholds table, if a number changed.
- The change log: date, and what changed.
- The header's Verified date, only if every section was re-read. Otherwise leave it and let the change log carry the partial update.
- The Review by date, only on a full re-read.
- `law/README.md`'s index, if the dates or the list of notes changed.

## What not to put in

- Facts about any project.
- Names of natural persons.
- Advice. The note says what the law is and how sure we are.

## A new note

One file per jurisdiction and subject, `law/<iso code>/<subject>.md`, code in lower case, in the shape of the existing note: header table with both dates, scoping questions, a section per regime, thresholds, watch list, not covered, change log, sources. The repository's tests check the header and the index.

## Landing it

Work on a branch. Commit type `docs:`. Run the repository's tests. Open a pull request and leave merging to the owner unless told otherwise.
