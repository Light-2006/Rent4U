import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, ChevronRight, TrendingUp } from 'lucide-react';
import { Shell } from '../components/layout/Shell';
import { ProductCard } from '../components/ui/ProductCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { useApp } from '../contexts/AppContext';

const TRENDING_SEARCHES = ['Đầm dạ hội', 'Áo blazer trắng', 'Váy hoa midi', 'Trench coat', 'Túi da vintage', 'Đầm sequin'];
const RECENT_SEARCHES = ['Đầm đen dạ hội', 'Áo khoác camel', 'Mini dress hồng'];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [submitted, setSubmitted] = useState(!!searchParams.get('q'));

  const { products } = useApp();

  const results = useMemo(() => {
    if (!submitted || !query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query, submitted, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Shell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#9B8E84] mb-6">
          <Link to="/" className="hover:text-[#8B6F47] transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <span className="text-[#3D2B1F]">Tìm kiếm</span>
        </nav>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-[#C4A882] rounded-2xl shadow-sm">
              <Search size={18} className="text-[#9B8E84] flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSubmitted(false); }}
                placeholder="Tìm kiếm trang phục, phụ kiện..."
                className="flex-1 bg-transparent outline-none text-sm text-[#3D2B1F] placeholder-[#C4A882]"
              />
              {query && (
                <button type="button" onClick={() => { setQuery(''); setSubmitted(false); }} className="text-[#9B8E84] hover:text-[#6B5135]">
                  ×
                </button>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-7 py-3.5 bg-[#8B6F47] text-white rounded-2xl hover:bg-[#6B5135] transition-colors font-medium"
            >
              Tìm
            </motion.button>
          </div>
        </form>

        {!submitted ? (
          /* Discovery UI */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#8B6F47]" />
                <h2 className="font-display text-lg text-[#3D2B1F]">Xu hướng tìm kiếm</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setQuery(s); setSubmitted(true); }}
                    className="px-3.5 py-2 bg-white border border-[#EDE0D0] text-[#6B5135] text-sm rounded-xl hover:border-[#C4A882] hover:bg-[#FAF8F5] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-lg text-[#3D2B1F] mb-4">Tìm kiếm gần đây</h2>
              <div className="space-y-2">
                {RECENT_SEARCHES.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setQuery(s); setSubmitted(true); }}
                    className="flex items-center gap-3 w-full py-2.5 px-3 rounded-xl hover:bg-[#FAF8F5] text-left transition-colors group"
                  >
                    <Search size={14} className="text-[#C4A882] flex-shrink-0" />
                    <span className="text-sm text-[#6B5135] flex-1">{s}</span>
                    <span className="text-xs text-[#C4A882] opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-[#9B8E84]">
                  Kết quả tìm kiếm cho{' '}
                  <span className="font-medium text-[#3D2B1F]">"{query}"</span>
                </p>
                <p className="text-xs text-[#9B8E84] mt-0.5">
                  {results.length === 0 ? 'Không tìm thấy kết quả' : `${results.length} sản phẩm`}
                </p>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="w-20 h-20 bg-[#F0E8DC] rounded-full flex items-center justify-center text-3xl">🔍</div>
                <h3 className="font-display text-2xl text-[#3D2B1F]">Không tìm thấy "{query}"</h3>
                <p className="text-sm text-[#9B8E84] max-w-sm">
                  Hãy thử từ khóa khác hoặc xem các xu hướng dưới đây
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {TRENDING_SEARCHES.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); setSubmitted(true); }}
                      className="px-3.5 py-1.5 bg-[#F0E8DC] text-[#6B5135] text-xs rounded-xl hover:bg-[#EDE0D0] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl w-full">
                  {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}
