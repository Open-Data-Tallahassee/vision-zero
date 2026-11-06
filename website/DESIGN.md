---
name: Vision Zero TLH
description: A free, community-built map of traffic crashes in Tallahassee and Leon County.
colors:
  paper: "#ffffff"
  paper-grey: "#f1f2ee"
  paper-grey-deep: "#e4e7e0"
  ink: "#1d221f"
  pencil: "#545b55"
  rule: "#c9cec7"
  spanish-moss: "#cfe4bd"
  moss-ink: "#1d221f"
  live-oak: "#1f3a2b"
  live-oak-ink: "#ffffff"
  live-oak-1: "#2c4a39"
  live-oak-2: "#36583f"
  live-oak-3: "#4d7058"
  signal-red: "#c0291d"
  signal-red-dot: "#c0291d"
  pedestrian-rust: "#b5491a"
  bicyclist-ochre: "#8a6a00"
  vehicle-slate: "#2f6f8f"
typography:
  display:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "clamp(4rem, 7.4vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "clamp(2rem, 1.3rem + 3.2vw, 4rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.005em"
  label:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  none: "0px"
spacing:
  gap: "8px"
  margin: "clamp(1rem, 0.6rem + 1.6vw, 2rem)"
  tile-pad: "20px"
  tile-pad-sm: "24px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.live-oak}"
    textColor: "{colors.live-oak-ink}"
  button-quiet:
    backgroundColor: "{colors.paper-grey-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
    typography: "{typography.body}"
  button-quiet-hover:
    backgroundColor: "{colors.spanish-moss}"
    textColor: "{colors.moss-ink}"
  toggle-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    height: "44px"
  toggle-unselected:
    backgroundColor: "{colors.paper-grey-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "44px"
  toggle-fatal-selected:
    backgroundColor: "{colors.signal-red-dot}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    height: "44px"
  field-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "48px"
    typography: "{typography.body}"
  tile:
    backgroundColor: "{colors.paper-grey}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.tile-pad}"
  tile-oak:
    backgroundColor: "{colors.live-oak}"
    textColor: "{colors.live-oak-ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.tile-pad}"
  tile-moss:
    backgroundColor: "{colors.spanish-moss}"
    textColor: "{colors.moss-ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.tile-pad}"
  photo-credit:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "4px 20px"
---

# Design System: Vision Zero TLH

This file describes the system as shipped. The source of truth is `src/app/globals.css` (tokens) and `tailwind.config.ts` (the names Tailwind uses for them). If you change a value, change it there first and then here. The frontmatter keys are descriptive names; the CSS variable and Tailwind class for each one are listed under Colors.

## Overview

**Creative North Star: "The Printed Annual"**

The site reads like a civic annual report printed on good paper. It is serious, local and plainly written, and it is about real people who died on real streets.

- **Layout:** pages are boards of flat, square-cornered tiles separated by a thin 8px gutter, like a page made of pasted-up panels.
- **Type:** one serif face, Boska, carries everything from the 7.5rem wordmark to the 13px credit line. Hierarchy comes from size, not weight.
- **Photographs:** street photographs of Tallahassee, shown in grayscale and credited on the picture itself.
- **Colour:** comes from the city's canopy roads. Live-oak green for the large fields and footer, Spanish-moss green for the pale accent tiles. Signal red belongs to deaths, on data only.

The map is the product, and it follows the same idea: a monochrome basemap (Mapbox Standard, monochrome theme), the city limits tinted with moss, and coloured dots on top. In dark mode the whole system, map included, moves to a near-black ground. Some colours keep their meaning and only lighten enough to stay readable.

The copy is part of the design. Sentences are plain, numbers say what they count and what area they cover, and the limits of the data are stated where people look ("People killed: not counted yet"). New screens should keep that voice.

**Key Characteristics:**
- Flat tiles, an 8px gap, no radius, no shadows except the floating crash card.
- One serif family (Boska 400 and 500), very large display type with tight tracking.
- Grayscale photographs of Tallahassee streets, always credited on the image.
- Live-oak and Spanish-moss greens for fields; red only for fatal crashes.
- Phone first: every page is designed at 390px before desktop.
- Light and dark themes, with the map following the theme.

## Colors

The palette is paper and ink, plus two greens from the canopy roads and a small set of data colours that are used on data and nowhere else.

### Primary
- **Live Oak** (#1f3a2b; `--field-2`, Tailwind `oak`): the big fields. Used for the home chart panel, the footer, the header mark tile, the 404 link tile and the hover state of the primary button. White text (`--field-2-ink`, Tailwind `oak-ink`) sits on it. The `live-oak-1` to `live-oak-3` steps (#2c4a39, #36583f, #4d7058; Tailwind `oak-1` to `oak-3`) are the chart's toggles and bars.

### Secondary
- **Spanish Moss** (#cfe4bd; `--accent`, Tailwind `accent`): pale accent tiles ("Zero is the goal", the fatal-crash tile on the home page, the map's coverage note), the hover state of quiet buttons, text selection, the peak bar in the chart, focus rings on dark fields, and the city-limit fill on the map. Ink text (`--accent-ink`) on it.

### Data colours (map dots and legend only)
- **Signal Red** (#c0291d; `--fatal-dot`, Tailwind `fatal-dot`): a fatal crash. It is the largest dot, has a ring, and draws on top. It is also used for the selected Fatal filter.
- **Pedestrian Rust** (#b5491a; `--pedestrian`), **Bicyclist Ochre** (#8a6a00; `--bicyclist`), **Vehicle Slate** (#2f6f8f; `--vehicle`): nonfatal crashes by the most vulnerable person involved.
- **Fatal text** (#c0291d; `--fatal`, Tailwind `text-fatal`): fatal counts and the word "Fatal" in running text and lists. In dark mode it becomes #ff8f84.
- **Ring colours:** `--map-ink` (#1d221f) rings the selected crash; `--map-paper` (#ffffff) rings fatal crashes.

### Neutral
- **Paper** (#ffffff; `--bg`, Tailwind `ground`): the page ground.
- **Paper Grey** (#f1f2ee; `--surface`, Tailwind `surface`): the default tile: header tiles, hero text tile, filter panel, totals.
- **Deep Paper Grey** (#e4e7e0; `--surface-2`, Tailwind `surface-2`): unselected toggles, quiet buttons, photo placeholders, the mobile menu.
- **Ink** (#1d221f; `--ink`, Tailwind `ink`): all running text, the primary button, selected toggles, and the dark "crashes reported" tile.
- **Pencil** (#545b55; `--muted`, Tailwind `muted`): secondary notes, field hints and table headers. Never body text.
- **Rule** (#c9cec7; `--line`, Tailwind `line`): input borders and table row rules. It is decorative (1.6:1), so it is never the only sign of a control's edge.

### Dark theme
`:root[data-theme="dark"]` overrides these tokens. An inline script in `<head>` sets `data-theme` before first paint, and the header toggle saves the choice.
- Ground #111612, surface #1a211c, surface-2 #262f28, ink #e8ece5, muted #a7b1a8, line #3b463e, accent #bcd7a6, fatal text #ff8f84.
- Dots lighten so they stay at about 3:1 or better on the night basemap: fatal #f05a4b, pedestrian #e07a45, bicyclist #c9a227, vehicle #5fa3c7. The rings swap: `--map-ink` #e8ece5, `--map-paper` #111612.
- Live oak and its ink stay the same in both themes.
- Photographs drop to 86% brightness so they don't glare.

### Named Rules
**The Red Means Death Rule.** Red (`--fatal-dot` / `--fatal`) marks fatal crashes and nothing else. It is never used for decoration, errors that aren't about deaths, links, or emphasis. The one exception is form validation, which uses `--fatal` for invalid fields because a second red would be worse.

**The Fields Not Accents Rule.** The greens are used as whole tiles and panels, not as thin lines, badges or text colour. A tile is either paper, ink, oak or moss.

**The Data Colours Stay On The Map Rule.** Pedestrian, bicyclist and vehicle colours appear only in map dots and the legend that explains them.

## Typography

**Display Font:** Boska (self-hosted from `src/app/fonts`, weights 400, 400 italic and 500), falling back to Georgia, serif.
**Body Font:** Boska.
**Label Font:** Boska.

**Character:** a high-contrast display serif used at every size, from the huge wordmark to the photo credits. It gives the site the voice of a printed report. Contrast between levels comes from size and tracking only; headings stay at weight 400.

### Hierarchy
All sizes are fluid `clamp()` steps defined as `--step-*` in `globals.css` and exposed as Tailwind `text-*` sizes.
- **Display** (400, `clamp(4rem, 7.4vw, 7.5rem)`, line-height 0.92, tracking -0.05em; `text-display`): the home hero wordmark and the 404 number. One per page at most.
- **Headline** (400, `clamp(2rem, 1.3rem + 3.2vw, 4rem)`, line-height 1, tracking -0.02em; `text-head`): page titles on text pages and the big counts in the map's totals.
- **Title** (400, `clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)`, line-height 1.35; `text-lead`): lead paragraphs, the crash-detail heading, mobile menu links.
- **Body** (400, `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)`, line-height 1.5, tracking 0.005em; `text-body`): running text, buttons, labels, navigation. Long text is limited to 68ch (`.prose-page`).
- **Label** (400, `clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)`, line-height 1.45; `text-small`): hints, legend, table headers, photo credits.

Some one-off sizes go above these steps and are set inline with `clamp()`:
- the footer wordmark (up to 10.5rem);
- the chart total (up to 10.5rem);
- the pedestrian figure (up to 8.25rem);
- prose `h2` (`clamp(1.625rem, 1.2rem + 1.4vw, 2.25rem)`).

Figures use `tabular-nums` wherever numbers sit in rows or change live.

### Named Rules
**The One Family Rule.** Boska is the only typeface. Don't add a sans for UI labels or a monospace for numbers. If small text needs help, change its size or colour, not its family.

**The No Faux Bold Rule.** Only weights 400 and 500 are loaded. Use `font-medium` for emphasis; `font-bold` and `<strong>` without a class render a synthetic bold.

## Layout

- **Phone first.** Every page is designed and checked at 390px before desktop. Base Tailwind classes are the phone layout; `sm:` (640px), `md:` (768px) and `lg:` (1024px) add to it. On phones the primary action and the key content are on the first screen.
- **The board.** Pages are grids of tiles with an 8px gap (`--gap`) and 8px padding around the board. From `lg` up, hero boards fill the screen below the header (`calc(100svh - 60px - 2 * var(--gap))`, minimum 640px) in a 2 × 2 grid. On phones the tiles stack.
- **Page margin.** Text that isn't in a tile uses `.page-frame`, which pads by `--margin` (`clamp(1rem, 0.6rem + 1.6vw, 2rem)`).
- **Tile padding.** 20px (`p-5`), 24px from `sm` (`sm:p-6`).
- **Text pages** (`TextPage`): on phones, a short photo band (22svh), then the title and text. From `lg` up, a sticky photo and side notes fill the left 42%, and the text runs beside them.
- **Map page.** On phones the order is the Filters toggle and the live count strip, then the map (62svh), then the totals and coverage. From `lg` up, filters, totals and coverage sit in a 380px left column and the map fills the rest of the screen.
- **Touch targets.** Buttons and toggles are at least 44px tall (`min-h-11`); primary buttons and inputs are 48px (`min-h-12`).

## Elevation & Depth

The system is flat. Depth comes from tone (paper, grey, deep grey, ink, oak), not shadow. Tiles sit side by side on the same plane, separated by the gap, never stacked.

### Shadow Vocabulary
- **Floating card** (`box-shadow: 0 6px 24px rgb(0 0 0 / 0.22)`): only the phone crash-detail card that floats over the map. It is the one element that sits on top of another.

### Named Rules
**The Flat Board Rule.** No shadows, blurs or glows on tiles, buttons or panels. An element gets a shadow only when it floats over the map.

## Shapes

- **Corners:** square everywhere (`--radius: 0px`). Buttons, inputs, tiles, toggles and the floating card all have square corners.
- **Round shapes:** used only where they mean something: the map's crash dots, their legend swatches, and the zero in the site mark.
- **Photographs:** cropped with `object-cover` to fill their tile, in grayscale with a little extra contrast (`grayscale contrast-[1.05]`).
- **The mark:** a zero crossed by three crosswalk stripes (`Mark.tsx`). The favicon uses the same drawing.

## Components

### Buttons
Square, solid and quiet. A button is a filled block with the label in body type.
- **Shape:** square corners (0px), at least 48px tall, 24px side padding.
- **Primary** (`.button`): ink background, paper text. Hover changes it to live oak with white text. Active nudges it down 1px.
- **Quiet** (`.button-quiet`): deep paper grey with ink text. Hover changes it to Spanish moss. Used for secondary actions such as "Reset filters" and "Return to your map".
- **Focus:** a 3px ink outline offset 3px on every focusable element. On oak and other dark fields the outline is moss.
- **Text links:** underlined with a 0.18em offset. The `.text-link` style uses a 2px underline that thickens to 3px on hover.

### Toggles
Segmented choices (Map/List, Area, Severity, the chart's Area and Measure) are rows of filled tiles separated by the gap.
- **Unselected:** deep paper grey (or `oak-1` on the oak chart panel).
- **Selected:** ink with paper text (moss with ink text on oak). The Fatal option uses signal red with `--map-paper` text, which gives 5.9:1 in light mode and 5.5:1 in dark.
- Toggles are real radio inputs or `aria-pressed` buttons, at least 44px tall.

### Tiles
The basic container.
- **Corner style:** square.
- **Background:** one of paper grey, ink, live oak or Spanish moss, with the matching ink.
- **Shadow strategy:** none (see Elevation).
- **Padding:** 20px, 24px from `sm`.
- Content usually sits at the bottom of the tile (`justify-end`), with the tile's link at the bottom left.

### Inputs / Fields
- **Style:** paper background, 1px rule border, square, 48px tall, 12px side padding, body type (`.field-input`). Labels sit above in body type (`.field-label`).
- **Focus:** the global ink outline.
- **Error:** a 2px `--fatal` border and an error message underneath (`.field-error`). Forms show an error summary first, which takes focus and links to each field.

### Navigation
- **Header:** a row of 60px tiles separated by the gap: the oak mark tile, then the site name and links in a grey tile, then "Explore the map" as an ink tile, then the theme toggle. Below `lg` the links collapse into a "Menu" `<details>` that opens a deep-grey panel with links at title size.
- **Footer:** a live-oak field with the "Vision Zero TLH" wordmark set very large, three columns of links, and the photo credits.

### Photo Credit (signature)
Every photograph carries its credit on the image: a paper strip in the bottom corner with label type: "Photo: [author], [licence]", both linked. Credits come from `src/content/photo-credits.json`, and `creditFor()` throws if a photo has no entry. The footer lists the full titles.

### Crash Map (signature)
- **Basemap:** Mapbox Standard, monochrome theme, with the `day` light preset in light mode and `night` in dark mode. The style's own coloured layers are hidden, and the city limits are tinted with Spanish moss. See `styleBasemap` in `CrashMapView.tsx`.
- **Dots:**
  - fatal crashes: 5px radius at zoom 9, 10px at zoom 14, opacity 0.95, with a 1.5px ring, drawn on top;
  - nonfatal crashes: 2px radius at zoom 9, 6px at zoom 14, opacity 0.85;
  - the selected crash gets a 3px `--map-ink` ring.
- **Overlays:** a "Records end [date]" tag sits in the top-left corner on a ground strip. On phones the crash detail floats as a card 40px above the map's bottom edge, so the Mapbox logo stays visible. From `lg` up, the detail sits above the map.
- The legend uses the same tokens as the dots, so it always matches in both themes.

### Motion
- One idea: things rise into place once. `[data-rise]` elements fade up 24px over 700ms (`cubic-bezier(0.2, 0.7, 0.2, 1)`), with each item in a group 75ms after the last.
- The hero photo opens like a shutter (`.shutter`); a second photo drifts slowly (`.drift`).
- All of this sits inside `prefers-reduced-motion: no-preference`, and content is visible without JavaScript.

## Do's and Don'ts

### Do:
- **Do** design every new page at 390px first, with the main action on the first phone screen.
- **Do** build pages as boards of square tiles separated by the 8px `--gap`, each tile filled with paper grey, ink, live oak or Spanish moss.
- **Do** use the `--step-*` type sizes (`text-display`, `text-head`, `text-lead`, `text-body`, `text-small`) and Boska 400 or 500 only.
- **Do** show photographs in grayscale (`grayscale contrast-[1.05]`), and add each one to `photo-credits.json` before using it.
- **Do** name the area (Leon County or Tallahassee city limits) and the period on every figure.
- **Do** keep text at 4.5:1 or better and map dots at 3:1 or better in both themes, and check both themes whenever you add a colour.
- **Do** reference colours through tokens (`bg-oak`, `text-fatal`, `var(--accent)`), never as hex values in components.

### Don't:
- **Don't** use red for anything except fatal crashes (and form errors).
- **Don't** round corners, add shadows to tiles, or add gradients, glows or glass effects.
- **Don't** add a second typeface or use `font-bold`.
- **Don't** use the pedestrian, bicyclist or vehicle colours outside the map and its legend.
- **Don't** put a small label or kicker above a heading; the heading carries itself.
- **Don't** set body text in `--muted`; it is for notes and hints.
- **Don't** edit the Standard basemap's colours in Mapbox Studio and expect them to show; the code sets them (see OPERATIONS.md › Dark mode and the map).
