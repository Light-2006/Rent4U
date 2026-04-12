import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Shell } from '../components/layout/Shell';

export default function NotFoundPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-22rem)] px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Big 404 */}
          <div className="font-display text-[10rem] sm:text-[14rem] text-[#EDE0D0] leading-none select-none">
            404
          </div>
          {/* Floating hanger icon */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 bg-white border-2 border-[#EDE0D0] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">👗</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl text-[#3D2B1F] mb-3">
            Ồ, trang này không tồn tại
          </h1>
          <p className="text-[#9B8E84] text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            Có vẻ như trang bạn đang tìm kiếm đã bị di chuyển hoặc không tồn tại. Hãy quay về trang chủ để khám phá bộ sưu tập thời trang mới nhất.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              to="/"
              className="px-8 py-3.5 bg-[#8B6F47] text-white rounded-2xl hover:bg-[#6B5135] transition-colors font-medium"
            >
              ← Về trang chủ
            </Link>
            <Link
              to="/products"
              className="px-8 py-3.5 border border-[#C4A882] text-[#8B6F47] rounded-2xl hover:bg-[#F0E8DC] transition-colors"
            >
              Xem sản phẩm
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 border border-[#EDE0D0] text-[#9B8E84] rounded-2xl hover:border-[#C4A882] hover:text-[#6B5135] transition-colors"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs text-[#9B8E84]">Có thể bạn muốn:</span>
            {['Đầm Dạ Hội', 'Áo Khoác', 'Phụ Kiện', 'Xu hướng'].map((label) => (
              <Link
                key={label}
                to="/products"
                className="text-xs text-[#8B6F47] hover:text-[#6B5135] underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </Shell>
  );
}
