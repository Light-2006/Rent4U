export interface Product {
  id: string;
  name: string;
  provider: string;
  providerAvatar: string;
  providerRating: number;
  providerTotalRentals: number;
  ownerId?: string;
  description: string;
  pricePerDay: number;
  depositAmount: number;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isAvailable: boolean;
  isNew: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  images: string[];
  condition: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1737188550231-cd8a16ec614b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbHV4dXJ5JTIwY3JlYW0lMjBkcmVzcyUyMG1vZGVsfGVufDF8fHx8MTc3NTgxOTUyM3ww&ixlib=rb-4.1.0&q=80&w=1080';

export const HERO_IMAGE_2 =
  'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBiZWlnZSUyMGJhY2tncm91bmQlMjBlbGVnYW50JTIwcG9zZXxlbnwxfHx8fDE3NzU4MTk1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080';

export const BOUTIQUE_IMAGE =
  'https://images.unsplash.com/photo-1745806115041-8711ae239878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYm91dGlxdWUlMjBjbG90aGluZyUyMHN0b3JlJTIwaW50ZXJpb3IlMjBtaW5pbWFsfGVufDF8fHx8MTc3NTgxOTUzMnww&ixlib=rb-4.1.0&q=80&w=1080';

export const PROVIDER_AVATAR =
  'https://images.unsplash.com/photo-1763987275895-72f645d0acbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwZmFzaGlvbiUyMHByb2ZpbGUlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzc1ODE5NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080';

export const products: Product[] = [
  {
    id: '1',
    name: 'Đầm Dạ Hội Lụa Đen',
    provider: 'Élégance Rental House',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.9,
    providerTotalRentals: 342,
    description:
      'Chiếc đầm dạ hội lụa đen sang trọng với đường cắt tinh tế, phù hợp cho các buổi tiệc tối, sự kiện gala và lễ tốt nghiệp. Chất liệu lụa cao cấp ôm vóc dáng hoàn hảo, tạo nên vẻ quyến rũ và thanh lịch.',
    pricePerDay: 480000,
    depositAmount: 2000000,
    rating: 4.9,
    reviewCount: 128,
    category: 'Đầm dạ hội',
    tags: ['dạ hội', 'sang trọng', 'lụa', 'tiệc tối'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Đen', hex: '#1A1A1A' },
      { name: 'Đỏ rượu', hex: '#722F37' },
    ],
    isAvailable: true,
    isNew: false,
    isTrending: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1764998112626-23f005c580d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbmluZyUyMGdvd24lMjBibGFjayUyMGRyZXNzJTIwbHV4dXJ5JTIwZmFzaGlvbnxlbnwxfHx8fDE3NzU4MTk1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBiZWlnZSUyMGJhY2tncm91bmQlMjBlbGVnYW50JTIwcG9zZXxlbnwxfHx8fDE3NzU4MTk1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Như mới',
  },
  {
    id: '2',
    name: 'Váy Hoa Midi Duyên Dáng',
    provider: 'Blooming Wardrobe',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.7,
    providerTotalRentals: 215,
    description:
      'Chiếc váy hoa midi nhẹ nhàng, phù hợp cho dã ngoại, sinh nhật và các buổi chụp ảnh ngoài trời. Chất liệu voan mềm mại, tạo cảm giác thoải mái và nữ tính.',
    pricePerDay: 195000,
    depositAmount: 800000,
    rating: 4.7,
    reviewCount: 89,
    category: 'Váy liền',
    tags: ['hoa nhí', 'nhẹ nhàng', 'chụp ảnh', 'dã ngoại'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Hoa xanh', hex: '#7EB5D6' },
      { name: 'Hoa hồng', hex: '#E8A0A0' },
    ],
    isAvailable: true,
    isNew: true,
    isTrending: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1773335954141-dd2c19b9fcd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBzdW1tZXIlMjBtaWRpJTIwZHJlc3MlMjB3b21hbiUyMGZhc2hpb258ZW58MXx8fHwxNzc1ODE5NTIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1763766274735-744ca07039d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuY2glMjBjb2F0JTIwd29tYW4lMjBhdXR1bW4lMjBmYXNoaW9uJTIwc3RyZWV0fGVufDF8fHx8MTc3NTgxOTUyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Rất tốt',
  },
  {
    id: '3',
    name: 'Áo Blazer Công Sở Trắng',
    provider: 'Office Chic Studio',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.8,
    providerTotalRentals: 178,
    description:
      'Áo blazer trắng thanh lịch dành cho phỏng vấn, họp quan trọng và sự kiện công sở. Kiểu dáng fitted tôn dáng, phù hợp với nhiều kiểu quần và váy.',
    pricePerDay: 155000,
    depositAmount: 600000,
    rating: 4.8,
    reviewCount: 67,
    category: 'Áo khoác',
    tags: ['công sở', 'thanh lịch', 'phỏng vấn', 'blazer'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Trắng', hex: '#F5F5F5' },
      { name: 'Kem', hex: '#F5E6D3' },
      { name: 'Đen', hex: '#1A1A1A' },
    ],
    isAvailable: true,
    isNew: false,
    isTrending: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1747814965215-15a273e27aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGF6ZXIlMjB3b21hbiUyMG9mZmljZSUyMGNoaWMlMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc3NTgxOTUyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1584287981937-67ab60932edf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2xpcCUyMGRyZXNzJTIwbWluaW1hbGlzdCUyMGZhc2hpb24lMjB3aGl0ZXxlbnwxfHx8fDE3NzU4MTk1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Như mới',
  },
  {
    id: '4',
    name: 'Đầm Lụa Trắng Minimalist',
    provider: 'Pure Linen Rental',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.6,
    providerTotalRentals: 134,
    description:
      'Đầm lụa trắng tinh khiết theo phong cách minimalist, lý tưởng cho chụp ảnh cưới, pre-wedding và các buổi chụp hình nghệ thuật. Đường may tinh tế, chất lụa thượng hạng.',
    pricePerDay: 350000,
    depositAmount: 1500000,
    rating: 4.6,
    reviewCount: 54,
    category: 'Đầm dạ hội',
    tags: ['minimalist', 'trắng', 'cưới', 'chụp ảnh'],
    sizes: ['XS', 'S', 'M'],
    colors: [{ name: 'Trắng ngà', hex: '#FAF0E6' }],
    isAvailable: false,
    isNew: false,
    isTrending: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1584287981937-67ab60932edf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2xpcCUyMGRyZXNzJTIwbWluaW1hbGlzdCUyMGZhc2hpb24lMjB3aGl0ZXxlbnwxfHx8fDE3NzU4MTk1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1764998112626-23f005c580d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbmluZyUyMGdvd24lMjBibGFjayUyMGRyZXNzJTIwbHV4dXJ5JTIwZmFzaGlvbnxlbnwxfHx8fDE3NzU4MTk1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Rất tốt',
  },
  {
    id: '5',
    name: 'Áo Khoác Trench Coat Dài',
    provider: 'Street Style Saigon',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.5,
    providerTotalRentals: 98,
    description:
      'Áo khoác trench coat dài cổ điển, phong cách Pháp. Phù hợp mặc mùa se lạnh, du lịch và chụp ảnh ngoài trời. Chất liệu cotton cao cấp, giữ ấm tốt.',
    pricePerDay: 220000,
    depositAmount: 1000000,
    rating: 4.5,
    reviewCount: 43,
    category: 'Áo khoác',
    tags: ['trench coat', 'cổ điển', 'thu đông', 'du lịch'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Đen', hex: '#1A1A1A' },
    ],
    isAvailable: true,
    isNew: true,
    isTrending: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1763766274735-744ca07039d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuY2glMjBjb2F0JTIwd29tYW4lMjBhdXR1bW4lMjBmYXNoaW9uJTIwc3RyZWV0fGVufDF8fHx8MTc3NTgxOTUyOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1747814965215-15a273e27aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGF6ZXIlMjB3b21hbiUyMG9mZmljZSUyMGNoaWMlMjBmYXNoaW9uJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc3NTgxOTUyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Tốt',
  },
  {
    id: '6',
    name: 'Túi Da Cao Cấp Vintage',
    provider: 'LuxBag Hanoi',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.9,
    providerTotalRentals: 267,
    description:
      'Túi da thật vintage cao cấp, thiết kế cổ điển trường tồn với thời gian. Phụ kiện hoàn hảo để hoàn thiện bộ trang phục dạ hội hay công sở. Phù hợp cho nhiều dịp quan trọng.',
    pricePerDay: 280000,
    depositAmount: 3000000,
    rating: 4.9,
    reviewCount: 156,
    category: 'Phụ kiện',
    tags: ['túi da', 'vintage', 'luxury', 'phụ kiện'],
    sizes: ['One Size'],
    colors: [
      { name: 'Nâu da bò', hex: '#8B4513' },
      { name: 'Đen', hex: '#1A1A1A' },
      { name: 'Kem', hex: '#F5E6D3' },
    ],
    isAvailable: true,
    isNew: false,
    isTrending: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1760624294504-211e763ee0fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwbGVhdGhlciUyMGJyb3duJTIwYWNjZXNzb3JpZXMlMjBmYXNoaW9ufGVufDF8fHx8MTc3NTgxOTUyOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1773335954141-dd2c19b9fcd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBzdW1tZXIlMjBtaWRpJTIwZHJlc3MlMjB3b21hbiUyMGZhc2hpb258ZW58MXx8fHwxNzc1ODE5NTIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Như mới',
  },
  {
    id: '7',
    name: 'Đầm Mini Dự Tiệc Y2K',
    provider: 'GenZ Closet',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.4,
    providerTotalRentals: 89,
    description:
      'Đầm mini phong cách Y2K sặc sỡ, hoàn hảo cho tiệc sinh nhật, bar hopping và các sự kiện vui nhộn. Thiết kế trendy, cá tính và đậm chất thế hệ Z.',
    pricePerDay: 165000,
    depositAmount: 500000,
    rating: 4.4,
    reviewCount: 72,
    category: 'Váy liền',
    tags: ['Y2K', 'tiệc', 'trendy', 'mini dress'],
    sizes: ['XS', 'S', 'M'],
    colors: [
      { name: 'Hồng baby', hex: '#FFB6C1' },
      { name: 'Bạc', hex: '#C0C0C0' },
    ],
    isAvailable: true,
    isNew: true,
    isTrending: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1766299235095-fa238ca90270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pJTIwZHJlc3MlMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIweW91bmclMjB3b21hbnxlbnwxfHx8fDE3NzU4MTk1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1644557516421-4f9ed408259f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXF1aW4lMjBwYXJ0eSUyMGRyZXNzJTIwZ2xhbSUyMG5pZ2h0JTIwb3V0Zml0JTIwd29tYW58ZW58MXx8fHwxNzc1ODE5NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Rất tốt',
  },
  {
    id: '8',
    name: 'Set Streetwear Phong Cách',
    provider: 'Urban Flow Collective',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.6,
    providerTotalRentals: 112,
    description:
      'Bộ trang phục streetwear năng động, phong cách Hàn Quốc hiện đại. Phù hợp cho đi chơi phố, sự kiện âm nhạc và chụp ảnh street style.',
    pricePerDay: 185000,
    depositAmount: 700000,
    rating: 4.6,
    reviewCount: 93,
    category: 'Streetwear',
    tags: ['streetwear', 'Hàn Quốc', 'năng động', 'phố'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Đen trắng', hex: '#808080' },
      { name: 'Beige', hex: '#F5DEB3' },
    ],
    isAvailable: true,
    isNew: false,
    isTrending: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1773170698495-5fc99eb39010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RyZWV0d2VhciUyMG91dGZpdCUyMGFzaWFuJTIwd29tYW4lMjB1cmJhbnxlbnwxfHx8fDE3NzU4MTk1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1766299235095-fa238ca90270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pJTIwZHJlc3MlMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIweW91bmclMjB3b21hbnxlbnwxfHx8fDE3NzU4MTk1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Tốt',
  },
  {
    id: '9',
    name: 'Đầm Sequin Ánh Kim Đêm Tiệc',
    provider: 'Glam Night Rental',
    providerAvatar: PROVIDER_AVATAR,
    providerRating: 4.8,
    providerTotalRentals: 201,
    description:
      'Đầm sequin ánh kim lấp lánh, toả sáng trong mọi buổi tiệc tối và đêm nhạc hội. Thiết kế ôm dáng, tôn lên đường cong hoàn hảo. Trở thành tâm điểm của mọi sự kiện.',
    pricePerDay: 395000,
    depositAmount: 1800000,
    rating: 4.8,
    reviewCount: 187,
    category: 'Đầm dạ hội',
    tags: ['sequin', 'tiệc đêm', 'ánh kim', 'nổi bật'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Vàng ánh kim', hex: '#D4AF37' },
      { name: 'Bạc', hex: '#C0C0C0' },
      { name: 'Đồng', hex: '#B87333' },
    ],
    isAvailable: true,
    isNew: false,
    isTrending: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1644557516421-4f9ed408259f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXF1aW4lMjBwYXJ0eSUyMGRyZXNzJTIwZ2xhbSUyMG5pZ2h0JTIwb3V0Zml0JTIwd29tYW58ZW58MXx8fHwxNzc1ODE5NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1764998112626-23f005c580d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZXZlbmluZyUyMGdvd24lMjBibGFjayUyMGRyZXNzJTIwbHV4dXJ5JTIwZmFzaGlvbnxlbnwxfHx8fDE3NzU4MTk1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    condition: 'Như mới',
  },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'Nguyễn Minh Châu',
    userAvatar: PROVIDER_AVATAR,
    rating: 5,
    comment: 'Đầm rất đẹp và sang trọng! Chất lụa mềm mại, đường may tinh tế. Mình mặc đi dự tiệc cưới và nhận được rất nhiều lời khen. Dịch vụ thuê cũng rất chuyên nghiệp.',
    date: '15 tháng 3, 2026',
    helpful: 24,
    images: ['https://images.unsplash.com/photo-1764998112626-23f005c580d7?w=200'],
  },
  {
    id: 'r2',
    productId: '1',
    userName: 'Trần Thuỳ Linh',
    userAvatar: PROVIDER_AVATAR,
    rating: 5,
    comment: 'Hoàn toàn xứng đáng với giá tiền! Đầm được vệ sinh sạch sẽ, đóng gói cẩn thận. Mình sẽ thuê lại lần sau.',
    date: '8 tháng 3, 2026',
    helpful: 18,
  },
  {
    id: 'r3',
    productId: '1',
    userName: 'Lê Phương Anh',
    userAvatar: PROVIDER_AVATAR,
    rating: 4,
    comment: 'Đầm rất đẹp nhưng cỡ M hơi chật ở vai. Mọi người nên chọn size L nếu vai rộng. Nhìn chung vẫn rất hài lòng.',
    date: '22 tháng 2, 2026',
    helpful: 31,
  },
];

export const categories = [
  { id: 'dam-da-hoi', name: 'Đầm Dạ Hội', icon: '👗', count: 248, color: '#F0E8DC' },
  { id: 'vay-lien', name: 'Váy Liền', icon: '🌸', count: 312, color: '#EDE0D0' },
  { id: 'ao-khoac', name: 'Áo Khoác', icon: '🧥', count: 156, color: '#F5EDE0' },
  { id: 'phu-kien', name: 'Phụ Kiện', icon: '👜', count: 421, color: '#F0EAD6' },
  { id: 'streetwear', name: 'Streetwear', icon: '✨', count: 189, color: '#EDE0D0' },
  { id: 'ao-dai', name: 'Áo Dài', icon: '🪷', count: 134, color: '#F5EDE0' },
];
