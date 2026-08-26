# LugBud landing page

React implementation of the **Lugbud Shoe Tracking Landing** design project
(`Lugbud Landing.dc.html`), imported from Claude Design.

```bash
npm install
npm run dev
```

## Layout

```
src/
  styles/
    tokens/        design tokens, copied verbatim from the project's ds/tokens
    index.css      token imports + the landing page's layout classes
  ds/              the LugBud design system, as real components
    core/          Badge, Button, Card, Icon, IconButton, SectionHeader, StatTile, Tag
    feedback/      Dialog, EmptyState, Toast, Tooltip
    forms/         Checkbox, Input, SegmentedControl, Select, Switch
    tracking/      DealCard, MileageRow, ShoeCard, WearMeter
    index.js       barrel export
  landing/
    Landing.jsx    page composition and state
    data.js        demo content (locker, deals, stats, copy)
    sections/      SiteHeader, Hero, Deals, HowItWorks, Dashboard, Strava, Waitlist, SiteFooter
```

## How the import was done

The canvas file is a Claude Design document: an `x-dc` template with `{{ }}`
bindings, `sc-if` / `sc-for` control flow, and `x-import` references into a
compiled design-system bundle (`ds/_ds_bundle.js`), driven by a `DCLogic`
class. Each of those maps onto ordinary React:

| Canvas | Here |
| --- | --- |
| `x-import component-from-global-scope="…Button"` | `import Button from '../../ds/core/Button.jsx'` |
| `sc-for list="{{ deals }}"` | `DEALS.map(…)` |
| `sc-if value="{{ submitted }}"` | conditional render |
| `DCLogic` state + `renderVals()` | `useState` in `Landing.jsx` and `useWaitlist.js` |
| `data-props` editor knobs | props on `<Landing />` |

The design system was recovered from the compiled bundle and rewritten as JSX
source. All visual values — colours, spacing, radii, shadows, motion, type —
come from the token files, unchanged.

### `<Landing />` props

These were the canvas's editor controls, kept as real props:

- `lifespanMiles` (default `500`) — fallback rated lifespan for a pair that
  doesn't carry its own. Every pair in the demo locker specifies one, so this
  currently has no visible effect; it exists for data that omits `life`.
- `askBrand` (default `true`) — show the brand picker beside the hero email field.
- `showStatsStrip` (default `true`) — show the stat tiles under the deals list.

## Deliberate differences from the canvas

- **Responsive.** The canvas is authored at desktop width with fixed
  multi-column grids. Column counts are identical at ≥ 960px; below that the
  hero, dashboard, Strava split, footer and locker rows collapse
  (`src/styles/index.css`). `DealCard` also wraps its CTA onto its own line
  when the row gets too narrow, and `Badge` no longer breaks mid-pill — both
  are no-ops at the widths the design specifies.
- **Icons.** The canvas loaded Lucide as a UMD global and injected SVG through
  `lucide.createIcons`. Here `Icon` renders `lucide-react` components from an
  explicit name registry in `src/ds/core/Icon.jsx`. Importing the whole Lucide
  namespace instead costs ~900 kB, so new glyphs need a line added there.
- **Wear state.** The canvas duplicated the fresh/good/worn/retire thresholds
  in the page script alongside the identical copy inside `WearMeter`. The page
  now uses the design system's `wearStateFor` / `WEAR_COLOR` / `WEAR_LABEL`.
- **Accessibility.** Locker rows are keyboard-operable (`role="button"`,
  Enter/Space) and report `aria-pressed`; the label-less email and brand
  controls carry `aria-label`; the wear bar is a `progressbar`.
- One inline style in the canvas's step cards used a camelCase property
  (`letterSpacing`) inside an HTML `style` attribute, where it does nothing.
  In JSX it applies as intended.

## Not carried over

The bundle also contains UI kits (`ui_kits/app/AppChrome`,
`ui_kits/app/Screens`, `ui_kits/website/*`) that the landing page doesn't
reference and that the bundle doesn't export. They were left behind.

Content in `src/landing/data.js` is the design's demo copy. Both waitlist forms
are local-only — submitting flips to the confirmation panel without a request.
