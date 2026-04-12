import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Grid2X2, AlignJustify, X, ChevronRight } from 'lucide-react';
import { Shell } from '../components/layout/Shell';
import { ProductCard } from '../components/ui/ProductCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { categories } from '../data/products';
import { useApp } from '../contexts/AppContext';

const PRICE_RANGES = [
  { label: 'Dưới 200K/ngày', min: 0, max: 200000 },
  { label: '200K – 400K/ngày', min: 200000, max: 400000 },
  { label: '400K – 600K/ngày', min: 400000, max: 600000 },
  { label: 'Trên 600K/ngày', min: 600000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'newest', label: 'Mới nhất' },
];

export default function ProductListPage() {
  const [params] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.get('category') ? [params.get('category')!] : []
  );
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState('popular');
  const [loading] = useState(false);
  const app = useApp();
  const [page, setPage] = useState(1);
  const toggleCat = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const togglePrice = (i: number) =>
    setSelectedPrices((prev) =>
      prev.includes(i) ? prev.filter((p) => p !== i) : [...prev, i]
    );

  const filtered = useMemo(() => {
    const { products } = app;
    let result = [...products];
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.some((c) => {
          const slug = (s: string) =>
            s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          return slug(p.category) === c || p.tags.some((t) => slug(t) === c);
        })
      );
    }
    if (selectedPrices.length > 0) {
      result = result.filter((p) =>
        selectedPrices.some((i) => p.pricePerDay >= PRICE_RANGES[i].min && p.pricePerDay < PRICE_RANGES[i].max)
      );
    }
    if (availableOnly) result = result.filter((p) => p.isAvailable);
    const cmpId = (a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id, undefined, { numeric: true });

    switch (sort) {
      case 'popular':
        result.sort((a, b) => {
          const byReviews = b.reviewCount - a.reviewCount;
          if (byReviews !== 0) return byReviews;
          const byRating = b.rating - a.rating;
          if (byRating !== 0) return byRating;
          return cmpId(a, b);
        });
        break;
      case 'price-asc':
        result.sort((a, b) => {
          const d = a.pricePerDay - b.pricePerDay;
          return d !== 0 ? d : cmpId(a, b);
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const d = b.pricePerDay - a.pricePerDay;
          return d !== 0 ? d : cmpId(a, b);
        });
        break;
      case 'rating':
        result.sort((a, b) => {
          const byRating = b.rating - a.rating;
          if (byRating !== 0) return byRating;
          const byReviews = b.reviewCount - a.reviewCount;
          if (byReviews !== 0) return byReviews;
          return cmpId(a, b);
        });
        break;
      case 'newest': {
        const getTs = (p: { createdAt?: string; id: string }) => {
          if (p.createdAt) return new Date(p.createdAt).getTime();
          const n = Number(p.id);
          return Number.isFinite(n) ? n : 0;
        };
        result.sort((a, b) => {
          const d = getTs(b) - getTs(a);
          return d !== 0 ? d : cmpId(a, b);
        });
        break;
      }
    }
    return result;
  }, [app.products, selectedCategories, selectedPrices, availableOnly, sort]);

  // Reset page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategories, selectedPrices, availableOnly, sort, app.products]);

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Compute dynamic counts per category based on other active filters (excluding category selection)
  const countsByCategory = useMemo(() => {
    const slug = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const base = app.products.filter((p) => {
      if (selectedPrices.length > 0) {
        const ok = selectedPrices.some((i) => p.pricePerDay >= PRICE_RANGES[i].min && p.pricePerDay < PRICE_RANGES[i].max);
        if (!ok) return false;
      }
      if (availableOnly && !p.isAvailable) return false;
      return true;
    });

    const map = new Map<string, number>();
    categories.forEach((cat) => {
      const cnt = base.filter((p) => slug(p.category) === cat.id || p.tags.some((t) => slug(t) === cat.id)).length;
      map.set(cat.id, cnt);
    });
    return map;
  }, [app.products, selectedPrices, availableOnly]);

  const activeFilters =
    selectedCategories.length + selectedPrices.length + (availableOnly ? 1 : 0);

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-card-foreground mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              onClick={() => toggleCat(cat.id)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-primary border-primary'
                      : 'border-border group-hover:border-primary'
                  }`}
                  aria-hidden
                >
                  {selectedCategories.includes(cat.id) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor">
                      <path d="M2 5l2.5 2.5L8 3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-card-foreground transition-colors">
                  {cat.icon} {cat.name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{countsByCategory.get(cat.id) ?? 0}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-muted" />

      {/* Price range */}
      <div>
        <h3 className="text-sm font-medium text-card-foreground mb-3">Khoảng giá / ngày</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, i) => (
            <label key={i} onClick={() => togglePrice(i)} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  selectedPrices.includes(i)
                    ? 'bg-primary border-primary'
                    : 'border-border group-hover:border-primary'
                }`}
                aria-hidden
              >
                {selectedPrices.includes(i) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor">
                    <path d="M2 5l2.5 2.5L8 3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-card-foreground transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-muted" />

      {/* Availability */}
      <div>
        <h3 className="text-sm font-medium text-card-foreground mb-3">Trạng thái</h3>
        <label onClick={() => setAvailableOnly(!availableOnly)} className="flex items-center gap-2.5 cursor-pointer group">
          <div
            className={`w-10 h-5 rounded-full border-2 relative transition-colors flex-shrink-0 ${
              availableOnly ? 'bg-primary border-primary' : 'bg-accent border-border'
            }`}
            aria-hidden
          >
            <div
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${
                availableOnly ? 'left-5' : 'left-0.5'
              }`}
            />
          </div>
          <span className="text-sm text-muted-foreground">Chỉ hiện còn trống</span>
        </label>
      </div>

      {activeFilters > 0 && (
        <button
          onClick={() => {
            setSelectedCategories([]);
            setSelectedPrices([]);
            setAvailableOnly(false);
          }}
          className="w-full py-2.5 border border-border text-primary text-sm rounded-xl hover:bg-accent transition-colors"
        >
          Xoá tất cả bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <span className="text-card-foreground">Sản phẩm</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl text-card-foreground">Bộ sưu tập</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} sản phẩm</p>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-border bg-card rounded-xl text-sm text-muted-foreground hover:border-primary transition-colors"
          >
            <SlidersHorizontal size={15} />
            Bộ lọc
            {activeFilters > 0 && (
              <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters > 0 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-muted-foreground">Đang lọc:</span>
            {selectedCategories.map((c) => {
              const cat = categories.find((k) => k.id === c);
              return cat ? (
                <button
                  key={c}
                  onClick={() => toggleCat(c)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-accent border border-border text-muted-foreground text-xs rounded-full hover:bg-muted transition-colors"
                >
                  {cat.name} <X size={10} />
                </button>
              ) : null;
            })}
            {availableOnly && (
              <button
                onClick={() => setAvailableOnly(false)}
                className="flex items-center gap-1.5 px-3 py-1 bg-accent border border-border text-muted-foreground text-xs rounded-full hover:bg-muted transition-colors"
              >
                Còn trống <X size={10} />
              </button>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-card rounded-2xl border border-border p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-card-foreground">Bộ lọc</h3>
                {activeFilters > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="mb-5 bg-card rounded-xl border border-border px-4 py-2.5">
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-2 flex-shrink-0">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSort(opt.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition-colors whitespace-nowrap ${
                        sort === opt.value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex border border-border rounded-xl overflow-hidden flex-shrink-0 sm:ml-auto">
                  {(['grid', 'list'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setView(v)}
                      className={`px-2.5 py-1.5 transition-colors ${
                        view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {v === 'grid' ? <Grid2X2 size={14} /> : <AlignJustify size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid / List */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className={view === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-4' : 'space-y-3'}>
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 py-20 text-center"
                  >
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl">👗</div>
                    <h3 className="font-display text-card-foreground text-xl">Không tìm thấy sản phẩm</h3>
                    <p className="text-sm text-muted-foreground">Hãy thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
                    <button
                      onClick={() => { setSelectedCategories([]); setSelectedPrices([]); setAvailableOnly(false); }}
                      className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-95 transition-colors"
                    >
                      Xoá bộ lọc
                    </button>
                  </motion.div>
              ) : (
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={
                    view === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-3 gap-4'
                      : 'flex flex-col gap-3'
                  }
                >
                  {pageItems.map((product) => (
                    <ProductCard key={product.id} product={product} view={view} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary"
                  disabled={page === 1}
                >
                  Prev
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm transition-colors ${
                          p === page
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border text-muted-foreground hover:border-primary'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:border-primary"
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-card z-50 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-medium text-card-foreground">Bộ lọc</span>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="p-5">
                <SidebarContent />
              </div>
              <div className="p-5 border-t border-border">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-95 transition-colors"
                >
                  Xem {filtered.length} sản phẩm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Shell>
  );
}
