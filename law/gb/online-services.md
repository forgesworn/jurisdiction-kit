# United Kingdom: running an online service

| | |
|---|---|
| Jurisdiction | GB |
| Verified | 28 September 2026 |
| Review by | 28 March 2027, or sooner if a watch list item moves |
| Status | Research notes. Not legal advice. No lawyer has reviewed them |

What UK law asks of somebody who publishes software, or runs a service that
carries messages, files or calls between people. Written with small
operators and open-source projects in mind.

Evidence marks are explained in the [index](../README.md): `[P]` primary
source read, `[S]` secondary source, `[U]` unchecked.

## 1. Start here

The duties below attach to **running a service**. Writing and publishing
software attracts almost none of them. Work out which you do.

| Question | If yes, read |
|---|---|
| Do you only publish source code or binaries? | Section 6. Nothing else here attaches to publication alone |
| Do you only use a service somebody else provides, as a member or as the person who runs a group on it? | 2.2. The duties are the provider's |
| Do you host an app that talks only to servers the user names, with no defaults of yours? | 2.2, then section 3 for your web host's logs |
| Do you ship defaults that point only at servers somebody else runs? | 2.2, then 3.2 for naming them |
| Do you run, or ship as a default, any server through which one person's content reaches another? A relay, a TURN server, a file store, a forwarder, a chat server | Sections 2, 3, 4 and 5 |
| Do you run servers only for yourself, your household, or the closed group that works on your project? | 2.10 and 3.9 |
| Could somebody under 18 plausibly use it? | 2.5 and 3.6 |
| Do you hold a key to anybody's content? | 5.4 |
| Do you take money? | Section 8 |
| Is the operator a project name and not a registered company? | Section 9 |

## 2. Online Safety Act 2023

Regulator: Ofcom.

### 2.1 Scope

A user-to-user service is "an internet service by means of which content
that is generated directly on the service by a user of the service, or
uploaded to or shared on the service by a user of the service, may be
encountered by another user, or other users, of the service" (section 3)
`[P]`. It does not matter whether content is in fact shared, so long as the
service has a function that allows it `[P]`.

It is regulated if it has links with the UK and no exemption applies
(section 4) `[P]`. It has links with the UK if:

- it has a significant number of UK users, or the UK is one of its target
  markets; or
- it can be used in the UK by individuals, and there are reasonable grounds
  to believe there is a material risk of significant harm to individuals in
  the UK from its content `[P]`.

The Act does not define "significant". Ofcom: "Service providers should be
able to explain their judgement, especially if they think they do not have a
significant number of UK users" `[P]`. Ofcom has read it, in an enforcement
decision, as UK user numbers that are "material in the context of the
service, rather than necessarily large or substantial" `[S]`. The lowest
figure in a published decision is an average of 855 UK visitors a month
`[S]`. Ofcom counts a visitor as a user, registered or not `[S]`; the Act
says registration does not matter (section 227(2)) `[P]`.

Exemptions, Schedule 1 Part 1 `[P]`:

| Exempt where the only user content is | Note |
|---|---|
| Email | |
| SMS or MMS | |
| One-to-one live aural communications | Voice only, two people only. Text, video and group calls are outside it |
| Comments or reviews on the provider's own content | "Limited functionality" |
| Internal business use | A closed group, for the purposes of the business. See 2.10 |
| A service provided by a public body, or by an education or childcare provider | |

A service with text chat, video, group calls or file sharing fits none of
them.

End-to-end encryption does not take a service out of scope. The duties apply
to a provider that cannot read its own traffic, and that fact shapes which
measures are possible and proportionate `[S]`.

### 2.2 Who the provider is

Section 226 `[P]`: the provider of a user-to-user service is "the entity
that has control over who can use the user-to-user part of the service (and
that entity alone)". Where individuals and not an entity have that control,
the provider is those individuals.

An individual can therefore be a provider in their own right.

Somebody who runs a group on another provider's platform is not the
provider. Asked who answers for a volunteer community group run on a social
media platform, Ofcom pointed to "the provider of the regulated service"
`[P]`.

Ofcom on decentralised services `[P]`: "services should approach it in the
same way, whether they are decentralised or not", and "If a user operates a
decentralised service, and the above applies, it is possible that they are
the provider." So each deployment has its own provider: whoever runs it and
controls who can use it.

**Open question: designs where nobody controls admission.** No Ofcom
guidance on where publishing software ends and providing a service begins
was found `[U]`. Four positions are open. All are readings, not settled
law:

- **A static app with no defaults and no infrastructure** is software. The
  operator stores nothing, chooses no server, and brokers no encounter
  between users. The reading weakens the moment a default server is shipped,
  or the operator runs anything that stores, lists or indexes content.
- **An app whose defaults are servers other people run** sits between the
  two. The publisher chooses the defaults and controls nobody's admission
  to them, and section 226 turns on control over who can use the service.
  Each server's own operator is the provider of that server. The publisher
  still owes the privacy notice an account of the third parties its
  defaults contact (3.2).
- **An operator that runs default infrastructure** treats itself as the
  provider, in respect of what it runs. This is the cautious reading.

- **An operator of a closed deployment** is the provider of it, and may be
  exempt or outside the Act. See 2.10.

Whichever is taken, write the reasoning down and keep it. Revisit it before
shipping a default, adding discovery, search, a feed, comments or presence,
or starting to run a server.

Somebody who self-hosts is the operator of their own deployment.

### 2.3 Duties on every regulated service

These apply whatever the size of the service `[P]`, from Ofcom's own
summary, unless marked:

- Carry out an illegal content risk assessment and keep a written record of
  every one. The record is kept, not filed: nothing read for this note asks
  a small service to send its assessment to Ofcom unless Ofcom asks for it
  `[U]`.
- Review it, Ofcom recommends at least annually, and before any significant
  change to the service.
- Take proportionate steps to prevent users encountering illegal content,
  and swiftly remove it on becoming aware of it.
- Explain how in terms of service or a publicly available statement.
- Let people report illegal content easily, and run a complaints procedure.
- Name a person accountable for the illegal content and reporting duties
  (Codes of Practice measure ICU A2) `[U]`.
- Carry out a children's access assessment `[S]`.
- Report detected child sexual exploitation and abuse content to the
  National Crime Agency (2.6) `[P]`.
- Answer an Ofcom information notice `[U]`.

Copyright is outside "illegal content" for these purposes `[U]`.

### 2.4 Deadlines

| Service | Duty | When |
|---|---|---|
| New, or newly in scope | Illegal content risk assessment | Three months after launch `[P]` |
| New, or newly in scope | Children's access assessment | Three months `[S]` |
| Existing on 16 December 2024 | Illegal content risk assessment | 16 March 2025 `[S]` |
| Existing | Children's access assessment | 16 April 2025 `[S]` |
| Existing and likely to be accessed by children | Children's risk assessment | 24 July 2025 `[S]` |

### 2.5 Children

A provider can conclude that children cannot access the service only if it
uses highly effective age assurance `[S]`. Otherwise the question is whether
a significant number of children use it, or it is of a kind likely to
attract them; "significant" can be a small number `[S]`.

If children are likely to access it: a children's risk assessment, and the
children's safety duties under Ofcom's Protection of Children Codes `[S]`.

**Under-16 measures.** Announced by the government on 15 June 2026 `[P]`:

- A ban for under-16s on "user-to-user platforms, whose purpose is to enable
  social interaction and which allow users to post material, alongside
  algorithms". Named: Snapchat, TikTok, YouTube, Instagram, Facebook, X.
- "We do not intend for messaging services like WhatsApp and Signal to be
  included in the social media ban."
- Separate restrictions on livestreaming and on strangers contacting
  children, including on gaming sites.
- Regulations expected before Christmas 2026; in force spring 2027.
- Made under powers in the Children's Wellbeing and Schools Act 2026, which
  inserts section 214A into the Online Safety Act `[S]`.

Until the regulations are made, their scope is a statement of intent.

### 2.6 Reporting child sexual exploitation and abuse content

Section 66, and SI 2026/268, in force 7 April 2026 `[P]`.

- Applies to all regulated user-to-user services. Search services are not
  yet commenced.
- The duty covers content the service detects, however it became aware of
  it, including through a user's report. It does not require a service to
  detect anything.
- Reports go to the NCA through its Industry Reporting Portal. A provider
  "must register with the NCA prior to submitting their first report"
  (regulation 4).
- Timing (regulation 6): immediately where a child faces an immediate
  threat; as soon as reasonably practicable where there is a risk of
  serious harm; otherwise without undue delay.
- Retention (regulation 8): report reference numbers for five years; the
  content, the information submitted and the user data for one year.
- Reporting false information is a criminal offence.

CEOP and the Internet Watch Foundation are routes for the public. They are
not the provider's statutory route.

Possessing or distributing such material is itself an offence. Do not view,
copy or forward it to check a report `[U]`.

### 2.7 What a small service is outside

| Regime | Threshold | Mark |
|---|---|---|
| Fees payable to Ofcom | Qualifying worldwide revenue of £250 million or more, and UK revenue of £10 million or more | `[S]` |
| Category 2B | More than 3 million UK monthly users, and direct messaging | `[S]` |
| Category 1 | More than 34 million UK monthly users with a recommender system, or more than 7 million with a recommender system and sharing | `[U]` |
| Registration with Ofcom | None exists for small services | `[U]` |

### 2.8 Scanning private messages

Section 121 lets Ofcom require a service to use accredited technology to
find child abuse content, in public and private communications. No notice
has been issued, and the accreditation framework it depends on was not in
place as of mid-2026 `[S]`.

### 2.9 Penalties and enforcement

Up to £18 million or 10% of qualifying worldwide revenue, whichever is
greater `[P]`.

As reported on 17 September 2026: eleven providers fined, over £7 million in
total, mainly pornography services and a suicide forum `[S]`. That describes
where Ofcom has started, not who owes the duties.

Ofcom on small services `[P]`:

- "We are not setting out to penalise small, low risk services trying to
  comply in good faith."
- "We will take a reasonable approach to enforcement with smaller services
  that present low risk to UK users, only taking action where it is
  proportionate and appropriate."
- "Regulated services cannot apply for an exemption."
- A small service that has assessed its risks as low across all harms is
  expected to have terms that are easy to find and understand, a way to
  report illegal material with a process behind it, the ability to review
  content and take it down quickly, and "a specific individual responsible
  for compliance who we can contact if we need to".

That is an approach to enforcement. It does not take a service out of scope.

### 2.10 Closed and personal services

Running servers for your own use is lawful. What varies is whether the Act's
duties attach, and that turns on who else uses them.

| Who uses the servers | Position | Mark |
|---|---|---|
| The provider alone | No second user can encounter anything, so the definition in section 3 is not met. A reading | `[U]` |
| The closed group that works on a business or project | Exempt as an internal business service, Schedule 1 paragraph 7 | `[P]` |
| Family and friends, by invitation | No exemption names it. Regulated only if it has links with the UK (2.1). No decision on a closed service of a handful of people was found | `[U]` |
| Anybody who finds it | A service to the public. Section 2 applies in full | `[P]` |

**The internal business exemption**, paragraph 7 `[P]`. All three must hold:

- the service is "an internal resource or tool for a business";
- the person carrying on the business is the provider;
- it is "available only to a closed group of people": the provider, officers,
  "persons who work for" the provider "(including as employees or
  volunteers)", and others they authorise "for the purposes of any
  activities of the business", such as a contractor or consultant.

"Business" here "includes trade, profession, educational institution or
other concern (whether or not carried on for profit)" `[P]`. An unpaid
open-source project is a concern in that sense `[U]`.

**The provider's own people are not users.** Section 227(3) `[P]`: a provider
who is an individual, the officers of one that is an entity, the people who
work for it including volunteers, and its contractors are not users when
acting in the course of the provider's business.

**Closed means closed.** Because a visitor counts as a user (2.1), keep a
private deployment free of any public page that shows user content, open
sign-up, or endpoint that takes content from whoever finds it `[U]`.

If a closed service does turn out to be regulated, what it owes is in 2.3:
assessments that are made, recorded and kept.

## 3. Data protection

UK GDPR, Data Protection Act 2018, Data (Use and Access) Act 2025.
Regulator: the Information Commissioner's Office (ICO).

The dataset carries the headline fields for GB: consent age 13, breach
notification 72 hours. `getJurisdiction('GB').dataProtection`.

### 3.1 When you are a controller

You are a controller for the personal data your own servers handle. For a
service that cannot read content, that is still usually `[U]`:

- IP addresses, at every server you run;
- identifiers that single out a device or a person, including public keys;
- emails and reports people send you;
- anything your logs keep.

Holding little is a good position. It is not the same as holding nothing.

### 3.2 The privacy notice

Article 13 `[P]` requires, among other things:

- the identity and the contact details of the controller;
- the purposes and the legal basis;
- the recipients;
- how long data is kept;
- the rights of access, rectification, erasure and restriction;
- the right to complain to the controller (Article 13(2)(ca), added by the
  2025 Act).

If the defaults you ship make a person's device contact a third party, say
so, and say what that party learns. Typical cases: a default relay, a
profile or avatar lookup, a name check against somebody's domain, a model
provider behind an agent, an update check `[U]`.

### 3.3 Complaints to the controller

Section 164A of the Data Protection Act 2018, in force 19 June 2026 `[S]`.
A controller must make it easy to complain to it directly, including by
electronic means, acknowledge within 30 days, and respond without undue
delay `[S]`. The privacy notice must mention the right `[P]`.

### 3.4 The data protection fee

| Tier | Fee | Who |
|---|---|---|
| 1 | £52 | Turnover up to £632,000, or no more than 10 staff |
| 2 | £78 | Turnover up to £36 million, or no more than 250 staff |
| 3 | £3,763 | Everybody else |

£5 less by direct debit `[S]`.

Exempt only if personal data is processed **solely** for one or more of:
staff administration; advertising, marketing and public relations;
accounts and records; not-for-profit purposes; personal, family or
household affairs; maintaining a public register; judicial functions; or
without an automated system `[P]`. Running a public online service is not
on the list.

The not-for-profit exemption is for "a body or association which is not
established or conducted for profit", processing to establish or maintain
membership or support, or for "providing or administering activities for
individuals who are either a member of the body or association or who have
regular contact with it" `[P]`. Whether an informal project of a few people
is such a body is not settled here `[U]`. The ICO's self-assessment is free.

There is no exemption for sole traders as such `[S]`.

Not paying when it is due: a penalty of £400 to £4,000 `[P]`.

An exemption from the fee is not an exemption from the law `[P]`.

### 3.5 What the register publishes

For every fee payer, the ICO publishes the name and address of the
controller, its trading names, the tier, and the dates `[P]`. Contact
people are not published. One secondary source says a sole trader can ask
for a home address to be withheld; the ICO pages read for this note did not
confirm it `[S]`.

### 3.6 Children

The Children's code (Age Appropriate Design Code) applies to information
society services likely to be accessed by children `[P]`:

- A child is a person under 18.
- "Likely" means more probable than not.
- It names "online messaging or internet based voice telephony services".
- A service free to the user still counts where it is funded some other
  way. Not-for-profit services are covered "as long as those services can
  be considered as 'economic activity' in a more general sense".

Whether a free project with no funding of any kind is an information
society service is unsettled `[U]`.

### 3.7 Breaches

Notify the Commissioner "without undue delay and, where feasible, not later
than 72 hours after having become aware of it", unless the breach is
unlikely to result in a risk to people's rights and freedoms (Article 33)
`[P]`.

### 3.8 Transfers abroad

A host or processor outside the UK is a transfer. See `canTransferData` in
the library for the mechanism between two jurisdictions.

### 3.9 Personal and household use

The UK GDPR does not apply to "the processing of personal data by an
individual in the course of a purely personal or household activity"
(Article 2(2)(a)) `[P]`. The fee regulations exempt processing "for the
purposes of their personal, family or household affairs", including for
recreational purposes `[P]`.

So an individual who runs closed servers for themselves, their household
and their friends, as private life and nothing else, is outside both `[U]`.

"Purely" is the limit. Servers used for a project's work, for a business, or
by the public are not a household activity, and section 3 applies to what
they log `[U]`.

## 4. Device storage and cookies

Privacy and Electronic Communications Regulations 2003, regulation 6 and
Schedule A1, as substituted with effect from 5 February 2026 `[P]`.

The rule: do not store information, or gain access to information stored,
on a person's device. Exceptions:

| Exception | Conditions |
|---|---|
| Consent | Clear and comprehensive information first |
| Transmission | Sole purpose is carrying a communication |
| Strictly necessary | For a service the person asked for. Includes security, fraud prevention and fault detection |
| Statistics about use of the service | Clear information, and a simple free way to object |
| Appearance and preferences | Clear information, and a free way to opt out |
| Emergency assistance | Location, on the person's request |

What an app keeps on the device in order to work needs no consent and no
banner. Describe it in the privacy notice all the same `[U]`.

## 5. Investigatory powers

### 5.1 Who is a telecommunications operator

Investigatory Powers Act 2016, section 261 `[P]`.

- An operator is a person who "offers or provides a telecommunications
  service to persons in the United Kingdom", or controls or provides a
  telecommunication system in, or controlled from, the UK.
- A telecommunications service is "any service that consists in the
  provision of access to, and of facilities for making use of, any
  telecommunication system (whether or not one provided by the person
  providing the service)".
- That includes "any case where a service consists in or includes
  facilitating the creation, management or storage of communications".

The definition is wide. Running a relay, a TURN server or a message or file
store for people in the UK very probably meets it `[U]`.

### 5.2 What follows from being one

- A warrant, authorisation or notice can be served on you, and you must
  give the assistance that is reasonably practicable `[U]`.
- You can disclose only what you hold.
- Notices commonly carry a duty not to reveal them `[U]`. If one arrives,
  the next step is a solicitor.

### 5.3 Technical capability notices and the 10,000 floor

Investigatory Powers (Technical Capability) Regulations 2018, SI 2018/353
`[P]`.

Regulation 4(3): "The obligations in Part 1 of Schedule 1 and in Schedule 3
may not be imposed on a relevant telecommunications operator who does not
provide, and does not intend to provide, a telecommunications service to
more than 10,000 persons."

| Schedule | Covers | Floor applies |
|---|---|---|
| 1, Part 1 | Interception | Yes |
| 2 | Communications data | No |
| 3 | Equipment interference | Yes |

Each schedule includes an obligation to "remove electronic protection
applied by or on behalf of the telecommunications operator ... where
reasonably practicable". On a plain reading, encryption applied on users'
own devices with keys the operator never holds is not protection applied by
or on behalf of the operator. That is a reading, not an authority `[U]`.

**Notifying changes.** Section 258A lets the Secretary of State require a
notified operator to report changes to its service in advance. Under
SI 2025/656, regulation 3, in force 6 June 2025 `[P]`, a change is not a
relevant change if it "is made by a relevant operator who does not provide,
and does not intend to provide, a telecommunications or postal service to
more than 10,000 persons", or if it fixes a defect and leaves the intended
function unchanged.

No UK law bans end-to-end encryption `[U]`.

### 5.4 Keys

Regulation of Investigatory Powers Act 2000, section 49, in force `[P]`. A
person believed to hold a key to protected information that was lawfully
obtained can be required to disclose the key or the information, where that
is necessary and proportionate. Failing to comply is an offence under
section 53 `[U]`.

It reaches keys you hold and no others. A design in which the operator
holds no key leaves nothing to disclose.

## 6. Export control

Regulator: the Export Control Joint Unit.

Cryptography is controlled under Category 5 Part 2 of the dual-use list
`[S]`. Published open-source software is released from control:

- Export Control Order 2008, article 18(2): "Nothing in article 10, 11, 12
  or 12A shall be taken to prohibit the transfer of software or technology
  in the public domain" `[P]`.
- Article 2: "in the public domain" means "available without restriction
  upon further dissemination (no account being taken of restrictions
  arising solely from copyright)" `[P]`.
- The dual-use list's General Software Note carries the equivalent release
  `[U]`. A law firm summary reads it as generally exempting open-source
  software, including under licence `[S]`.

Still applies:

- End-use controls can require a licence for items that are not on the
  list `[P]`.
- Sanctions. Knowingly supplying a sanctioned person is a separate
  question `[U]`.
- Software that is not published, or published with restrictions on passing
  it on, does not get the release.

### 6.1 What other people do with published software

Somebody who installs and runs the software is the provider of their own
deployment (2.2). The duties in sections 2 to 5 are theirs.

Publishing general-purpose software does not make the publisher a party to
an offence somebody else commits with it. The offences of encouraging or
assisting crime, Serious Crime Act 2007 Part 2 `[P]`, need a state of mind:

- Section 44: the person "intends to encourage or assist" the offence, and
  "is not to be taken to have intended to encourage or assist the
  commission of an offence merely because such encouragement or assistance
  was a foreseeable consequence of his act".
- Section 45: the person "believes" that the offence "will be committed" and
  that the act "will encourage or assist its commission".
- Section 50 gives a defence of acting reasonably.

What would change the picture `[U]`: presenting the software as a means to
break the law, or helping a particular person in the belief that they are
committing an offence.

A licence grants permission and disclaims warranty. It does not make the
publisher answerable for the use. Licence compliance is not covered
(section 13).

## 7. Telecoms regulation

Communications Act 2003. Regulator: Ofcom.

A messaging or calling app is a number-independent interpersonal
communications service. The UK did not bring these within Ofcom's General
Conditions `[S]`. Micro-entities are exempt from the measures in the
telecoms security code `[S]`.

Nothing here for a small messaging service to do, on the secondary sources
read.

## 8. Trading

These rules attach to economic activity. A free project with no revenue is
arguably outside them. They apply from the moment money changes hands.

**Electronic Commerce (EC Directive) Regulations 2002, regulation 6**, in
force `[P]`. A person providing an information society service must make
available, easily, directly and permanently:

- the name of the service provider;
- the geographic address at which it is established;
- contact details including email;
- registration details, if on a trade register;
- a VAT number, if it has one;
- prices stated clearly, saying whether tax and delivery are included.

Non-commercial online activity is outside the Regulations; a free service
that is part of an economic activity is inside them `[S]`.

**Companies Act 2006, sections 1200 to 1206** `[P]`. An individual or
partnership carrying on business in the UK under a business name must
disclose the individual's name and an address for service:

- on business letters, orders, invoices, receipts and demands for payment;
- in a notice at business premises;
- in writing, immediately, to anybody who asks in the course of business.

Failure is an offence, and can defeat a claim brought by the business.

## 9. Who the operator is

This runs through every section above.

- A project name or trading name that is not a registered legal person
  cannot be a provider or a controller. The person or company behind it is
  `[U]`.
- The privacy notice must give the controller's identity (3.2).
- The ICO register publishes the controller's name and address (3.5).
- An individual can be the provider under the Online Safety Act (2.2).
- Once trading, the individual's name goes on business documents
  (section 8).
- A company's directors are named on the public register at Companies
  House, and must verify their identity `[U]`.

None of these regimes makes room for running a regulated service under a
pseudonym. The alternatives are to have a registered entity operate the
service, which names its directors instead, or to publish software only and
operate nothing. Take advice before choosing.

## 10. Thresholds at a glance

| Threshold | What it switches | Section |
|---|---|---|
| A significant number of UK users, or the UK as a target market | Online Safety Act duties | 2.1 |
| An average of 855 UK visitors a month | The lowest figure Ofcom has treated as significant in a published decision. Not a floor | 2.1 |
| Only a closed group working for the business or project | Exempt from the Online Safety Act | 2.10 |
| Purely personal or household use | Outside the UK GDPR and the fee | 3.9 |
| Three months from launch | Risk assessment due | 2.4 |
| More than 10,000 people served | Interception and equipment interference capability can be required; changes may have to be notified | 5.3 |
| More than 3 million UK monthly users, with direct messages | Category 2B | 2.7 |
| £250 million worldwide and £10 million UK revenue | Ofcom fees | 2.7 |
| First revenue | Trading rules | 8 |
| Turnover over £632,000 and more than 10 staff | ICO fee tier 2 | 3.4 |

## 11. Worked examples

Public projects that have written their position down. They show the shape
of the documents; they are drafts and carry no authority.

- **Runs default infrastructure, treats itself as in scope.** KithMoot:
  [risk assessment, children's access assessment, terms, privacy notice and
  report runbook](https://github.com/forgesworn/kithmoot/tree/main/docs/legal).
- **Static app, no defaults, position that it is software.** Wildbloom:
  [Online Safety Act position](https://github.com/forgesworn/wildbloom/tree/main/docs/legal).

## 12. Watch list

| Item | What to look for | Section |
|---|---|---|
| Under-16 regulations | The text when laid, expected before Christmas 2026. Whether messaging services are excluded in terms, and how "stranger" contact is defined | 2.5 |
| Section 121 | Accreditation of scanning technology; any first notice | 2.8 |
| Ofcom guidance on software and decentralised services | Anything on who the provider is where nobody controls admission | 2.2 |
| CSEA reporting for search services | Commencement | 2.6 |
| ICO fee | Amounts change by regulation | 3.4 |
| Ofcom Codes of Practice | New or strengthened measures | 2.3 |

## 13. Not covered

- Consumer law, including the Consumer Rights Act 2015 and the Digital
  Markets, Competition and Consumers Act 2024.
- Payments, cryptoassets and financial promotion.
- Tax.
- Defamation, harassment and other liability for content.
- Copyright and licence compliance for what you ship.
- Recording and transcribing calls.
- Accessibility under the Equality Act 2010.
- Differences in Scotland and Northern Ireland.
- Any other jurisdiction. A service used by people in the EU brings the EU
  GDPR and the Digital Services Act into view.

## 14. Change log

| Date | Change |
|---|---|
| 28 September 2026 | First version |
| 28 September 2026 | 2.3: the risk assessment is kept, not filed |
| 28 September 2026 | 2.1: what "significant" has meant. 2.2: defaults that are other people's servers. New 2.10, closed and personal services, and 3.9, personal and household use |
| 28 September 2026 | Ofcom's own words on "significant", decentralised services, groups on another platform and small services (2.1, 2.2, 2.9). 3.4: the not-for-profit exemption in full. New 6.1, what other people do with published software |

## 15. Sources

Primary, read 28 September 2026:

- Online Safety Act 2023: [section 3](https://www.legislation.gov.uk/ukpga/2023/50/section/3), [section 4](https://www.legislation.gov.uk/ukpga/2023/50/section/4), [section 226](https://www.legislation.gov.uk/ukpga/2023/50/section/226), [section 227](https://www.legislation.gov.uk/ukpga/2023/50/section/227), [Schedule 1](https://www.legislation.gov.uk/ukpga/2023/50/schedule/1)
- [Online Safety (CSEA Content Reporting by Regulated User-to-User Service Providers) Regulations 2026, SI 2026/268](https://www.legislation.gov.uk/uksi/2026/268/made)
- Ofcom: [Online Safety Act explained, questions and answers, updated 28 May 2025](https://www.ofcom.org.uk/siteassets/resources/documents/online-safety/information-for-industry/other/online-safety-act-explained-qa-web.pdf?v=409647), [helping small services navigate the Act](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/helping-small-services-navigate-the-online-safety-act)
- Serious Crime Act 2007: [section 44](https://www.legislation.gov.uk/ukpga/2007/27/section/44), [section 45](https://www.legislation.gov.uk/ukpga/2007/27/section/45), [section 50](https://www.legislation.gov.uk/ukpga/2007/27/section/50)
- Ofcom: [illegal content duties](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/illegal-content-duties-under-the-online-safety-act), [duty to report CSEA content](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/duty-to-report-child-sexual-exploitation-and-abuse-csea-content-know-the-rules-and-how-to-comply)
- GOV.UK: [under-16 announcement, 15 June 2026](https://www.gov.uk/government/news/social-media-to-be-banned-for-under-16s-in-landmark-government-move-to-givekids-their-childhood-back)
- UK GDPR: [Article 2](https://www.legislation.gov.uk/eur/2016/679/article/2), [Article 13](https://www.legislation.gov.uk/eur/2016/679/article/13), [Article 33](https://www.legislation.gov.uk/eur/2016/679/article/33)
- [Data Protection (Charges and Information) Regulations 2018, SI 2018/480, Schedule](https://www.legislation.gov.uk/uksi/2018/480/schedule)
- ICO: [fee exemptions](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/exemptions/), [information collected and published](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/information-we-will-collect-and-publish/), [registration questions](https://ico.org.uk/for-organisations/data-protection-fee/faqs-data-protection-fee-payment-and-online-registration/), [services covered by the Children's code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/services-covered-by-this-code/)
- Privacy and Electronic Communications Regulations 2003: [regulation 6](https://www.legislation.gov.uk/uksi/2003/2426/regulation/6), [Schedule A1](https://www.legislation.gov.uk/uksi/2003/2426/schedule/A1)
- [Investigatory Powers Act 2016, section 261](https://www.legislation.gov.uk/ukpga/2016/25/section/261)
- [Investigatory Powers (Technical Capability) Regulations 2018, SI 2018/353](https://www.legislation.gov.uk/uksi/2018/353/made)
- [Investigatory Powers (Codes of Practice, Review of Notices and Technical Advisory Board) Regulations 2025, SI 2025/656](https://www.legislation.gov.uk/uksi/2025/656/made)
- [Regulation of Investigatory Powers Act 2000, section 49](https://www.legislation.gov.uk/ukpga/2000/23/section/49)
- Export Control Order 2008: [article 2](https://www.legislation.gov.uk/uksi/2008/3231/article/2), [article 18](https://www.legislation.gov.uk/uksi/2008/3231/article/18)
- GOV.UK: [export controls on dual-use items](https://www.gov.uk/guidance/export-controls-dual-use-items-software-and-technology-goods-for-torture-and-radioactive-sources)
- [Electronic Commerce (EC Directive) Regulations 2002, regulation 6](https://www.legislation.gov.uk/uksi/2002/2013/regulation/6)
- [Companies Act 2006, Part 41 Chapter 2](https://www.legislation.gov.uk/ukpga/2006/46/part/41/chapter/2)

Secondary:

- decoded.legal, 24 March 2026: [what number of UK users is a significant number](https://decoded.legal/blog/2026/03/what-number-of-uk-users-constitutes-a-significant-number-for-the-purposes-of-the-online-safety-act-2023/)
- Ben Tasker, 9 February 2025: [an assessment for a single-user server](https://www.bentasker.co.uk/posts/blog/law/doing-an-osa-assessment-for-my-single-user-fedi-server.html), for Ofcom's reading of "user"
- The Register, 17 September 2026: [Online Safety Act fines](https://www.theregister.com/security/2026/09/17/ofcom-discovers-issuing-online-safety-act-fines-is-easier-than-collecting-them/5297110)
- CMS: [under-16 ban, scope and questions](https://cms.law/en/gbr/legal-updates/the-uk-social-media-ban-for-children-scope-implementation-and-outstanding-questions)
- House of Commons Library: [proposals to ban social media for children](https://commonslibrary.parliament.uk/research-briefings/cbp-10468/)
- CMS: [data protection complaints from 19 June 2026](https://cms.law/en/gbr/legal-updates/data-use-and-access-act-2025-new-statutory-rules-on-handling-data-protection-complaints-from-19th-june-2026)
- Ofcom: [online safety fees](https://www.ofcom.org.uk/online-safety/illegal-and-harmful-content/online-safety-fees-and-penalties), as summarised by [techUK](https://www.techuk.org/resource/ofcom-sets-out-final-plans-for-online-safety-fees-and-penalties.html)
- [Category threshold regulations 2025](https://statutoryinstruments.parliament.uk/instrument/TxW3BnVV)
- Dechert: [export controls on encryption products](https://www.dechert.com/knowledge/onpoint/2016/9/uk-eu-export-controls-on-encryption-products.html)
- Wiggin: [UK treatment of messaging services](https://www.wiggin.co.uk/insight/european-electronic-communications-code-uk-deprioritised-regulation-of-otts-ofcoms-focus-on-consumer-protection/)
- Pinsent Masons: [the UK's E-Commerce Regulations](https://www.pinsentmasons.com/out-law/guides/the-uks-e-commerce-regulations)
