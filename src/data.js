// Placeholder content for the prototype. Swap in the real shop details here.
export const SERVICES = [
  { name: 'Short cut', price: '$35', mins: 30 },
  { name: 'Skin fade', price: '$40', mins: 45 },
  { name: 'Long cut', price: '$45', mins: 45 },
  { name: 'Buzz cut', price: '$25', mins: 20 },
  { name: 'Beard trim', price: '$20', mins: 20 },
  { name: 'Kid cut', price: '$25', mins: 25 },
];

export const SHOPS = [
  { name: 'Downtown', photo: 'beard', address: '120 Main St', hours: 'Daily 9a to 8p' },
  { name: 'Eastside', photo: 'classic', address: '48 Elm Ave', hours: 'Daily 9a to 8p' },
  { name: 'Riverside', photo: 'razor', address: '902 River Rd', hours: 'Daily 10a to 7p' },
  { name: 'North Park', photo: 'tools', address: '3300 Park Blvd', hours: 'Daily 9a to 8p' },
  { name: 'Southgate', photo: 'shears', address: '77 Gate St', hours: 'Daily 10a to 7p' },
  { name: 'Old Town', photo: 'styling', address: '15 Mill Ln', hours: 'Daily 9a to 9p' },
];

// Sample reviews for layout only. Replace with real customer reviews before launch.
export const REVIEWS = [
  { name: 'Marcus T.', shop: 'Downtown', text: 'Booked online in about thirty seconds, walked in, and walked out with the cleanest fade I\'ve had in years.' },
  { name: 'Priya S.', shop: 'Eastside', text: 'My son actually asks to go back. The barbers are patient and the free lemonade seals the deal.' },
  { name: 'Diego R.', shop: 'Riverside', text: 'Great music, no upsell, and they remember exactly how I like my lineup. That\'s my shop now.' },
  { name: 'Jordan K.', shop: 'North Park', text: 'Finally a place that knows what to do with longer hair. Listened first, cut second.' },
  { name: 'Sam W.', shop: 'Old Town', text: 'Walked in on a Sunday with no appointment and was in the chair in ten minutes. Friendly crew.' },
  { name: 'Alicia M.', shop: 'Southgate', text: 'Hot towel, sharp beard line, cold drink. Simple and done right every single time.' },
];

export const MIXTAPES = [
  { title: 'Fresh Fade Fridays', by: 'Picked by the Downtown crew', tracks: 24, color: '#e63b2e' },
  { title: 'Sunday Slow Cuts', by: 'Picked by the Old Town crew', tracks: 18, color: '#c8963e' },
  { title: 'Lineup Heat', by: 'Picked by the Eastside crew', tracks: 30, color: '#f4ecdf' },
];

// Free photos from Unsplash (Unsplash License: free to use, no permission needed),
// downloaded into public/photos so they load with the site. Credits show in the
// gallery captions and footer. Swap in photos of the real shop when you have them.
export const PHOTOS = {
  razor: { alt: 'Barber lining up a fade with a straight razor', by: 'Agustin Fernandez', page: 'https://unsplash.com/photos/1Pmp9uxK8X8' },
  tools: { alt: 'Clippers, comb, shears, shaving brush and pomade on a slate board', by: 'Andrea Donato', page: 'https://unsplash.com/photos/V3NNg858vkA' },
  lather: { alt: 'Barber brushing shaving lather onto a bearded neck', by: 'Arthur Humeau', page: 'https://unsplash.com/photos/Twd3yaqA2NM' },
  shears: { alt: 'Thinning shears and comb working through dark hair', by: 'Gulom Nazarov', page: 'https://unsplash.com/photos/DrG4V5skbMY' },
  styling: { alt: 'Barber finishing a slick side part with hairspray', by: 'Jeppe Monster', page: 'https://unsplash.com/photos/T_gTN3Po9RQ' },
  clippers: { alt: 'Cordless clippers blending a skin fade', by: 'Redd Francisco', page: 'https://unsplash.com/photos/PDDvMlScofU' },
  beard: { alt: 'Barber blow-drying a long white beard in a moody shop', by: 'Reza Ghaemi', page: 'https://unsplash.com/photos/5P-eClxMg1s' },
  classic: { alt: 'Barber in a hat and suspenders styling a fresh fade', by: 'Salah Regouane', page: 'https://unsplash.com/photos/8HkPnJhC5Ic' },
};

export const photoUrl = (key) => `photos/${key}.jpg`;

// Gallery strip, in scroll order
export const GALLERY = [
  { photo: 'beard', caption: 'Lights low, music up' },
  { photo: 'razor', caption: 'Straight-razor detail' },
  { photo: 'classic', caption: 'Old-school service' },
  { photo: 'lather', caption: 'Hot lather, slow shave' },
  { photo: 'clippers', caption: 'Fades, blended right' },
  { photo: 'styling', caption: 'Finished to perfection' },
];

// Photo shown when hovering each service
export const SERVICE_PHOTOS = { 'Short cut': 'shears', 'Skin fade': 'clippers', 'Long cut': 'styling', 'Buzz cut': 'tools', 'Beard trim': 'lather', 'Kid cut': 'classic' };
