import 'dotenv/config';
import mongoose from 'mongoose';
import ClothingItem from '../src/models/ClothingItem.js';

const MONGO_URL = process.env.MONGO_URI as string;

const clerkUserId = process.argv[2];
if (!clerkUserId) {
  console.error('Usage: npx ts-node backend/scripts/seed.ts <clerk_user_id>');
  process.exit(1);
}

type Category = 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'hatwear';

const CLOTHING_ITEMS: { name: string; category: Category; tags: string[]; imageUrl: string }[] = [
  // Tops
  { name: 'Black Collar Shirt',    category: 'tops',        tags: ['formal'],                        imageUrl: '/images/black_collar.avif' },
  { name: 'Burgundy Tee',          category: 'tops',        tags: ['casual'],                        imageUrl: '/images/burgunry_tee.jpeg' },
  { name: 'Uniqlo Airism Black',   category: 'tops',        tags: ['casual', 'everyday'],            imageUrl: '/images/uniqlo_airism_black.avif' },
  { name: 'Uniqlo Airism White',   category: 'tops',        tags: ['casual', 'everyday'],            imageUrl: '/images/uniqlo_airism_white.avif' },
  // Bottoms
  { name: 'Dune Pant',             category: 'bottoms',     tags: ['casual'],                        imageUrl: '/images/dune_pant.jpg' },
  { name: 'Light Wash Jeans',      category: 'bottoms',     tags: ['casual', 'denim'],               imageUrl: '/images/light_wash_jeans.avif' },
  { name: 'Vintage Wash Jeans',    category: 'bottoms',     tags: ['vintage', 'denim'],              imageUrl: '/images/vintage_wash_jeans.jpg' },
  // Outerwear
  { name: 'Leather Jacket',        category: 'outerwear',   tags: ['casual', 'leather'],             imageUrl: '/images/leather_jacket.avif' },
  { name: 'Olive Sweater',         category: 'outerwear',   tags: ['casual', 'knit'],                imageUrl: '/images/olive_sweater.jpg' },
  { name: 'Petrol Jacket',         category: 'outerwear',   tags: ['casual', 'streetwear'],          imageUrl: '/images/petrol_jacket.jpg' },
  // Footwear
  { name: 'Brown Chelsea Boots',   category: 'footwear',    tags: ['formal', 'leather', 'boots'],    imageUrl: '/images/brown_chelsea.webp' },
  { name: 'Black Loafers',         category: 'footwear',    tags: ['formal', 'leather'],             imageUrl: '/images/loafer_black.jpg' },
  { name: 'Onika',                 category: 'footwear',    tags: ['casual', 'sneakers'],            imageUrl: '/images/onika.jpg' },
  // Headwear
  { name: 'Black Cap',             category: 'hatwear',     tags: ['casual', 'streetwear'],          imageUrl: '/images/black_cap.avif' },
  { name: 'Yankees Grey Cap',      category: 'hatwear',     tags: ['casual', 'streetwear'],          imageUrl: '/images/yankee_grey.webp' },
  // Accessories
  { name: 'Silver Bracelet',       category: 'accessories', tags: ['casual', 'formal'],              imageUrl: '/images/bracelet_silver.webp' },
  { name: 'Silver Necklace',       category: 'accessories', tags: ['casual', 'formal'],              imageUrl: '/images/necklace_silver.png' },
];

async function seed() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');

  // Clear existing items for this Clerk user and re-insert
  const deleted = await ClothingItem.deleteMany({ userId: clerkUserId });
  if (deleted.deletedCount > 0) {
    console.log(`Cleared ${deleted.deletedCount} existing items`);
  }

  const items = CLOTHING_ITEMS.map(item => ({ ...item, userId: clerkUserId }));
  await ClothingItem.insertMany(items);
  console.log(`Inserted ${items.length} clothing items for Clerk user: ${clerkUserId}`);

  console.log('\n--- Done! ---');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
