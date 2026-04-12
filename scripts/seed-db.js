const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'mock-data', 'db.json');
const out = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const categories = [
  { id: 'dam-da-hoi', name: 'Đầm Dạ Hội' },
  { id: 'vay-lien', name: 'Váy Liền' },
  { id: 'ao-khoac', name: 'Áo Khoác' },
  { id: 'phu-kien', name: 'Phụ Kiện' },
  { id: 'streetwear', name: 'Streetwear' },
  { id: 'ao-dai', name: 'Áo Dài' },
];

const imagePool = [
  'https://images.unsplash.com/photo-1764998112626-23f005c580d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1773335954141-dd2c19b9fcd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1763766274735-744ca07039d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1766299235095-fa238ca90270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1747814965215-15a273e27aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1760624294504-211e763ee0fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1773170698495-5fc99eb39010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1644557516421-4f9ed408259f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1763987275895-72f645d0acbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const providers = [
  'Élégance Rental House',
  'Blooming Wardrobe',
  'Office Chic Studio',
  'Pure Linen Rental',
  'Street Style Saigon',
  'LuxBag Hanoi',
  'GenZ Closet',
  'Urban Flow Collective',
  'Glam Night Rental',
  'Vintage Vault',
];

const sampleNames = ['Aurora', 'Luna', 'Nova', 'Mina', 'Iris', 'Sakura', 'Mira', 'Nora', 'Violet', 'Zara'];
const sampleUsers = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Minh', 'Đỗ Thị Hương', 'Võ Anh', 'Bùi Lan'];
const colorPool = [
  { name: 'Đen', hex: '#1A1A1A' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Đỏ', hex: '#C0392B' },
  { name: 'Xanh dương', hex: '#2980B9' },
  { name: 'Xanh lá', hex: '#27AE60' },
  { name: 'Vàng', hex: '#F1C40F' },
  { name: 'Hồng', hex: '#FFB6C1' },
  { name: 'Be', hex: '#F5DEB3' },
];
const sizesPool = [['XS','S','M','L'], ['S','M','L','XL'], ['One Size']];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function sample(arr, n) {
  const copy = [...arr];
  const res = [];
  while (res.length < n && copy.length) res.push(copy.splice(Math.floor(Math.random()*copy.length), 1)[0]);
  return res;
}

const existingIds = out.products.map(p => parseInt(p.id, 10)).filter(n => !Number.isNaN(n));
let nextId = existingIds.length ? Math.max(...existingIds) + 1 : 100;

let addedProducts = 0;
let addedReviews = 0;

for (const cat of categories) {
  for (let i = 0; i < 20; i++) {
    const id = String(nextId++);
    const provider = choice(providers);
    const images = sample(imagePool, Math.max(1, Math.min(3, rand(1,3))));
    const prices = [120000, 150000, 180000, 200000, 250000, 300000, 350000, 400000, 450000, 500000];
    const pricePerDay = choice(prices);
    const reviewCount = rand(0, 250);
    const rating = Math.round((3 + Math.random() * 2) * 10) / 10; // 3.0 - 5.0

    const prod = {
      id,
      name: `${cat.name} ${choice(sampleNames)} #${i + 1}`,
      provider,
      providerAvatar: choice(imagePool),
      providerRating: Math.round((4 + Math.random() * 1) * 10) / 10,
      providerTotalRentals: rand(0, 500),
      ownerId: null,
      description: `${cat.name} phong cách đẹp, phù hợp nhiều dịp. Mẫu số ${i+1} thuộc bộ sưu tập tự động.`,
      pricePerDay,
      depositAmount: rand(500000, 3000000),
      rating,
      reviewCount,
      category: cat.name,
      tags: [cat.id, 'new-arrival'],
      sizes: choice(sizesPool),
      colors: sample(colorPool, Math.max(1, Math.min(3, rand(1,3)))),
      isAvailable: Math.random() > 0.2,
      isNew: Math.random() > 0.6,
      isTrending: Math.random() > 0.8,
      isFeatured: Math.random() > 0.85,
      images,
      condition: choice(['Tốt', 'Rất tốt', 'Như mới']),
    };

    out.products.push(prod);
    addedProducts++;

    // generate a few actual review objects (0-6)
    const reviewsToMake = Math.min(reviewCount, rand(0, 6));
    for (let r = 0; r < reviewsToMake; r++) {
      const rid = `r${Date.now()}${Math.floor(Math.random()*10000)}${r}`;
      const rating = rand(3,5);
      const comment = ['Tuyệt vời', 'Rất đẹp', 'Chất lượng tốt', 'Vừa vặn', 'Sẽ thuê lại', 'Hài lòng'][rand(0,5)];
      const date = new Date(Date.now() - rand(0, 365) * 24 * 3600 * 1000).toISOString().split('T')[0];
      out.reviews.push({ id: rid, productId: id, userName: choice(sampleUsers), userAvatar: choice(imagePool), rating, comment, date, helpful: rand(0, 50) });
      addedReviews++;
    }
  }
}

out.dbVersion = Date.now();

fs.writeFileSync(dbPath, JSON.stringify(out, null, 2), 'utf8');
console.log(`Seeded ${addedProducts} products and ${addedReviews} reviews into ${dbPath}. New dbVersion=${out.dbVersion}`);
