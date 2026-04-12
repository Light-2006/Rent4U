import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shell } from '../components/layout/Shell';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';

function ProductForm({ product, onSave, onCancel }: any) {
  const [form, setForm] = useState<any>({
    name: product?.name ?? '',
    provider: product?.provider ?? '',
    pricePerDay: product?.pricePerDay ?? 0,
    description: product?.description ?? '',
    images: (product?.images ?? []).join(','),
    sizes: (product?.sizes ?? []).join(','),
    colors: (product?.colors ?? []).map((c: any) => `${c.name}:${c.hex}`).join(','),
    category: product?.category ?? '',
    isAvailable: product?.isAvailable ?? true,
    isFeatured: product?.isFeatured ?? false,
  });

  const handle = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const payload: any = {
          name: form.name,
          provider: form.provider,
          pricePerDay: Number(form.pricePerDay) || 0,
          description: form.description,
          images: form.images ? form.images.split(',').map((s: string) => s.trim()) : [],
          sizes: form.sizes ? form.sizes.split(',').map((s: string) => s.trim()) : [],
          colors: form.colors
            ? form.colors.split(',').map((s: string) => {
                const [name, hex] = s.split(':').map((t) => t.trim());
                return { name: name || 'Color', hex: hex || '#CCCCCC' };
              })
            : [],
          category: form.category,
          isAvailable: !!form.isAvailable,
          isFeatured: !!form.isFeatured,
        };
        onSave(payload);
      }}
    >
      <div className="grid grid-cols-1 gap-3">
        <input value={form.name} onChange={(e) => handle('name', e.target.value)} placeholder="Tên sản phẩm" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.provider} onChange={(e) => handle('provider', e.target.value)} placeholder="Nhà cung cấp" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.pricePerDay} onChange={(e) => handle('pricePerDay', e.target.value)} placeholder="Giá / ngày" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.category} onChange={(e) => handle('category', e.target.value)} placeholder="Danh mục" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <textarea value={form.description} onChange={(e) => handle('description', e.target.value)} placeholder="Mô tả" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.images} onChange={(e) => handle('images', e.target.value)} placeholder="Images (comma separated)" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.sizes} onChange={(e) => handle('sizes', e.target.value)} placeholder="Sizes (comma)" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.colors} onChange={(e) => handle('colors', e.target.value)} placeholder="Colors (name:hex, comma)" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <div className="flex gap-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isAvailable} onChange={(e) => handle('isAvailable', e.target.checked)} /> Có sẵn</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => handle('isFeatured', e.target.checked)} /> Nổi bật</label>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Lưu</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Huỷ</button>
        </div>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { products, createProduct, updateProduct, deleteProduct, isAdmin, users, updateUser, deleteUser, currentUser } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');

  if (!isAdmin) {
    return (
      <Shell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-4xl">🔒</div>
            <h1 className="font-display text-2xl text-card-foreground">Chỉ dành cho quản trị viên</h1>
            <p className="text-sm text-muted-foreground max-w-md text-center">Vui lòng đăng nhập bằng tài khoản quản trị để truy cập trang này.</p>
            <div className="flex gap-3 mt-4">
              <Link to="/login" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl">Đăng nhập</Link>
              <Link to="/" className="px-6 py-2.5 border border-border text-primary rounded-xl">Về trang chủ</Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
              <div className="flex rounded-lg overflow-hidden border">
                <button onClick={() => setActiveTab('products')} className={`px-4 py-2 ${activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'}`}>Products</button>
                <button onClick={() => setActiveTab('users')} className={`px-4 py-2 ${activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'}`}>Users</button>
              </div>
              <button onClick={() => navigate('/')} className="px-4 py-2 border rounded">Về trang chủ</button>
            </div>
        </div>

        {activeTab === 'products' ? (
          <>
            {showNew && (
              <div className="bg-card p-4 rounded mb-6 border">
                <h3 className="font-medium mb-3">Tạo sản phẩm</h3>
                <ProductForm
                  onCancel={() => setShowNew(false)}
                  onSave={(payload: any) => {
                    createProduct(payload);
                    toast.success('Đã tạo sản phẩm mới');
                    setShowNew(false);
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-card border rounded p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-28 bg-accent flex-shrink-0 rounded overflow-hidden">
                      {p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">📷</div>}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.provider}</p>
                      <p className="text-sm text-primary mt-2">Giá: {p.pricePerDay.toLocaleString()} / ngày</p>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => setEditing(p.id)} className="px-3 py-1 border rounded text-sm">Sửa</button>
                        <button onClick={() => { if (confirm('Xoá sản phẩm?')) { deleteProduct(p.id); toast.success('Đã xoá sản phẩm'); } }} className="px-3 py-1 border rounded text-sm text-destructive">Xoá</button>
                      </div>
                    </div>
                  </div>

                  {editing === p.id && (
                    <div className="mt-3 border-t border-border pt-3">
                      <ProductForm
                        product={p}
                        onCancel={() => setEditing(null)}
                        onSave={(payload: any) => {
                          updateProduct(p.id, payload);
                          toast.success('Cập nhật sản phẩm');
                          setEditing(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-card p-4 rounded border">
            <h3 className="font-medium mb-3">Quản lý người dùng</h3>
            {users.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Chưa có người dùng nào.</div>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{u.username ?? u.email}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">Role: <strong className="text-primary">{u.role}</strong></p>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => { updateUser(u.id, { role: 'admin' }); toast.success('Đã nâng quyền thành admin'); }}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Promote Admin
                        </button>
                      )}
                      {u.role !== 'shopowner' && (
                        <button
                          onClick={() => { updateUser(u.id, { role: 'shopowner' }); toast.success('Đã nâng quyền thành shopowner'); }}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Promote Shopowner
                        </button>
                      )}
                      {u.role !== 'user' && (
                        <button
                          onClick={() => { updateUser(u.id, { role: 'user' }); toast.success('Đã hạ quyền về user'); }}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          Demote to User
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (u.username === currentUser?.username) { toast.error('Không thể xoá chính bạn'); return; }
                          if (confirm('Xoá người dùng?')) { deleteUser(u.id); toast.success('Đã xoá người dùng'); }
                        }}
                        className="px-3 py-1 border rounded text-sm text-destructive"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}
