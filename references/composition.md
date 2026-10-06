# Composition

A screen is composed, not assembled. The most reliable way to produce generated-looking UI is to open the component library, pick a header, a scroll view and a card, and fill them. The result is correct, tokenized, and identical to every other app built the same way. Composition is the layer that decides where the eye goes, how much of the viewport one thing gets, and which things are allowed to repeat, before any component is chosen.

This file defines the composition variables, eight archetypes, the composition-level anti-patterns (C-AI codes, referenced from `tells-mobile.md` §H) and the first viewport test.

## 1. Composition variables

Every screen in the inventory sets these. The app-level defaults live in `MOBILE-DESIGN.md` under `composition:`.

```yaml
composition:
  archetype: editorial            # one of the eight in §2
  axis: leading                   # leading | centered | split | diagonal (rare)
  alignment: left                 # text alignment of the anchor level
  focal_point: hero image          # the single first stop for the eye
  secondary_focus: title + date    # at most one
  hierarchy: image > title > metadata > action   # first three or four levels, in order
  whitespace: generous             # tight | regular | generous; sets which spacing steps dominate
  image_bleed: full                # none | inset | full
  surface_strategy: open canvas    # open canvas | grouped lists | cards-to-group | mixed (say where)
  repetition_limits: "0 cards; 1 section grammar"   # see §4
```

`axis` is the organizing line of the screen. `leading` (left in LTR) is the default for anything with data or lists; `centered` is for single-message screens (empty, success, error, paywall headline) and nothing else (tell B13, C-AI-04). `split` is a two-column discovery or a map-plus-panel.

## 2. The eight archetypes

Each archetype is a complete answer to "how is this screen organized". A screen uses one. An app uses several (`screen-archetypes.md` maps intent to archetype).

### Hero

- **Purpose:** one subject, presented. Detail of a product, a place, a device, a person.
- **Hierarchy:** subject (image, render, chart or one big number) > name > the primary decision > everything else.
- **Use:** product detail, device status, place detail, a single metric that is the point of the app.
- **Typical composition:** the subject takes 40 to 60% of the first viewport, full-bleed or with room; title and primary action directly under it; metadata in a grouped list below the fold; sticky CTA only when the decision is the task.
- **Anti-patterns:** the subject in a card with margins and a radius; stats row under the hero (B8); two heroes.
- **Example:** solar inverter device screen: live kW figure at display size over a cutaway render, status line, then a grouped list of today, this month, settings.

### Editorial

- **Purpose:** discovery and visual storytelling, where the content is the attraction.
- **Hierarchy:** one lead item at large scale > a few items at medium scale > many at small; type is part of the imagery.
- **Use:** home of a content, commerce, travel, beauty or journaling app; a magazine-like feed with few items.
- **Typical composition:** asymmetric; items vary in scale and crop; display type may cross image boundaries; generous whitespace; cards rare or absent, items separated by space.
- **Anti-patterns:** a grid of identical cards (C-AI-02); every section as heading + subtitle + carousel (C-AI-01); identical aspect ratio on every image (C-AI-08).
- **Example:** journaling Today: one entry per viewport, the photo bleeding to the edges, the serif title overlapping its bottom edge, the date in caption size.

### Canvas

- **Purpose:** the user makes something. The content area is the UI.
- **Hierarchy:** the work > the one tool in hand > tool palette > chrome.
- **Use:** editors (text, photo, drawing, audio), map editing, planners.
- **Typical composition:** the work fills the viewport; controls are a thin bottom toolbar within the thumb zone, or a sheet; chrome is minimal and often auto-hides; no cards.
- **Anti-patterns:** the canvas inside a card; a persistent header taking 15% of the screen; a tab bar visible while editing.
- **Example:** note editor: text from the top safe area, a 44 pt formatting bar above the keyboard, Done in the header.

### Feed

- **Purpose:** many items of equal type, consumed in sequence.
- **Hierarchy:** the current item > the next item > chrome; within an item: media > author or title > actions.
- **Use:** social timelines, news, notifications, chat lists at high volume.
- **Typical composition:** repeating item grammar (this is the one archetype where repetition is the point); items separated by space or hairlines, not cards, unless the item is itself a mixed-media object; media edge to edge; actions in a quiet row.
- **Anti-patterns:** each post in a shadowed card (B3); badges on every item (B10); items of different types forced into one card grammar.
- **Example:** a neighborhood feed: photo edge to edge, one line of author and time, text, a quiet action row, 16 pt gap.

### Dashboard

- **Purpose:** state at a glance, with a way into each part.
- **Hierarchy:** one headline metric or status > two to four supporting modules of unequal size > links.
- **Use:** analytics, operations overview, account overview, health summary.
- **Typical composition:** one module dominates (40% of the viewport or more); supporting modules differ in size by importance; charts are content, not decoration; dense but with three spacing levels.
- **Anti-patterns:** the stat triplet (B8); every module the same card size (C-AI-14); a module per sensor.
- **Example:** warehouse overview: today's inbound count with a comparison as the headline; below it a half-width low-stock module and a half-width pending-orders module; then a plain list of recent movements.

### Focused Task

- **Purpose:** one thing to do, with one decision at the end.
- **Hierarchy:** the object being acted on > the hero input > the live consequence > the CTA > secondary fields.
- **Use:** transfer, booking, receive stock, compose, checkout step, pairing step.
- **Typical composition:** the object visible at the top (label, patient, recipient); the hero input set large with the control the context calls for (`patterns.md` §4b); the consequence line directly under it; secondary content filling to the CTA; CTA in the thumb zone, sticky only when the keyboard plan allows.
- **Anti-patterns:** the template form (B16); the CTA floating under empty space (C-AI-03); every input the same box.
- **Example:** receive stock: SKU label with barcode at the top, a 56 pt quantity stepper with quick-add chips, "Tồn 18 → 42 sau nhập", last receipt row, then the CTA.

### List

- **Purpose:** find and open one of many known things; manage settings.
- **Hierarchy:** section > row > row detail; the eye scans the leading edge.
- **Use:** settings, archive, history, contacts, a tab's secondary content.
- **Typical composition:** platform list grammar (grouped inset lists on iOS, Material list items on Android); rows 44 to 64 pt; leading alignment; sections separated by space and a header; search at the top when there are more than about twenty items.
- **Anti-patterns:** icon chip on every row (B4); chevron on every row (C15); rows as cards (B3); every row icon + title + subtitle + chevron (C-AI-05).
- **Example:** settings: three grouped sections, rows with label and value, destructive row last in the destructive color.

### Immersive

- **Purpose:** media or sensor takes over; the user is inside the content.
- **Hierarchy:** the content > the one control in hand > nothing else.
- **Use:** camera, scanner, player, map in navigation mode, story viewer, a full-screen success moment.
- **Typical composition:** edge to edge, chrome auto-hides or sits on a scrim within the safe area; controls large and few; a visible way out (X or Done).
- **Anti-patterns:** a header bar over the camera; controls at the very bottom under the home indicator (R-TZ3); a card over the content.
- **Example:** barcode scanner: full-bleed camera, a reticle, one torch button, Done top-right inside the safe area, the last scanned item as a small sheet.

## 3. Composition anti-patterns (C-AI)

These are review criteria, run in Visual QA (`visual-qa.md`) and surfaced as tells H1 to H10 in `tells-mobile.md`. Numbering is stable; append, do not renumber.

| Code | Pattern | Why it reads as generated | Instead | Check |
|---|---|---|---|---|
| C-AI-01 | Every section = heading + subtitle + card (or carousel) | Section grammar copied from a component demo | Vary section shape by content: a lead item, a list, a single line, a chart | V count sections sharing the same grammar; more than two is a hit |
| C-AI-02 | Every content item = rounded rectangle | The container is the design | Items separated by space or hairlines; containers only when the item is a mixed object | V count equivalent containers per viewport |
| C-AI-03 | Every screen = header + scroll + bottom CTA | One layout for every task | Archetype by intent (`screen-archetypes.md`); CTA only where there is a decision | C compare archetypes across the inventory |
| C-AI-04 | Centered composition by default | Centering hides hierarchy and breaks scanning | Leading axis on data and content screens; centered only for single-message screens | S `justifyContent: 'center'` / `Alignment.center` / `.center` on content screens |
| C-AI-05 | Every list row = icon + title + subtitle + chevron | The row template, not the content | Row shape from the data: value rows, two-line rows, image rows, switch rows, chevron only on pushing rows | V/S chevron count vs pushing rows |
| C-AI-06 | Every action = filled accent button | No action hierarchy | One filled primary per screen; secondary as text or tonal; destructive styled as such | S count filled buttons per screen |
| C-AI-07 | Identical horizontal padding on every section | Full-bleed and inset never alternate; the rhythm is flat | Media and lists may bleed; text keeps the gutter; at least one bleed per content screen where imagery exists | V |
| C-AI-08 | Every image at the same aspect ratio | Crop chosen by the grid, not the content | Ratio by content type and role (portrait people, wide places, square products); lead item differs from the rest | V count distinct ratios |
| C-AI-09 | The same visual rhythm on every screen | Screen sameness; the user cannot tell where they are | Archetype per intent; the Settings rhythm is not the Home rhythm | C side-by-side of inventory screens |
| C-AI-10 | Hierarchy changes expressed only by font size | Size is the weakest and most expensive level device | Position, weight, color, space first; size for the one display element | V/S count font sizes vs weight and color roles |
| C-AI-11 | Component-first composition: the screen is whatever the library offered | Nothing was decided | Task, hierarchy, anchor, archetype, then components (SKILL.md "Content before components") | C the inventory row was filled before the build |
| C-AI-12 | No clear visual anchor | The eye has nowhere to land | One focal point per screen, named in the inventory, visible in the first viewport | V the first-stop test (§5) |
| C-AI-13 | Too many competing anchors | Everything shouts | One dominant idea, up to two supporting (`visual-dna.md` §5) | V count elements at display scale or full-bleed |
| C-AI-14 | Equal visual weight regardless of importance | Content has not earned its size | Size and position by product importance (`visual-dna.md` §4) | C name the largest element and its reason |
| C-AI-15 | The screen is a stack of component-library examples | A kitchen-sink demo | Remove any component that does not serve the task or hierarchy | C each component traces to an inventory column |

## 4. Repetition limits

Repetition is a tool for feeds and lists and a tell everywhere else. Defaults, overridable with a written reason:

| Limit | Default | Applies to |
|---|---|---|
| Cards (bordered or shadowed containers) per viewport | 3 on a non-feed screen (B3); 0 on Hero, Editorial, Canvas, Immersive | all |
| Sections sharing one grammar per screen | 2 | Hero, Editorial, Dashboard, Focused Task |
| Identical image aspect ratios per screen | the lead item differs from the rest | Editorial, Hero, Dashboard |
| Filled accent buttons per screen | 1 | all |
| Modules of equal size on a Dashboard | 2 (the headline module is always larger) | Dashboard |
| Screens in the app sharing one archetype | no more than half the inventory, excluding List | app level |
| Display-size elements per screen | 1 | all |

Record the app's limits as `repetition_limits` in `MOBILE-DESIGN.md`; per screen only when the screen deviates.

## 5. The first viewport test

At the initial viewport, before any scroll, identify:

1. the primary visual anchor (one element);
2. the primary task (what the user is here to do);
3. the product identity (one thing that could only be this app: the subject, the signature element, the domain object);
4. the next action.

Flag the screen when any of the four cannot be named, or when the primary purpose only becomes clear after scrolling (allowed only with a product reason written in the inventory). Flag it as probable generic composition when the first viewport is `header, subtitle, card, card, card` or `greeting, stat row, card list`.

## 6. Composing a screen

The order of decisions, before any component is chosen:

1. **Task.** What the user does here, in one verb phrase. Settles the archetype candidates (`screen-archetypes.md`).
2. **Content hierarchy.** The three or four levels, in order, from the real content (not from the template).
3. **Anchor.** The one focal point, and where in the viewport it sits.
4. **Archetype and axis.** One of the eight; leading unless the screen is a single message.
5. **Whitespace and surfaces.** Which spacing steps dominate; open canvas, grouped list or cards-to-group; what bleeds.
6. **Repetition.** What is allowed to repeat and how many times.
7. **Interaction.** Direct manipulation, swipes, the primary control for the hero input.
8. **Components.** Only now, from the platform and the direction's posture, to implement the decisions above.

Steps 1 to 7 are the inventory row. Step 8 is the build.
