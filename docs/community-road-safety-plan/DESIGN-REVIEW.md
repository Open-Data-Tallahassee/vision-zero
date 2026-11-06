# Design review

Checklist item 5.1. This is an `/impeccable critique` of the rendered site at http://localhost:3000, run on 2026-11-06 against branch `feat/community-site`.

- **Pages reviewed:** `/`, `/map` (filters, selection, list view), `/data`, `/cities/request`, a 404, and the `TextPage` template from source.
- **Widths and themes:** each page at 390px and 1440px, in light and dark.
- **Method:** two assessments run by separate agents that did not see each other's output.
  - A is a design review.
  - B is the detector scan, a browser overlay, and contrast and overflow measurements.
- **"Before" screenshots (0.6):** none exist, so there is no before/after comparison.

**Score: 27/40.** That sits at the top of the "acceptable" band. The score is from the first run, before any fixes. The Follow-up table at the end tracks what has been fixed since; a fresh critique would give a new score.

## Verdict

**Most of the site is clearly made for this project, but the map is not.**

What belongs to this project:
- the grayscale photographs of Tallahassee streets;
- the oak-coloured footer;
- the "Zero is the goal" panel;
- above all, the copy: "People killed: not counted yet", "This page isn't on the map", and "More dots in one place means more reported crashes there, not necessarily a more dangerous place". The copy is the site's strongest asset.

`/data` reads like a careful newsroom methods note.

The map is the most-used screen, and it looks like a stock Mapbox demo:
- a pale-blue city fill;
- navy and maroon roads;
- about 10,000 blue dots at 60% opacity that merge into a blanket at the default zoom;
- in dark mode, a bright white block.

None of the "printed annual" direction reaches it.

## Heuristic scores

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Loading and live counts are good. The desktop header shows no active page. |
| 2 | Match with the real world | 3 | Crashes have no street or place. Times are in 24-hour format, and `00:00` probably means "not recorded". |
| 3 | User control and freedom | 3 | "Return to your map" appears only at the top of a long `/data` page. |
| 4 | Consistency and standards | 2 | The area is called "Tallahassee" in some places and "Tallahassee (city limits)" in others. The home page mixes county and city figures. The phone chart says "by month" but shows quarters. |
| 5 | Error prevention | 3 | Date inputs are limited to the data range, and the form labels are clear. |
| 6 | Recognition rather than recall | 2 | The date range isn't shown above the map on phones. The `/data` table of contents is hidden on phones. |
| 7 | Flexibility and efficiency | 2 | There is no copy-link button, no street search and no sorting. Choosing Leon County doesn't zoom out to the county. |
| 8 | Aesthetic and minimalist design | 3 | The composed pages are strong. The map's dot blanket is not. |
| 9 | Error recovery | 3 | There is a focused error summary, empty and out-of-area states, and a list fallback when the map fails. |
| 10 | Help and documentation | 3 | `/data` is a model methods page and is linked in context. |

## What's working

1. **Honest copy about data limits is built into the interface.** The site says what the data can't show, right where people look. Few crash maps, official ones included, do this.
2. **The map is built for phones first.**
   - Filters sit behind a toggle next to a live count.
   - The map comes before the totals.
   - "Show 39 crashes" closes the panel.
   - All state is kept in the URL, so links reopen the same view.
3. **Forms and edge cases are handled with care.**
   - The error summary takes focus and links to each field.
   - Live regions announce changes.
   - There are recovery states for no results, an area outside the data, and a crash that is no longer in the results.
   - The 404 page matches the rest of the site.

## Priority issues

### P1: A visitor from a shared link can't tell the data ends in June 2021
**Problem:** at 390px, the strip above the map reads "39 crashes · 39 fatal · Leon County" with no dates. The note that crashes after June 30, 2021 aren't included sits about 1,000px further down. It is now late 2026, so readers will assume they are looking at recent crashes. USER-FLOWS.md requires that coverage is clear without visiting the overview.

**Fix:**
- In `website/src/components/explorer/Explorer.tsx` (the summary strip, around lines 121–125), add the active range: "39 fatal · Leon County · Jan 2020–Jun 2021".
- Pin a short "Data ends June 2021" tag to the top-left corner of the map.

### P1: Crashes have no place
**Problem:** the detail panel and the list show date, severity and who was involved, but no street or intersection. Fatal rows in the list read "Jun 16, 2021 · Fatal · Motor vehicle" again and again. A journalist can't cite a crash. A resident can't confirm "that's my corner". The list, which is the keyboard-accessible alternative to the map, can't answer "where".

**Fix:**
- Add the nearest road or intersection to `CrashFeature`. Take it from the FLHSMV fields where they exist, or reverse-geocode once at build time.
- Use it as the heading in the detail panel and as the first column of the list.
- Add a "Copy link to this crash" button.
- Show times in 12-hour format, and write "time not recorded" instead of `00:00` if that is what it means.

### P1: Map colours bury the deaths and break the direction
**Problem:** the custom Mapbox style (`CrashMapView.tsx:10`) uses:
- maroon motorways (`#980606`) and labels, close to the fatal red `#c0291d`;
- a blue city fill underneath blue vehicle dots.

Measured contrast (the WCAG 1.4.11 target for graphics is 3:1):
- Non-fatal dots at `circle-opacity: 0.6` (`CrashMapView.tsx:91`) reach only 2.4–2.6:1 even on white.
- On the motorway colour every dot drops to 1.0–1.5:1.
- All four dot colours have nearly the same lightness (1.04–1.16:1 against each other), so only hue separates them.
- Pedestrian orange against fatal red is the riskiest pair for colour-blind readers.

Nothing in the layer draws fatal dots on top.

**Fix:**
1. Restyle the basemap to grayscale ink on paper, so red is used only for deaths. Use a dark variant in dark mode.
2. Add `"circle-sort-key": ["case", ["get", "fatal"], 1, 0]` to the layer so fatal dots draw on top.
3. Raise non-fatal opacity, or keep it and add a thin stroke, so the dots reach 3:1.
4. Below zoom 13, show non-fatal crashes as a heatmap or as smaller dots.
5. When `geo=leon`, fit the view to the county bounds.

### P2: Tapping a crash on a phone moves the map out from under the finger
**Problem:** the detail `<section>` (`Explorer.tsx`, around line 280) is inserted above the map. At 390px a tap pushes the map down from y≈234 to y≈488, so the dot the user just tapped jumps away.

**Fix:** below `lg`, show the detail as a bottom sheet over the map, or order it after the map. Keep the current placement from `lg` up.

### P2: Home-page numbers change area without saying so
**Problem:**
- The hero tiles give Leon County figures (12,578 crashes, 39 fatal).
- The chart panel right after them defaults to the city (22 fatal).
- "218 crashes involved a person on foot" names no area.
- On phones the chart title says "by month" but shows quarters.
- The period in `MonthlyBars.tsx:75` is hard-coded instead of using `formatCoverage`.

A reporter will quote the wrong number, and a reader comparing 39 with 22 will think the site contradicts itself.

**Fix:**
- Default the chart to Leon County.
- Name the area on every figure.
- Title the phone chart "by quarter".
- Pass the coverage period to the chart as a prop.

### P2: The 404 page's button is hidden behind a tile at laptop sizes
**Problem:** the board in `website/src/app/not-found.tsx` sets each tile to half the screen height (`md:h-[calc(100svh-…)] md:grid-rows-2`). The message tile's content is 392px tall but the tile is only 350px, so "Explore the map" spills into the accent tile below, which covers it.
- At 1280×800 the button is 34px under the tile.
- At 1024×768 it is 17px under.
- At 1440×900 it clears.

The detector caught this (text-occlusion) and a manual check confirmed it.

**Fix:** let the message tile grow (`md:min-h-…` instead of a fixed height, or `grid-rows-[auto_1fr]`), or remove the fixed board height below `xl`.

## People who would hit these problems

**A resident opening a shared fatal-crash link on a phone**
- They see no dates and assume the crashes are recent.
- The crash has no street name, so they can't match it to the one a neighbour posted about.
- The map jumps when they tap a dot.
- The map opens on the city, so some county deaths are off-screen.
- "How to read this map" sends them to the top of a long page.
- There is no Share button.

**A journalist checking numbers**
- The home page gives 39, then 22, then 218 without naming the area each one covers.
- The list can't be sorted or searched, and its rows have no place.
- "People involved" includes people who weren't hurt, so it could be miscopied as casualties.
- `00:00` times are never explained.
- In fairness, `/data` does carry the methods notes they need. It should be linked from the numbers themselves.

**City staff presenting to the commission (desktop, dim room)**
- The dot blanket at the default zoom means fatal crashes don't stand out, and there is no density view.
- On `/map` the footer is about 800px tall.
- In dark mode the map stays a glaring white block.

## Minor observations

**Wording and labels**
- The area label is "Tallahassee (city limits)" in the map filters but "Tallahassee" everywhere else.
- "Report a broken link" on the 404 page goes to GitHub issues, and most residents don't have GitHub accounts.
- The desktop header has no active-page indicator. The phone menu repeats "Explore the map" outside the main nav list.

**Typography**
- `<strong>` on `/data` renders as faux bold, because only Boska weights 400 and 500 are loaded (`layout.tsx`). Use `font-medium` or load weight 700.
- 14px muted Boska in the filter hints and legend is tiring to read on phones. Consider a sturdier UI face for small labels.
- The phone chart labels ("2020 Q1") are about 13px in Boska, and the old-style figures make "Q1" look like "Ql".

**Layout and visibility**
- At 390px the photo credit in the "Zero is the goal" tile wraps to two lines and covers about a quarter of the image.
- The legend stays visible in List view.
- The `/data` "On this page" table of contents is `hidden lg:block`, so phones get no jump links.
- The city-request form needs two consent checkboxes just to submit a city name. Check whether the policy really requires both.

**Detector notes**
- Line length is about 86–87 characters (target under 80) in two `/data` paragraphs and one `/privacy` list item.
- Footer trailhead names wrap with one word left alone on the last line ("straggler"). This is advisory only.

## Detector and measurements

- **Source scan:** `impeccable detect` on `website/src` found nothing (61 files). It only runs text-pattern rules on source files, so that is an undercount.
- **Rendered-page scans and in-browser overlay:** run on `/`, `/map`, `/data`, `/privacy` and the 404. They found:
  - 1 text-occlusion (the 404 button, which is real);
  - 3 line-length warnings (minor);
  - 1 first-viewport column overflow on `/privacy`, a false positive because the long legal text is supposed to run long;
  - 11 stragglers (advisory).
- **Text contrast:** 0 failures across all 20 combinations of page, width and theme.
  - Lowest muted pair: muted text on surface-2 at 5.59:1.
  - Lowest fatal pair: fatal text on surface-2 at 4.70:1.
  - Text over photographs was not measured.
- **Map legend in dark mode:** the swatches pass 3:1 but only just, at 3.12–3.61:1.
- **Horizontal overflow at 390px:** none on any page.

## Questions worth asking

- Should a fatal crash get more than a data row? For example, a quieter panel ("One or more people died here on …") rather than the same component used for a fender-bender.
- If the map is the product, why is it the least designed screen?
- Do phone users need 10,000 non-fatal dots by default, or should the map open on deaths and pedestrians?
- The data is five years old. Should that be the loudest fact on the map, and the fundraising pitch?

## Follow-up

The table below tracks whether each item has been fixed. Update its Status as items are done.

| Item | Status |
|---|---|
| Date range on the map strip (P1) | done: the strip shows the active dates, and the map shows "Records end Jun 30, 2021" |
| Crash location field (P1) | done: street and cross street are the second line of the crash-details heading and a column in the list; people killed and seriously injured are shown on each crash |
| Grayscale basemap, fatal on top, dot contrast, county fit (P1) | done: monochrome Standard basemap with a night version for dark mode; the old red roads are hidden; the city limits are tinted with the lichen accent; fatal dots draw on top; nonfatal dots reach about 3:1; dark mode has lighter dot colours; Leon County fits the county |
| Phone detail as a bottom sheet (P2) | done: on phones in map view the detail floats as a card over the lower map, and the map pans the selected dot above it |
| Home-page area labels and chart (P2) | done: the chart opens on Leon County, the pedestrian figure names Leon County, and the phone chart says "by quarter"; the period comes from `formatCoverage` |
| 404 button covered by a tile (P2) | done: rows grow with their content; checked at 1280×800 |
| Mapbox logo covered by the phone sheet | done: the sheet floats 40px above the map's bottom edge, so the logo and attribution stay visible |
