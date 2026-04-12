import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { HERO_IMAGE_2 } from '../data/products';

const TS = {
  style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!email && !username) || !password) {
      toast.error('Vui lòng điền email hoặc tên đăng nhập và mật khẩu', TS);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    // attempt authentication
    try {
      const user = login({ username: username || undefined, email: email || undefined, password });
      if (user?.role === 'admin') {
        toast.success('Đăng nhập admin thành công!', { icon: '👋', ...TS });
        navigate('/admin');
        return;
      }
      if (user?.role === 'shopowner') {
        toast.success('Đăng nhập thành công!', { icon: '👋', ...TS });
        navigate('/shopowner');
        return;
      }
      toast.success('Đăng nhập thành công!', { icon: '👋', ...TS });
      const from = (location.state as any)?.from;
      navigate(from ?? '/');
    } catch (err) {
      toast.error('Đăng nhập thất bại', TS);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      {/* Left: Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <ImageWithFallback
          src={HERO_IMAGE_2}
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2B1F]/70 to-[#3D2B1F]/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#C4A882] rounded-lg flex items-center justify-center">
              <span className="text-[#3D2B1F] text-xs font-bold">R4</span>
            </div>
            <span className="font-display text-white text-xl">rent4u</span>
          </div>
          <h2 className="font-display text-3xl text-white mb-3">
            Mở rộng tủ đồ của bạn<br />
            <span className="font-display-italic text-[#C4A882]">không giới hạn</span>
          </h2>
          <p className="text-[#C4A882] text-sm leading-relaxed max-w-sm">
            Thuê hàng nghìn thiết kế thời trang cao cấp với giá phải chăng. Giao tận nơi, mặc đẹp, sống xanh.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#3D2B1F] rounded-lg flex items-center justify-center">
              <span className="text-[#F0E8DC] text-xs font-bold">R4</span>
            </div>
            <span className="font-display text-[#3D2B1F] text-xl">rent4u</span>
          </div>

          <h1 className="font-display text-3xl text-[#3D2B1F] mb-2">Chào mừng trở lại</h1>
          <p className="text-[#9B8E84] text-sm mb-8">Đăng nhập để khám phá bộ sưu tập mới nhất</p>

          {/* Social login */}
          <div className="flex flex-col gap-3 mb-6">
            {[
              { icon: 'G', label: 'Đăng nhập với Google', color: '#EA4335' },
              { icon: 'f', label: 'Đăng nhập với Facebook', color: '#1877F2' },
            ].map((s) => (
              <button
                key={s.label}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] hover:border-[#C4A882] hover:bg-[#FAF8F5] transition-colors"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: s.color }}
                >
                  {s.icon}
                </span>
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#EDE0D0]" />
            <span className="text-xs text-[#9B8E84]">hoặc đăng nhập bằng email hoặc tên đăng nhập</span>
            <div className="flex-1 h-px bg-[#EDE0D0]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3D2B1F] mb-1.5">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="vd: minhchau"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors"
              />
              <p className="text-xs text-[#9B8E84] mt-2">Hoặc điền email bên dưới</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3D2B1F] mb-1.5">Email (nếu không dùng tên đăng nhập)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[#3D2B1F]">Mật khẩu</label>
                <a href="#" className="text-xs text-[#8B6F47] hover:text-[#6B5135] transition-colors">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8E84] hover:text-[#6B5135] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-4 h-4 border-2 border-[#C4A882] rounded flex items-center justify-center flex-shrink-0">
              </div>
              <span className="text-sm text-[#6B5135]">Ghi nhớ đăng nhập</span>
            </label>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#8B6F47] text-white rounded-xl font-medium hover:bg-[#6B5135] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[#9B8E84] mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-[#8B6F47] font-medium hover:text-[#6B5135] transition-colors">
              Đăng ký ngay
            </Link>
          </p>

          <p className="text-center text-xs text-[#C4A882] mt-4">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="underline hover:text-[#9B8E84]">Điều khoản</a> và{' '}
            <a href="#" className="underline hover:text-[#9B8E84]">Chính sách bảo mật</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
