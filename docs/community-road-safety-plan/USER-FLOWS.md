# User journeys and navigation

Status: implementation plan, not a rendered design. Builds on the approved free community purpose, historical-data release, optional donations and Florida city/data requests.

## Experience goal

Help a neighbor answer a question about local crashes, understand what the evidence does and does not show, and choose whether to help or ask for coverage elsewhere. Exploring and learning are successful outcomes on their own. Donations and requests are optional next steps, never requirements to continue.

## Navigation and entry points

Use consistent primary navigation: **Explore the map**, **Understand the data**, **Request a Florida city**, and **Support the work**. The project name returns to the overview. Put **About**, **Privacy**, and **Terms** in the footer; place **Request data** prominently within the methodology page and explorer's supporting actions so it is not confused with requesting a city map.

The overview's primary action is **Explore the map**. Explain the community purpose and show verified geography and date coverage before entry. A short explanation below the map introduction links to **Understand the data**; later sections introduce supporting updates and requesting another Florida city.

Visitors may arrive directly at a shared map URL, methodology page, donation page or city-request page. Every page must explain its purpose independently and provide a clear route to the map. Do not require a homepage visit or tutorial first.

## Resident journey: explore, then understand

1. From the overview, choose **Explore the map**; start with Tallahassee and clearly show the selected dates. Offer Leon County as a labeled alternative.
2. Pan/zoom or use the available geography, date, severity and road-user filters. Display results and map/list alternatives together with coverage information.

   Keep the fatal-crash filter prominent within severity controls. Explain that it selects crashes involving at least one fatality; any displayed fatalities total counts people killed, separately from fatal-crash results.
3. Select a crash to see permitted crash-level details. Use plain language and link unfamiliar definitions to their exact explanation under **Understand the data**.
4. Offer **How to read this map** near the legend and **About these numbers** near summary totals. These lead to relevant explanations, not a generic page top.
5. Provide **Return to your map** from explanatory pages, restoring filters, viewport and selected result where still valid.

The learning page explains crashes versus people injured/killed, fatal versus nonfatal/unknown injury, city versus county coverage, missing locations, incomplete periods and source limitations. It must not equate fewer observed crashes with a safer route or present counts as exposure-adjusted risk.

## Support journey: understand the gap, then choose to help

Place a modest **Help update this data** link beside the coverage explanation and at the end of the methodology's missing-period section. Keep it outside map popups and filter interactions. Do not interrupt exploration with timed donation modals or tie a fundraising appeal to an individual crash.

The support page should answer, in order:

1. What data is available and what periods are missing?
2. What would newer records help neighbors understand?
3. How will voluntary contributions support acquisition first and necessary operating costs?
4. Who receives the money, and where are funding/spending updates published?
5. How can someone donate, or return to exploring without donating?

Show a target/progress only when supported by verified costs and accounting. The action **Donate to support the work** hands off to the established provider with clear recipient and policy links. Preserve the map return state before handoff.

On return, distinguish confirmed payment, pending/unknown status and cancellation. A return URL alone is not proof of payment. Thank confirmed donors without granting access or priority; offer **Return to your map**. A canceled donation should return gracefully with no loss of access or repeated pressure. If payment handling is not ready, publish factual support information without a fake or dead donation control.

## Expansion journey: request a Florida city

Introduce **Want a map for your Florida city?** in the overview, in the explorer's coverage explanation, and in navigation. Panning outside supported coverage should show **Outside available coverage**, not zero crashes; offer return to Tallahassee and the city-request link. Do not add address search solely to support this flow unless separately scoped.

On the request page, explain that requests are free, currently Florida-only, and considered according to community need, available data and local help. Tallahassee/Leon County remains the initial priority. No donation, response date or delivery guarantee is implied.

Collect city/county, optional email and optional context/help offer. Require linked Terms agreement and Privacy acknowledgment, initially unchecked. Validate geography and fields accessibly. Retain entries through errors and policy-page visits; announce errors and move focus appropriately.

After successful storage, show **Your city request was received** and what happens next: monthly review, no guaranteed timeline, and contact only if an email was provided. Offer **Explore the Tallahassee map** or return to the visitor's prior view. Do not insert a donation step or suggest that paying accelerates the request. Distinguish city expansion from asking for an existing dataset.

## Research journey: understand, then request data

From the map, **Request data for this selection** opens the data-request form with geography and date range prefilled and editable. Display other filter context as a request summary, not a promise of an immediately available extract. From methodology, **Request data** opens the same flow without assuming previous filters.

Explain manual review, free access, permitted data fields and lack of guaranteed turnaround. Collect desired information and reply email; intended use is optional. Apply the same policy acknowledgments and accessible error behavior as city requests. Confirmation means receipt, not approval or delivery. Provide **Return to your map** and a methodology link. There is no public export/download button.

## State, mobile and recovery behavior

- Encode only public exploration state in the map URL: geography, dates, filters, viewport and permitted selected-result identifier. Never put email, request text, consent records or payment information in URLs.
- Use an allowlisted same-origin return destination. Browser Back and explicit return links restore the map; fresh visits without saved context use documented defaults. Avoid open redirects.
- Keep unsent form entries only for the session needed to complete the form and policy reading; clear after success. Do not place personal information in persistent browser storage by default.
- On phones, keep **Map / List** and **Filters** easy to reach, with an obvious close/back action. Contextual learn/support links belong in the results/coverage area, not over map controls.
- Zero matching results offers **Clear filters** or a date adjustment. Missing coverage, missing coordinates and failed loading have distinct explanations. A technical failure never becomes a fundraising prompt.
- If a selected crash disappears after a dataset update, preserve valid filters, explain that the selection is unavailable, and return to results rather than showing a broken panel.
- Submission success requires server confirmation. Prevent accidental duplicate submissions; preserve input on recoverable failure. If a request pathway lacks an operator or destination, state its unavailability without accepting submissions that nobody will handle.

## Acceptance walkthroughs

- [ ] New resident: overview → filtered map → injury definition → return with the same map state.
- [ ] Shared-link visitor: open a filtered map directly → understand coverage without visiting the overview.
- [ ] Interested supporter: map coverage → support explanation → provider handoff → confirmed/pending/canceled return with correct messaging and restored map state.
- [ ] Florida neighbor: outside-coverage explanation → city request → policies → submit without email or donation → receipt confirmation.
- [ ] Researcher: map selection → prefilled editable data request → policies → validation error recovery → receipt confirmation → same map.
- [ ] Keyboard/mobile visitor: complete exploration and request flows with visible focus, readable labels, accessible errors and no map-only dependency.
- [ ] All visitors: decline donations, skip requests and continue using the resource freely.

Use these walkthroughs to judge the design. Do not add visitor tracking or collection of map-location histories just to measure a donation funnel; any future analytics requires a separate scope/privacy decision.
