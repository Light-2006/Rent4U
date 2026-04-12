import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, ArrowRight, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Shell } from '../components/layout/Shell';
import { ProductCard } from '../components/ui/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';
import { useState } from 'react';

const TOASTER_STYLE = {
  style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
};

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartItem,
    cartTotal,
    products,
    appliedPromoCode,
    setAppliedPromoCode,
    cartDiscountAmount,
  } = useApp();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const promoApplied = appliedPromoCode === 'RENT10';
  const suggested = products.filter((p) => !cart.some((c) => c.product.id === p.id)).slice(0, 4);

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast(`Đã xóa "${name}" khỏi giỏ hàng`, { icon: '🗑️', ...TOASTER_STYLE });
  };

  const formatDate = (d: Date | null) =>
    d ? `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}` : '—';

  const getRentalDays = (start: Date | null, end: Date | null) =>
    start && end ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) : 1;

  const itemTotal = (item: typeof cart[0]) => {
    const days = getRentalDays(item.startDate, item.endDate);
    return item.product.pricePerDay * days * item.quantity;
  };

  const shipping = 35000;
  const finalTotal = cartTotal + shipping - cartDiscountAmount;

  const handlePromo = () => {
    if (promoCode.toUpperCase() === 'RENT10') {
      setAppliedPromoCode('RENT10');
      toast.success('Mã giảm giá đã được áp dụng! -10%', { icon: '🎉', ...TOASTER_STYLE });
    } else {
      toast.error('Mã giảm giá không hợp lệ', TOASTER_STYLE);
    }
  };

  if (cart.length === 0) {
    return (
      <Shell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-md mx-auto py-16 gap-5"
          >
            <div className="w-24 h-24 bg-[#F0E8DC] rounded-full flex items-center justify-center text-4xl">
              🛍️
            </div>
            <h1 className="font-display text-3xl text-[#3D2B1F]">Giỏ hàng trống</h1>
            <p className="text-[#9B8E84] text-sm leading-relaxed">
              Bạn chưa thêm sản phẩm nào. Hãy khám phá bộ sưu tập và tìm trang phục ưng ý!
            </p>
            <Link
              to="/products"
              className="flex items-center gap-2 px-8 py-3.5 bg-[#8B6F47] text-white rounded-2xl hover:bg-[#6B5135] transition-colors"
            >
              <ShoppingBag size={18} />
              Khám phá ngay
            </Link>
          </motion.div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#9B8E84] mb-6">
          <Link to="/" className="hover:text-[#8B6F47] transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <span className="text-[#3D2B1F]">Giỏ hàng</span>
        </nav>

        <h1 className="font-display text-3xl text-[#3D2B1F] mb-8">
          Giỏ hàng ({cart.length} sản phẩm)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map((item) => {
                const days = getRentalDays(item.startDate, item.endDate);
                const total = itemTotal(item);
                return (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-[#EDE0D0] rounded-2xl overflow-hidden"
                  >
                    <div className="flex gap-0">
                      {/* Image */}
                      <Link to={`/product/${item.product.id}`} className="w-32 sm:w-40 flex-shrink-0">
                        <ImageWithFallback
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          style={{ minHeight: '160px' }}
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-xs text-[#9B8E84]">{item.product.provider}</p>
                              <Link to={`/product/${item.product.id}`}>
                                <h3 className="font-display text-[#3D2B1F] text-base leading-snug hover:text-[#8B6F47] transition-colors">
                                  {item.product.name}
                                </h3>
                              </Link>
                            </div>
                            <button
                              onClick={() => handleRemove(item.product.id, item.product.name)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-[#9B8E84] hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {item.selectedSize && (
                              <span className="px-2.5 py-1 bg-[#F0E8DC] text-[#6B5135] text-xs rounded-full">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="px-2.5 py-1 bg-[#F0E8DC] text-[#6B5135] text-xs rounded-full">
                                {item.selectedColor}
                              </span>
                            )}
                          </div>

                          {/* Rental dates */}
                          <div className="flex items-center gap-2 p-2.5 bg-[#FAF8F5] rounded-xl border border-[#F0E8DC] mb-3">
                            <svg className="w-3.5 h-3.5 text-[#8B6F47] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                            </svg>
                            <span className="text-xs text-[#6B5135]">
                              {formatDate(item.startDate)} → {formatDate(item.endDate)}
                              {days > 1 && <span className="text-[#8B6F47] ml-1.5">({days} ngày)</span>}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center border border-[#EDE0D0] rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateCartItem(item.product.id, { quantity: Math.max(1, item.quantity - 1) })}
                              className="px-2.5 py-1.5 text-[#6B5135] hover:bg-[#F0E8DC] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 py-1.5 text-[#3D2B1F] text-sm border-x border-[#EDE0D0]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItem(item.product.id, { quantity: item.quantity + 1 })}
                              className="px-2.5 py-1.5 text-[#6B5135] hover:bg-[#F0E8DC] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          {/* Price */}
                          <div className="text-right">
                            <p className="font-semibold text-[#8B6F47]">{formatPrice(total)}</p>
                            <p className="text-xs text-[#9B8E84]">{formatPrice(item.product.pricePerDay)}/ngày</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Link
              to="/products"
              className="flex items-center gap-2 text-sm text-[#8B6F47] hover:text-[#6B5135] transition-colors py-2"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Promo Code */}
            <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
              <p className="text-sm font-medium text-[#3D2B1F] mb-3 flex items-center gap-2">
                <Tag size={14} className="text-[#8B6F47]" />
                Mã giảm giá
              </p>
              <div className="flex gap-2">
                <input
                  value={promoApplied ? 'RENT10' : promoCode}
                  onChange={(e) => !promoApplied && setPromoCode(e.target.value)}
                  placeholder="Nhập mã (VD: RENT10)"
                  disabled={promoApplied}
                  className="flex-1 px-3 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handlePromo}
                  disabled={promoApplied || !promoCode}
                  className="px-4 py-2.5 bg-[#8B6F47] text-white rounded-xl text-sm hover:bg-[#6B5135] transition-colors disabled:opacity-50"
                >
                  Áp dụng
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs text-green-600 mt-2">✓ Mã RENT10 đã được áp dụng — giảm 10%</p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5 sticky top-24">
              <h2 className="font-display text-xl text-[#3D2B1F] mb-5">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B8E84]">Tiền thuê</span>
                  <span className="text-[#3D2B1F]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B8E84]">Phí giao hàng</span>
                  <span className="text-[#3D2B1F]">{formatPrice(shipping)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Giảm giá (10%)</span>
                    <span className="text-green-600">−{formatPrice(cartDiscountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#EDE0D0] pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="font-medium text-[#3D2B1F]">Tổng thanh toán</span>
                  <span className="font-display text-xl text-[#8B6F47]">{formatPrice(finalTotal)}</span>
                </div>
                <p className="text-xs text-[#9B8E84] mt-1">
                  Chưa bao gồm đặt cọc trang phục
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#8B6F47] text-white rounded-2xl hover:bg-[#6B5135] transition-colors font-medium"
              >
                Tiến hành thanh toán
                <ArrowRight size={16} />
              </motion.button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 mt-4">
                {['SSL An toàn', 'Hoàn tiền', 'Hỗ trợ 24/7'].map((badge) => (
                  <div key={badge} className="text-center">
                    <div className="text-xs text-[#9B8E84]">{badge}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {suggested.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#EDE0D0]">
            <h2 className="font-display text-2xl text-[#3D2B1F] mb-6">Bạn có thể thích</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {suggested.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
