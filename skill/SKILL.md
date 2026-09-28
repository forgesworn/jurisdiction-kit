---
name: legal-cover
description: Check a project against the written-up law notes in jurisdiction-kit and draft or update its legal cover (position, risk assessment, privacy notice, terms, report runbook). Use when asked whether software or an online service is legal, what it owes under UK law, to write or refresh a project's docs/legal, or to bring a law note up to date. Works from the notes and researches only what is stale or missing.
---

# Legal cover

The law is already written up in `law/` of the jurisdiction-kit repository: dated, with every claim marked by how it was checked. This skill applies it to a project. The point is to stop repeating research. Read the note, inventory the project, write down where the project stands.

What comes out is drafts and findings for the owner to decide on. It is not legal advice. Never say a project "complies" or "is compliant"; say what applies, what is in place and what is owed.

## Two scripts do the searching

```sh
scripts/law-notes.sh status                          # every note, its dates, and whether it is due
scripts/law-notes.sh sections gb/online-services     # the headings
scripts/law-notes.sh section gb/online-services 2.6  # one section
scripts/law-notes.sh watch gb/online-services        # what is expected to change

scripts/project-inventory.sh /path/to/project        # what the project runs, ships and contacts
```

Run them from this skill's folder. Both are read-only and need no model.

`law-notes.sh` finds the notes beside the skill, through a symlink if the skill was installed by one. Exit code 2 means there is no local copy: read the notes at the address it prints. Exit code 3 means a note is past its review date.

Read `law/README.md` once for the evidence marks: `[P]` primary source read, `[S]` secondary, `[U]` unchecked.

## Pick the job

| Asked | Do |
|---|---|
| Is this legal? What do we owe? | The check, below |
| Write or refresh the project's legal documents | The check, then [references/documents.md](references/documents.md) |
| The project has legal documents. Are they still true? | [references/gap-check.md](references/gap-check.md) |
| A note is overdue, a watch list item moved, or the subject is not covered | [references/updating-notes.md](references/updating-notes.md) |

## The check

1. **Inventory what the project runs and ships.** Run `scripts/project-inventory.sh` and follow [references/inventory.md](references/inventory.md). Every finding carries `path:line`. This is reading code, not reading law.
2. **Look at section 13 of the inventory.** If the project already has legal documents, this is a gap check, not a fresh start: go to [references/gap-check.md](references/gap-check.md).
3. **Answer the note's scoping questions** (section 1 of the note) from the inventory. They name the sections that apply. Read those sections and the watch list, and nothing else.
4. **Report**, in this order:
   - what the project is in law's eyes, and the evidence;
   - what applies, by regime, with the note's section number;
   - what is already in place;
   - what is owed, in order, with any deadline the note gives;
   - what was not checked.

Carry the note's evidence marks into the report. A claim marked `[S]` or `[U]` stays marked; do not present it as settled.

## Which model

The two scripts do the searching and need no model. What is left is judgement: setting what the documents claim beside what the code does.

Run that on a capable model at medium effort. At the time of writing:

| Host | Use |
|---|---|
| Claude Code | The `legal-cover-opus` agent: Opus at medium effort. Pass it the project path and the job |
| Codex | The session's model at medium reasoning effort |

If the host is a stronger model than that, it delegates and reviews. It does not do the work itself.

The smallest tier is not enough. In trials it found the paperwork gaps, but it passed a claim that the operator "cannot read" content with the line naming the key holder in front of it. Do not use it for the check or the gap check.

Go above medium only for an open question the note itself flags, such as who the provider is. Hand over the inventory and the question, nothing more. A solicitor is the other answer to those.

Do not re-research a `[P]` claim that is inside its review date and not on the watch list. That is the work this skill exists to avoid.

## Rules

- **Evidence is code and configuration, never the documents being checked.** A privacy notice saying "we cannot read it" is a claim to test. One component that holds a key defeats it.
- **Notes hold the law. Project documents hold facts and decisions.** Link to the note for the law; do not copy it across. Keep project facts out of the notes.
- **Decisions belong to the owner.** Leave `[DECISION: ...]`, `[INPUT: ...]` and `[LEGAL REVIEW: ...]` markers where a choice, a fact or a lawyer is needed. Do not pick a minimum age, name a person or choose a legal basis on the owner's behalf.
- **Roles, not names.** Refer to "the maintainer on call", never a natural person. If the law requires an identity the project has not published, flag it as a decision; do not supply one. If the project's documents leave a host or a person unnamed on purpose, leave it unnamed.
- **Costs are listed, not acted on.** State the amount from the note and stop. Do not pay, register, incorporate or instruct anybody.
- **Nothing leaves the machine unasked.** No publishing, pushing, deploying, or contact with a regulator without the owner saying so.
- **If the note does not cover it, say so.** Do not fill a gap from memory. Name the gap and offer to extend the note.
- **Dates matter.** Quote the note's verified date in every report.
