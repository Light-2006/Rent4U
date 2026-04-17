import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, Mail, Phone, MapPin, MessageCircle, Clock, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Shell } from '../components/layout/Shell';

const FAQ_ITEMS = [
  {
    q: 'Tôi cần đặt cọc bao nhiêu khi thuê?',
    a: 'Số tiền đặt cọc thường từ 2–5x giá trị thuê, tùy theo từng sản phẩm. Tiền cọc sẽ được hoàn lại đầy đủ sau khi bạn trả đồ nguyên vẹn.',
  },
  {
    q: 'Nếu trang phục không vừa thì sao?',
    a: 'Chúng tôi hỗ trợ đổi size miễn phí trong vòng 24h sau khi nhận hàng. Vui lòng liên hệ hotline để được hỗ trợ nhanh nhất.',
  },
  {
    q: 'Thời gian giao hàng là bao lâu?',
    a: 'Giao hàng tiêu chuẩn 2–3 ngày, giao nhanh trong ngày. Chúng tôi đảm bảo trang phục đến tay bạn trước ngày sự kiện.',
  },
  {
    q: 'Tôi có thể thuê trang phục cho nhiều ngày không?',
    a: 'Bạn có thể thuê tối thiểu 1 ngày và tối đa 30 ngày. Thuê dài ngày thường có giá ưu đãi hơn.',
  },
  {
    q: 'Trang phục được vệ sinh như thế nào?',
    a: 'Mọi trang phục đều được giặt khô chuyên nghiệp, khử trùng và kiểm tra kỹ lưỡng trước mỗi lần cho thuê.',
  },
];

const TS = {
  style: {
    background: 'var(--card)',
    color: 'var(--card-foreground)',
    border: '1px solid var(--border)',
    borderRadius: '1rem',
  },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Vui lòng điền đầy đủ thông tin', TS);
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setForm({ name: '', email: '', subject: '', message: '' });
    toast.success('Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi trong 24h 😊', { ...TS, duration: 5000 });
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <span className="text-card-foreground">Liên hệ</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs text-primary uppercase tracking-widest font-medium">Hỗ trợ</span>
          <h1 className="font-display text-4xl text-card-foreground mt-2 mb-3">Chúng tôi luôn sẵn sàng lắng nghe</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Có câu hỏi về trang phục hay đơn thuê? Đội ngũ <span translate="no" className="notranslate">rent4u</span> sẵn sàng hỗ trợ bạn 24/7.
          </p>
        </div>

        {/* Contact methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Phone,
              title: 'Hotline',
              val: '1800 1234',
              sub: 'Miễn phí · 8:00–22:00',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              icon: Mail,
              title: 'Email',
              val: 'hello@rent4u.vn',
              sub: 'Phản hồi trong 24h',
              color: 'bg-accent text-primary',
            },
            {
              icon: MessageCircle,
              title: 'Live Chat',
              val: 'Chat ngay',
              sub: 'Phản hồi dưới 5 phút',
              color: 'bg-green-50 text-green-600',
            },
          ].map(({ icon: Icon, title, val, sub, color }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:shadow-md transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{title}</p>
                <p className="font-medium text-card-foreground mt-0.5">{val}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-2xl text-card-foreground mb-6">Gửi tin nhắn</h2>

              {/* Subject chips */}
              <div className="mb-5">
                <p className="text-xs font-medium text-muted-foreground mb-2">Chủ đề</p>
                <div className="flex flex-wrap gap-2">
                  {['Vấn đề đơn hàng', 'Tư vấn sản phẩm', 'Hợp tác', 'Báo lỗi', 'Khác'].map((s, i) => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, subject: s })}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        form.subject === s || (i === 0 && !form.subject)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent border border-border text-muted-foreground hover:border-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A' },
                    { key: 'email', label: 'Email', placeholder: 'email@example.com' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-accent border border-border rounded-xl text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Tin nhắn</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                    rows={5}
                    className="w-full px-4 py-3 bg-accent border border-border rounded-xl text-sm text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{form.message.length}/500 ký tự</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-95 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : 'Gửi tin nhắn'}
                </motion.button>
              </form>
            </div>
          </div>

          {/* FAQ + Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* FAQ */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-display text-xl text-card-foreground mb-4">Câu hỏi thường gặp</h2>
              <div className="space-y-2">
                {FAQ_ITEMS.map((item, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent transition-colors"
                    >
                      <span className="text-sm font-medium text-card-foreground pr-2">{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-primary transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openFaq === i && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed bg-accent"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Office info */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="font-display text-lg text-card-foreground">Văn phòng</h3>
              {[
                { icon: MapPin, text: '120 Yên Lãng' },
                { icon: Clock, text: 'Thứ 2–6: 8:00–18:00 | Thứ 7: 9:00–12:00' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{text}</span>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="mt-3 h-36 bg-accent rounded-xl flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Bản đồ Google Maps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
