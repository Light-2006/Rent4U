import { Link } from 'react-router';
import { Instagram, MessageCircle, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#3D2B1F] text-[#C4A882]">
      {/* Newsletter */}
      <div className="border-b border-[#6B5135]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-white text-xl mb-1">Đừng bỏ lỡ xu hướng mới</h3>
              <p className="text-sm text-[#9B8E84]">Nhận thông báo về bộ sưu tập mới và ưu đãi đặc biệt</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 md:w-64 px-4 py-2.5 bg-[#6B5135]/40 border border-[#6B5135] rounded-xl text-sm text-white placeholder-[#9B8E84] outline-none focus:border-[#C4A882] transition-colors"
              />
              <button className="px-5 py-2.5 bg-[#C4A882] text-[#3D2B1F] text-sm rounded-xl hover:bg-[#D4A853] transition-colors font-medium flex-shrink-0">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#C4A882] rounded-lg flex items-center justify-center">
                <span className="text-[#3D2B1F] text-xs font-bold">R4</span>
              </div>
              <span className="font-display text-white text-lg">rent4u</span>
            </div>
            <p className="text-sm text-[#9B8E84] leading-relaxed mb-5">
              Nền tảng thuê thời trang hàng đầu Việt Nam, kết nối người dùng với các nhà cung cấp uy tín.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-[#6B5135]/50 rounded-xl flex items-center justify-center hover:bg-[#6B5135] transition-colors">
                <Instagram size={16} className="text-[#C4A882]" />
              </a>
              <a href="#" className="w-9 h-9 bg-[#6B5135]/50 rounded-xl flex items-center justify-center hover:bg-[#6B5135] transition-colors">
                <MessageCircle size={16} className="text-[#C4A882]" />
              </a>
              <a href="#" className="w-9 h-9 bg-[#6B5135]/50 rounded-xl flex items-center justify-center hover:bg-[#6B5135] transition-colors">
                <Youtube size={16} className="text-[#C4A882]" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Mua sắm</h4>
            <ul className="space-y-2.5">
              {['Đầm Dạ Hội', 'Váy Liền', 'Áo Khoác', 'Phụ Kiện', 'Áo Dài'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-sm text-[#9B8E84] hover:text-[#C4A882] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              {['Hướng dẫn thuê', 'Chính sách hoàn trả', 'Bảo hiểm trang phục', 'Câu hỏi thường gặp', 'Liên hệ'].map((item) => (
                <li key={item}>
                  <Link to="/contact" className="text-sm text-[#9B8E84] hover:text-[#C4A882] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white text-sm font-medium mb-4">Về chúng tôi</h4>
            <ul className="space-y-2.5">
              {['Câu chuyện thương hiệu', 'Phát triển bền vững', 'Trở thành đối tác', 'Tuyển dụng', 'Blog thời trang'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#9B8E84] hover:text-[#C4A882] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-8 border-y border-[#6B5135]/50 mb-8">
          {[
            { num: '5,000+', label: 'Sản phẩm' },
            { num: '500+', label: 'Nhà cung cấp' },
            { num: '50,000+', label: 'Khách hàng' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-[#C4A882] text-2xl mb-1">{num}</div>
              <div className="text-xs text-[#9B8E84]">{label}</div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9B8E84]">© 2026 rent4u. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookie'].map((item) => (
              <a key={item} href="#" className="text-xs text-[#9B8E84] hover:text-[#C4A882] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
