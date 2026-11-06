# Planning interview

## Clarification: retain fatalities

The user explicitly wants to retain fatalities, consistent with the existing site's purpose and Boston inspiration. The former glossary “Avoid” wording was about not using person counts as synonyms for crash counts; it was not a feature-removal decision. That ambiguous wording has been removed. Preserve fatal-crash filtering and fatality information, and label event counts separately from people killed.

## Settled roots

- Audience: residents plus advocates/researchers, with overview and deeper explorer.
- Scope: design plus data reliability.
- Purpose: free community benefit, not selling access or maps.
- Contributions: voluntary support for obtaining newer crash data.
- Expansion: allow people to request maps for their cities.

## Round 1: approved

The user approved all four recommendations in this round.

1. Geography: lead with Tallahassee city limits and offer a clearly labeled Leon County option? Recommended: yes, subject to validating boundary data.
2. Donation purpose: allow contributions to support data acquisition first and necessary hosting/maintenance as well, with clear disclosure? Recommended: yes. This avoids promising every dollar buys records when operating costs exist.
3. City request meaning: collect interest with no guaranteed delivery date, no payment requirement, and no donor priority? Recommended: yes. Prioritization can then be designed around community need, feasible data access, and local help.
4. Release boundary: allow the repaired explorer and honest historical coverage to launch before newer data is funded and obtained? Recommended: yes. Do not describe historical coverage as current.

## Round 2: approved

The user approved all five recommendations in this round (Q5–Q9).

1. Funding policy: treat donations as general project support, prioritize missing data, carry surplus forward to future data/hosting, and publish quarterly income/spending/progress summaries. If funding falls short, acquire useful complete periods when feasible and disclose remaining gaps.
2. Expansion scope: accept Florida city requests initially, while keeping Tallahassee/Leon County the first delivery priority. Rank expansion by community need, feasible data access, and available local help, never donations.
3. Request handling: collect city/county, optional email and optional explanation/help offer; keep submissions private; publish only aggregated city interest. Explain that no response date or map delivery is guaranteed. Decide retention once the handling workflow is chosen.
4. Operational ownership: designate an Open Tallahassee maintainer for requests and funding updates; enable donations and submissions only once a real recipient/destination and responsible operator are established. The overview/explorer can launch independently.
5. First-release scope: overview, repaired explorer, accessible results, downloads/methodology and ready community pathways; defer advanced trends, corridor rankings, accounts and crash/near-miss reporting. Show fatalities/serious injuries only when definitions and person counts are validated.

## Round 3: approved with Q10 correction

The user approved Q11–Q13 and replaced Q10 with no public downloads; people may request data.

10. Corrected decision: no public dataset downloads. Provide a data-request pathway instead. The proposed delivery fields and handling policy are not approved by this correction. This supersedes downloads in the earlier release scope.
11. Missing-location policy: include records in geographic totals only when their geography is supported by reliable evidence; report unmapped records separately and never guess coordinates or silently discard them. State why mapped-point and overall totals may differ. Document the boundary source and vintage used.
12. Request lifecycle: review requests monthly without guaranteeing a response date; delete optional contact details and free text after 12 months unless the person is actively collaborating and agrees to continued contact. Retain anonymous city-interest counts and provide a deletion contact.
13. Planning completion: finish the plan with implementation and launch checklists, leaving verified coverage, acquisition quotes, boundary source, named operator, recipient and provider as explicit prerequisite tasks. Do not invent these facts or block the entire historical-data release on donation/request readiness. Select the final visual direction during the design phase, following a rendered review.

## Round 4: approved

The user approved Q14–Q16. These recommendations are accepted decisions.

14. Intake and handling: recommend a free, manually reviewed request for city/county, date range, desired information and reply email, with optional intended use; no account, payment, donor priority or promised turnaround. Assign a maintainer before enabling intake.
15. Delivery and public map boundary: recommend sharing only reviewed crash-level fields and aggregate injury counts, excluding names, contact details and individual person records. Apply the same field minimization to browser-visible map data. No public bulk download links or export endpoints. A public interactive map necessarily exposes some data to its visitors.
16. Retention: recommend monthly review and deletion of request contact details and free text after 12 months, except ongoing collaboration with consent; provide a deletion contact. Keep private fulfillment records only as needed for that lifecycle.

## Additional requirement: privacy and terms approvals

The user requested privacy and Terms of Service approvals. Add policy pages, request-form acknowledgment/agreement, and publisher approval of final policy text. Detailed implementation is documented in POLICY-REQUIREMENTS.md; these details are a planning interpretation, not approval of policy text that has not yet been written.

## Remaining prerequisites and dependent work

- Geography → boundary vintage, default extent, unmapped records, consistent totals.
- Funding purpose → recipient/owner, restricted versus general support, surplus/shortfall policy, reporting cadence, payment service.
- City request meaning → eligible geography, prioritization, response owner, minimum fields, retention and public/private visibility.
- Release boundary → milestone contents, operational readiness, evidence for launch, maintenance ownership.
- Data inventory and acquisition facts → verified cutoff, quote, target amount, update cadence.
- Audience and scope → overview measures, advanced explorer needs, requested-data contents and accessibility acceptance.

Planning interview complete for the agreed scope. Q10 was corrected; all other interview recommendations were approved. Remaining facts, final visual direction and exact policy text are explicit implementation/publication prerequisites, not silently assumed decisions. No website implementation or policy publication has occurred.

## Additional requirement: Neon with Prisma

The user selected Prisma for database access and supplied Neon organization/project/production-branch setup instructions. NEON-PRISMA.md adapts those instructions for this repository and defines implementation evidence. No new ORM-choice interview is needed; actual provisioning, schema design and verification remain implementation work.

## Additional requirement: connected user journeys

The user requested explicit flow between map exploration, learning, donations and Florida city requests. USER-FLOWS.md records proposed navigation, contextual actions, return-state behavior, form/payment outcomes and acceptance walkthroughs within the already approved scope. No new donation requirement, public download or visitor analytics is introduced.
