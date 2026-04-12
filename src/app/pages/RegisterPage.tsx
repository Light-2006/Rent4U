import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { BOUTIQUE_IMAGE } from '../data/products';

const TS = {
  style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { createUser } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [accountType, setAccountType] = useState<'renter' | 'provider'>('renter');
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : form.password.match(/[A-Z]/) && form.password.match(/[0-9]/) ? 4
    : 3;

  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-[#8B6F47]', 'bg-green-500'];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Vui lòng điền đầy đủ thông tin', TS);
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Mật khẩu xác nhận không khớp', TS);
      return;
    }
    if (!agreed) {
      toast.error('Vui lòng đồng ý điều khoản sử dụng', TS);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    // create user and auto-login (createUser sets currentUser and auth)
    const username = form.name.trim() ? form.name.trim().replace(/\s+/g, '').toLowerCase() : form.email.split('@')[0];
    const role = accountType === 'provider' ? 'shopowner' : 'user';
    const newUser = createUser({ username, email: form.email, password: form.password, role });
    setLoading(false);
    toast.success('Đăng ký thành công! Bạn đã tự động đăng nhập.', { ...TS, duration: 3500 });
    if (newUser.role === 'admin') {
      navigate('/admin');
      return;
    }
    if (newUser.role === 'shopowner') {
      navigate('/shopowner');
      return;
    }
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      {/* Left: Image */}
      <div className="hidden lg:block lg:w-2/5 relative flex-shrink-0">
        <ImageWithFallback
          src={BOUTIQUE_IMAGE}
          alt="Fashion boutique"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2B1F]/60 to-[#3D2B1F]/20" />
        <div className="absolute bottom-10 left-8 right-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-[#C4A882] rounded-lg flex items-center justify-center">
              <span className="text-[#3D2B1F] text-xs font-bold">R4</span>
            </div>
            <span className="font-display text-white text-lg">rent4u</span>
          </div>
          <h2 className="font-display text-2xl text-white mb-2">
            Tham gia cộng đồng<br />
            <span className="font-display-italic text-[#C4A882]">thời trang bền vững</span>
          </h2>
          <div className="mt-4 space-y-2">
            {[
              'Truy cập 5,000+ trang phục cao cấp',
              'Giao hàng tận nơi trên toàn quốc',
              'Tiết kiệm tới 90% so với mua mới',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#C4A882] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-[#3D2B1F]" />
                </div>
                <span className="text-sm text-[#F0E8DC]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 bg-[#3D2B1F] rounded-lg flex items-center justify-center">
              <span className="text-[#F0E8DC] text-xs font-bold">R4</span>
            </div>
            <span className="font-display text-[#3D2B1F] text-lg">rent4u</span>
          </div>

          <h1 className="font-display text-3xl text-[#3D2B1F] mb-1">Tạo tài khoản</h1>
          <p className="text-[#9B8E84] text-sm mb-6">Đăng ký miễn phí và nhận ưu đãi 20% đơn đầu</p>

          {/* Account type */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { val: 'renter' as const, icon: '🛍️', title: 'Tôi muốn thuê', desc: 'Tìm & thuê trang phục' },
              { val: 'provider' as const, icon: '👗', title: 'Tôi muốn cho thuê', desc: 'Kiếm tiền từ tủ đồ' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setAccountType(opt.val)}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all text-center ${
                  accountType === opt.val
                    ? 'border-[#8B6F47] bg-[#FAF8F5]'
                    : 'border-[#EDE0D0] hover:border-[#C4A882]'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <p className={`text-sm font-medium ${accountType === opt.val ? 'text-[#8B6F47]' : 'text-[#3D2B1F]'}`}>
                    {opt.title}
                  </p>
                  <p className="text-xs text-[#9B8E84]">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { key: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
              { key: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '0xxx xxx xxx' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#3D2B1F] mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-[#3D2B1F] mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8E84]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-colors ${
                          i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-[#EDE0D0]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#9B8E84]">{strengthLabels[passwordStrength]}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3D2B1F] mb-1.5">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-4 py-3 bg-[#FAF8F5] border rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none transition-colors ${
                  form.confirm && form.confirm !== form.password
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-[#EDE0D0] focus:border-[#C4A882]'
                }`}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer" onClick={() => setAgreed(!agreed)}>
              <div
                className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  agreed ? 'bg-[#8B6F47] border-[#8B6F47]' : 'border-[#C4A882]'
                }`}
              >
                {agreed && <Check size={10} className="text-white" />}
              </div>
              <span className="text-sm text-[#6B5135] leading-relaxed">
                Tôi đồng ý với{' '}
                <a href="#" className="text-[#8B6F47] underline">Điều khoản sử dụng</a> và{' '}
                <a href="#" className="text-[#8B6F47] underline">Chính sách bảo mật</a> của rent4u
              </span>
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
                  Đang tạo tài khoản...
                </>
              ) : (
                'Đăng ký ngay'
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[#9B8E84] mt-5">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-[#8B6F47] font-medium hover:text-[#6B5135] transition-colors">
              Đăng nhập
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
