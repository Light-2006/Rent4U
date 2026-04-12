import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ShoppingBag, Heart, Star, MapPin, CreditCard, Bell,
  Settings, LogOut, ChevronRight, Package, Clock, CheckCircle, Truck
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
    <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
      <h4 className="text-sm font-medium mb-3">Thêm địa chỉ mới</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input placeholder="Tên người nhận" value={data.fullName ?? ''} onChange={(e) => setData({ ...data, fullName: e.target.value })} className="px-3 py-2 bg-[#FAF8F5] rounded" />
        <input placeholder="Số điện thoại" value={data.phone ?? ''} onChange={(e) => setData({ ...data, phone: e.target.value })} className="px-3 py-2 bg-[#FAF8F5] rounded" />
        <input placeholder="Địa chỉ (số nhà, đường)" value={data.line1 ?? ''} onChange={(e) => setData({ ...data, line1: e.target.value })} className="sm:col-span-2 px-3 py-2 bg-[#FAF8F5] rounded" />
        <input placeholder="Quận / Huyện" value={data.state ?? ''} onChange={(e) => setData({ ...data, state: e.target.value })} className="px-3 py-2 bg-[#FAF8F5] rounded" />
        <input placeholder="Thành phố" value={data.city ?? ''} onChange={(e) => setData({ ...data, city: e.target.value })} className="px-3 py-2 bg-[#FAF8F5] rounded" />
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => { onSave(data); setData({ label: 'Nhà', city: 'TP. Hồ Chí Minh' }); }} className="px-4 py-2 bg-[#8B6F47] text-white rounded">Lưu địa chỉ</button>
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
    <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
      <h4 className="text-sm font-medium mb-3">Thêm phương thức thanh toán</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="px-3 py-2 bg-[#FAF8F5] rounded">
          <option value="card">Thẻ</option>
          <option value="momo">MoMo</option>
          <option value="cod">COD</option>
        </select>
        <input placeholder="Nhãn (ví dụ: Cá nhân)" value={label} onChange={(e) => setLabel(e.target.value)} className="px-3 py-2 bg-[#FAF8F5] rounded" />
      </div>
      {type === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input placeholder="Số thẻ" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="px-3 py-2 bg-[#FAF8F5] rounded" />
          <input placeholder="Tên chủ thẻ" value={holder} onChange={(e) => setHolder(e.target.value)} className="px-3 py-2 bg-[#FAF8F5] rounded" />
          <input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="px-3 py-2 bg-[#FAF8F5] rounded" />
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button onClick={() => {
          const pm: Partial<PaymentMethod> = { type, label, cardLast4: cardNumber ? cardNumber.slice(-4) : undefined };
          onSave(pm);
          setCardNumber(''); setHolder(''); setExpiry('');
        }} className="px-4 py-2 bg-[#8B6F47] text-white rounded">Lưu phương thức</button>
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
    <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
      <h4 className="text-sm font-medium mb-3">Viết đánh giá</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="px-3 py-2 bg-[#FAF8F5] rounded">
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="sm:col-span-2 flex items-center gap-3">
          <div className="flex items-center gap-2">Đánh giá:</div>
          <div>
            <StarRating rating={rating} interactive onRate={(r) => setRating(r)} />
          </div>
        </div>
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Viết nhận xét của bạn" className="w-full px-3 py-2 bg-[#FAF8F5] rounded mb-3" />
      <div className="flex gap-2 mt-2">
        <button onClick={() => { if (!productId) { toast.error('Chọn sản phẩm'); return; } onSave({ productId, rating, comment }); setComment(''); setRating(5); toast.success('Đã gửi đánh giá'); }} className="px-4 py-2 bg-[#8B6F47] text-white rounded">Gửi đánh giá</button>
      </div>
    </div>
  );
}

const TABS = ['Đơn hàng', 'Yêu thích', 'Đánh giá', 'Địa chỉ', 'Phương thức thanh toán', 'Cài đặt'];

// ORDER_STATUSES will be built from current products inside component

const NAV_ITEMS = [
  { icon: ShoppingBag, label: 'Đơn hàng của tôi', tab: 'Đơn hàng' },
  { icon: Heart, label: 'Yêu thích', tab: 'Yêu thích' },
  { icon: Star, label: 'Đánh giá của tôi', tab: 'Đánh giá' },
  { icon: MapPin, label: 'Địa chỉ', tab: 'Địa chỉ' },
  { icon: CreditCard, label: 'Phương thức thanh toán', tab: 'Phương thức thanh toán' },
  { icon: Bell, label: 'Thông báo', tab: null },
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

  useEffect(() => {
    setFullName(currentUser?.fullName ?? currentUser?.username ?? '');
    setEmailVal(currentUser?.email ?? '');
    setPhone(currentUser?.phone ?? '');
    setBirthDate(currentUser?.birthDate ?? '');
  }, [currentUser]);

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

  if (!isAuthenticated) {
    return (
      <Shell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-[#F0E8DC] rounded-full flex items-center justify-center text-4xl">👤</div>
            <h1 className="font-display text-2xl text-[#3D2B1F]">Bạn chưa đăng nhập</h1>
            <p className="text-sm text-[#9B8E84] max-w-md text-center">Vui lòng đăng nhập để xem trang cá nhân, quản lý yêu thích và thuê trang phục.</p>
            <div className="flex gap-3 mt-4">
              <Link to="/login" className="px-6 py-2.5 bg-[#8B6F47] text-white rounded-xl">Đăng nhập</Link>
              <Link to="/register" className="px-6 py-2.5 border border-[#C4A882] text-[#8B6F47] rounded-xl">Đăng ký</Link>
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
            <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full bg-[#F0E8DC] flex items-center justify-center text-3xl font-medium text-[#3D2B1F] border-4 border-[#F0E8DC]">
                      {displayName.split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#8B6F47] rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                      +
                    </button>
                  </div>
                  <h2 className="font-display text-[#3D2B1F] text-lg">{displayName}</h2>
                  <p className="text-xs text-[#9B8E84] mt-0.5">{displayEmail}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="px-2.5 py-1 bg-[#F0E8DC] text-[#8B6F47] text-xs rounded-full">{roleLabel}</span>
                  </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#F0E8DC]">
                {[
                  { n: String(rentalsCount), l: 'Lần thuê' },
                  { n: String(wishlist.length), l: 'Yêu thích' },
                  { n: String(reviewsCount), l: 'Đánh giá' },
                ].map(({ n, l }) => (
                  <div key={l} className="text-center">
                    <p className="font-display text-[#3D2B1F] text-lg">{n}</p>
                    <p className="text-xs text-[#9B8E84]">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="bg-white border border-[#EDE0D0] rounded-2xl overflow-hidden">
              {NAV_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const isActive = item.tab === activeTab;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.tab && setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
                      isActive ? 'bg-[#FAF8F5] text-[#8B6F47] border-l-2 border-[#8B6F47]' : 'text-[#6B5135] hover:bg-[#FAF8F5]'
                    } ${i > 0 ? 'border-t border-[#F0E8DC]' : ''}`}
                  >
                    <Icon size={16} className={isActive ? 'text-[#8B6F47]' : 'text-[#9B8E84]'} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight size={14} className="text-[#C4A882]" />
                  </button>
                );
              })}
              {isShopOwner ? (
                <Link to="/shopowner" className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#8B6F47] hover:bg-[#FAF8F5] transition-colors border-t border-[#F0E8DC]">
                  <Package size={16} />
                  Quản lý Shop
                </Link>
              ) : (
                <button
                  onClick={() => { setShopOwner(true); toast.success('Bạn đã đăng ký chủ shop'); navigate('/shopowner'); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#8B6F47] hover:bg-[#FAF8F5] transition-colors border-t border-[#F0E8DC]"
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
            <div className="flex border-b border-[#EDE0D0] mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-[#8B6F47] text-[#8B6F47] font-medium'
                      : 'border-transparent text-[#9B8E84] hover:text-[#6B5135]'
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
                        i === 0 ? 'bg-[#3D2B1F] text-white' : 'border border-[#EDE0D0] text-[#6B5135] hover:border-[#C4A882]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {userOrders.length === 0 ? (
                  <div className="py-20 text-center text-sm text-[#9B8E84]">Bạn chưa có đơn hàng nào.</div>
                ) : (
                  userOrders.map((order) => {
                    const item = order.items[0];
                    const prod = item?.product;
                    const StatusIcon = order.status === 'Đang giao' ? Truck : order.status === 'Đang thuê' ? Clock : order.status === 'Đã hoàn trả' ? CheckCircle : Package;
                    return (
                      <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#EDE0D0] rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-[#FAF8F5] border-b border-[#F0E8DC]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#9B8E84]">Đơn #{order.id}</span>
                            <span className="text-xs text-[#9B8E84]">·</span>
                            <span className="text-xs text-[#9B8E84]">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${order.status === 'Đang giao' ? 'text-blue-600 bg-blue-50' : order.status === 'Đang thuê' ? 'text-[#8B6F47] bg-[#F0E8DC]' : 'text-green-600 bg-green-50'}`}>
                            <StatusIcon size={12} />
                            {order.status}
                          </span>
                        </div>
                        <div className="flex gap-4 p-4">
                          <div className="flex-shrink-0">
                            <ImageWithFallback src={prod?.images?.[0]} alt={prod?.name ?? 'sản phẩm'} className="w-20 h-20 object-cover rounded-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#9B8E84]">{prod?.provider}</p>
                            <p className="font-display text-[#3D2B1F] text-sm">{prod?.name}</p>
                            <p className="text-xs text-[#9B8E84] mt-1">{item?.startDate ? `${new Date(item.startDate).toLocaleDateString()} → ${item.endDate ? new Date(item.endDate).toLocaleDateString() : ''}` : 'Chưa có lịch thuê'}</p>
                            <p className="text-sm font-medium text-[#8B6F47] mt-2">{formatPrice(order.total)}</p>
                            <p className="text-xs text-[#9B8E84] mt-1">{order.address ? `${order.address.line1}, ${order.address.city}` : 'Địa chỉ: —'}</p>
                          </div>
                          <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            <Link to={`/product/${prod?.id}`}>
                              <button className="px-3 py-1.5 border border-[#C4A882] text-[#8B6F47] text-xs rounded-xl hover:bg-[#F0E8DC] transition-colors">Xem lại</button>
                            </Link>
                            <div className="flex gap-2">
                              {order.status === 'Đang xử lý' && (
                                <button onClick={() => updateOrderStatus(order.id, 'Đã hủy')} className="px-3 py-1.5 text-xs rounded-xl border border-red-200 text-red-500">Hủy đơn</button>
                              )}
                              {order.status === 'Đang giao' && (
                                <button onClick={() => updateOrderStatus(order.id, 'Đang thuê')} className="px-3 py-1.5 text-xs rounded-xl bg-[#8B6F47] text-white">Đã nhận</button>
                              )}
                              {order.status === 'Đang thuê' && (
                                <button onClick={() => updateOrderStatus(order.id, 'Đã hoàn trả')} className="px-3 py-1.5 text-xs rounded-xl bg-[#8B6F47] text-white">Đã trả</button>
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
                    <div className="w-16 h-16 bg-[#F0E8DC] rounded-full flex items-center justify-center text-2xl">❤️</div>
                    <h3 className="font-display text-[#3D2B1F] text-xl">Chưa có sản phẩm yêu thích</h3>
                    <p className="text-sm text-[#9B8E84]">Thêm sản phẩm vào yêu thích để xem tại đây</p>
                    <Link to="/products" className="px-6 py-2.5 bg-[#8B6F47] text-white rounded-xl text-sm hover:bg-[#6B5135] transition-colors">
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
                    <h3 className="col-span-full font-display text-[#3D2B1F] text-lg mb-1">Gợi ý cho bạn</h3>
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
                  <h3 className="font-display text-[#3D2B1F] text-lg">Đánh giá của bạn</h3>
                  {(!currentUser || getReviewsForUser(currentUser.fullName ?? displayName).length === 0) ? (
                    <div className="py-8 text-sm text-[#9B8E84]">Bạn chưa có đánh giá nào.</div>
                  ) : (
                    getReviewsForUser(currentUser.fullName ?? displayName).map((r) => {
                      const prod = getProductById(r.productId);
                      return (
                        <div key={r.id} className="bg-white border border-[#EDE0D0] rounded-2xl p-4 flex gap-3">
                          <ImageWithFallback src={prod?.images?.[0]} alt={prod?.name ?? 'sản phẩm'} className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-[#3D2B1F]">{prod?.name ?? 'Sản phẩm'}</p>
                                <p className="text-xs text-[#9B8E84]">{new Date(r.date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <StarRating rating={r.rating} size="sm" />
                                <button onClick={() => { deleteReview(r.id); toast.success('Đã xóa đánh giá'); }} className="text-xs text-red-500">Xóa</button>
                              </div>
                            </div>
                            <p className="text-sm text-[#6B5135] mt-2">{r.comment}</p>
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
                <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
                  <h3 className="font-display text-[#3D2B1F] text-lg mb-4">Địa chỉ của tôi</h3>
                  {(currentUser?.addresses ?? []).length === 0 ? (
                    <p className="text-sm text-[#9B8E84]">Bạn chưa lưu địa chỉ nào.</p>
                  ) : (
                    <div className="space-y-3">
                      {(currentUser?.addresses ?? []).map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-3 border rounded-xl">
                          <div>
                            <p className="text-sm font-medium">{a.label ?? 'Địa chỉ'}</p>
                            <p className="text-xs text-[#9B8E84]">{[a.fullName, a.phone, a.line1, a.city].filter(Boolean).join(', ')}</p>
                          </div>
                          <div className="flex gap-2">
                            {!a.isDefault && (
                              <button onClick={() => updateAddress(currentUser!.id, a.id, { isDefault: true })} className="text-xs text-[#8B6F47]">Đặt mặc định</button>
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
                <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
                  <h3 className="font-display text-[#3D2B1F] text-lg mb-4">Phương thức thanh toán</h3>
                  {(currentUser?.paymentMethods ?? []).length === 0 ? (
                    <p className="text-sm text-[#9B8E84]">Chưa có phương thức thanh toán.</p>
                  ) : (
                    <div className="space-y-3">
                      {(currentUser?.paymentMethods ?? []).map((m) => (
                        <div key={m.id} className="flex items-center justify-between p-3 border rounded-xl">
                          <div>
                            <p className="text-sm font-medium">{m.label ?? m.type}</p>
                            <p className="text-xs text-[#9B8E84]">{m.type === 'card' ? `•••• ${m.cardLast4}` : m.type}</p>
                          </div>
                          <div className="flex gap-2">
                            {!m.isDefault && (
                              <button onClick={() => updatePaymentMethod(currentUser!.id, m.id, { isDefault: true })} className="text-xs text-[#8B6F47]">Đặt mặc định</button>
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

            {/* Settings Tab */}
            {activeTab === 'Cài đặt' && (
              <div className="space-y-5">
                <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
                  <h3 className="font-display text-[#3D2B1F] text-lg mb-4">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#6B5135] mb-1.5">Họ và tên</label>
                      <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] outline-none focus:border-[#C4A882] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B5135] mb-1.5">Email</label>
                      <input value={emailVal} onChange={(e) => setEmailVal(e.target.value)} className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] outline-none focus:border-[#C4A882] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B5135] mb-1.5">Số điện thoại</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] outline-none focus:border-[#C4A882] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B5135] mb-1.5">Ngày sinh</label>
                      <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="YYYY-MM-DD" className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EDE0D0] rounded-xl text-sm text-[#3D2B1F] outline-none focus:border-[#C4A882] transition-colors" />
                    </div>
                  </div>
                  <button onClick={saveProfile} className="mt-4 px-6 py-2.5 bg-[#8B6F47] text-white rounded-xl text-sm hover:bg-[#6B5135] transition-colors">
                    Lưu thay đổi
                  </button>
                </div>

                <div className="bg-white border border-[#EDE0D0] rounded-2xl p-5">
                  <h3 className="font-display text-[#3D2B1F] text-lg mb-4">Thông báo</h3>
                  <div className="space-y-3">
                    {NOTIFY_ITEMS.map(({ key, label }) => {
                      const on = !!((currentUser?.notificationSettings as any)?.[key]);
                      return (
                        <div key={key} className="flex items-center justify-between py-2">
                          <span className="text-sm text-[#6B5135]">{label}</span>
                          <button onClick={() => toggleNotification(key)} className={`w-10 h-5 rounded-full relative transition-colors ${on ? 'bg-[#8B6F47]' : 'bg-[#EDE0D0]'}`}>
                            <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all ${on ? 'left-5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
