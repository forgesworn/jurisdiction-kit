# Inventory: what the project runs and ships

The law attaches to running a service far more than to publishing code. So the first job is to find out, from the repository, what the project operates, what it ships as a default, and what a user's device contacts because of it.

## The rule on evidence

**Evidence is code and configuration. It is never a legal document, a privacy notice, a terms page or marketing copy.** Those are what is being checked. If the privacy notice says "we cannot read your messages", that is a claim to test, not a fact to record.

Every finding carries `path:line`. "Not found" is a finding; say what was searched.

## 1. Run the script

```sh
scripts/project-inventory.sh /path/to/project > inventory.txt
```

Read-only, a few seconds, no model. It prints fourteen numbered sections. The first thirteen are raw findings from code and configuration. The last sets those findings beside the project's legal documents, if it has any. It searches and does not judge: some lines will be noise, and some answers need a file opened.

## 2. Answer these from its output

Open the file at each `path:line` that matters and read around it before answering.

| # | Question | Script section | Then |
|---|---|---|---|
| 1 | What could the operator host? | 3 | Read the deploy README or each service file: what is each thing for? Label each: a default for every user, an optional kit, or present but not wired in |
| 2 | What hosts does the client ship as defaults? | 1 | Open each first place. Is it a default, a fallback, a lookup, a link in a page? |
| 3 | Which of those does the operator run? | 1, 3 | A host on the project's own domain, or one a deploy file stands up |
| 4 | What third parties does a user's device contact? | 1, 2 | **Every** host in section 1 the operator does not run, and every address in section 2. For each: what triggers it, and what does that party learn? |
| 5 | Can one person's content reach another through anything the operator hosts? | 3 | Chat, files, calls, comments, feeds, presence |
| 6 | Can a stranger find people or content? | 11 | |
| 7 | Does anything the operator runs hold a key to content? | 6 | If "Says it holds one" lists anything, the answer is yes. Name the component and say which conversations it serves |
| 8 | What is stored, where, for how long? | 3, 8 | Retention and logging settings in deploy files |
| 9 | Are there accounts, or age checks? | 10 | |
| 10 | Could money change hands? | 4, 5 | A kit, a donation path or a payment address that is present counts, even if switched off. Say which. The host of a payment address is a third party too |
| 11 | Do agents or bots read content, and where do they send it? | 4, 7 | A model SDK in the dependencies means content can leave for that provider |
| 12 | When did the service start? | 12 | The note's deadlines run from launch |
| 13 | Who do the documents say runs it? | 13 | Record it as written. Do not investigate the person |

## Traps

- **A default is a choice.** A server the user can change is still one the operator chose for everybody who did not.
- **Present is not deployed.** A deploy kit does not show the thing is running. Say "kit present, deployment not verified" unless it can be seen live.
- **One exception defeats "never".** If five components cannot read content and one can, the answer to question 7 is yes.
- **Do not stop at the first hit.** Section 1 lists every host. A lookup or an update check further down the list is as much a third party as the first default.
- **Old links outlive new defaults.** A default that was removed may still be named in links already handed out.
- **If the documents leave something unnamed on purpose**, a host or a person, leave it unnamed in the report. Refer to it as the documents do.

## Output

A table with one row per question: the answer, the evidence, and what was not verified. Facts about the project only. Conclusions about the law come after, from the note.
