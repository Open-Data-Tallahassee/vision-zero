# Community road safety website plan

Status: planning decisions approved; privacy and terms approval requirements added. Implementation and publication remain future work. Confirmed requirements are separated from proposals. No implementation is authorized by this document alone.

## Confirmed purpose and scope

Build a free resource for neighbors and the community, using the Florida crash data already collected, initially focused on Tallahassee. Serve residents with a simple overview and researchers/advocates with a deeper explorer. Improve website design and data reliability together.

Enable voluntary donations to help acquire data from where the collection stopped through the present. Let people request maps for their cities. This is community work, not a storefront: access and city requests must not require payment. Acquisition costs, complete coverage, recipient, payment destination, named operator, service providers, and final policy text remain unverified or undecided.

## Proposed experience

### Approved planning decisions

- Retain fatalities as a core first-release feature, including the fatal-crash map filter and clearly labeled fatality information. Distinguish fatal crashes (events) from fatalities (people killed); validate person counts before presenting a fatalities total. This is a labeling and accuracy requirement, not a proposal to remove fatalities.
- Default to Tallahassee city limits, with a clearly labeled Leon County option, subject to validating boundary data.
- Voluntary donations prioritize data acquisition and may also support necessary hosting and maintenance, with transparent disclosure.
- City requests carry no guaranteed delivery date, payment requirement, or donor priority.
- The improved site may launch with honestly labeled historical coverage while newer data is funded and obtained.
- Donations are general project support: prioritize missing data, carry surplus forward to future data and operating costs, and publish quarterly income/spending/progress updates. If funding falls short, acquire useful complete periods when feasible and disclose gaps.
- Accept Florida city requests initially; Tallahassee/Leon County remains the first delivery priority. Expansion considers community need, data availability, and local help, not contributions.
- Request city/county, optional email, and an optional explanation/help offer. Keep submissions private and publish only aggregated city interest, without response or delivery promises.
- Designate an Open Tallahassee maintainer for requests and funding updates. Enable each pathway only when its real destination and responsible operator are established; the overview and explorer may launch independently.
- First release includes overview, repaired explorer, accessible results, data requests/methodology, and community pathways ready to operate. Defer advanced trends, corridor rankings, accounts, and crash/near-miss reporting. Publish fatality and serious-injury measures only after validating definitions and person counts.

- No public dataset downloads. People may request data; this supersedes earlier download proposals. The free explorer and accessible on-screen results remain in scope.
- Include records in geographic totals only when reliable evidence supports that geography. Disclose unmapped records separately, never guess coordinates, and explain differences between overall totals and map points. Document boundary source and vintage.
- Review city requests monthly. Delete optional contact details and free text after 12 months unless active collaborators agree to continued contact; retain anonymous city-interest counts and provide a deletion contact.
- Complete planning with explicit implementation and launch prerequisites. Choose the final visual direction during design after reviewing the rendered site.

- Data requests are free and manually reviewed. Collect city/county, date range, desired information and reply email; intended use is optional. No account, donation, donor priority or guaranteed turnaround.
- Share reviewed crash-level information and aggregate injury counts only; exclude names, contact details and individual person records. Apply the same limits to browser-visible map data.
- Apply monthly review and 12-month deletion of data-request contact information/free text, with continued contact for ongoing collaboration by agreement and a deletion contact.
- Include Privacy Policy and Terms of Service pages and approval requirements. See [policy requirements](POLICY-REQUIREMENTS.md) for the proposed implementation of visitor acknowledgment and publisher approval.

### Planned pages

- Overview: explain the purpose, verified coverage, useful summary measures, and entry to the explorer.
- Explorer: map and accessible results, clearly labeled filters, synchronized totals, reset, and shareable URLs.
- Data and methodology: a data-request pathway, source attribution, definitions, coverage gaps, refresh history, and limitations.
- Support the work: explain the missing data and voluntary funding needs; publish costs and funding progress only when verified.
- Request a city: a free expression of community interest, with expectations and follow-up policy decided before launch.
- Privacy Policy and Terms of Service: accessible from the footer and relevant request forms, with effective dates and versions.
- About: Open Tallahassee's community role and ways to participate.

Proposed message: “Built by neighbors, for safer streets. Free for everyone.”

## User journeys and transitions

Follow the [user-flow plan](USER-FLOWS.md). The central journey is overview → map exploration → contextual explanations → return to the same map. From coverage explanations, visitors can optionally support updated data or request a map for their Florida city. Researchers can request data for their current selection. These are independent choices, not mandatory steps in a donation funnel.

Preserve map filters and viewport across learning pages, request forms and donation handoffs. Distinguish request receipt from fulfillment and confirmed payment from a canceled or unverified return. Validate the mobile, keyboard, empty-state and error-recovery walkthroughs before release.

## Evidence from the repository

Source review only; no rendered UI audit or data reconciliation has been completed.

- `website/src/utils/combineYearQuarterData.ts` requests 2020 Q1–Q4 and 2021 Q1–Q2 and includes an import-time example invocation.
- `website/src/components/CrashMap.tsx` hardcodes a June 2023 update label and May–June 2021 default dates.
- `website/src/utils/mapConfig.ts` equates the injury filter with `is_fatal = 0`; nonfatal does not establish an injury.
- `website/src/components/Navbar.tsx` routes both data download items to `/`.
- Existing documentation describes Leon County selection, while the site is named for Tallahassee. Geographic coverage must be explicit.
- Collected files describe multiple periods; filenames alone do not establish complete coverage or the acquisition cutoff.

## Database architecture

Use Neon Postgres with Prisma for server-side database access and Prisma Migrate for schema changes. Follow the [Neon + Prisma implementation brief](NEON-PRISMA.md), which adapts the supplied setup commands to the `website/` app root, preserves the specified Neon project, and defines build and end-to-end verification. This is a documented implementation task; no provisioning or migration has run.

## Delivery sequence and acceptance

### 1. Establish the data baseline

Inventory source files and hosted data; verify source provenance, coverage by period, unique crash identifiers, participant joins, severity codes, timestamps, coordinate validity, and duplicates. Separate crashes from people injured or killed. Distinguish city limits from county coverage. Retain and disclose unmapped records in appropriate totals.

Acceptance: a reproducible coverage report and reconciled counts; documented definitions and exclusions; a verified missing-period list suitable for requesting acquisition quotes.

### 2. Repair the explorer

Correct severity semantics and date bounds; add labeled controls, all-severity and reset options, result counts, accessible results, loading/error/empty states, and mobile filters. Validate data at the boundary, remove duplicate fetch side effects, harden pagination, and clean up map lifecycle behavior. Retain Next.js, Tailwind, and Mapbox unless evidence warrants a change.

Acceptance: filters agree across map, results, and totals; date boundary and duplicate cases are tested; failures are understandable and recoverable.

### 3. Shape and apply the design

Use Impeccable for hierarchy, accessibility, responsive behavior, and states. Use design-taste-frontend for typography, spacing, restrained color, and cohesive composition. Review the rendered incumbent before choosing a final visual direction. Keep the map central and establish consistent navigation and controls.

Acceptance: clear overview-to-explorer journey, readable mobile layouts, keyboard access, meaningful color with non-color alternatives, and verified loading/empty/error layouts.

### 4. Publish the community pathways

Replace download navigation with “Request data” and publish methodology pages. Do not provide public bulk downloads or self-service exports. Implement the approved manual data-request workflow and establish its operational destination before enabling submissions. Add optional donations once recipient, costs, purpose, and handling are established. Add free city requests once ownership, privacy, follow-up, and prioritization are agreed. Do not imply official government status, guaranteed delivery, or tax deductibility without supporting facts.

Acceptance: real destinations, honest expectations, tested submission/payment handoffs, and an agreed operational owner. No payment requirement for data access or requests.

### 5. Add validated analysis

Add monthly patterns, severity summaries, and road-user breakdowns only after the data baseline supports them. Label incomplete periods and avoid treating crash frequency as exposure-adjusted risk. Corridor/intersection rankings need their own documented method.

Acceptance: charts and fulfilled data requests reconcile with the explorer under equivalent filters; limitations are visible.

## Implementation and launch checklists

The following are work to complete, not assertions that verification has happened.

### Core historical-data release

- [ ] Verify source coverage, missing periods, duplicates, severity definitions and person/crash totals.
- [ ] Select and document authoritative city/county boundary data and its vintage.
- [ ] Reconcile mapped, unmapped and geographically unclassified records.
- [ ] Implement validated filters, shareable state, accessible on-screen results and failure states.
- [ ] Review the current rendered site and establish the visual direction using the design skills.
- [ ] Build overview, explorer, methodology and about content with accurate coverage labels.
- [ ] Replace download calls to action with the agreed data-request pathway; omit bulk export endpoints and public dataset links.
- [ ] Review data sent to the browser: hiding a download button does not make map payloads private. Decide the permitted public map fields before implementation.
- [ ] Verify keyboard access, phone layouts, counts and filters; complete applicable build/lint checks.
- [ ] Complete the user-flow walkthroughs, including direct map entry, contextual learning, return-state restoration, city/data requests and donation cancellation.

### Community pathways (independent launch gates)

- [ ] Verify acquisition cutoff and obtain current quotes before publishing a funding target.
- [ ] Establish donation recipient, payment destination, responsible maintainer and quarterly reporting process.
- [ ] Establish city-request destination, operator, monthly review and 12-month deletion process.
- [ ] Implement approved data-request fields, manual review, delivery limits and retention; establish the destination and maintainer.
- [ ] Test real submission/confirmation/error flows and payment handoff before enabling each pathway.
- [ ] Publish honest availability and expectations. Unready pathways do not block the core historical-data release.

### Privacy and terms publication

- [ ] Inventory actual collected fields, logs, cookies/storage, map services, hosting, form/email services, and payment providers.
- [ ] Draft policies matching those actual practices and the approved request-retention and sharing rules.
- [ ] Identify the responsible publisher and privacy/deletion contact; obtain their approval of the exact policy versions before publication.
- [ ] Add linked, unchecked Terms agreement and Privacy acknowledgment to city/data request forms; validate on the server and record policy version and acceptance time with the submission.
- [ ] Keep optional updates or ongoing-collaboration permission separate from required request acknowledgments.
- [ ] Verify keyboard access, linked policy access, missing-acceptance errors, version recording, and retention/deletion behavior.
- [ ] Review the donation handoff and identify which policies and acceptance steps belong to the payment provider.

## References

- https://www.boston.gov/departments/transportation/vision-zero
- https://experience.arcgis.com/experience/429eb72636804cf3ba5f68fc05ac7a53
- https://app.powerbigov.us/view?r=eyJrIjoiZjhiMDVmNDctM2QwZC00NDZjLTgwMmUtMjI0ZTZiNGJkNTgxIiwidCI6Ijg1NTI4ODdjLWNiYzMtNGVlNS05ZmQzLWVhMjE3ZTMwMjZmYyJ9
- https://experience.arcgis.com/experience/bae68e65908f45e1bcc86fe5f089d266/page/

Boston's readable page supports the mission/maps/dashboard/reports organization. Embedded dashboards did not expose readable contents during retrieval; visual review remains outstanding. Boston's source definitions must not be transferred to Florida data without validation.

## Decisions and next steps

See [INTERVIEW.md](INTERVIEW.md) for the decision tree and current questions, and [the glossary](../../GLOSSARY.md) for agreed language. Record answers as they arrive. Create ADRs only for consequential, costly-to-reverse choices involving a real trade-off; none is warranted yet.
