/**
 * Demo content for the landing page. Everything here is illustrative — the
 * shipped page would read the locker and the deal feed from the API.
 */

export const BRANDS = [
  'Your main brand',
  'Hoka',
  'Saucony',
  'Nike',
  'Asics',
  'Salomon',
  'Brooks',
  'New Balance',
  'Something else',
];

export const LOCKER = [
  {
    name: 'Hoka Speedgoat 6',
    meta: 'trail · since jan',
    miles: 412,
    life: 500,
    left: 'about 6 weeks left',
    surface: 'trail · added january',
    note: 'Cushion is fading. Around 6 weeks of your mileage left before we call it.',
    runs: [
      { d: 'Sat', t: 'Ridge loop', mi: 12.4, surface: 'Trail', pace: '9:12' },
      { d: 'Thu', t: 'Easy hour', mi: 7.1, surface: 'Trail', pace: '9:48' },
      { d: 'Tue', t: 'Hill repeats', mi: 6.0, surface: 'Trail', pace: '8:31' },
    ],
  },
  {
    name: 'Saucony Endorphin Speed 4',
    meta: 'road · tempo days',
    miles: 168,
    life: 450,
    left: 'plenty left',
    surface: 'road · tempo days',
    note: "Still plenty of foam. We'll start watching prices around 300 miles.",
    runs: [
      { d: 'Wed', t: '5 × 1k', mi: 8.2, surface: 'Road', pace: '6:44' },
      { d: 'Sun', t: 'Long tempo', mi: 13.0, surface: 'Road', pace: '7:20' },
      { d: 'Fri', t: 'Strides', mi: 4.5, surface: 'Road', pace: '7:58' },
    ],
  },
  {
    name: 'Nike Pegasus 41',
    meta: 'road · daily',
    miles: 486,
    life: 500,
    left: 'replace now',
    surface: 'road · daily miles',
    note: 'These are done. 486 miles is past where this foam holds up — three retailers have the 42 under $110.',
    runs: [
      { d: 'Mon', t: 'Commute', mi: 5.8, surface: 'Road', pace: '8:40' },
      { d: 'Sun', t: 'Easy', mi: 9.3, surface: 'Road', pace: '8:55' },
      { d: 'Thu', t: 'Recovery', mi: 4.0, surface: 'Road', pace: '9:30' },
    ],
  },
  {
    name: 'Salomon Speedcross 6',
    meta: 'trail · mud only',
    miles: 92,
    life: 450,
    left: 'barely broken in',
    surface: 'trail · mud only',
    note: 'Barely broken in. Nothing to do here yet.',
    runs: [
      { d: 'Sat', t: 'Wet singletrack', mi: 9.6, surface: 'Trail', pace: '10:02' },
      { d: 'Sat', t: 'Fell race', mi: 6.2, surface: 'Trail', pace: '9:18' },
      { d: 'Sun', t: 'Recce', mi: 5.0, surface: 'Trail', pace: '10:40' },
    ],
  },
];

export const MILES_THIS_YEAR = '1,158';

export const DEALS = [
  { shoe: 'Hoka Speedgoat 7', retailer: 'Running Warehouse', price: 104, list: 140, ends: 'ends sunday', img: 'trail shoe · side profile' },
  { shoe: 'Saucony Endorphin Speed 4', retailer: 'Fleet Feet', price: 129, list: 170, ends: '4 days left', img: 'road shoe · side profile' },
  { shoe: 'Nike Pegasus 41', retailer: 'Nike.com', price: 97, list: 145, ends: 'ends aug 31', img: 'road shoe · side profile' },
  { shoe: 'Asics Novablast 5', retailer: 'Road Runner Sports', price: 112, list: 145, ends: '2 days left', img: 'road shoe · side profile' },
  { shoe: 'Salomon Speedcross 6', retailer: 'REI', price: 96, list: 140, ends: 'ends sunday', img: 'trail shoe · side profile' },
];

export const STATS = [
  { v: '4,213', l: 'models with a known lifespan', i: 'footprints', tone: 'card' },
  { v: '30', l: 'retailers watched hourly', i: 'tag', tone: 'card' },
  { v: '$41', l: 'average saved per pair', i: 'trending-down', tone: 'inverse' },
  { v: '18.4M', l: 'miles tracked', i: 'route', tone: 'card' },
];

export const STEPS = [
  {
    n: '01',
    icon: 'activity',
    t: 'Connect Strava',
    b: 'Authorize once, read-only. Your last 90 days of runs come across so your shoes start with real mileage.',
  },
  {
    n: '02',
    icon: 'gauge',
    t: 'We track the miles',
    b: "Every upload gets matched to the pair you wore. We know what each model's foam is good for, so the wear meter is honest.",
  },
  {
    n: '03',
    icon: 'tag',
    t: 'Deals hit your inbox',
    b: "When you cross 80% of a pair's life, we start hunting. You get the sale a few weeks before you need the shoe.",
  },
];

export const STRAVA_ROWS = [
  { icon: 'activity', t: 'Tap Connect with Strava', b: 'Standard Strava authorization screen. No password ever touches us.' },
  { icon: 'check', t: 'Read-only access', b: 'Activities and gear. We cannot post, delete, or change anything.' },
  { icon: 'route', t: '90 days backfilled', b: 'Your existing mileage lands in the locker within a minute.' },
  { icon: 'settings', t: 'Disconnect any time', b: 'One tap in settings and we forget the data.' },
];

export const FEATURED_DEAL = {
  shoe: 'Speedgoat 7',
  price: 104,
  retailer: 'Running Warehouse',
  blurb: "$36 under list, lowest we've seen since March. Ends Sunday.",
};
