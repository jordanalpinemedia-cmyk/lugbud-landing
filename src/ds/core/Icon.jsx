import {
  Activity,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Footprints,
  Gauge,
  Mail,
  Play,
  Plus,
  Route,
  Settings,
  Tag as TagIcon,
  TrendingDown,
  TriangleAlert,
  X,
} from 'lucide-react';

const SIZE_STROKE = { 16: 2, 20: 1.75, 24: 1.75, 32: 1.75 };

/**
 * Icons are addressed by their kebab-case Lucide name, the way the design
 * system specifies them. Registering them explicitly (rather than importing
 * the whole Lucide namespace) keeps the bundle to the glyphs we actually use —
 * the wildcard import costs ~900 kB.
 *
 * Add a line here when a new glyph is needed.
 */
const ICONS = {
  activity: Activity,
  'alert-triangle': TriangleAlert,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'external-link': ExternalLink,
  footprints: Footprints,
  gauge: Gauge,
  mail: Mail,
  play: Play,
  plus: Plus,
  route: Route,
  settings: Settings,
  tag: TagIcon,
  'trending-down': TrendingDown,
  x: X,
};

export default function Icon({ name, size = 20, strokeWidth, color = 'currentColor', style, ...rest }) {
  const Glyph = ICONS[name];

  if (!Glyph && import.meta.env.DEV) {
    console.warn(`Icon: "${name}" is not registered in ds/core/Icon.jsx`);
  }

  return (
    <span
      aria-hidden="true"
      style={{ display: 'inline-flex', width: size, height: size, flex: 'none', color, ...style }}
      {...rest}
    >
      {Glyph ? <Glyph size={size} strokeWidth={strokeWidth || SIZE_STROKE[size] || 1.75} /> : null}
    </span>
  );
}
