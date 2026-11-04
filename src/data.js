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
  { name: 'Downtown', photo: 'empty', address: '120 Main St', hours: 'Daily 9a to 8p' },
  { name: 'Eastside', photo: 'silverChair', address: '48 Elm Ave', hours: 'Daily 9a to 8p' },
  { name: 'Riverside', photo: 'interior', address: '902 River Rd', hours: 'Daily 10a to 7p' },
  { name: 'North Park', photo: 'moody', address: '3300 Park Blvd', hours: 'Daily 9a to 8p' },
  { name: 'Southgate', photo: 'brickChair', address: '77 Gate St', hours: 'Daily 10a to 7p' },
  { name: 'Old Town', photo: 'lamps', address: '15 Mill Ln', hours: 'Daily 9a to 9p' },
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

// Free photos from Unsplash (Unsplash License: free to use, no permission needed).
// Credit is not required but we show it in the gallery captions and footer.
// Paid "Unsplash+" photos are deliberately not used.
export const PHOTOS = {
  interior: { id: '1781768526571-ef9c333279c7', alt: 'Classic barbershop interior with people getting haircuts', by: 'Barney Goodman', page: 'https://unsplash.com/photos/classic-barbershop-interior-with-people-getting-haircuts-aM2VSVn8ktg' },
  crew: { id: '1759134198561-e2041049419c', alt: 'Barbers cutting hair in a modern salon', by: 'Chaps & Co', page: 'https://unsplash.com/photos/barbers-cutting-hair-in-a-modern-salon-BX8OTlmHOaI' },
  brickChair: { id: '1585747860715-2ba37e788b70', alt: 'Black leather barber chair by a brick wall', by: 'Nathon Oski', page: 'https://unsplash.com/photos/black-leather-barber-chair-near-brown-brick-wall-EW_rqoSdDes' },
  moody: { id: '1773904215697-e6c21fc27ac2', alt: 'Barber chairs and sinks in a dimly lit shop', by: 'T', page: 'https://unsplash.com/photos/luxurious-barber-chairs-and-sinks-in-a-dimly-lit-salon-fa0DqQ91dWU' },
  empty: { id: '1781455793310-8427c96454c7', alt: 'Empty barbershop with chairs and mirrors', by: 'Barney Goodman', page: 'https://unsplash.com/photos/an-empty-barbershop-interior-with-several-chairs-and-mirrors-AXurvQTtO3Y' },
  silverChair: { id: '1621645582931-d1d3e6564943', alt: 'Black and silver barber chair', by: 'Joshua Lawrence', page: 'https://unsplash.com/photos/black-and-silver-barber-chair-dU6eE_j2My8' },
  lamps: { id: '1536520002442-39764a41e987', alt: 'Shop interior with glowing pendant lamps', by: 'Jason Leung', page: 'https://unsplash.com/photos/salon-interior-with-lighted-pendant-lamps-2seUdPQNy_I' },
  scissors: { id: '1647140655214-e4a2d914971f', alt: 'Barber cutting hair with scissors', by: 'Nate Johnston', page: 'https://unsplash.com/photos/a-man-cutting-another-mans-hair-with-a-pair-of-scissors-tgPrIYnW3g4' },
  inChair: { id: '1503951914875-452162b0f3f1', alt: "Man sitting in a barber's chair", by: 'Allef Vinicius', page: 'https://unsplash.com/photos/man-sitting-on-barbers-chair-IvQeAVeJULw' },
  blowdry: { id: '1605497788044-5a32c7078486', alt: "Barber blow-drying a man's hair", by: 'delfina pan', page: 'https://unsplash.com/photos/barber-blow-drying-hair-in-salon-wJoB8D3hnzc' },
  clippers: { id: '1621605815971-fbc98d665033', alt: 'Hair clippers, scissors and a comb on a slate board', by: 'Andrea Donato', page: 'https://unsplash.com/photos/hair-clippers-and-grooming-tools-MNu0n-3BIKs' },
  razor: { id: '1599351431202-1e0f0137899a', alt: 'Barber trimming hair with a straight razor', by: 'Agustin Fernandez', page: 'https://unsplash.com/photos/barber-trimming-hair-with-straight-razor-1Pmp9uxK8X8' },
  cape: { id: '1761839256791-6a93f89fb8b0', alt: 'Stylist draping a client with a black cape', by: "Land O'Lakes, Inc.", page: 'https://unsplash.com/photos/stylist-drapes-client-with-a-black-cape-in-salon-UnSFmJCCrW0' },
};

export const photoUrl = (key, w = 1200) => `https://images.unsplash.com/photo-${PHOTOS[key].id}?auto=format&fit=crop&q=70&w=${w}`;

// Gallery strip, in scroll order
export const GALLERY = [
  { photo: 'interior', caption: 'Every chair, every day' },
  { photo: 'razor', caption: 'Straight-razor detail' },
  { photo: 'moody', caption: 'Lights low, music up' },
  { photo: 'crew', caption: 'The crew at work' },
  { photo: 'brickChair', caption: 'Your seat is ready' },
  { photo: 'lamps', caption: 'Stay a while' },
];

// Photo shown when hovering each service
export const SERVICE_PHOTOS = { 'Short cut': 'scissors', 'Skin fade': 'inChair', 'Long cut': 'blowdry', 'Buzz cut': 'clippers', 'Beard trim': 'razor', 'Kid cut': 'cape' };
