# Gap check: are the project's legal documents still true?

Legal documents go stale in two ways: the project changes, or the law does. Check both. Run this before a release that adds a server, a default, a feature that reaches other users, or a payment.

Work through all four parts. The first two are where the serious gaps are, and they are the ones a quick read misses.

Before any of them, name the position the deployment is in and the one the documents were written for (`SKILL.md`, "Name the position first"). Documents written for one position are wrong for another, in both directions: a notice that says "we run nothing" over an open endpoint, or a risk assessment for a service the owner never meant to run. If the owner means to change position, say what the move takes and stop there. Do not repair documents for a position about to be left.

## 1. Test every claim against the code

Do the inventory first ([inventory.md](inventory.md)), and write down the answer to its question 7 in one sentence before going on: does anything the operator may run hold a key to content?

Section 14 of the inventory lists the documents' claims that content cannot be read. If question 7 is yes, each of those claims is contradicted for the conversations that component serves, however many other components are blind.

Then pull the rest of the documents' factual claims out and test each one:

```sh
grep -nEi "cannot|can not|never|do not|does not|don't|no longer|only|nobody|nothing" docs/legal/*.md site/*/index.html
```

Use the files section 13 of the inventory lists: the drafts and the published pages both.

For each claim about what the service does or holds, find the inventory row that makes it true. Three outcomes:

- **Supported.** Evidence in code. Move on.
- **Contradicted.** Something in the inventory says otherwise. This is a gap, and usually a serious one. "We cannot read any room" is contradicted by one component that holds a room key.
- **Unsupported.** Nothing either way. Report as not verified.

## 2. Look for what the documents leave out

Start from section 14 of the inventory. It lists the hosts and providers no legal document names, and quotes what the documents say about agents, device storage and money. A host the documents cover by kind ("independent public relays") is covered only if the kind fits what that host is used for: a relay used to look people up is not covered by a sentence about relays that carry a room.

Then go down the inventory and ask of each row: do the documents say this?

| Inventory row | The documents should say |
|---|---|
| Every third party a device contacts (question 4) | Who, when, and what they learn. Each one, by name or by kind |
| Anything the operator runs that holds a key (7) | That it does, and for which conversations |
| Agents or bots that read content (11) | That they do, and where content goes |
| What is kept on the device (8) | What and why |
| Each server the operator could host (1) | What it sees and how long it keeps it |
| A payment path, present or live (10) | Nothing, if it is off. If it is on, the trading section of the note applies |

A row with nothing behind it in the documents is a gap.

## 3. Check each document against what it must contain

Use the lists in [documents.md](documents.md): "Privacy notice: what must be in it" and "Report runbook: what must be in it". Read the note section each item comes from. Two that are often wrong:

- **The reporting route for child sexual abuse content.** The note gives the statutory route. A runbook that names only the public routes has a gap.
- **The right to complain to the controller.** The note gives the date it came in. A notice written without it has a gap.

Then the housekeeping:

| Look for | Usual cause |
|---|---|
| Markers still open: `[DECISION]`, `[INPUT]`, `[LEGAL REVIEW]` | Nobody adopted the drafts. The script counts them |
| Assessments not completed and signed by the note's deadline | Same |
| The operator named only by a project name | See the note's section on who the operator is |
| Published pages that differ from the drafts | One was edited and the other was not |
| Documents written for a position the project is not in | What the operator runs changed, or was never what the owner meant |

Use the note's own verbs. If the note says an assessment is carried out and recorded, do not write that it is submitted.

## 4. Has the law moved?

```sh
scripts/law-notes.sh status
scripts/law-notes.sh watch gb/online-services
```

- If the note is overdue, or a watch list item bears on this project, update the note first ([updating-notes.md](updating-notes.md)).
- Compare the documents' dates with the note's change log.
- Read the note's section on deadlines. Count from the first deploy commit in section 12 of the inventory, unless the owner has given the launch date. Write the date down and say which you counted from.
- Read the note's section on fees and costs, and quote the amounts. Do not write "to be determined" for a figure the note gives.

## 5. Report

One table, most serious first. Contradicted claims and missing third parties go above housekeeping.

| Gap | Evidence | Note section | Who decides |
|---|---|---|---|

Then: deadlines, costs, and what was not checked. Offer to draft the fixes that need no decision from the owner. Do not make them unasked.
