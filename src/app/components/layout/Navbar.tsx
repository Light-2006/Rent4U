import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

import { logoSmall, logoLight, logoDark } from '@/assets';

const NAV_LINKS = [
  { label: 'Trang chủ', to: '/' },
  {
    label: 'Sản phẩm',
    to: '/products',
    children: [
      { label: 'Đầm Dạ Hội', to: '/products?category=dam-da-hoi' },
      { label: 'Váy Liền', to: '/products?category=vay-lien' },
      { label: 'Áo Khoác', to: '/products?category=ao-khoac' },
      { label: 'Phụ Kiện', to: '/products?category=phu-kien' },
      { label: 'Streetwear', to: '/products?category=streetwear' },
      { label: 'Áo Dài', to: '/products?category=ao-dai' },
    ],
  },
  { label: 'Xu hướng', to: '/search' },
  { label: 'Liên hệ', to: '/contact' },
];

export function Navbar() {
  const { cartCount, wishlistCount, currentUser, isAuthenticated, isAdmin, isShopOwner, logout } = useApp();
  const displayName = currentUser?.username ?? currentUser?.email ?? '';
  const initials = (displayName ? displayName.split(/[@.\s]+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase() : '');
  const roleBadge = isAdmin ? 'Admin' : isShopOwner ? 'Owner' : null;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-background/80 backdrop-blur-sm'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={logoSmall} alt="Rent4U" className="w-8 h-8 object-contain rounded-lg" />
              <img src={logoLight} alt="Rent4U" className="block dark:hidden h-6 object-contain" />
              <img src={logoDark} alt="Rent4U" className="hidden dark:block h-6 object-contain" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => link.children && setMegaOpen(link.label)}
                  onMouseLeave={() => setMegaOpen(null)}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      location.pathname === link.to
                        ? 'text-primary font-medium'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={14} className={`transition-transform ${megaOpen === link.label ? 'rotate-180' : ''}`} />}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && megaOpen === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-card rounded-2xl shadow-xl border border-border p-3 w-52 z-50"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-foreground hover:bg-accent hover:text-primary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-primary hover:bg-accent transition-colors"
              >
                <Search size={18} />
              </button>

              {/* Wishlist (go straight to wishlist tab; ask to login if needed) */}
              <button
                onClick={() => {
                  const target = `/profile?tab=${encodeURIComponent('Yêu thích')}`;
                  if (isAuthenticated) navigate(target);
                  else navigate('/login', { state: { from: target } });
                }}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-primary hover:bg-accent transition-colors"
                aria-label="Yêu thích"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8B6F47] text-white text-xs rounded-full flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-primary hover:bg-accent transition-colors"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#8B6F47] text-white text-xs rounded-full flex items-center justify-center leading-none"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Profile / Login */}
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-3 px-3 py-1 bg-card border border-border rounded-xl hover:bg-accent/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-secondary-foreground">
                    {initials || <User size={14} />}
                  </div>
                  <div className="hidden md:flex flex-col leading-tight">
                    <span className="text-sm text-foreground truncate max-w-[120px]">{displayName}</span>
                    {roleBadge && <span className="text-xs text-primary">{roleBadge}</span>}
                  </div>
                </Link>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-primary hover:bg-accent transition-colors"
                  >
                    <User size={18} />
                  </Link>

                  <Link
                    to="/login"
                    className="hidden sm:flex items-center px-4 py-2 bg-[#3D2B1F] text-[#F0E8DC] text-sm rounded-xl hover:bg-[#6B5135] transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-primary hover:bg-accent transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-background"
            >
              <div className="max-w-2xl mx-auto px-4 py-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-2xl">
                    <Search size={16} className="text-muted-foreground flex-shrink-0" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm đầm dạ hội, áo khoác, phụ kiện..."
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-primary text-primary-foreground rounded-2xl text-sm hover:opacity-90 transition-colors"
                  >
                    Tìm
                  </button>
                </form>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {['Đầm dạ hội', 'Áo blazer', 'Túi xách', 'Đầm hoa'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setSearchQuery(tag); }}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full hover:opacity-90 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-background z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-display text-foreground text-lg">Menu</span>
                <button type="button" onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent">
                  <X size={18} className="text-primary" />
                </button>
              </div>
              <nav className="p-5 space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm transition-colors ${
                        location.pathname === link.to
                          ? 'bg-accent text-primary font-medium'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-4 mt-1 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            className="flex items-center px-4 py-2 rounded-xl text-xs text-muted-foreground hover:text-primary hover:bg-accent/40 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="p-5 border-t border-border space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex justify-center w-full py-3 bg-card text-foreground border border-border text-sm rounded-xl hover:bg-accent/40 transition-colors"
                    >
                      Tài khoản
                    </Link>
                    <button
                      type="button"
                      onClick={() => { try { logout(); } catch {} ; navigate('/'); }}
                      className="flex justify-center w-full py-3 border border-primary/50 text-primary text-sm rounded-xl hover:bg-accent transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex justify-center w-full py-3 bg-primary text-primary-foreground text-sm rounded-xl hover:opacity-90 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="flex justify-center w-full py-3 border border-primary/50 text-primary text-sm rounded-xl hover:bg-accent transition-colors"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
