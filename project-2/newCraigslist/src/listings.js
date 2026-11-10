export const categories = {
  'For sale': ['Furniture', 'Bikes', 'Household', 'Electronics'],
  Housing: ['Apartments', 'Rooms', 'Sublets'],
  Jobs: ['Full-time', 'Part-time', 'Gigs'],
  Services: ['Home services', 'Lessons', 'Creative services'],
  Community: ['Activities', 'Events', 'Lost and found'],
};

const samples = [
  ['Mid-century lounge chair', 125, 'Furniture', 'Like new', 'Brown', 'Oakley', 'A comfortable accent chair with solid wood legs and clean upholstery.', 'chair'],
  ['Solid oak dining table', 240, 'Furniture', 'Good', 'Brown', 'Clifton', 'Seats six comfortably. Solid oak with a warm natural finish.', 'table'],
  ['City commuter bicycle', 180, 'Bikes', 'Good', 'Blue', 'Hyde Park', 'Lightweight commuter bike, tuned up and ready for your next ride.', 'bicycle'],
  ['Modern linen sofa', 380, 'Furniture', 'Like new', 'Gray', 'Downtown', 'A cozy three-seat sofa from a smoke-free home.', 'sofa'],
  ['Ceramic table lamp', 35, 'Household', 'Good', 'White', 'Northside', 'Soft warm light with a ceramic base. Bulb included.', 'lamp'],
  ['Vintage bookshelf', 90, 'Furniture', 'Good', 'Brown', 'Mount Adams', 'Five sturdy shelves for books, plants, and favorite finds.', 'bookshelf'],
  ['Mirrorless camera kit', 420, 'Electronics', 'Like new', 'Black', 'Clifton', 'Camera, kit lens, charger, and carrying case included.', 'camera'],
  ['Indoor plant collection', 45, 'Household', 'Good', 'Green', 'Oakley', 'Three easy-care houseplants with their ceramic pots.', 'houseplant'],
  ['Adjustable desk chair', 65, 'Furniture', 'Good', 'Black', 'Downtown', 'Supportive office chair with adjustable height and armrests.', 'office chair'],
  ['Wireless headphones', 75, 'Electronics', 'Like new', 'Black', 'Hyde Park', 'Over-ear headphones with a charging cable and travel case.', 'headphones'],
  ['Walnut coffee table', 110, 'Furniture', 'Fair', 'Brown', 'Northside', 'A classic coffee table with light wear and plenty of character.', 'coffee table'],
  ['Weekend road bicycle', 295, 'Bikes', 'Like new', 'White', 'Mount Adams', 'Smooth-shifting road bike, perfect for weekend adventures.', 'road bike'],
];

// Local mock listings; no network or backend is required.
export const listings = samples.map(([title, price, category, condition, color, neighborhood, description, kind], index) => ({
  id: index + 1, title, price, category, condition, color, neighborhood, description, kind,
  mainCategory: 'For sale',
  age: index + 1,
  image: `/mock/listing-${index + 1}.svg`,
}));
