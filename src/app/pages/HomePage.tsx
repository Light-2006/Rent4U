import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Leaf, RotateCcw, Shield, Sparkles } from 'lucide-react';
import { Shell } from '../components/layout/Shell';
import { ProductCard } from '../components/ui/ProductCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { StarRating } from '../components/ui/StarRating';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { categories, formatPrice, HERO_IMAGE, HERO_IMAGE_2, BOUTIQUE_IMAGE } from '../data/products';
import { useApp } from '../contexts/AppContext';

function pickRandomItems<T>(items: T[], count: number): T[] {
  if (items.length === 0) return [];
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

const testimonials = [
  {
    text: 'rent4u đã thay đổi hoàn toàn cách tôi ăn mặc đến các sự kiện. Tiết kiệm mà vẫn sang xịn!',
    name: 'Nguyễn Minh Châu',
    role: 'Sinh viên năm 3, 22 tuổi',
    rating: 5,
  },
  {
    text: 'Chất lượng trang phục vượt xa mong đợi. Đầm dạ hội tôi thuê còn đẹp hơn cả ảnh trên web.',
    name: 'Trần Thuỳ Linh',
    role: 'Graphic Designer, 25 tuổi',
    rating: 5,
  },
  {
    text: 'Giao hàng nhanh, dịch vụ tuyệt vời và đa dạng lựa chọn. Tôi đã giới thiệu cho cả nhóm bạn!',
    name: 'Lê Phương Anh',
    role: 'Content Creator, 23 tuổi',
    rating: 5,
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const navigate = useNavigate();
  const { products, currentUser } = useApp();
  const mostLoved = useMemo(() => {
    const cmpId = (a: { id: string }, b: { id: string }) =>
      a.id.localeCompare(b.id, undefined, { numeric: true });
    return [...products]
      .sort((a, b) => {
        const byReviews = b.reviewCount - a.reviewCount;
        if (byReviews !== 0) return byReviews;
        const byRating = b.rating - a.rating;
        if (byRating !== 0) return byRating;
        return cmpId(a, b);
      })
      .slice(0, 5);
  }, [products]);
  const trendingSpotlight = useMemo(() => pickRandomItems(products, 5), [products]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Shell>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={HERO_IMAGE}
            alt="Fashion hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F0E8DC]/30 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 pb-20">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0E8DC] border border-[#C4A882] rounded-full text-xs text-[#8B6F47] font-medium mb-6">
                <Sparkles size={12} />
                Bộ sưu tập Xuân Hè 2026
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#3D2B1F] leading-tight mb-6">
                Thời trang{' '}
                <span className="font-display-italic text-[#8B6F47]">sang trọng</span>
                {' '}cho mọi khoảnh khắc
              </h1>
              <p className="text-[#6B5135] text-base sm:text-lg mb-8 leading-relaxed">
                Thuê trang phục cao cấp với giá phải chăng. Hơn 5,000 thiết kế từ các thương hiệu hàng đầu, giao tận nơi, mặc đẹp không lo giá.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                to="/products"
                className="flex items-center gap-2 px-7 py-3.5 bg-[#8B6F47] text-white rounded-2xl hover:bg-[#6B5135] transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Thuê ngay
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="px-7 py-3.5 border border-[#C4A882] text-[#6B5135] rounded-2xl hover:bg-[#F0E8DC] transition-all"
              >
                Cách hoạt động
              </a>
            </motion.div>

            {/* Search bar */}
            <motion.form
              onSubmit={(e) => { e.preventDefault(); navigate(`/search?q=${searchQ}`); }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-2 max-w-md"
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-sm border border-[#EDE0D0] rounded-2xl shadow-sm">
                <svg className="w-4 h-4 text-[#9B8E84] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />
                  <path d="m21 21-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Tìm đầm, áo, túi xách..."
                  className="flex-1 bg-transparent outline-none text-sm text-[#3D2B1F] placeholder-[#9B8E84]"
                />
              </div>
              <button type="submit" className="px-5 py-3 bg-[#3D2B1F] text-[#F0E8DC] rounded-2xl text-sm hover:bg-[#6B5135] transition-colors">
                Tìm
              </button>
            </motion.form>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex gap-6 mt-8"
            >
              {[
                { n: '5,000+', l: 'Trang phục' },
                { n: '500+', l: 'Nhà cung cấp' },
                { n: '50K+', l: 'Khách hàng' },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div className="font-display text-xl text-[#3D2B1F]">{n}</div>
                  <div className="text-xs text-[#9B8E84]">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Floating product card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute right-8 bottom-16 hidden lg:block w-56"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-[#EDE0D0] p-3">
            <ImageWithFallback
              src={products[0].images[0]}
              alt="Featured"
              className="w-full h-36 object-cover rounded-xl mb-3"
            />
            <p className="text-xs text-[#9B8E84] mb-0.5">{products[0].provider}</p>
            <p className="font-display text-[#3D2B1F] text-sm mb-2">{products[0].name}</p>
            <div className="flex items-center justify-between">
              <span className="text-[#8B6F47] text-sm font-semibold">{formatPrice(products[0].pricePerDay)}/ngày</span>
              <span className="w-6 h-6 bg-green-100 text-green-700 text-xs rounded-full flex items-center justify-center">●</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Marquee Banner ───────────────────────────────────────────── */}
      <div className="bg-[#3D2B1F] py-3 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 whitespace-nowrap"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="text-[#C4A882] text-sm flex items-center gap-4">
              ✦ Giao hàng miễn phí toàn quốc
              <span className="text-[#6B5135] mx-2">|</span>
              ✦ Vệ sinh & khử trùng chuyên nghiệp
              <span className="text-[#6B5135] mx-2">|</span>
              ✦ Hoàn tiền 100% nếu sản phẩm lỗi
              <span className="text-[#6B5135] mx-2">|</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeSection>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs text-[#8B6F47] uppercase tracking-widest font-medium">Danh mục</span>
              <h2 className="font-display text-3xl text-[#3D2B1F] mt-1">Khám phá bộ sưu tập</h2>
            </div>
            <Link to="/products" className="text-sm text-[#8B6F47] hover:text-[#6B5135] flex items-center gap-1 transition-colors">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="group flex flex-col items-center gap-3 p-4 bg-white border border-[#EDE0D0] rounded-2xl hover:border-[#C4A882] hover:shadow-md transition-all text-center"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#3D2B1F] leading-tight">{cat.name}</p>
                    <p className="text-xs text-[#9B8E84] mt-0.5">{cat.count} sản phẩm</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ── Featured Products ──────────────────────────────────────────── */}
      <section className="bg-[#F0E8DC]/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs text-[#8B6F47] uppercase tracking-widest font-medium">Nổi bật</span>
                <h2 className="font-display text-3xl text-[#3D2B1F] mt-1">Được yêu thích nhất</h2>
              </div>
              <Link to="/products" className="text-sm text-[#8B6F47] hover:text-[#6B5135] flex items-center gap-1 transition-colors hidden sm:flex">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
          </FadeSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : mostLoved.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeSection>
          <div className="text-center mb-12">
            <span className="text-xs text-[#8B6F47] uppercase tracking-widest font-medium">Quy trình</span>
            <h2 className="font-display text-3xl text-[#3D2B1F] mt-1">Thuê đơn giản chỉ 3 bước</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <Sparkles size={24} className="text-[#8B6F47]" />,
                title: 'Chọn trang phục',
                desc: 'Duyệt hàng nghìn thiết kế sang trọng theo danh mục, dịp đặc biệt hoặc phong cách cá nhân.',
              },
              {
                step: '02',
                icon: <RotateCcw size={24} className="text-[#8B6F47]" />,
                title: 'Đặt ngày thuê',
                desc: 'Chọn ngày nhận và trả hàng trên lịch trực tiếp. Giao hàng tận nơi trước ngày bạn cần.',
              },
              {
                step: '03',
                icon: <Leaf size={24} className="text-[#8B6F47]" />,
                title: 'Mặc & hoàn trả',
                desc: 'Toả sáng trong trang phục ý thích. Sau đó gói lại và gửi trả — chúng tôi lo phần còn lại.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-7 border border-[#EDE0D0] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F0E8DC] rounded-2xl flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#C4A882] tracking-widest">{step.step}</span>
                    <h3 className="font-display text-[#3D2B1F] text-lg mt-1 mb-2">{step.title}</h3>
                    <p className="text-sm text-[#9B8E84] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ── Trending Section ───────────────────────────────────────────── */}
      <section className="bg-[#3D2B1F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeSection>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs text-[#C4A882] uppercase tracking-widest font-medium">Xu hướng</span>
                <h2 className="font-display text-3xl text-white mt-1">Đang được săn đón</h2>
              </div>
              <Link to="/search" className="text-sm text-[#C4A882] hover:text-white flex items-center gap-1 transition-colors">
                Khám phá thêm <ArrowRight size={14} />
              </Link>
            </div>
          </FadeSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingSpotlight.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Sustainability Banner ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeSection>
          <div className="relative bg-[#F0E8DC] rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-72">
              <div className="flex flex-col justify-center p-10 lg:p-14">
                <span className="inline-flex items-center gap-2 text-xs text-[#8B6F47] uppercase tracking-widest font-medium mb-4">
                  <Leaf size={14} />
                  Thời trang bền vững
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-[#3D2B1F] mb-4">
                  Mặc đẹp, sống xanh
                </h2>
                <p className="text-[#6B5135] text-sm leading-relaxed mb-6">
                  Mỗi lần thuê thay vì mua mới, bạn đã giúp giảm 73% lượng nước tiêu thụ và 80% khí thải carbon. rent4u là lựa chọn thời trang có trách nhiệm với hành tinh.
                </p>
                <div className="flex gap-6 mb-6">
                  {[
                    { n: '73%', l: 'Tiết kiệm nước' },
                    { n: '80%', l: 'Giảm carbon' },
                    { n: '100%', l: 'Tái sử dụng' },
                  ].map(({ n, l }) => (
                    <div key={l}>
                      <div className="font-display text-2xl text-[#8B6F47]">{n}</div>
                      <div className="text-xs text-[#9B8E84]">{l}</div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/products"
                  className="w-fit flex items-center gap-2 px-6 py-3 bg-[#8B6F47] text-white rounded-2xl hover:bg-[#6B5135] transition-colors text-sm"
                >
                  Thuê ngay <ArrowRight size={14} />
                </Link>
              </div>
              <div className="relative hidden lg:block">
                <ImageWithFallback
                  src={BOUTIQUE_IMAGE}
                  alt="Sustainable fashion boutique"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#F0E8DC] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ── Values ──────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF8F5] border-t border-[#EDE0D0] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={20} />, title: 'Bảo hiểm 100%', desc: 'Mọi trang phục đều có bảo hiểm' },
              { icon: <RotateCcw size={20} />, title: 'Đổi trả dễ dàng', desc: 'Không vừa? Đổi ngay miễn phí' },
              { icon: <Sparkles size={20} />, title: 'Chất lượng đảm bảo', desc: 'Vệ sinh & kiểm tra trước mỗi lần thuê' },
              { icon: <Leaf size={20} />, title: 'Thân thiện môi trường', desc: 'Giảm thiểu lãng phí thời trang' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3 p-5"
              >
                <div className="w-10 h-10 bg-[#F0E8DC] rounded-xl flex items-center justify-center text-[#8B6F47]">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium text-[#3D2B1F] text-sm">{item.title}</p>
                  <p className="text-xs text-[#9B8E84] mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeSection>
          <div className="text-center mb-10">
            <span className="text-xs text-[#8B6F47] uppercase tracking-widest font-medium">Đánh giá</span>
            <h2 className="font-display text-3xl text-[#3D2B1F] mt-1">Khách hàng nói gì về chúng tôi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white border border-[#EDE0D0] rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <StarRating rating={t.rating} size="sm" />
                <p className="text-sm text-[#6B5135] leading-relaxed mt-4 mb-5 font-display-italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#F0E8DC]">
                  <div className="w-9 h-9 bg-[#EDE0D0] rounded-full flex items-center justify-center text-[#8B6F47] font-medium text-sm flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#3D2B1F]">{t.name}</p>
                    <p className="text-xs text-[#9B8E84]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <FadeSection>
          <div className="relative bg-[#3D2B1F] rounded-3xl px-8 py-14 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <ImageWithFallback src={HERO_IMAGE_2} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative">
              <span className="text-xs text-[#C4A882] uppercase tracking-widest font-medium">Bắt đầu ngay hôm nay</span>
              <h2 className="font-display text-3xl sm:text-4xl text-white mt-3 mb-4">
                Mở tủ đồ vô hạn<br />
                <span className="font-display-italic text-[#C4A882]">chỉ với vài click</span>
              </h2>
              <p className="text-[#9B8E84] text-sm mb-8 max-w-md mx-auto">
                Đăng ký ngay hôm nay và nhận ưu đãi giảm 20% cho đơn thuê đầu tiên.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!currentUser && (
                  <Link
                    to="/register"
                    className="px-8 py-3.5 bg-[#C4A882] text-[#3D2B1F] rounded-2xl font-medium hover:bg-[#D4A853] transition-colors"
                  >
                    Đăng ký miễn phí
                  </Link>
                )}
                <Link
                  to="/products"
                  className="px-8 py-3.5 border border-[#6B5135] text-[#C4A882] rounded-2xl hover:border-[#C4A882] hover:text-white transition-colors"
                >
                  Xem bộ sưu tập
                </Link>
              </div>
            </div>
          </div>
        </FadeSection>
      </section>
    </Shell>
  );
}
