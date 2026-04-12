import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shell } from '../components/layout/Shell';
import { useApp } from '../contexts/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

function ProductForm({ product, onSave, onCancel }: any) {
  const [form, setForm] = useState<any>({
    name: product?.name ?? '',
    provider: product?.provider ?? '',
    pricePerDay: product?.pricePerDay ?? 0,
    description: product?.description ?? '',
    images: product?.images ?? [],
    sizes: (product?.sizes ?? []).join(','),
    colors: (product?.colors ?? []).map((c: any) => `${c.name}:${c.hex}`).join(','),
    category: product?.category ?? '',
    isAvailable: product?.isAvailable ?? true,
    isFeatured: product?.isFeatured ?? false,
  });

  const handle = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  const colorNameMap: Record<string, string> = {
    red: '#FF0000',
    blue: '#0000FF',
    green: '#00A86B',
    black: '#000000',
    white: '#FFFFFF',
    pink: '#FFC0CB',
    purple: '#800080',
    yellow: '#FFD700',
    orange: '#FFA500',
    grey: '#808080',
    gray: '#808080',
    brown: '#8B4513',
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    Promise.all(
      list.map((f) => new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res(String(reader.result));
        reader.readAsDataURL(f);
      }))
    ).then((urls) => {
      setForm((s: any) => ({ ...s, images: [...(s.images ?? []), ...urls] }));
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const images = Array.isArray(form.images)
          ? form.images
          : (form.images || '').split(',').map((s: string) => s.trim()).filter(Boolean);

        const sizes = form.sizes ? form.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

        const colors = form.colors
          ? form.colors.split(',').map((s: string) => s.trim()).filter(Boolean).map((entry: string) => {
              const parts = entry.split(':').map((t) => t.trim());
              const name = parts[0] || 'Color';
              const hex = parts[1] || colorNameMap[name.toLowerCase()] || '#CCCCCC';
              return { name, hex };
            })
          : [];

        const payload: any = {
          name: form.name,
          provider: form.provider,
          pricePerDay: Number(form.pricePerDay) || 0,
          description: form.description,
          images,
          sizes,
          colors,
          category: form.category,
          isAvailable: !!form.isAvailable,
          isFeatured: !!form.isFeatured,
        };
        onSave(payload);
      }}
    >
      <div className="grid grid-cols-1 gap-3">
        <input value={form.name} onChange={(e) => handle('name', e.target.value)} placeholder="Tên sản phẩm" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.provider} onChange={(e) => handle('provider', e.target.value)} placeholder="Nhà cung cấp (hiển thị)" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.pricePerDay} onChange={(e) => handle('pricePerDay', e.target.value)} placeholder="Giá / ngày" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <input value={form.category} onChange={(e) => handle('category', e.target.value)} placeholder="Danh mục" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <textarea value={form.description} onChange={(e) => handle('description', e.target.value)} placeholder="Mô tả" className="px-3 py-2 bg-accent border border-border rounded text-sm text-card-foreground placeholder:text-muted-foreground outline-none" />
        <div>
          <input value={(form.images ?? []).join(',')} onChange={(e) => handle('images', e.target.value.split(',').map((s: string) => s.trim()))} placeholder="Images (comma separated or upload files)" className="px-3 py-2 border rounded w-full mb-2" />
          <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="mb-2" />
          <div className="flex gap-2 flex-wrap mb-2">
            {(form.images ?? []).map((img: string, i: number) => (
              <div key={i} className="w-20 h-20 bg-gray-100 rounded overflow-hidden border">
                <img src={img} alt="preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <input value={form.sizes} onChange={(e) => handle('sizes', e.target.value)} placeholder="Sizes (comma)" className="px-3 py-2 border rounded" />
        <input value={form.colors} onChange={(e) => handle('colors', e.target.value)} placeholder="Colors (name or name:hex, comma)" className="px-3 py-2 border rounded" />
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

export default function ShopOwnerPage() {
  const navigate = useNavigate();
  const { products, createProduct, updateProduct, deleteProduct, isShopOwner, currentUser, setShopOwner } = useApp();
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  if (!currentUser) {
    return (
      <Shell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-4xl">🔒</div>
            <h1 className="font-display text-2xl text-card-foreground">Bạn cần đăng nhập</h1>
            <p className="text-sm text-muted-foreground max-w-md text-center">Vui lòng đăng nhập để truy cập trang chủ shop của bạn.</p>
            <div className="flex gap-3 mt-4">
              <Link to="/login" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl">Đăng nhập</Link>
              <Link to="/" className="px-6 py-2.5 border border-border text-primary rounded-xl">Về trang chủ</Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isShopOwner) {
    return (
      <Shell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-4xl">🔑</div>
            <h1 className="font-display text-2xl text-card-foreground">Trang chủ shop</h1>
            <p className="text-sm text-muted-foreground max-w-md text-center">Bạn chưa đăng ký là chủ shop. Nhấn nút bên dưới để đăng ký và bắt đầu đăng sản phẩm.</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShopOwner(true); toast.success('Bạn đã đăng ký chủ shop'); navigate('/shopowner'); }}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl"
              >
                Trở thành chủ shop
              </button>
              <Link to="/profile" className="px-6 py-2.5 border border-border text-primary rounded-xl">Trang cá nhân</Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  const ownerId = currentUser.username ?? currentUser.email ?? 'me';
  const ownerProducts = products.filter((p) => p.ownerId === ownerId);

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl">Quản lý Shop của {currentUser.username ?? currentUser.email}</h1>
          <div className="flex gap-2">
            <button onClick={() => setShowNew((s) => !s)} className="px-4 py-2 bg-primary text-primary-foreground rounded">Đăng sản phẩm mới</button>
            <button onClick={() => navigate('/')} className="px-4 py-2 border rounded">Về trang chủ</button>
          </div>
        </div>

        {showNew && (
          <div className="bg-card p-4 rounded mb-6 border">
            <h3 className="font-medium mb-3">Đăng sản phẩm</h3>
            <ProductForm
              onCancel={() => setShowNew(false)}
              onSave={(payload: any) => {
                createProduct({ ...payload, ownerId });
                toast.success('Đã đăng sản phẩm mới');
                setShowNew(false);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownerProducts.length === 0 && (
            <div className="col-span-full bg-card border rounded p-6 text-center">Bạn chưa có sản phẩm nào. Hãy đăng sản phẩm đầu tiên!</div>
          )}

          {ownerProducts.map((p) => (
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
                      toast.success('Cập nhật thành công');
                      setEditing(null);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
