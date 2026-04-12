import { useState, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, ShoppingBag, Share2, Star, ChevronRight, ChevronLeft,
  Shield, RotateCcw, Truck, CheckCircle2, AlertCircle, MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { Shell } from '../components/layout/Shell';
import { ProductCard } from '../components/ui/ProductCard';
import { StarRating } from '../components/ui/StarRating';
import { RentalCalendar } from '../components/ui/RentalCalendar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';

const TABS = ['Mô tả', 'Hướng dẫn size', 'Chính sách thuê', 'Đánh giá'];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, isAuthenticated, products, reviews } = useApp();
  const location = useLocation();
  const product = products.find((p) => p.id === id) ?? products[0];
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);
  const productReviews = reviews.filter((r) => r.productId === product.id).slice(0, 3);
  const productReviewList = reviews.filter((r) => r.productId === product.id);
  const totalFromState = productReviewList.length;
  const totalReviews = totalFromState > 0 ? totalFromState : (product.reviewCount ?? 0);
  const averageRating = totalFromState > 0 ? productReviewList.reduce((s, r) => s + r.rating, 0) / totalFromState : (product.rating ?? 0);
  const tabPanelRef = useRef<HTMLDivElement | null>(null);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? '');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [quantity, setQuantity] = useState(1);
  const inWishlist = isInWishlist(product.id);

  const rentalDays =
    startDate && endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : null;
  const totalPrice = rentalDays ? product.pricePerDay * rentalDays : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Vui lòng chọn kích cỡ', {
        style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
      });
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn ngày thuê', {
        style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
      });
      return;
    }
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thuê sản phẩm', {
        style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
      });
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    addToCart({ product, startDate, endDate, quantity, selectedSize, selectedColor });
    toast.success('Đã thêm vào giỏ hàng!', {
      icon: '🛍️',
      style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
      action: { label: 'Xem giỏ', onClick: () => navigate('/cart') },
    });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng yêu thích', {
        style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
      });
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    toggleWishlist(product.id);
    toast(inWishlist ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích', {
      icon: inWishlist ? '💔' : '❤️',
      style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
    });
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#9B8E84] mb-8">
          <Link to="/" className="hover:text-[#8B6F47] transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-[#8B6F47] transition-colors">Sản phẩm</Link>
          <ChevronRight size={12} />
          <span className="text-[#3D2B1F] line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* ── Image Gallery ─────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#F0E8DC] aspect-[4/5]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <ImageWithFallback
                    src={product.images[activeImg] ?? product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((i) => Math.max(0, i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={18} className="text-[#3D2B1F]" />
                  </button>
                  <button
                    onClick={() => setActiveImg((i) => Math.min(product.images.length - 1, i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={18} className="text-[#3D2B1F]" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.isNew && (
                  <span className="px-2.5 py-1 bg-[#8B6F47] text-white text-xs rounded-full shadow-sm">Mới</span>
                )}
                {product.isTrending && (
                  <span className="px-2.5 py-1 bg-[#3D2B1F] text-white text-xs rounded-full shadow-sm">Hot 🔥</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={handleWishlist}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <Heart size={16} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-[#6B5135]'} />
                </button>
                <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                  <Share2 size={14} className="text-[#6B5135]" />
                </button>
              </div>

              {!product.isAvailable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-white/95 rounded-2xl px-6 py-4 text-center">
                    <AlertCircle size={24} className="text-[#9B8E84] mx-auto mb-2" />
                    <p className="text-[#3D2B1F] font-medium text-sm">Đang được thuê</p>
                    <p className="text-[#9B8E84] text-xs mt-1">Trả ngày 20/04/2026</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImg === i ? 'border-[#8B6F47]' : 'border-transparent hover:border-[#C4A882]'
                  }`}
                >
                  <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ───────────────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div>
              <p className="text-sm text-[#9B8E84] mb-1">{product.provider}</p>
              <h1 className="font-display text-3xl text-[#3D2B1F] mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <StarRating rating={product.rating} count={product.reviewCount} />
                <span className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full ${
                  product.isAvailable ? 'bg-green-50 text-green-700' : 'bg-[#EDE0D0] text-[#9B8E84]'
                }`}>
                  {product.isAvailable ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  {product.isAvailable ? 'Còn trống' : 'Đã thuê'}
                </span>
                <span className="text-sm text-[#9B8E84] bg-[#F0E8DC] px-2.5 py-1 rounded-full">
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-[#FAF8F5] border border-[#EDE0D0] rounded-2xl p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl text-[#8B6F47]">
                  {formatPrice(product.pricePerDay)}
                </span>
                <span className="text-[#9B8E84] text-sm">/ngày</span>
              </div>
              <p className="text-xs text-[#9B8E84] mt-1">
                Đặt cọc: {formatPrice(product.depositAmount)} (hoàn lại sau khi trả đồ)
              </p>
              {totalPrice && (
                <div className="mt-3 pt-3 border-t border-[#EDE0D0] flex items-center justify-between">
                  <span className="text-sm text-[#6B5135]">Tổng cộng ({rentalDays} ngày)</span>
                  <span className="font-semibold text-[#3D2B1F]">{formatPrice(totalPrice)}</span>
                </div>
              )}
            </div>

            {/* Color selector */}
            <div>
              <p className="text-sm font-medium text-[#3D2B1F] mb-2.5">
                Màu sắc: <span className="text-[#8B6F47]">{selectedColor}</span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === color.name ? 'border-[#8B6F47] scale-110 shadow-md' : 'border-[#EDE0D0]'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-sm font-medium text-[#3D2B1F]">Kích cỡ</p>
                <button
                  onClick={() => {
                    setActiveTab(TABS[1]);
                    // wait a short moment for tab content to render, then scroll
                    setTimeout(() => tabPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
                  }}
                  className="text-xs text-[#8B6F47] underline"
                >
                  Hướng dẫn chọn size
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border-2 rounded-xl text-sm transition-all ${
                      selectedSize === s
                        ? 'bg-[#3D2B1F] border-[#3D2B1F] text-white shadow-md'
                        : 'border-[#EDE0D0] text-[#6B5135] hover:border-[#C4A882]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Rental Calendar */}
            <div>
              <p className="text-sm font-medium text-[#3D2B1F] mb-2.5">Chọn ngày thuê</p>
              <RentalCalendar
                startDate={startDate}
                endDate={endDate}
                onRangeChange={(s, e) => { setStartDate(s); setEndDate(e); }}
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-[#3D2B1F]">Số lượng:</p>
              <div className="flex items-center border border-[#EDE0D0] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-[#6B5135] hover:bg-[#F0E8DC] transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-[#3D2B1F] font-medium text-sm border-x border-[#EDE0D0]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-[#6B5135] hover:bg-[#F0E8DC] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#8B6F47] text-white rounded-2xl hover:bg-[#6B5135] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <ShoppingBag size={18} />
                {product.isAvailable ? 'Thêm vào giỏ' : 'Hết hàng'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWishlist}
                className={`p-4 border-2 rounded-2xl transition-colors ${
                  inWishlist
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-[#EDE0D0] text-[#6B5135] hover:border-[#C4A882] hover:bg-[#F0E8DC]'
                }`}
              >
                <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
              </motion.button>
            </div>

            {/* Trust features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={16} />, text: 'Giao tận nơi' },
                { icon: <Shield size={16} />, text: 'Bảo hiểm 100%' },
                { icon: <RotateCcw size={16} />, text: 'Đổi trả dễ dàng' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-center">
                  <span className="text-[#8B6F47]">{item.icon}</span>
                  <span className="text-xs text-[#6B5135]">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Provider card */}
            <div className="flex items-center gap-4 p-4 bg-white border border-[#EDE0D0] rounded-2xl">
              <ImageWithFallback
                src={product.providerAvatar}
                alt={product.provider}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#3D2B1F] truncate">{product.provider}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating rating={product.providerRating} size="sm" />
                  <span className="text-xs text-[#9B8E84]">{product.providerTotalRentals} lượt thuê</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-[#9B8E84]" />
                  <span className="text-xs text-[#9B8E84]">TP. Hồ Chí Minh</span>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-[#C4A882] text-[#8B6F47] text-xs rounded-xl hover:bg-[#F0E8DC] transition-colors flex-shrink-0">
                Xem shop
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div className="mt-12">
          <div className="flex border-b border-[#EDE0D0]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-[#8B6F47] text-[#8B6F47] font-medium'
                    : 'border-transparent text-[#9B8E84] hover:text-[#6B5135]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-8" ref={tabPanelRef}>
            {/* Tab: Mô tả */}
            {activeTab === TABS[0] && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[#6B5135] leading-relaxed text-sm">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#F0E8DC] text-[#6B5135] text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Danh mục', value: product.category },
                    { label: 'Tình trạng', value: product.condition },
                    { label: 'Kích cỡ có sẵn', value: product.sizes.join(', ') },
                    { label: 'Đặt cọc', value: formatPrice(product.depositAmount) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5 border-b border-[#F0E8DC]">
                      <span className="text-sm text-[#9B8E84]">{label}</span>
                      <span className="text-sm text-[#3D2B1F] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Hướng dẫn size */}
            {activeTab === TABS[1] && (
              <div className="max-w-lg">
                <p className="text-sm text-[#6B5135] mb-4">Bảng hướng dẫn chọn size cho sản phẩm này:</p>
                <div className="overflow-x-auto rounded-xl border border-[#EDE0D0]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F0E8DC]">
                        {['Size', 'Ngực (cm)', 'Eo (cm)', 'Hông (cm)'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6B5135]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['XS', '78–82', '62–66', '84–88'],
                        ['S', '82–86', '66–70', '88–92'],
                        ['M', '86–90', '70–74', '92–96'],
                        ['L', '90–94', '74–78', '96–100'],
                      ].map((row) => (
                        <tr key={row[0]} className="border-t border-[#F0E8DC] hover:bg-[#FAF8F5] transition-colors">
                          {row.map((cell, i) => (
                            <td key={i} className={`px-4 py-3 text-[#3D2B1F] ${i === 0 ? 'font-medium' : ''}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Chính sách thuê */}
            {activeTab === TABS[2] && (
              <div className="space-y-4 max-w-2xl">
                {[
                  { title: 'Thời gian thuê', desc: 'Tối thiểu 1 ngày, tối đa 30 ngày mỗi lần thuê.' },
                  { title: 'Giao nhận hàng', desc: 'Giao hàng trước 1 ngày sự kiện. Trả hàng trong vòng 24h sau ngày kết thúc thuê.' },
                  { title: 'Đặt cọc', desc: `Đặt cọc ${formatPrice(product.depositAmount)} sẽ được hoàn lại đầy đủ sau khi trả trang phục nguyên vẹn.` },
                  { title: 'Chính sách hư hỏng', desc: 'Trang phục được bảo hiểm cho các hư hỏng nhỏ thông thường. Hư hỏng nghiêm trọng sẽ tính thêm phí.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle2 size={16} className="text-[#8B6F47] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#3D2B1F] mb-0.5">{item.title}</p>
                      <p className="text-sm text-[#9B8E84]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Đánh giá */}
            {activeTab === TABS[3] && (
              <div>
                {/* Review summary */}
                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                          {/* sync rating/count with actual reviews when available */}
                          <span className="font-display text-5xl text-[#3D2B1F]">{averageRating.toFixed(1)}</span>
                          <StarRating rating={averageRating} size="md" />
                          <p className="text-xs text-[#9B8E84]">{totalReviews} đánh giá</p>
                        </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = productReviewList.filter((r) => r.rating === star).length;
                      const pct = Math.round((count / Math.max(1, totalReviews)) * 100);
                      return (
                        <div key={star} className="flex items-center gap-3 mb-3">
                          <span className="text-xs w-6">{star}★</span>
                          <div className="flex-1 h-2 bg-[#F0E8DC] rounded-full overflow-hidden">
                            <div className="h-full bg-[#D4A853] rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-[#9B8E84] w-8">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="space-y-5">
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#EDE0D0] flex items-center justify-center text-[#8B6F47] font-medium text-sm flex-shrink-0">
                          {rev.userName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-[#3D2B1F]">{rev.userName}</span>
                            <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Đã xác minh</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={rev.rating} size="sm" />
                            <span className="text-xs text-[#9B8E84]">{rev.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#6B5135] leading-relaxed">{rev.comment}</p>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#FAF8F5]">
                        <button className="text-xs text-[#9B8E84] hover:text-[#6B5135] transition-colors">
                          👍 Hữu ích ({rev.helpful})
                        </button>
                        <button className="text-xs text-[#9B8E84] hover:text-[#6B5135] transition-colors">
                          Báo cáo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-5 w-full py-3 border border-[#C4A882] text-[#8B6F47] rounded-xl text-sm hover:bg-[#F0E8DC] transition-colors">
                  Xem tất cả {totalReviews} đánh giá
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────── */}
        <div className="mt-8 pt-8 border-t border-[#EDE0D0]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-[#3D2B1F]">Có thể bạn thích</h2>
            <Link to="/products" className="text-sm text-[#8B6F47] hover:text-[#6B5135] transition-colors">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-[#EDE0D0] px-4 py-3 flex gap-3 z-40"
      >
        <div className="flex-1">
          <p className="text-xs text-[#9B8E84]">Giá thuê / ngày</p>
          <p className="font-semibold text-[#8B6F47]">{formatPrice(product.pricePerDay)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-6 py-2.5 bg-[#8B6F47] text-white rounded-xl text-sm font-medium hover:bg-[#6B5135] transition-colors"
        >
          Thuê ngay
        </button>
      </motion.div>
    </Shell>
  );
}