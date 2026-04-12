import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, CreditCard, Truck, ClipboardList, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Shell } from '../components/layout/Shell';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { formatPrice } from '../data/products';

const STEPS = [
  { label: 'Địa chỉ', icon: Truck },
  { label: 'Thanh toán', icon: CreditCard },
  { label: 'Xác nhận', icon: ClipboardList },
];

const TOAST_STYLE = {
  style: { background: '#FAF8F5', color: '#3D2B1F', border: '1px solid #EDE0D0', borderRadius: '1rem' },
};

export default function CheckoutPage() {
  const { cart, cartTotal, cartDiscountAmount, clearCart, currentUser, createOrder, addAddress } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState('card');
  const [saveAddress, setSaveAddress] = useState(true);
  const defaultAddr = currentUser?.addresses?.find((a) => a.isDefault) ?? currentUser?.addresses?.[0] ?? null;
  const [form, setForm] = useState({
    name: defaultAddr?.fullName ?? currentUser?.username ?? '',
    phone: defaultAddr?.phone ?? '',
    email: currentUser?.email ?? '',
    address: defaultAddr?.line1 ?? '',
    district: defaultAddr?.state ?? '',
    city: defaultAddr?.city ?? 'TP. Hồ Chí Minh',
    note: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const shipping = shippingMethod === 'express' ? 35000 : 0;
  const total = cartTotal + shipping - cartDiscountAmount;

  const handleNext = () => {
    if (step === 0) {
      if (!form.name || !form.phone || !form.address) {
        toast.error('Vui lòng điền đầy đủ thông tin', TOAST_STYLE);
        return;
      }
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleOrder();
  };

  const handleOrder = () => {
    // build address object
    const addr = {
      id: `a-${Date.now()}`,
      fullName: form.name,
      phone: form.phone,
      line1: form.address,
      state: form.district,
      city: form.city,
      isDefault: true,
      label: 'Địa chỉ giao hàng',
    };

    // if user wants to save address, persist to profile
    if (currentUser && saveAddress) {
      addAddress(currentUser.id, addr);
    }

    // create order in context
    createOrder({
      userId: currentUser?.id,
      items: cart,
      address: addr,
      paymentMethod: { id: `pm-${Date.now()}`, type: payMethod, label: payMethod === 'card' ? 'Thẻ' : payMethod },
      total,
      status: 'Đang xử lý',
    });

    clearCart();
    setStep(3); // Success screen
    toast.success('Đặt hàng thành công! 🎉', {
      ...TOAST_STYLE,
      duration: 5000,
    });
  };

  if (step === 3) {
    return (
      <Shell>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="font-display text-3xl text-[#3D2B1F] mb-3">Đặt hàng thành công!</h1>
            <p className="text-[#9B8E84] text-sm leading-relaxed mb-2">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ giao trang phục trước ngày sự kiện.
            </p>
            <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5 mt-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#9B8E84]">Mã đơn hàng</span>
                <span className="font-medium text-[#3D2B1F]">#R4U{Math.floor(Math.random() * 90000 + 10000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9B8E84]">Địa chỉ nhận</span>
                <span className="font-medium text-[#3D2B1F] text-right max-w-[200px]">{form.address || '123 Lê Lợi, Q1, HCM'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9B8E84]">Phương thức</span>
                <span className="font-medium text-[#3D2B1F]">
                  {payMethod === 'card' ? 'Thẻ tín dụng' : payMethod === 'momo' ? 'MoMo' : 'COD'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <Link
                to="/profile"
                className="py-3.5 bg-[#8B6F47] text-white rounded-2xl hover:bg-[#6B5135] transition-colors text-sm font-medium"
              >
                Theo dõi đơn hàng
              </Link>
              <Link
                to="/"
                className="py-3.5 border border-[#C4A882] text-[#8B6F47] rounded-2xl hover:bg-[#F0E8DC] transition-colors text-sm"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </motion.div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#9B8E84] mb-8">
          <Link to="/" className="hover:text-[#8B6F47] transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link to="/cart" className="hover:text-[#8B6F47] transition-colors">Giỏ hàng</Link>
          <ChevronRight size={12} />
          <span className="text-[#3D2B1F]">Thanh toán</span>
        </nav>

        <h1 className="font-display text-3xl text-[#3D2B1F] mb-8">Thanh toán</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5 relative">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                      done
                        ? 'bg-[#8B6F47] border-[#8B6F47]'
                        : active
                        ? 'bg-white border-[#8B6F47]'
                        : 'bg-white border-[#EDE0D0]'
                    }`}
                  >
                    {done ? (
                      <Check size={16} className="text-white" />
                    ) : (
                      <Icon size={16} className={active ? 'text-[#8B6F47]' : 'text-[#C4A882]'} />
                    )}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${active ? 'text-[#8B6F47] font-medium' : 'text-[#9B8E84]'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mb-4 ${i < step ? 'bg-[#8B6F47]' : 'bg-[#EDE0D0]'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 0: Address */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-[#EDE0D0] rounded-2xl p-6 space-y-5"
                >
                  <h2 className="font-display text-xl text-[#3D2B1F]">Thông tin giao hàng</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', full: false },
                      { key: 'phone', label: 'Số điện thoại', placeholder: '0xxx xxx xxx', full: false },
                      { key: 'email', label: 'Email', placeholder: 'email@example.com', full: true },
                      { key: 'address', label: 'Địa chỉ', placeholder: 'Số nhà, tên đường', full: true },
                      { key: 'district', label: 'Quận / Huyện', placeholder: 'Quận 1', full: false },
                      { key: 'city', label: 'Thành phố', placeholder: 'TP. Hồ Chí Minh', full: false },
                    ].map(({ key, label, placeholder, full }) => (
                      <div key={key} className={full ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-medium text-[#6B5135] mb-1.5">{label}</label>
                        <input
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          placeholder={placeholder}
                          className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#6B5135] mb-1.5">Ghi chú (tùy chọn)</label>
                    <textarea
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Hướng dẫn giao hàng, yêu cầu đặc biệt..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input id="saveAddr" type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="w-4 h-4" />
                    <label htmlFor="saveAddr" className="text-sm text-[#6B5135]">Lưu địa chỉ này vào hồ sơ</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3D2B1F] mb-3">Phương thức vận chuyển</label>
                    {[
                      { val: 'standard', label: 'Giao hàng tiêu chuẩn', sub: '2–3 ngày làm việc', price: 'Miễn phí' },
                      { val: 'express', label: 'Giao hàng nhanh', sub: 'Trong ngày', price: '35.000₫' },
                    ].map((opt) => (
                      <label
                        key={opt.val}
                        className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer mb-2 transition-colors ${
                          (shippingMethod === opt.val) ? 'border-[#8B6F47] bg-[#FAF8F5]' : 'border-[#EDE0D0] hover:border-[#C4A882]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={opt.val}
                          checked={shippingMethod === opt.val}
                          onChange={() => setShippingMethod(opt.val as 'standard' | 'express')}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${shippingMethod === opt.val ? 'border-[#8B6F47]' : 'border-[#C4A882]'}`}>
                          {shippingMethod === opt.val && <div className="w-2 h-2 bg-[#8B6F47] rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#3D2B1F]">{opt.label}</p>
                          <p className="text-xs text-[#9B8E84]">{opt.sub}</p>
                        </div>
                        <span className="text-sm text-[#8B6F47] font-medium">{opt.price}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-[#EDE0D0] rounded-2xl p-6 space-y-5"
                >
                  <h2 className="font-display text-xl text-[#3D2B1F]">Phương thức thanh toán</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { val: 'card', label: 'Thẻ tín/ghi nợ', icon: '💳' },
                      { val: 'momo', label: 'Ví MoMo', icon: '📱' },
                      { val: 'cod', label: 'Tiền mặt (COD)', icon: '💵' },
                    ].map((m) => (
                      <button
                        key={m.val}
                        onClick={() => setPayMethod(m.val)}
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all text-sm ${
                          payMethod === m.val
                            ? 'border-[#8B6F47] bg-[#FAF8F5] text-[#8B6F47] font-medium'
                            : 'border-[#EDE0D0] text-[#6B5135] hover:border-[#C4A882]'
                        }`}
                      >
                        <span className="text-2xl">{m.icon}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {payMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#6B5135] mb-1.5">Số thẻ</label>
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl">
                          <input
                            placeholder="1234 5678 9012 3456"
                            className="flex-1 bg-transparent outline-none text-sm text-[#3D2B1F] placeholder-[#C4A882]"
                          />
                          <div className="flex gap-1">
                            {['VISA', 'MC'].map((b) => (
                              <span key={b} className="text-xs text-[#9B8E84] bg-[#F0E8DC] px-1.5 py-0.5 rounded">{b}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Tên chủ thẻ', placeholder: 'NGUYEN VAN A' },
                          { label: 'Ngày hết hạn', placeholder: 'MM/YY' },
                        ].map(({ label, placeholder }) => (
                          <div key={label}>
                            <label className="block text-xs font-medium text-[#6B5135] mb-1.5">{label}</label>
                            <input
                              placeholder={placeholder}
                              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] placeholder-[#C4A882] outline-none focus:border-[#C4A882] transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {payMethod === 'momo' && (
                    <div className="text-center py-8 bg-[#FAF8F5] rounded-2xl border border-[#EDE0D0]">
                      <div className="text-4xl mb-3">📱</div>
                      <p className="text-sm text-[#6B5135] mb-2">Quét mã QR bằng ứng dụng MoMo</p>
                      <div className="w-32 h-32 bg-[#EDE0D0] rounded-xl mx-auto flex items-center justify-center">
                        <span className="text-xs text-[#9B8E84]">QR Code</span>
                      </div>
                    </div>
                  )}

                  {payMethod === 'cod' && (
                    <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EDE0D0]">
                      <p className="text-sm text-[#6B5135]">
                        Thanh toán tiền mặt khi nhận hàng. Vui lòng chuẩn bị đúng số tiền <strong>{formatPrice(total)}</strong>.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
                    <h3 className="font-display text-lg text-[#3D2B1F] mb-4">Sản phẩm đặt thuê</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-3">
                          <ImageWithFallback
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#3D2B1F] truncate">{item.product.name}</p>
                            <p className="text-xs text-[#9B8E84]">Size {item.selectedSize} · {item.quantity} cái</p>
                          </div>
                          <p className="text-sm font-medium text-[#8B6F47] flex-shrink-0">
                            {formatPrice(item.product.pricePerDay * Math.max(1, item.quantity))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: 'Địa chỉ giao hàng', content: [form.name, form.phone, form.address, form.city].filter(Boolean).join(', ') || 'Chưa điền địa chỉ' },
                      { title: 'Thanh toán', content: payMethod === 'card' ? 'Thẻ tín dụng' : payMethod === 'momo' ? 'Ví MoMo' : 'Tiền mặt (COD)' },
                    ].map(({ title, content }) => (
                      <div key={title} className="bg-white border border-[#EDE0D0] rounded-2xl p-4">
                        <p className="text-xs text-[#9B8E84] mb-2">{title}</p>
                        <p className="text-sm text-[#3D2B1F] font-medium">{content}</p>
                        <button className="text-xs text-[#8B6F47] mt-2 hover:underline">Chỉnh sửa</button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex gap-3 mt-5">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-[#EDE0D0] text-[#6B5135] rounded-xl text-sm hover:border-[#C4A882] hover:bg-[#FAF8F5] transition-colors"
                >
                  ← Quay lại
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 py-3.5 bg-[#8B6F47] text-white rounded-xl font-medium hover:bg-[#6B5135] transition-colors"
              >
                {step === STEPS.length - 1 ? 'Đặt hàng ngay' : 'Tiếp theo →'}
              </motion.button>
            </div>
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5 sticky top-24">
              <h2 className="font-display text-lg text-[#3D2B1F] mb-4">Đơn hàng</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-2.5">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#3D2B1F] line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-[#9B8E84]">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium text-[#8B6F47] flex-shrink-0">
                      {formatPrice(item.product.pricePerDay * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#F0E8DC] pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B8E84]">Thuê</span>
                  <span className="text-[#3D2B1F]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9B8E84]">Phí ship</span>
                  <span className="text-[#3D2B1F]">{formatPrice(shipping)}</span>
                </div>
                {cartDiscountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Giảm giá (RENT10)</span>
                    <span className="text-green-600">−{formatPrice(cartDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-2 border-t border-[#F0E8DC]">
                  <span className="text-[#3D2B1F]">Tổng</span>
                  <span className="text-[#8B6F47] font-display">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
