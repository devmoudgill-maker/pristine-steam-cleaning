// Everything Abood may want to change lives in this file.
// Edit, then run `npm run build` and drag the `site/` folder onto Netlify.

export const BIZ = {
  name: 'Pristine Steam Cleaning',
  domain: 'https://pristinesteamcleaning.co',
  phone: '(346) 666-6223',
  tel: '+13466666223',
  email: '', // business email not set yet; leave '' to hide it
  hoursLabel: 'Mon–Sat, 8am–6pm', // PLACEHOLDER: needs approval
  hoursSchema: ['Mo-Sa 08:00-18:00'],
  city: 'Houston',
  region: 'TX',
};

// Paste profile URLs here. Icons only show in the footer once a link is set.
export const SOCIAL = {
  instagram: '',
  facebook: '',
  tiktok: '',
  yelp: '',
};

// Paste the Jobber "Work Request" embed code here (the whole snippet Jobber gives you).
// While this is empty, the quote form prepares a text message to BIZ.phone instead.
export const JOBBER_EMBED = '';

// Trust sections stay hidden until real content is added here. Never put invented
// reviews or results in this block. Photos go in static/photos/ (served at /assets/photos/).
export const PROOF = {
  // rating: { score: 4.9, count: 37, url: 'https://g.page/r/...' },  // from the Google Business Profile
  rating: null,
  // reviews: [{ name: 'Maria G.', area: 'Katy', text: 'Exact words from the review.' }],
  reviews: [],
  // beforeAfter: [{ before: 'living-room-before.jpg', after: 'living-room-after.jpg', label: 'Living room, Katy' }],
  beforeAfter: [],
  // owner: { name: 'Abood Yahya', photo: 'abood.jpg', text: 'A few sentences in his own words.' },
  owner: null,
};

export const PRICES = {
  specialPrice: 98,
  specialRooms: 3,
  room: 45,
  sofa: 99,
  chair: 45,
  tileSqft: 0.75,
  minimum: 150,
  club: 39,
};

// PLACEHOLDERS: every number here still needs Abood's approval.
export const POLICY = {
  effective: 'October 15, 2026',
  cancelFeeShort: 75, // under 24 hours' notice or no-show
  cancelFeeMid: 40, // 24 to 48 hours' notice
  reportHours: 72, // window to report a concern
  lateFeePct: 10,
  lateFeeDays: 7,
  clubRooms: 3, // rooms included in each club cleaning
};

// Unsplash and Pexels photos (free licenses). Swap for real job photos when they exist.
export const PHOTOS = {
  hero: { pexels: '6692902', pos: '70% 60%', alt: 'Parent and toddler playing on a soft, clean cream carpet' },
  carpet: { pexels: '35964344', pos: '50% 60%', alt: 'Blue sofa resting on a clean, textured carpet' },
  upholstery: { id: 'photo-1686178827149-6d55c72d81df', alt: 'Upholstery extraction tool pulling dirt out of a gray fabric ottoman' },
  tile: { id: 'photo-1605696420965-9247f11e1acd', alt: 'Terracotta saltillo tile floor with grout lines, the kind found in many Houston homes' },
  pet: { id: 'photo-1591722430978-61b0d6fa30bb', alt: 'Small tan dog lying on a soft beige carpet' },
  kitchen: { id: 'photo-1760545813135-fbda9423e448', alt: 'White kitchen with large porcelain floor tiles' },
  room: { id: 'photo-1789352844296-81a113658d69', alt: 'Sunlit empty bedroom with beige carpet, ready for move-in' },
};

export const img = (key, w, h, q = 72) => {
  const p = PHOTOS[key];
  // with `pos`, fetch the uncropped frame and let CSS object-position choose the crop
  if (p.pexels) return `https://images.pexels.com/photos/${p.pexels}/pexels-photo-${p.pexels}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h && !p.pos ? `&h=${h}&fit=crop` : ''}`;
  return `https://images.unsplash.com/${p.id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=${q}`;
};
