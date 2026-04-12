import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Heart, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { type Product, formatPrice } from '../../data/products';
import { StarRating } from './StarRating';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const TOAST_STYLE = {
    style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
  };
  const [hovered, setHovered] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng yêu thích', TOAST_STYLE);
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    toggleWishlist(product.id);
    toast(inWishlist ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào danh sách yêu thích', {
      icon: inWishlist ? '💔' : '❤️',
      ...TOAST_STYLE,
    });
  };

  if (view === 'list') {
    return (
      <motion.div
        layout
        whileHover={{ y: -2 }}
        className="group bg-white rounded-2xl overflow-hidden border border-[#EDE0D0] hover:border-[#C4A882] hover:shadow-lg transition-all duration-300"
      >
        <Link to={`/product/${product.id}`} className="flex gap-0">
          <div className="relative w-36 sm:w-44 flex-shrink-0 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ minHeight: '160px' }}
              />
            </motion.div>
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xs bg-black/60 px-3 py-1 rounded-full">Đã thuê</span>
              </div>
            )}
          </div>
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {product.isNew && (
                    <span className="px-2 py-0.5 bg-[#8B6F47] text-white text-xs rounded-full">Mới</span>
                  )}
                  {product.isTrending && (
                    <span className="px-2 py-0.5 bg-[#3D2B1F] text-white text-xs rounded-full">Hot 🔥</span>
                  )}
                </div>
                <button onClick={handleWishlist} className="flex-shrink-0 p-1">
                  <Heart
                    size={16}
                    className={inWishlist ? 'fill-red-500 text-red-500' : 'text-[#C4A882] hover:text-red-400 transition-colors'}
                  />
                </button>
              </div>
              <p className="text-xs text-[#9B8E84] mb-1">{product.provider}</p>
              <h3 className="font-display text-[#3D2B1F] mb-2 text-base line-clamp-2">{product.name}</h3>
              <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
              <p className="text-sm text-[#9B8E84] mt-2 line-clamp-2 hidden sm:block">{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="font-semibold text-[#8B6F47] text-base">{formatPrice(product.pricePerDay)}</span>
                <span className="text-xs text-[#9B8E84] ml-1">/ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    product.isAvailable ? 'bg-green-50 text-green-700' : 'bg-[#EDE0D0] text-[#9B8E84]'
                  }`}
                >
                  {product.isAvailable ? '● Còn trống' : '○ Đã thuê'}
                </span>
                <span className="hidden sm:flex px-3 py-1.5 bg-[#8B6F47] text-white text-xs rounded-xl group-hover:bg-[#6B5135] transition-colors">
                  Thuê ngay
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EDE0D0] hover:border-[#C4A882] hover:shadow-xl transition-all duration-300"
      style={{ boxShadow: hovered ? '0 20px 40px rgba(61,43,31,0.10)' : undefined }}
    >
      <Link to={`/product/${product.id}`}>
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <motion.div
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Overlay on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/60 via-transparent to-transparent pointer-events-none"
          />

          {/* Quick view */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"
          >
            <span className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm text-[#3D2B1F] shadow-lg">
              <Eye size={14} />
              Xem nhanh
            </span>
          </motion.div>

          {/* Availability badge */}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <span className="text-white text-xs bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
                Đã được thuê
              </span>
            </div>
          )}

          {/* Status badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-2.5 py-1 bg-[#8B6F47] text-white text-xs rounded-full shadow-sm">Mới</span>
            )}
            {product.isTrending && (
              <span className="px-2.5 py-1 bg-[#3D2B1F] text-white text-xs rounded-full shadow-sm">Hot 🔥</span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            animate={{ scale: hovered ? 1 : 0.9, opacity: hovered ? 1 : 0.7 }}
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
          >
            <Heart
              size={14}
              className={inWishlist ? 'fill-red-500 text-red-500' : 'text-[#6B5135] hover:text-red-400 transition-colors'}
            />
          </motion.button>
        </div>

        {/* Content */}
          <div className="p-4">
          <p className="text-xs text-[#9B8E84] mb-1 truncate">{product.provider}</p>
          <h3 className="font-display text-[#3D2B1F] mb-2 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
          <StarRating rating={product.rating} count={product.reviewCount} size="sm" />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0E8DC]">
            <div>
              <span className="font-semibold text-[#8B6F47] text-sm">{formatPrice(product.pricePerDay)}</span>
              <span className="text-xs text-[#9B8E84]">/ngày</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                product.isAvailable ? 'bg-green-50 text-green-700' : 'bg-[#EDE0D0] text-[#9B8E84]'
              }`}
            >
              {product.isAvailable ? '● Còn trống' : '○ Đã thuê'}
            </span>
          </div>

          {/* CTA */}
          <motion.button
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAuthenticated) {
                toast.error('Vui lòng đăng nhập để thuê sản phẩm', TOAST_STYLE);
                navigate('/login', { state: { from: location.pathname + location.search } });
                return;
              }
              if (!product.isAvailable) {
                toast.error('Sản phẩm hiện không có sẵn');
                return;
              }
              const today = new Date();
              const tomorrow = new Date();
              tomorrow.setDate(today.getDate() + 1);
              const defaultSize = product.sizes?.[0] ?? '';
              const defaultColor = product.colors?.[0]?.name ?? '';
              if (!defaultSize) {
                toast.error('Vui lòng chọn kích cỡ trên trang sản phẩm');
                return;
              }
              addToCart({ product, startDate: today, endDate: tomorrow, quantity: 1, selectedSize: defaultSize, selectedColor: defaultColor });
              toast.success('Đã thêm vào giỏ hàng', {
                icon: '🛒',
                style: {
                  background: '#FAF8F5',
                  color: '#3D2B1F',
                  border: '1px solid #EDE0D0',
                  borderRadius: '1rem',
                },
              });
            }}
            disabled={!product.isAvailable || !(product.sizes && product.sizes.length > 0)}
            className="w-full mt-3 py-2.5 bg-[#3D2B1F] text-white text-xs rounded-xl hover:bg-[#6B5135] transition-colors"
          >
            Thuê Ngay
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}
