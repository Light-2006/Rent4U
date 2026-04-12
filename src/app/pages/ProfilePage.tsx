import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import {
  ShoppingBag, Heart, Star, MapPin, CreditCard, Bell,
  Settings, LogOut, ChevronRight, Package, Clock, CheckCircle, Truck, Tag, X,
} from 'lucide-react';
import { Shell } from '../components/layout/Shell';
import { ProductCard } from '../components/ui/ProductCard';
import { StarRating } from '../components/ui/StarRating';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp, Address, PaymentMethod } from '../contexts/AppContext';
import { toast } from 'sonner';
import { formatPrice } from '../data/products';

// Small forms for adding address/payment
function AddAddressForm({ onSave }: { onSave: (data: Partial<Address>) => void }) {
  const [data, setData] = useState<Partial<Address>>({ label: 'Nhà', city: 'TP. Hồ Chí Minh' });
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h4 className="text-sm font-medium mb-3">Thêm địa chỉ mới</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input placeholder="Tên người nhận" value={data.fullName ?? ''} onChange={(e) => setData({ ...data, fullName: e.target.value })} className="px-3 py-2 bg-accent rounded" />
        <input placeholder="Số điện thoại" value={data.phone ?? ''} onChange={(e) => setData({ ...data, phone: e.target.value })} className="px-3 py-2 bg-accent rounded" />
        <input placeholder="Địa chỉ (số nhà, đường)" value={data.line1 ?? ''} onChange={(e) => setData({ ...data, line1: e.target.value })} className="sm:col-span-2 px-3 py-2 bg-accent rounded" />
        <input placeholder="Quận / Huyện" value={data.state ?? ''} onChange={(e) => setData({ ...data, state: e.target.value })} className="px-3 py-2 bg-accent rounded" />
        <input placeholder="Thành phố" value={data.city ?? ''} onChange={(e) => setData({ ...data, city: e.target.value })} className="px-3 py-2 bg-accent rounded" />
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => { onSave(data); setData({ label: 'Nhà', city: 'TP. Hồ Chí Minh' }); }} className="px-4 py-2 bg-primary text-primary-foreground rounded">Lưu địa chỉ</button>
      </div>
    </div>
  );
}

function AddPaymentForm({ onSave }: { onSave: (data: Partial<PaymentMethod>) => void }) {
  const [type, setType] = useState<'card' | 'momo' | 'cod'>('card');
  const [label, setLabel] = useState('Thẻ');
  const [cardNumber, setCardNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h4 className="text-sm font-medium mb-3">Thêm phương thức thanh toán</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="px-3 py-2 bg-accent rounded">
          <option value="card">Thẻ</option>
          <option value="momo">MoMo</option>
          <option value="cod">COD</option>
        </select>
        <input placeholder="Nhãn (ví dụ: Cá nhân)" value={label} onChange={(e) => setLabel(e.target.value)} className="px-3 py-2 bg-accent rounded" />
      </div>
      {type === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input placeholder="Số thẻ" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="px-3 py-2 bg-accent rounded" />
          <input placeholder="Tên chủ thẻ" value={holder} onChange={(e) => setHolder(e.target.value)} className="px-3 py-2 bg-accent rounded" />
          <input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="px-3 py-2 bg-accent rounded" />
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button onClick={() => {
          const pm: Partial<PaymentMethod> = { type, label, cardLast4: cardNumber ? cardNumber.slice(-4) : undefined };
          onSave(pm);
          setCardNumber(''); setHolder(''); setExpiry('');
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded">Lưu phương thức</button>
      </div>
    </div>
  );
}

function AddReviewForm({ products, onSave }: { products: any[]; onSave: (data: { productId: string; rating: number; comment: string }) => void }) {
  const [productId, setProductId] = useState(products?.[0]?.id ?? '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  useEffect(() => { if (!productId && products?.[0]) setProductId(products[0].id); }, [products]);
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h4 className="text-sm font-medium mb-3">Viết đánh giá</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="px-3 py-2 bg-accent rounded">
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="sm:col-span-2 flex items-center gap-3">
          <div className="flex items-center gap-2">Đánh giá:</div>
          <div>
            <StarRating rating={rating} interactive onRate={(r) => setRating(r)} />
          </div>
        </div>
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Viết nhận xét của bạn" className="w-full px-3 py-2 bg-accent rounded mb-3" />
      <div className="flex gap-2 mt-2">
        <button onClick={() => { if (!productId) { toast.error('Chọn sản phẩm'); return; } onSave({ productId, rating, comment }); setComment(''); setRating(5); toast.success('Đã gửi đánh giá'); }} className="px-4 py-2 bg-primary text-primary-foreground rounded">Gửi đánh giá</button>
      </div>
    </div>
  );
}

type InAppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  category: 'order' | 'promo' | 'system';
};

function defaultInAppNotifications(ordersCount: number): InAppNotification[] {
  const list: InAppNotification[] = [
    {
      id: 'welcome',
      title: 'Chào mừng đến rent4u',
      body: 'Khám phá bộ sưu tập và thuê trang phục chỉ với vài bước. Chọn ngày nhận và trả ngay trên từng sản phẩm.',
      createdAt: new Date().toISOString(),
      read: false,
      category: 'system',
    },
    {
      id: 'promo-rent10',
      title: 'Ưu đãi: mã RENT10',
      body: 'Giảm 10% tiền thuê khi nhập mã RENT10 ở bước giỏ hàng (áp dụng cho đơn hợp lệ).',
      createdAt: new Date().toISOString(),
      read: false,
      category: 'promo',
    },
  ];
  if (ordersCount > 0) {
    list.unshift({
      id: 'tip-orders',
      title: 'Theo dõi đơn hàng',
      body: `Bạn có ${ordersCount} đơn — xem chi tiết và cập nhật trạng thái tại tab Đơn hàng.`,
      createdAt: new Date().toISOString(),
      read: false,
      category: 'order',
    });
  }
  return list;
}

function loadInAppNotifications(userId: string, ordersCount: number): InAppNotification[] {
  try {
    const raw = localStorage.getItem(`r4u-inapp-notify-${userId}`);
    if (raw != null && raw !== '') {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed as InAppNotification[];
    }
  } catch {
    /* ignore */
  }
  return defaultInAppNotifications(ordersCount);
}

const TABS = ['Đơn hàng', 'Yêu thích', 'Đánh giá', 'Địa chỉ', 'Phương thức thanh toán', 'Thông báo', 'Cài đặt'];

// ORDER_STATUSES will be built from current products inside component

const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Đơn hàng của tôi', tab: 'Đơn hàng' },
  { icon: Heart, label: 'Yêu thích', tab: 'Yêu thích' },
  { icon: Star, label: 'Đánh giá của tôi', tab: 'Đánh giá' },
  { icon: MapPin, label: 'Địa chỉ', tab: 'Địa chỉ' },
  { icon: CreditCard, label: 'Phương thức thanh toán', tab: 'Phương thức thanh toán' },
  { icon: Bell, label: 'Thông báo', tab: 'Thông báo' },
  { icon: Settings, label: 'Cài đặt', tab: 'Cài đặt' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const navigate = useNavigate();
  const { wishlist, isAuthenticated, logout, products, isShopOwner, setShopOwner, currentUser, isAdmin, cartCount, getOrdersForUser, updateOrderStatus, addAddress, updateAddress, deleteAddress, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, updateUser, getProductById, reviews, addReview, deleteReview, getReviewsForUser } = useApp();

  const [fullName, setFullName] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const location = useLocation();

  useEffect(() => {
    setFullName(currentUser?.fullName ?? currentUser?.username ?? '');
    setEmailVal(currentUser?.email ?? '');
    setPhone(currentUser?.phone ?? '');
    setBirthDate(currentUser?.birthDate ?? '');
  }, [currentUser]);

  // Respect `?tab=` query param so external links can open a specific tab (e.g. wishlist)
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      if (tab && TABS.includes(tab)) {
        setActiveTab(tab as any);
        // ensure we start at top of profile when opened via external link
        window.scrollTo({ top: 0, left: 0 });
      }
    } catch (e) {
      // ignore
    }
  }, [location.search]);

  const saveProfile = () => {
    if (!currentUser) { toast.error('Vui lòng đăng nhập'); return; }
    const updates: any = { fullName: fullName || undefined, email: emailVal || undefined, phone: phone || undefined, birthDate: birthDate || undefined };
    updateUser(currentUser.id, updates);
    toast.success('Đã lưu thông tin cá nhân');
  };
  const NOTIFY_ITEMS = [
    { key: 'ordersEmail', label: 'Thông báo đơn hàng qua email' },
    { key: 'ordersSMS', label: 'SMS khi giao hàng' },
    { key: 'trends', label: 'Thông báo xu hướng mới' },
    { key: 'promos', label: 'Ưu đãi và khuyến mãi' },
  ];

  const toggleNotification = (key: string) => {
    if (!currentUser) { toast.error('Vui lòng đăng nhập'); return; }
    const prev = currentUser.notificationSettings ?? {};
    const next = { ...prev, [key]: !prev[key as keyof typeof prev] };
    updateUser(currentUser.id, { notificationSettings: next });
  };
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const displayName = currentUser?.username ?? (currentUser?.email ? currentUser.email.split('@')[0] : 'Người dùng');
  const displayEmail = currentUser?.email ?? '—';
  const roleLabel = isAdmin ? 'Admin' : isShopOwner ? 'Chủ shop' : 'Khách hàng';
  const ownerId = currentUser?.username ?? currentUser?.email ?? '';
  const rentalsCount = isShopOwner
    ? products.filter((p) => p.ownerId === ownerId).reduce((s, p) => s + (p.providerTotalRentals ?? 0), 0)
    : cartCount;
  const reviewsCount = reviews.filter((r) => r.userName === (currentUser?.fullName ?? displayName)).length;
  // Orders will be pulled from context for the current user
  const userOrders = currentUser ? getOrdersForUser(currentUser.id) : [];

  const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([]);

  useEffect(() => {
    if (!currentUser?.id) return;
    setInAppNotifications(loadInAppNotifications(currentUser.id, userOrders.length));
  }, [currentUser?.id, userOrders.length]);

  const persistInAppNotifications = (next: InAppNotification[]) => {
    if (!currentUser?.id) return;
    setInAppNotifications(next);
    try {
      localStorage.setItem(`r4u-inapp-notify-${currentUser.id}`, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const markNotificationRead = (id: string) =>
    persistInAppNotifications(inAppNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllNotificationsRead = () =>
    persistInAppNotifications(inAppNotifications.map((n) => ({ ...n, read: true })));

  const removeNotification = (id: string) =>
    persistInAppNotifications(inAppNotifications.filter((n) => n.id !== id));

  if (!isAuthenticated) {
    return (
      <Shell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-4xl">👤</div>
            <h1 className="font-display text-2xl text-foreground">Bạn chưa đăng nhập</h1>
            <p className="text-sm text-muted-foreground max-w-md text-center">Vui lòng đăng nhập để xem trang cá nhân, quản lý yêu thích và thuê trang phục.</p>
            <div className="flex gap-3 mt-4">
              <Link to="/login" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl">Đăng nhập</Link>
              <Link to="/register" className="px-6 py-2.5 border border-border text-primary rounded-xl">Đăng ký</Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Profile card */}
            <div className="bg-card border border-border rounded-2xl p-5 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-3xl font-medium text-secondary-foreground border-4 border-border">
                      {displayName.split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full border-2 border-border flex items-center justify-center text-primary-foreground text-xs">
                      +
                    </button>
                  </div>
                  <h2 className="font-display text-card-foreground text-lg">{displayName}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{displayEmail}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">{roleLabel}</span>
                  </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-border">
                {[
                  { n: String(rentalsCount), l: 'Lần thuê' },
                  { n: String(wishlist.length), l: 'Yêu thích' },
                  { n: String(reviewsCount), l: 'Đánh giá' },
                ].map(({ n, l }) => (
                  <div key={l} className="text-center">
                    <p className="font-display text-card-foreground text-lg">{n}</p>
                    <p className="text-xs text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {NAV_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const isActive = item.tab === activeTab;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.tab && setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
                      isActive ? 'bg-accent text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-accent'
                    } ${i > 0 ? 'border-t border-border' : ''}`}
                  >
                    <Icon size={16} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                );
              })}
              {isShopOwner ? (
                <Link to="/shopowner" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-primary hover:bg-accent transition-colors border-t border-border">
                  <Package size={16} />
                  Quản lý Shop
                </Link>
              ) : (
                <button
                  onClick={() => { setShopOwner(true); toast.success('Bạn đã đăng ký chủ shop'); navigate('/shopowner'); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-primary hover:bg-accent transition-colors border-t border-border"
                >
                  <Package size={16} />
                  Trở thành chủ shop
                </button>
              )}

              <button
                onClick={() => {
                  try { logout(); } catch {}
                  toast.success('Đăng xuất thành công');
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Tab bar */}
            <div className="flex border-b border-border mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Orders Tab */}
            {activeTab === 'Đơn hàng' && (
              <div className="space-y-4">
                {/* Status filter (UI only) */}
                <div className="flex gap-2 pb-1 flex-wrap">
                  {['Tất cả', 'Đang xử lý', 'Đang giao', 'Đang thuê', 'Đã hoàn trả'].map((f, i) => (
                    <button
                      key={f}
                      className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-colors ${
                        i === 0 ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:border-primary'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {userOrders.length === 0 ? (
                  <div className="py-20 text-center text-sm text-muted-foreground">Bạn chưa có đơn hàng nào.</div>
                ) : (
                  userOrders.map((order) => {
                    const item = order.items[0];
                    const prod = item?.product;
                    const StatusIcon = order.status === 'Đang giao' ? Truck : order.status === 'Đang thuê' ? Clock : order.status === 'Đã hoàn trả' ? CheckCircle : Package;
                    return (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-accent border-b border-border">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Đơn #{order.id}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${order.status === 'Đang giao' ? 'text-blue-600 bg-blue-50' : order.status === 'Đang thuê' ? 'text-primary bg-accent' : 'text-green-600 bg-green-50'}`}>
                            <StatusIcon size={12} />
                            {order.status}
                          </span>
                        </div>
                        <div className="flex gap-4 p-4">
                          <div className="flex-shrink-0">
                            <ImageWithFallback src={prod?.images?.[0]} alt={prod?.name ?? 'sản phẩm'} className="w-20 h-20 object-cover rounded-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">{prod?.provider}</p>
                            <p className="font-display text-card-foreground text-sm">{prod?.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item?.startDate ? `${new Date(item.startDate).toLocaleDateString()} → ${item.endDate ? new Date(item.endDate).toLocaleDateString() : ''}` : 'Chưa có lịch thuê'}</p>
                            <p className="text-sm font-medium text-primary mt-2">{formatPrice(order.total)}</p>
                            <p className="text-xs text-muted-foreground mt-1">{order.address ? `${order.address.line1}, ${order.address.city}` : 'Địa chỉ: —'}</p>
                          </div>
                          <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            <Link to={`/product/${prod?.id}`}>
                              <button className="px-3 py-1.5 border border-border text-primary text-xs rounded-xl hover:bg-accent transition-colors">Xem lại</button>
                            </Link>
                            <div className="flex gap-2">
                              {order.status === 'Đang xử lý' && (
                                <button onClick={() => updateOrderStatus(order.id, 'Đã hủy')} className="px-3 py-1.5 text-xs rounded-xl border border-red-200 text-red-500">Hủy đơn</button>
                              )}
                              {order.status === 'Đang giao' && (
                                <button onClick={() => updateOrderStatus(order.id, 'Đang thuê')} className="px-3 py-1.5 text-xs rounded-xl bg-primary text-primary-foreground">Đã nhận</button>
                              )}
                              {order.status === 'Đang thuê' && (
                                <button onClick={() => updateOrderStatus(order.id, 'Đã hoàn trả')} className="px-3 py-1.5 text-xs rounded-xl bg-primary text-primary-foreground">Đã trả</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'Yêu thích' && (
              <div>
                {wishlistProducts.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl">❤️</div>
                    <h3 className="font-display text-card-foreground text-xl">Chưa có sản phẩm yêu thích</h3>
                    <p className="text-sm text-muted-foreground">Thêm sản phẩm vào yêu thích để xem tại đây</p>
                    <Link to="/products" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-95 transition-colors">
                      Khám phá ngay
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
                {wishlistProducts.length === 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                    <h3 className="col-span-full font-display text-card-foreground text-lg mb-1">Gợi ý cho bạn</h3>
                    {products.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'Đánh giá' && (
              <div className="space-y-4">
                <AddReviewForm products={products} onSave={(data) => {
                  if (!currentUser) { toast.error('Vui lòng đăng nhập'); return; }
                  addReview({ productId: data.productId, rating: data.rating, comment: data.comment, userName: currentUser.fullName ?? currentUser.username });
                }} />

                <div className="space-y-3">
                  <h3 className="font-display text-card-foreground text-lg">Đánh giá của bạn</h3>
                  {(!currentUser || getReviewsForUser(currentUser.fullName ?? displayName).length === 0) ? (
                    <div className="py-8 text-sm text-muted-foreground">Bạn chưa có đánh giá nào.</div>
                  ) : (
                    getReviewsForUser(currentUser.fullName ?? displayName).map((r) => {
                      const prod = getProductById(r.productId);
                      return (
                        <div key={r.id} className="bg-card border border-border rounded-2xl p-4 flex gap-3">
                          <ImageWithFallback src={prod?.images?.[0]} alt={prod?.name ?? 'sản phẩm'} className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-card-foreground">{prod?.name ?? 'Sản phẩm'}</p>
                                <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <StarRating rating={r.rating} size="sm" />
                                <button onClick={() => { deleteReview(r.id); toast.success('Đã xóa đánh giá'); }} className="text-xs text-red-500">Xóa</button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'Địa chỉ' && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-display text-card-foreground text-lg mb-4">Địa chỉ của tôi</h3>
                  {(currentUser?.addresses ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Bạn chưa lưu địa chỉ nào.</p>
                  ) : (
                    <div className="space-y-3">
                      {(currentUser?.addresses ?? []).map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-3 border rounded-xl">
                          <div>
                            <p className="text-sm font-medium">{a.label ?? 'Địa chỉ'}</p>
                            <p className="text-xs text-muted-foreground">{[a.fullName, a.phone, a.line1, a.city].filter(Boolean).join(', ')}</p>
                          </div>
                          <div className="flex gap-2">
                            {!a.isDefault && (
                              <button onClick={() => updateAddress(currentUser!.id, a.id, { isDefault: true })} className="text-xs text-primary">Đặt mặc định</button>
                            )}
                            <button onClick={() => deleteAddress(currentUser!.id, a.id)} className="text-xs text-red-500">Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <AddAddressForm onSave={(data) => {
                  if (!currentUser) { toast.error('Vui lòng đăng nhập'); return; }
                  addAddress(currentUser.id, data);
                  toast.success('Đã lưu địa chỉ');
                }} />
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'Phương thức thanh toán' && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-display text-card-foreground text-lg mb-4">Phương thức thanh toán</h3>
                  {(currentUser?.paymentMethods ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Chưa có phương thức thanh toán.</p>
                  ) : (
                    <div className="space-y-3">
                      {(currentUser?.paymentMethods ?? []).map((m) => (
                        <div key={m.id} className="flex items-center justify-between p-3 border rounded-xl">
                          <div>
                            <p className="text-sm font-medium">{m.label ?? m.type}</p>
                            <p className="text-xs text-muted-foreground">{m.type === 'card' ? `•••• ${m.cardLast4}` : m.type}</p>
                          </div>
                          <div className="flex gap-2">
                            {!m.isDefault && (
                              <button onClick={() => updatePaymentMethod(currentUser!.id, m.id, { isDefault: true })} className="text-xs text-primary">Đặt mặc định</button>
                            )}
                            <button onClick={() => deletePaymentMethod(currentUser!.id, m.id)} className="text-xs text-red-500">Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <AddPaymentForm onSave={(data) => {
                  if (!currentUser) { toast.error('Vui lòng đăng nhập'); return; }
                  addPaymentMethod(currentUser.id, data);
                  toast.success('Đã lưu phương thức thanh toán');
                }} />
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Thông báo' && (
              <div className="space-y-5">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-display text-card-foreground text-lg">Thông báo của bạn</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cập nhật đơn hàng, ưu đãi và tin tức từ rent4u
                      </p>
                    </div>
                    {inAppNotifications.some((n) => !n.read) && (
                      <button
                        type="button"
                        onClick={() => {
                          markAllNotificationsRead();
                          toast.success('Đã đánh dấu tất cả là đã đọc');
                        }}
                        className="text-xs text-primary hover:underline whitespace-nowrap"
                      >
                        Đánh dấu tất cả đã đọc
                      </button>
                    )}
                  </div>

                  {inAppNotifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">Chưa có thông báo.</p>
                  ) : (
                    <ul className="space-y-2">
                      {inAppNotifications.map((n) => {
                        const CatIcon = n.category === 'order' ? Package : n.category === 'promo' ? Tag : Bell;
                        return (
                          <li
                            key={n.id}
                            className={`relative flex gap-3 p-4 rounded-xl border transition-colors ${
                              n.read ? 'border-border bg-background' : 'border-primary/30 bg-accent/50'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => markNotificationRead(n.id)}
                              className="flex gap-3 flex-1 min-w-0 text-left"
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  n.read ? 'bg-muted text-muted-foreground' : 'bg-primary/15 text-primary'
                                }`}
                              >
                                <CatIcon size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${n.read ? 'text-muted-foreground' : 'text-card-foreground'}`}>
                                  {n.title}
                                  {!n.read && (
                                    <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary align-middle" aria-hidden />
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.body}</p>
                                <p className="text-[11px] text-muted-foreground mt-2">
                                  {new Date(n.createdAt).toLocaleString('vi-VN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                removeNotification(n.id);
                                toast.success('Đã xóa thông báo');
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 self-start"
                              aria-label="Xóa thông báo"
                            >
                              <X size={16} />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-display text-card-foreground text-lg mb-1">Cài đặt nhận thông báo</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Chọn kênh bạn muốn nhận cập nhật (lưu theo tài khoản).
                  </p>
                  <div className="space-y-3">
                    {NOTIFY_ITEMS.map(({ key, label }) => {
                      const on = !!((currentUser?.notificationSettings as Record<string, boolean>)?.[key]);
                      return (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
                          <span className="text-sm text-card-foreground">{label}</span>
                          <button
                            type="button"
                            onClick={() => {
                              toggleNotification(key);
                              toast.success(on ? 'Đã tắt thông báo' : 'Đã bật thông báo');
                            }}
                            className={`w-10 h-5 rounded-full relative transition-colors ${on ? 'bg-primary' : 'bg-muted'}`}
                            aria-pressed={on}
                          >
                            <span
                              className={`absolute top-0.5 w-3.5 h-3.5 bg-background rounded-full shadow transition-all ${
                                on ? 'left-5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'Cài đặt' && (
              <div className="space-y-5">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-display text-card-foreground text-lg mb-4">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Họ và tên</label>
                      <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl text-sm text-card-foreground outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
                      <input value={emailVal} onChange={(e) => setEmailVal(e.target.value)} className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl text-sm text-card-foreground outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Số điện thoại</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl text-sm text-card-foreground outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ngày sinh</label>
                      <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="YYYY-MM-DD" className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl text-sm text-card-foreground outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <button onClick={saveProfile} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-95 transition-colors">
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
