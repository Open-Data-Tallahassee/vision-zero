# Privacy and Terms of Service approvals

Status: planning requirements, not final policy text or a legal-compliance determination. The user requested privacy and terms approvals. This plan interprets that as visitor acknowledgment on request forms and approval of final text by the responsible publisher before publication.

## Privacy Policy contents

Describe the actual site operator and privacy contact, information collected, purposes, access, service providers, retention, deletion requests and policy changes. Inventory hosting logs, map-provider requests, browser storage, form/email services and payment handoffs before making claims about them. Do not promise “no tracking” or “no sharing” without verifying the deployed behavior.

Reflect the approved project rules:

- City requests: city/county, optional email and optional explanation/help offer. Submissions stay private; only anonymous aggregate city interest is published.
- Data requests: city/county, date range, desired information and reply email; intended use is optional. Requests receive manual review.
- Requests are reviewed monthly. Contact details and free text are deleted after 12 months unless ongoing collaboration continues by agreement; provide a deletion contact. Implement that lifecycle for stored requests and describe relevant copies/backups accurately.
- Shared datasets and browser-visible map data exclude names, contact information and individual person records; permitted information is reviewed crash-level fields and aggregate injury counts.
- Document donation-provider processing separately from information held by the project. Do not assume request-retention rules apply to financial records.

## Terms of Service contents

Explain the free community purpose, who operates the site, historical coverage and limitations, acceptable use, and the distinction between city requests and data requests. State that requests do not guarantee delivery or a response date, donations are voluntary general project support, and donations do not buy priority. Explain that there are no public dataset downloads and how people can request data.

Identify source attribution and applicable data-use conditions after verifying them. Do not invent redistribution permissions, tax status, legal waivers, jurisdiction clauses or guarantees. Exact terms need review against the actual operating arrangement before publication.

## Visitor approval flow (proposed implementation)

City and data request forms include two unchecked controls, linked to readable policy pages:

- “I agree to the Terms of Service.”
- “I acknowledge the Privacy Policy and how my request information will be used.”

Treat the second as acknowledgment of a notice, not blanket consent to unrelated processing. Do not add marketing or optional updates to these controls. If optional communications are later introduced, give them separate, unchecked permission.

Allow visitors to read the policies without losing their form entries. Validate the required controls on the server and associate the accepted policy versions and acceptance time with the request, without adding unnecessary identity fields. Define acceptance-record retention alongside the request lifecycle rather than retaining it indefinitely. Show clear errors when acknowledgment is missing.

Keep browsing the public map free of a mandatory acceptance wall. For donations, review the hosted provider's flow and clearly link project policies before handoff; avoid duplicating or misrepresenting the provider's own terms.

## Publisher approval before release

Prepare the final text only after the operator, contact, providers and actual data practices are known. Record the approving publisher, policy version and approval date. Version and date the published policies and define how substantive changes will be communicated. Final wording and any legal-review needs are release tasks, not conclusions established by this planning document.

The core website needs accurate policies for its deployed behavior. Request and donation features additionally require policies and approvals covering their specific processing before those features are enabled.
