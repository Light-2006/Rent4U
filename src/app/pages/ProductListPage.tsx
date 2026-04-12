import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Grid2X2, AlignJustify, ChevronDown, X, ChevronRight } from 'lucide-react';
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
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    params.get('category') ? [params.get('category')!] : []
  );
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState('popular');
  const [loading] = useState(false);
  const app = useApp();

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
        selectedCategories.some((c) => p.category.toLowerCase().replace(/ /g, '-') === c || p.tags.includes(c))
      );
    }
    if (selectedPrices.length > 0) {
      result = result.filter((p) =>
        selectedPrices.some((i) => p.pricePerDay >= PRICE_RANGES[i].min && p.pricePerDay < PRICE_RANGES[i].max)
      );
    }
    if (availableOnly) result = result.filter((p) => p.isAvailable);
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case 'price-desc': result.sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    }
    return result;
  }, [selectedCategories, selectedPrices, availableOnly, sort]);

  const activeFilters =
    selectedCategories.length + selectedPrices.length + (availableOnly ? 1 : 0);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? '';

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-[#3D2B1F] mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div
                  onClick={() => toggleCat(cat.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-[#8B6F47] border-[#8B6F47]'
                      : 'border-[#C4A882] group-hover:border-[#8B6F47]'
                  }`}
                >
                  {selectedCategories.includes(cat.id) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor">
                      <path d="M2 5l2.5 2.5L8 3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-[#6B5135] group-hover:text-[#3D2B1F] transition-colors">
                  {cat.icon} {cat.name}
                </span>
              </div>
              <span className="text-xs text-[#9B8E84]">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#EDE0D0]" />

      {/* Price range */}
      <div>
        <h3 className="text-sm font-medium text-[#3D2B1F] mb-3">Khoảng giá / ngày</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, i) => (
            <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => togglePrice(i)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                  selectedPrices.includes(i)
                    ? 'bg-[#8B6F47] border-[#8B6F47]'
                    : 'border-[#C4A882] group-hover:border-[#8B6F47]'
                }`}
              >
                {selectedPrices.includes(i) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor">
                    <path d="M2 5l2.5 2.5L8 3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#6B5135] group-hover:text-[#3D2B1F] transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#EDE0D0]" />

      {/* Availability */}
      <div>
        <h3 className="text-sm font-medium text-[#3D2B1F] mb-3">Trạng thái</h3>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`w-10 h-5 rounded-full border-2 relative transition-colors flex-shrink-0 ${
              availableOnly ? 'bg-[#8B6F47] border-[#8B6F47]' : 'bg-[#F0E8DC] border-[#C4A882]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${
                availableOnly ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
          <span className="text-sm text-[#6B5135]">Chỉ hiện còn trống</span>
        </label>
      </div>

      {activeFilters > 0 && (
        <button
          onClick={() => {
            setSelectedCategories([]);
            setSelectedPrices([]);
            setAvailableOnly(false);
          }}
          className="w-full py-2.5 border border-[#C4A882] text-[#8B6F47] text-sm rounded-xl hover:bg-[#F0E8DC] transition-colors"
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
        <nav className="flex items-center gap-2 text-xs text-[#9B8E84] mb-6">
          <Link to="/" className="hover:text-[#8B6F47] transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <span className="text-[#3D2B1F]">Sản phẩm</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl text-[#3D2B1F]">Bộ sưu tập</h1>
            <p className="text-sm text-[#9B8E84] mt-1">{filtered.length} sản phẩm</p>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-[#EDE0D0] bg-white rounded-xl text-sm text-[#6B5135] hover:border-[#C4A882] transition-colors"
          >
            <SlidersHorizontal size={15} />
            Bộ lọc
            {activeFilters > 0 && (
              <span className="w-5 h-5 bg-[#8B6F47] text-white text-xs rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters > 0 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-[#9B8E84]">Đang lọc:</span>
            {selectedCategories.map((c) => {
              const cat = categories.find((k) => k.id === c);
              return cat ? (
                <button
                  key={c}
                  onClick={() => toggleCat(c)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#F0E8DC] border border-[#C4A882] text-[#6B5135] text-xs rounded-full hover:bg-[#EDE0D0] transition-colors"
                >
                  {cat.name} <X size={10} />
                </button>
              ) : null;
            })}
            {availableOnly && (
              <button
                onClick={() => setAvailableOnly(false)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#F0E8DC] border border-[#C4A882] text-[#6B5135] text-xs rounded-full hover:bg-[#EDE0D0] transition-colors"
              >
                Còn trống <X size={10} />
              </button>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#EDE0D0] p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-[#3D2B1F]">Bộ lọc</h3>
                {activeFilters > 0 && (
                  <span className="w-5 h-5 bg-[#8B6F47] text-white text-xs rounded-full flex items-center justify-center">
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
            <div className="flex items-center justify-between mb-5 bg-white rounded-xl border border-[#EDE0D0] px-4 py-2.5">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['Tất cả', 'Mới nhất', 'Đang hot', 'Còn trống'].map((tag, i) => (
                  <button
                    key={tag}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-colors whitespace-nowrap ${
                      i === 0
                        ? 'bg-[#3D2B1F] text-white'
                        : 'text-[#6B5135] hover:bg-[#F0E8DC]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Sort */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-[#EDE0D0] rounded-xl text-xs text-[#6B5135] hover:border-[#C4A882] transition-colors"
                  >
                    {sortLabel}
                    <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute right-0 top-full mt-1.5 bg-white border border-[#EDE0D0] rounded-xl shadow-lg py-1 z-20 w-44"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSort(opt.value); setSortOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-[#FAF8F5] ${
                              sort === opt.value ? 'text-[#8B6F47] font-medium' : 'text-[#6B5135]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View toggle */}
                <div className="flex border border-[#EDE0D0] rounded-xl overflow-hidden">
                  {(['grid', 'list'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-2.5 py-1.5 transition-colors ${
                        view === v ? 'bg-[#3D2B1F] text-white' : 'text-[#9B8E84] hover:bg-[#FAF8F5]'
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
                  <div className="w-16 h-16 bg-[#F0E8DC] rounded-full flex items-center justify-center text-2xl">👗</div>
                  <h3 className="font-display text-[#3D2B1F] text-xl">Không tìm thấy sản phẩm</h3>
                  <p className="text-sm text-[#9B8E84]">Hãy thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
                  <button
                    onClick={() => { setSelectedCategories([]); setSelectedPrices([]); setAvailableOnly(false); }}
                    className="px-5 py-2.5 bg-[#8B6F47] text-white rounded-xl text-sm hover:bg-[#6B5135] transition-colors"
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
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} view={view} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    className={`w-9 h-9 rounded-xl text-sm transition-colors ${
                      p === 1
                        ? 'bg-[#3D2B1F] text-white'
                        : 'border border-[#EDE0D0] text-[#6B5135] hover:border-[#C4A882]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
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
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#EDE0D0]">
                <span className="font-medium text-[#3D2B1F]">Bộ lọc</span>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FAF8F5]">
                  <X size={16} className="text-[#6B5135]" />
                </button>
              </div>
              <div className="p-5">
                <SidebarContent />
              </div>
              <div className="p-5 border-t border-[#EDE0D0]">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-3 bg-[#8B6F47] text-white rounded-xl text-sm hover:bg-[#6B5135] transition-colors"
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
