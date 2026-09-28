# Drafting a project's legal documents

Write these in the project's own repository, by convention under `docs/legal/`, with an index that says they are drafts. Do the check in `SKILL.md` first: the inventory decides which documents are needed and what goes in them.

Two public worked examples, both drafts:

- A project that runs default infrastructure: <https://github.com/forgesworn/kithmoot/tree/main/docs/legal>
- A static app with no defaults: <https://github.com/forgesworn/wildbloom/tree/main/docs/legal>

Read the one closer to the project for shape. Do not copy its facts.

## Which documents

| Document | Needed when | Note sections (GB) |
|---|---|---|
| Position on scope | Always. One page on whether the project is a service, and why | 1, 2.1, 2.2 |
| Illegal content risk assessment | The project treats itself as a regulated service | 2.3, 2.4 |
| Children's access assessment | Same | 2.5 |
| Privacy notice | The operator handles any personal data, including IP addresses | 3, 4 |
| Terms | The operator runs anything people use | 2.3, 8 |
| Report handling runbook | Same | 2.3, 2.6 |
| Index | Always. Lists the documents and what must be true before they are relied on | |

If the position is "software, not a service", the position document and a short privacy notice may be all that is needed. Say what would change that position.

By position (see `SKILL.md`). Draft for the position the owner has chosen, and only once the deployment matches it:

| Position | Documents | Note sections (GB) |
|---|---|---|
| Publisher, with or without defaults | Position on scope. A short privacy notice: the site's logs, update checks, and every third party a default contacts. A report page that says who can act, since the project holds nothing to remove | 2.2, 3.1, 3.2 |
| Closed operator | Position on scope, with the reasoning for the exemption, kept and not published | 2.10, 3.9 |
| Public operator | All of them | 2, 3, 4, 5 |

## Every document

- Opens with a banner: draft, date, not legal advice, not reviewed by a lawyer, drafted from the code at a named commit.
- States facts from the inventory, each traceable to code. An HTML comment naming the file is enough.
- Links to the law note for the law. One sentence of law and a section reference, not a restatement.
- Leaves markers for what is not yours to decide:
  - `[DECISION: ...]` a choice for the owner;
  - `[INPUT: ...]` a fact only the owner has;
  - `[LEGAL REVIEW: ...]` a point for a lawyer.
- Refers to roles, never to a named person.
- Says plainly what the operator cannot do. Do not promise a capability the software lacks.

## Privacy notice: what must be in it

From the note's data protection section. Check each against the inventory.

- Who the controller is, and how to reach them. If the project has not published a legal identity, leave a `[DECISION]` marker.
- What each server the operator runs sees, and for how long it is kept.
- What the app keeps on the device.
- Every third party a user's device contacts because of a default, and what that party learns.
- Where agents or bots send content.
- Who holds keys, if anybody but the users.
- The legal basis for each purpose. Propose, and mark for legal review.
- The rights, including the right to complain to the controller and to the regulator.
- Children.

## Report runbook: what must be in it

- How a report arrives, without needing an account.
- What the operator can act on, surface by surface, verified against the deployed software. Mark anything unverified.
- The statutory reporting route for child sexual abuse content, from the note. Not the public routes.
- A rule against viewing or forwarding such material to check a report.
- Timescales and record keeping, as decisions for the owner.

## Published pages

If the project publishes these as web pages, the pages are built from the drafts. After changing a draft, list the pages that now differ. Do not publish them.

## Finish

Give the owner: the list of open markers grouped by kind, any deadline from the note, any cost from the note, and what was not verified.
