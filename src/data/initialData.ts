import { MenuItem, Review, GalleryItem, Reservation, Order } from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // STARTERS
  {
    id: 'starter-1',
    name: 'Truffle Infused Arancini',
    category: 'Starters',
    description: 'Crispy arborio rice spheres with wild forest mushrooms, molten taleggio cheese, and black summer truffle crema.',
    price: 24,
    imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
    isVegetarian: true,
    isBestseller: true,
    calories: 380,
    prepTime: '15 mins',
    rating: 4.9,
    ingredients: ['Arborio Rice', 'Taleggio', 'Wild Truffle', 'Panko Crumb', 'Parmigiano Reggiano'],
    pairing: 'Franciacorta Brut 2018',
    available: true
  },
  {
    id: 'starter-2',
    name: 'Pan-Seared Hokkaido Scallops',
    category: 'Starters',
    description: 'Caramelized diver scallops on Jerusalem artichoke mousseline with crispy prosciutto crumble and citrus-herb oil.',
    price: 28,
    imageUrl: '/src/assets/images/food_lobster_pasta_1792868334911.jpg',
    isVegetarian: false,
    isChefSpecial: true,
    calories: 320,
    prepTime: '18 mins',
    rating: 5.0,
    ingredients: ['Hokkaido Scallops', 'Jerusalem Artichoke', 'San Daniele Prosciutto', 'Finger Lime'],
    pairing: 'Chablis Premier Cru 2020',
    available: true
  },
  {
    id: 'starter-3',
    name: 'Royal Shahi Galouti Kebab',
    category: 'Starters',
    description: 'Melt-in-mouth smoked lamb patties subtly spiced with 32 royal Awadhi herbs, served on saffron sheermal crisps.',
    price: 26,
    imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
    isVegetarian: false,
    isBestseller: true,
    calories: 440,
    prepTime: '20 mins',
    rating: 4.8,
    ingredients: ['Prime Spring Lamb', 'Awadhi Potli Spices', 'Saffron Milk', 'Ghee Essence'],
    pairing: 'Pinot Noir Domaine Dujac',
    available: true
  },

  // MAIN COURSE
  {
    id: 'main-1',
    name: 'Imperial A5 Wagyu Tenderloin',
    category: 'Main Course',
    description: 'Charcoal-grilled Miyazaki A5 beef tenderloin, Perigord black truffle jus, buttered potato puree, and glazed heirloom baby carrots.',
    price: 95,
    imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
    isVegetarian: false,
    isBestseller: true,
    isChefSpecial: true,
    calories: 680,
    prepTime: '25 mins',
    rating: 5.0,
    ingredients: ['Miyazaki A5 Wagyu', 'Black Truffle Jus', 'Yukon Gold Butter Puree', 'Smoked Sea Salt'],
    pairing: 'Château Margaux Premier Grand Cru',
    available: true
  },
  {
    id: 'main-2',
    name: 'Chilean Sea Bass Cartoccio',
    category: 'Main Course',
    description: 'Wild-caught Chilean sea bass en papillote with saffron fumet, castelvetrano olives, caper berries, and confit cherry tomatoes.',
    price: 58,
    imageUrl: '/src/assets/images/food_lobster_pasta_1792868334911.jpg',
    isVegetarian: false,
    calories: 510,
    prepTime: '22 mins',
    rating: 4.9,
    ingredients: ['Chilean Sea Bass', 'Saffron Fumet', 'Sicilian Capers', 'Fennel Pollen'],
    pairing: 'Meursault Louis Jadot 2019',
    available: true
  },
  {
    id: 'main-3',
    name: 'Sous-Vide Duck Breast Royale',
    category: 'Main Course',
    description: 'Crispy skin Magret duck breast, spiced sour cherry gastrique, parsnip velvet, and toasted hazelnut soil.',
    price: 48,
    imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
    isVegetarian: false,
    calories: 590,
    prepTime: '24 mins',
    rating: 4.8,
    ingredients: ['Magret Duck Breast', 'Morello Cherries', 'Parsnip Mousseline', 'Thyme Blossom'],
    pairing: 'Barolo DOCG Massolino 2017',
    available: true
  },

  // INDIAN
  {
    id: 'ind-1',
    name: 'Royal Dum Nalli Gosht Biryani',
    category: 'Indian',
    description: 'Fragrant aged Dehradun basmati rice slow-cooked in a sealed clay handi with tender lamb shanks, saffron milk, and rose water potli.',
    price: 42,
    imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
    isVegetarian: false,
    isBestseller: true,
    isChefSpecial: true,
    calories: 720,
    prepTime: '30 mins',
    rating: 5.0,
    ingredients: ['Lamb Shank', 'Aged Basmati Rice', 'Kashmiri Saffron', 'Kewra Essence', 'Caramelized Onion'],
    pairing: 'Syrah Crozes-Hermitage',
    available: true
  },
  {
    id: 'ind-2',
    name: 'Dal Broso Makhani (Slow 36h)',
    category: 'Indian',
    description: 'Whole black urad lentils slow-simmered over smoldering embers for 36 hours with churned organic butter and vine-ripened San Marzano tomatoes.',
    price: 28,
    imageUrl: '/src/assets/images/food_royal_dessert_1792868334735.jpg',
    isVegetarian: true,
    isBestseller: true,
    calories: 490,
    prepTime: '15 mins',
    rating: 4.9,
    ingredients: ['Urad Lentils', 'Cultured Country Butter', 'Kasturi Methi', 'San Marzano Puree'],
    pairing: 'Full-Bodied Zinfandel',
    available: true
  },
  {
    id: 'ind-3',
    name: 'Paneer Zafrani Mille-Feuille',
    category: 'Indian',
    description: 'Artisanal malai paneer layers infused with royal saffron cardamom gravy, crushed pine nuts, and edible silver vark.',
    price: 34,
    imageUrl: '/src/assets/images/food_lobster_pasta_1792868334911.jpg',
    isVegetarian: true,
    calories: 520,
    prepTime: '20 mins',
    rating: 4.7,
    ingredients: ['Organic Malai Paneer', 'Kashmir Saffron', 'Toasted Pine Nuts', 'Cardamom Essence'],
    pairing: 'Viognier Condrieu',
    available: true
  },

  // ITALIAN
  {
    id: 'ita-1',
    name: 'Maine Lobster Tagliolini',
    category: 'Italian',
    description: 'Handcrafted squid-ink pasta strands with butter-poached Maine lobster tail, velvety saffron reduction, and fresh chives.',
    price: 64,
    imageUrl: '/src/assets/images/food_lobster_pasta_1792868334911.jpg',
    isVegetarian: false,
    isBestseller: true,
    isChefSpecial: true,
    calories: 580,
    prepTime: '20 mins',
    rating: 5.0,
    ingredients: ['Squid Ink Tagliolini', 'Maine Lobster', 'Saffron Fumet', 'Sweet Chervil'],
    pairing: 'Gavi di Gavi La Scolca',
    available: true
  },
  {
    id: 'ita-2',
    name: 'Tartufo Nero Risotto',
    category: 'Italian',
    description: 'Acquerello aged carnaroli rice mantecato with 36-month aged Parmigiano Reggiano, alpine butter, and shaved Norcia black truffles.',
    price: 46,
    imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
    isVegetarian: true,
    calories: 610,
    prepTime: '22 mins',
    rating: 4.9,
    ingredients: ['Acquerello Carnaroli', 'Norcia Black Truffle', 'Vacche Rosse Parmigiano', 'Alpine Butter'],
    pairing: 'Barbaresco Bruno Rocca',
    available: true
  },

  // DESSERTS
  {
    id: 'des-1',
    name: '24K Gold Royal Chocolate Sphere',
    category: 'Desserts',
    description: 'Valrhona Grand Cru dark chocolate sphere leafed with 24K edible gold, warm poured blackberry coulis, hazelnut praline core, and smoked vanilla gelato.',
    price: 32,
    imageUrl: '/src/assets/images/food_royal_dessert_1792868334735.jpg',
    isVegetarian: true,
    isBestseller: true,
    isChefSpecial: true,
    calories: 460,
    prepTime: '12 mins',
    rating: 5.0,
    ingredients: ['Valrhona 72% Chocolate', '24K Edible Gold Leaf', 'Madagascar Smoked Vanilla', 'Wild Blackberry'],
    pairing: 'Château d’Yquem Sauternes 2011',
    available: true
  },
  {
    id: 'des-2',
    name: 'Saffron Pistachio Kulfi Terrine',
    category: 'Desserts',
    description: 'Deconstructed royal kulfi with Persian pistachios, rose caviar pearls, candied orange peel, and gold dust dusting.',
    price: 24,
    imageUrl: '/src/assets/images/food_royal_dessert_1792868334735.jpg',
    isVegetarian: true,
    calories: 340,
    prepTime: '10 mins',
    rating: 4.8,
    ingredients: ['Buffalo Milk Kulfi', 'Iranian Saffron', 'Damask Rose Caviar', 'Bronte Pistachio'],
    pairing: 'Moscato d’Asti Marchesi di Barolo',
    available: true
  },

  // BEVERAGES
  {
    id: 'bev-1',
    name: 'Smoked Velvet Old Fashioned',
    category: 'Beverages',
    description: 'Hand-smoked with cherrywood embers, Yamazaki 12-Year whiskey, Angostura infused demerara syrup, and flamed orange oils.',
    price: 28,
    imageUrl: '/src/assets/images/hero_dining_interior_1792868333053.jpg',
    isVegetarian: true,
    isBestseller: true,
    isChefSpecial: true,
    calories: 190,
    prepTime: '8 mins',
    rating: 4.9,
    ingredients: ['Yamazaki 12yr', 'House Bitters', 'Cherrywood Smoke', 'Turbinado Sugar'],
    available: true
  },
  {
    id: 'bev-2',
    name: 'Royale Hibiscus & Gold Mocktail',
    category: 'Beverages',
    description: 'Cold-steeped organic wild hibiscus blossoms, clarified yuzu juice, white peach nectar, and floating shimmer gold flakes.',
    price: 18,
    imageUrl: '/src/assets/images/hero_dining_interior_1792868333053.jpg',
    isVegetarian: true,
    calories: 120,
    prepTime: '6 mins',
    rating: 4.8,
    ingredients: ['Wild Hibiscus', 'Japanese Yuzu', 'White Peach', 'Sparkling Spring Water', 'Edible Shimmer'],
    available: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-vip-1',
    userName: 'Lord Alistair Sterling',
    userRole: 'Food & Wine Critic',
    rating: 5,
    title: 'An unmatchable sensory masterpiece in fine dining',
    comment: 'From the discreet greeting to the breathtaking Wagyu tenderloin with Perigord jus, Broso operates on an entirely distinct echelon of royal hospitality. The ambiance is regal and intoxicating.',
    dishRecommended: 'Imperial A5 Wagyu Tenderloin',
    visitDate: '2026-09-18',
    isVerifiedVisit: true,
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-09-19T20:15:00Z'
  },
  {
    id: 'rev-2',
    userId: 'user-vip-2',
    userName: 'Elena Rostova',
    userRole: 'Sommelier & Journalist',
    rating: 5,
    title: 'The Lobster Tagliolini is unforgettable',
    comment: 'The handmade pasta paired with saffron emulsion was heavenly. The sommelier’s wine pairing recommendation exceeded every expectation. An absolute jewel of modern culinary artistry.',
    dishRecommended: 'Maine Lobster Tagliolini',
    visitDate: '2026-10-04',
    isVerifiedVisit: true,
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-10-05T14:32:00Z'
  },
  {
    id: 'rev-3',
    userId: 'user-vip-3',
    userName: 'Dr. Siddharth Sen',
    userRole: 'Verified Patron',
    rating: 5,
    title: 'Flawless 36-hour Dal Makhani and Awadhi Kebab',
    comment: 'As someone raised in Lucknow, I had high standards for Awadhi cuisine. Broso’s Galouti Kebabs and slow-simmered Dal Makhani are worthy of the Nizams of old. Simply sublime.',
    dishRecommended: 'Dal Broso Makhani (Slow 36h)',
    visitDate: '2026-10-14',
    isVerifiedVisit: true,
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-10-15T09:10:00Z'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Grand Imperial Dining Hall',
    category: 'Dining Room',
    imageUrl: '/src/assets/images/hero_dining_interior_1792868333053.jpg',
    description: 'Featuring dark navy acoustic paneling, crystal chandeliers, and secluded velvet banquettes.'
  },
  {
    id: 'gal-2',
    title: 'Miyazaki Wagyu Mastery',
    category: 'Dishes',
    imageUrl: '/src/assets/images/food_wagyu_steak_1792868333122.jpg',
    description: 'Prime A5 tenderloin seared to medium-rare precision with Perigord black truffle essence.'
  },
  {
    id: 'gal-3',
    title: 'Executive Chef at the Pass',
    category: 'Culinary Art',
    imageUrl: '/src/assets/images/chef_plating_dish_1792868334890.jpg',
    description: 'Precision plating and micro-herb finishing at our state-of-the-art open theater kitchen.'
  },
  {
    id: 'gal-4',
    title: 'Poached Maine Lobster & Squid Ink Tagliolini',
    category: 'Dishes',
    imageUrl: '/src/assets/images/food_lobster_pasta_1792868334911.jpg',
    description: 'Ocean-fresh sweetness balanced with rich saffron emulsion and hand-rolled pasta.'
  },
  {
    id: 'gal-5',
    title: '24K Royal Chocolate Finale',
    category: 'Dishes',
    imageUrl: '/src/assets/images/food_royal_dessert_1792868334735.jpg',
    description: 'An interactive pour-over chocolate sphere melting into warm wild blackberry coulis.'
  },
  {
    id: 'gal-6',
    title: 'The Vintage Wine Vault & Cellar',
    category: 'Wine & Cocktails',
    imageUrl: '/public/assets/aistudio/Broso_-_Restaurants___Cafes_WordPress_Theme_53af6de3.jpeg',
    description: 'Over 1,200 curated labels from Old World vineyards and rare artisanal distilleries.'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    code: 'BRS-7921',
    userId: 'admin-1',
    guestName: 'Julian & Claire Vance',
    guestEmail: 'julian.vance@luxurymail.com',
    guestPhone: '+1 (555) 234-8971',
    date: '2026-10-25',
    time: '19:30',
    guests: 2,
    seatingArea: 'Private Wine Vault',
    specialRequests: 'Celebrating 10th wedding anniversary. Preference for quiet corner.',
    occasion: 'Anniversary',
    status: 'confirmed',
    createdAt: '2026-10-22T10:00:00Z'
  },
  {
    id: 'res-102',
    code: 'BRS-8044',
    guestName: 'Marcus Dupont',
    guestEmail: 'marcus.dupont@financepartners.com',
    guestPhone: '+1 (555) 890-1234',
    date: '2026-10-26',
    time: '20:00',
    guests: 4,
    seatingArea: 'Main Royal Hall',
    specialRequests: 'Client dinner, pre-select Wagyu tasting menu.',
    occasion: 'Business Dinner',
    status: 'pending',
    createdAt: '2026-10-24T08:30:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-5401',
    userId: 'guest-1',
    userName: 'Lord Alistair Sterling',
    userEmail: 'sterling@heritage.co.uk',
    userPhone: '+1 (555) 902-3341',
    items: [
      {
        dish: INITIAL_MENU_ITEMS[3], // Wagyu
        quantity: 2,
        specialInstructions: 'Chef recommendation medium-rare, extra truffle jus.'
      },
      {
        dish: INITIAL_MENU_ITEMS[8], // Lobster pasta
        quantity: 1
      },
      {
        dish: INITIAL_MENU_ITEMS[10], // 24k dessert
        quantity: 2
      }
    ],
    subtotal: 318,
    tax: 25.44,
    discount: 0,
    total: 343.44,
    diningType: 'dine_in',
    tableNumber: 'Royal Booth 7',
    paymentMethod: 'card',
    status: 'preparing',
    createdAt: '2026-10-24T18:45:00Z',
    estimatedDelivery: '25 mins'
  }
];

export const DEFAULT_RESTAURANT_SETTINGS: import('../types').RestaurantSettings = {
  id: 'settings_default',
  restaurantName: 'BROSO',
  brandName: 'BROSO',
  tagline: 'Taste Royale Cuisine',
  phone: '+1 (877) 485-0700',
  contactPhone: '+1 (877) 485-0700',
  email: 'concierge@broso.com',
  contactEmail: 'concierge@broso.com',
  address: '450 Royale Boulevard, Penthouse Pavilion, Metropolitan Arts District, NY 10019',
  openingHoursWeekday: 'Tue – Thu: 12:00 PM – 10:30 PM',
  openingHoursWeekend: 'Fri – Sat: 12:00 PM – 11:30 PM',
  openingHoursSunday: 'Sun: 1:00 PM – 10:00 PM (Mon: Private Buyouts)',
  openingHours: {
    weekdays: '12:00 PM – 10:30 PM',
    weekends: '12:00 PM – 11:30 PM',
    closedDays: 'Private Buyouts & Masterclasses'
  },
  heroSubtitle: 'Welcome to Our Restaurant',
  heroTitle: 'TASTE ROYALE CUISINE',
  heroDescription: 'An unparalleled fine dining sanctuary where centuries-old royal Awadhi heritage meets modern artisanal Italian culinary mastery and rare vintage cellaring.',
  heroImageUrl: '/src/assets/images/hero_dining_interior_1792868333053.jpg',
  heroImage: '/src/assets/images/hero_dining_interior_1792868333053.jpg',
  aboutTitle: 'THE NOBLE PURSUIT OF GASTRONOMY',
  aboutStory: 'Founded under the patronage of connoisseurs who sought the timeless elegance of Awadhi royal banquets combined with the technical finesse of Italian alta cucina, BROSO is more than a restaurant—it is an ode to gastronomic aristocracy.',
  aboutSecondaryStory: 'Every reduction simmered for 36 hours, every A5 Miyazaki Wagyu grain inspected, and every truffle shaved tableside reflects our uncompromising devotion.',
  aboutImageUrl: '/src/assets/images/chef_plating_dish_1792868334890.jpg',
  aboutImage: '/src/assets/images/chef_plating_dish_1792868334890.jpg',
  yearsHeritage: '18+',
  experienceYears: '18+',
  patronsServed: '45K+',
  happyCustomers: '45K+',
  signatureRecipesCount: '68',
  signatureDishesCount: '68',
  cellarBottlesCount: '1,200+',
  masterChefsCount: '12',
  socialInstagram: 'https://instagram.com/broso.royale',
  socialFacebook: 'https://facebook.com/broso.royale',
  socialTripadvisor: 'https://tripadvisor.com',
  footerText: 'A Michelin-inspired gastronomic sanctuary honoring the regal heritage of Awadhi court banquets and the pure elegance of Northern Italian culinary artistry.',
  updatedAt: new Date().toISOString()
};
