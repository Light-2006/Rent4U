import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { BOUTIQUE_IMAGE } from '../data/products';

const TS = {
  style: {
    background: 'var(--card)',
    color: 'var(--card-foreground)',
    border: '1px solid var(--border)',
    borderRadius: '1rem',
  },
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
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-primary', 'bg-green-500'];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Vui lòng điền đầy đủ thông tin', TS);
      return;
    }
    if (form.confirm !== form.password) {
      toast.error('Mật khẩu xác nhận không khớp', TS);
      return;
    }
    if (form.password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự', TS);
      return;
    }
    if (!agreed) {
      toast.error('Vui lòng đồng ý với điều khoản', TS);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    try {
      const username = form.email.split('@')[0] || form.name.replace(/\s+/g, '').toLowerCase();
      const role = accountType === 'provider' ? 'shopowner' : 'user';
      const user = await createUser({ username, email: form.email, password: form.password, role });
      toast.success('Tạo tài khoản thành công!', { icon: '🎉', ...TS });
      if (user?.role === 'admin') { navigate('/admin'); return; }
      if (user?.role === 'shopowner') { navigate('/shopowner'); return; }
      navigate('/');
    } catch (err: any) {
      const msg = err?.message || 'Đăng ký thất bại';
      toast.error(msg, TS);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <ImageWithFallback
          src={BOUTIQUE_IMAGE}
          alt="Boutique"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-card-foreground text-xs font-bold">R4</span>
            </div>
            <span translate="no" className="font-display text-white text-xl notranslate">rent4u</span>
          </div>
          <h2 className="font-display text-3xl text-white mb-3">
            Tham gia cộng đồng<br />
            <span className="font-display-italic text-primary">thời trang bền vững</span>
          </h2>
          <p className="text-primary text-sm leading-relaxed max-w-sm">
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
            <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-card-foreground rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground text-xs font-bold">R4</span>
            </div>
            <span translate="no" className="font-display text-card-foreground text-xl notranslate">rent4u</span>
          </div>

          <h1 className="font-display text-3xl text-card-foreground mb-2">Tạo tài khoản</h1>
          <p className="text-muted-foreground text-sm mb-6">Đăng ký miễn phí và nhận ưu đãi 20% đơn đầu</p>

          {/* Account type */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { val: 'renter' as const, icon: '🛍️', title: 'Tôi muốn thuê', desc: 'Tìm & thuê trang phục' },
              { val: 'provider' as const, icon: '👗', title: 'Tôi muốn cho thuê', desc: 'Kiếm tiền từ tủ đồ' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setAccountType(opt.val)}
                type="button"
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all text-center ${
                  accountType === opt.val
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-primary'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <p className={`text-sm font-medium ${accountType === opt.val ? 'text-primary' : 'text-card-foreground'}`}>
                    {opt.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
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
                <label className="block text-sm font-medium text-card-foreground mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-accent border border-border rounded-xl text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Tối thiểu 8 ký tự"
                  className="w-full px-4 py-3 bg-accent border border-border rounded-xl text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                          i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{strengthLabels[passwordStrength]}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-4 py-3 bg-accent border rounded-xl text-sm text-card-foreground placeholder:text-muted-foreground outline-none transition-colors ${
                  form.confirm && form.confirm !== form.password
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-border focus:border-primary'
                }`}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
              )}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer mt-3">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  agreed ? 'bg-primary border-primary' : 'border-border'
                }`}
              >
                {agreed && <Check size={10} className="text-white" />}
              </div>
                <span className="text-sm text-muted-foreground leading-relaxed ml-2">
                Tôi đồng ý với{' '}
                <a href="#" className="text-primary underline">Điều khoản sử dụng</a> và{' '}
                <a href="#" className="text-primary underline">Chính sách bảo mật</a> của <span translate="no" className="notranslate">rent4u</span>
              </span>
            </label>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-95 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
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

          <p className="text-center text-sm text-muted-foreground mt-5">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary font-medium hover:text-primary/90 transition-colors">
              Đăng nhập
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
