import React, { createContext, useContext, useState, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { type Product, products as initialProducts, type Review, reviews as initialReviews, PROVIDER_AVATAR } from '../data/products';
import mockApi from '../api/mockApi';

export interface Address {
  id: string;
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'momo' | 'cod' | string;
  label?: string;
  cardHolder?: string;
  cardLast4?: string;
  expiry?: string;
  isDefault?: boolean;
}

export interface NotificationSettings {
  ordersEmail?: boolean;
  ordersSMS?: boolean;
  trends?: boolean;
  promos?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  address: Address | null;
  paymentMethod: PaymentMethod | null;
  status: 'Đang xử lý' | 'Đang giao' | 'Đang thuê' | 'Đã hoàn trả' | 'Hoàn thành' | 'Đã hủy';
  fullName?: string;
  phone?: string;
  birthDate?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  notificationSettings?: NotificationSettings;
}

export interface User {
  id: string;
  username?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  birthDate?: string;
  role: 'user' | 'shopowner' | 'admin';
  password?: string;
  createdAt?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
}

const initialUsers: User[] = [
  { id: 'u-admin', username: 'admin', email: 'admin@example.com', role: 'admin', password: 'admin', createdAt: new Date().toISOString() },
  { id: 'u-owner', username: 'owner', email: 'owner@example.com', role: 'shopowner', password: 'owner', createdAt: new Date().toISOString() },
  { id: 'u-1', username: 'minhchau', email: 'minh.chau@example.com', role: 'user', password: 'password', createdAt: new Date().toISOString() },
];

export interface CartItem {
  product: Product;
  startDate: Date | null;
  endDate: Date | null;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isShopOwner: boolean;
  setShopOwner: (flag: boolean) => void;
  currentUser: User | null;
  users: User[];
  createUser: (u: Partial<User>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  login: (opts?: { username?: string; password?: string; email?: string } ) => User | null;
  logout: () => void;
  products: Product[];
  createProduct: (p: Partial<Product>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  // addresses / payments / orders
  addAddress: (userId: string, a: Partial<Address>) => Address;
  updateAddress: (userId: string, addressId: string, updates: Partial<Address>) => void;
  deleteAddress: (userId: string, addressId: string) => void;
  addPaymentMethod: (userId: string, p: Partial<PaymentMethod>) => PaymentMethod;
  updatePaymentMethod: (userId: string, pmId: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (userId: string, pmId: string) => void;
  orders: Order[];
  createOrder: (o: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersForUser: (userId: string) => Order[];
  // reviews
  reviews: Review[];
  addReview: (r: Partial<Review>) => Review;
  deleteReview: (id: string) => void;
  getReviewsForUser: (userName: string) => Review[];
  // theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    const parsed = JSON.parse(val);
    // Dates come back as strings from JSON
    if (key === 'r4u-cart') {
      return (parsed as CartItem[]).map((item) => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate) : null,
        endDate: item.endDate ? new Date(item.endDate) : null,
      })) as unknown as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>('r4u-cart', [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadFromStorage<string[]>('r4u-wishlist', [])
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadFromStorage<boolean>('r4u-auth', false)
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    loadFromStorage<boolean>('r4u-admin', false)
  );
  const [isShopOwner, setIsShopOwner] = useState<boolean>(() =>
    loadFromStorage<boolean>('r4u-shopowner', false)
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage<User | null>('r4u-user', null)
  );
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>('r4u-products', initialProducts)
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage<User[]>('r4u-users', initialUsers)
  );

  const [reviews, setReviews] = useState<Review[]>(() =>
    loadFromStorage<Review[]>('r4u-reviews', initialReviews ?? [])
  );

  useEffect(() => {
    localStorage.setItem('r4u-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('r4u-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('r4u-auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('r4u-admin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('r4u-shopowner', JSON.stringify(isShopOwner));
  }, [isShopOwner]);

  useEffect(() => {
    localStorage.setItem('r4u-user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('r4u-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('r4u-users', JSON.stringify(users));
  }, [users]);

  // Try to load data from mock backend (json-server) if available
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [srvProducts, srvUsers, srvOrders, srvReviews] = await Promise.all([
          mockApi.fetchProducts(),
          mockApi.fetchUsers(),
          mockApi.fetchOrders(),
          mockApi.fetchReviews(),
        ]);
        if (!mounted) return;
        if (Array.isArray(srvProducts) && srvProducts.length > 0) setProducts(srvProducts as Product[]);
        if (Array.isArray(srvUsers) && srvUsers.length > 0) setUsers(srvUsers as User[]);
        if (Array.isArray(srvOrders)) setOrders(srvOrders as Order[]);
        if (Array.isArray(srvReviews)) setReviews(srvReviews as Review[]);
      } catch (err) {
        // mock server not available — continue using local data
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Reconcile currentUser to full user object if localStorage contained only partial info
  useEffect(() => {
    if (currentUser && !currentUser.id) {
      const found = users.find((u) => u.username === currentUser.username || u.email === currentUser.email);
      if (found) setCurrentUser(found);
    }
  }, [users, currentUser]);

  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage<Order[]>('r4u-orders', []));

  useEffect(() => {
    localStorage.setItem('r4u-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('r4u-reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Theme (light / dark) persisted to localStorage and applied via `.dark` class
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('r4u-theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (parsed === 'dark' || parsed === 'light') return parsed;
      }
    } catch {
      /* ignore corrupt storage */
    }
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useLayoutEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('r4u-theme', JSON.stringify(theme));
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.findIndex((i) => i.product.id === item.product.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...item };
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateCartItem = (productId: string, updates: Partial<CartItem>) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const cartTotal = cart.reduce((sum, item) => {
    if (item.startDate && item.endDate) {
      const days = Math.max(
        1,
        Math.ceil(
          (item.endDate.getTime() - item.startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      return sum + item.product.pricePerDay * days * item.quantity;
    }
    return sum + item.product.pricePerDay * item.quantity;
  }, 0);

  const login = (opts?: { username?: string; password?: string; email?: string }): User | null => {
    setIsAuthenticated(true);
    const uname = (opts?.username ?? opts?.email ?? '').toString();
    const pwd = opts?.password ?? '';

    // try to find a matching user by username or email
    const found = users.find(
      (u) => (u.username === uname || u.email === uname || u.username === opts?.username || u.email === opts?.email)
    );

    if (found && pwd && found.password === pwd) {
      setCurrentUser(found);
      setIsAdmin(found.role === 'admin');
      setIsShopOwner(found.role === 'shopowner');
      return found;
    }

    // fallback: special credentials or guest
    const isAdminLogin = uname === 'admin' && pwd === 'admin';
    const isOwnerLogin = uname === 'owner' && pwd === 'owner';
    setIsAdmin(isAdminLogin);
    setIsShopOwner(isOwnerLogin);

    if (isAdminLogin) {
      const admin = users.find((u) => u.role === 'admin') ?? null;
      if (admin) setCurrentUser(admin);
      return admin;
    }
    if (isOwnerLogin) {
      const owner = users.find((u) => u.role === 'shopowner') ?? null;
      if (owner) setCurrentUser(owner);
      return owner;
    }

    const guest: User = {
      id: `guest-${Date.now()}`,
      username: opts?.username ?? opts?.email ?? `guest${Date.now()}`,
      email: opts?.email ?? '',
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(guest);
    return null;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsShopOwner(false);
    setCurrentUser(null);
  };

  const createProduct = (p: Partial<Product>) => {
    const id = String(Date.now());
    const newP: Product = {
      id,
      name: p.name ?? 'Untitled',
      provider: p.provider ?? currentUser?.username ?? 'Admin',
      providerAvatar: p.providerAvatar ?? '',
      providerRating: p.providerRating ?? 4.5,
      providerTotalRentals: p.providerTotalRentals ?? 0,
      description: p.description ?? '',
      pricePerDay: p.pricePerDay ?? 0,
      depositAmount: p.depositAmount ?? 0,
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      category: p.category ?? 'Uncategorized',
      tags: p.tags ?? [],
      sizes: p.sizes ?? ['One Size'],
      colors: p.colors ?? [{ name: 'Default', hex: '#CCCCCC' }],
      isAvailable: p.isAvailable ?? true,
      isNew: p.isNew ?? false,
      isTrending: p.isTrending ?? false,
      isFeatured: p.isFeatured ?? false,
      images: p.images ?? [],
      condition: p.condition ?? 'Tốt',
      ownerId: p.ownerId ?? currentUser?.username ?? undefined,
    };
    setProducts((prev) => [newP, ...prev]);

    // persist to mock backend in background
    (async () => {
      try {
        const saved = await mockApi.createProduct(newP);
        setProducts((prev) => prev.map((it) => (it.id === newP.id ? saved : it)));
      } catch (e) {
        // ignore if backend not available
      }
    })();

    return newP;
  };

  const createUser = (u: Partial<User>) => {
    const id = String(Date.now());
    const user: User = {
      id,
      username: u.username ?? `user${id}`,
      email: u.email ?? '',
      role: u.role ?? 'user',
      password: u.password ?? undefined,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [user, ...prev]);
    // Auto-login the newly created user
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsAdmin(user.role === 'admin');
    setIsShopOwner(user.role === 'shopowner');
    // persist to mock backend in background
    (async () => {
      try {
        const saved = await mockApi.createUser(user);
        // replace temporary local user with saved one
        setUsers((prev) => prev.map((it) => (it.id === user.id ? saved : it)));
        setCurrentUser((prev) => (prev && prev.id === user.id ? saved : prev));
      } catch (e) {
        // ignore
      }
    })();

    return user;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((it) => (it.id === id ? { ...it, ...updates } : it)));
    setCurrentUser((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
    (async () => {
      try {
        const saved = await mockApi.patchUser(id, updates);
        if (saved) {
          setUsers((prev) => prev.map((it) => (it.id === id ? saved : it)));
          setCurrentUser((prev) => (prev && prev.id === id ? saved : prev));
        }
      } catch {}
    })();
  };

  // Reviews helpers
  const addReview = (r: Partial<Review>) => {
    const id = String(Date.now());
    const review: Review = {
      id,
      productId: r.productId ?? '',
      userName: r.userName ?? currentUser?.fullName ?? currentUser?.username ?? 'Khách',
      userAvatar: r.userAvatar ?? PROVIDER_AVATAR,
      rating: r.rating ?? 5,
      comment: r.comment ?? '',
      date: new Date().toISOString(),
      helpful: r.helpful ?? 0,
      images: r.images ?? [],
    };
    // optimistic add
    setReviews((prev) => [review, ...prev]);
    // bump product reviewCount optimistically
    const existing = products.find((p) => p.id === review.productId) ?? null;
    const newCount = (existing?.reviewCount ?? 0) + 1;
    if (existing) setProducts((prev) => prev.map((p) => (p.id === review.productId ? { ...p, reviewCount: newCount } : p)));

    (async () => {
      try {
        const saved = await mockApi.createReview(review);
        setReviews((prev) => prev.map((it) => (it.id === review.id ? saved : it)));
        // persist new reviewCount to product on backend
        try {
          await mockApi.updateProduct(review.productId, { reviewCount: newCount });
        } catch {}
      } catch (e) {}
    })();

    return review;
  };

  const deleteReview = (id: string) => {
    // find review to update product count
    const rev = reviews.find((r) => r.id === id) ?? null;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    if (rev) {
      const existing = products.find((p) => p.id === rev.productId) ?? null;
      if (existing) {
        const newCount = Math.max(0, (existing.reviewCount ?? 1) - 1);
        setProducts((prev) => prev.map((p) => (p.id === existing.id ? { ...p, reviewCount: newCount } : p)));
        (async () => {
          try {
            await mockApi.updateProduct(existing.id, { reviewCount: newCount });
          } catch {}
        })();
      }
    }
    (async () => {
      try {
        await mockApi.deleteReview(id);
      } catch (e) {}
    })();
  };

  const getReviewsForUser = (userName: string) => reviews.filter((r) => r.userName === userName);

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((it) => it.id !== id));
    (async () => {
      try {
        await mockApi.deleteUser(id);
      } catch {}
    })();
  };

  const getUserById = (id: string) => users.find((u) => u.id === id);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((it) => (it.id === id ? { ...it, ...updates } : it)));
    (async () => {
      try {
        await mockApi.updateProduct(id, updates);
      } catch {}
    })();
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((it) => it.id !== id));
    (async () => {
      try {
        await mockApi.deleteProduct(id);
      } catch {}
    })();
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  // Address / Payment / Orders helpers
  const addAddress = (userId: string, a: Partial<Address>) => {
    const id = String(Date.now());
    const addr: Address = { id, label: a.label ?? 'Địa chỉ mới', fullName: a.fullName ?? '', phone: a.phone ?? '', line1: a.line1 ?? '', line2: a.line2 ?? '', city: a.city ?? '', state: a.state ?? '', postalCode: a.postalCode ?? '', country: a.country ?? '', isDefault: a.isDefault ?? false };
    // allow passing a partial/legacy currentUser by finding matching user if needed
    const targetId = userId || (currentUser ? (users.find((u) => u.username === currentUser.username || u.email === currentUser.email) ?? null)?.id ?? '' : '');
    if (!targetId) return addr;
    const existing = users.find((u) => u.id === targetId) ?? null;
    const prevAddrs = existing?.addresses ?? [];
    const updatedPrev = addr.isDefault ? prevAddrs.map((p) => ({ ...p, isDefault: false })) : prevAddrs;
    const newAddrs = [addr, ...updatedPrev];
    setUsers((prev) => prev.map((u) => (u.id === targetId ? { ...u, addresses: newAddrs } : u)));
    setCurrentUser((prev) => (prev && prev.id === targetId ? { ...prev, addresses: newAddrs } : prev));

    // persist to backend
    (async () => {
      try {
        await mockApi.patchUser(targetId, { addresses: newAddrs });
      } catch (e) {}
    })();

    return addr;
  };

  const updateAddress = (userId: string, addressId: string, updates: Partial<Address>) => {
    const existing = users.find((u) => u.id === userId) ?? null;
    if (!existing) return;
    const addrs = (existing.addresses ?? []).map((a) => (a.id === addressId ? { ...a, ...updates } : a));
    const final = updates.isDefault ? addrs.map((a) => ({ ...a, isDefault: a.id === addressId })) : addrs;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, addresses: final } : u)));
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, addresses: final } : prev));
    (async () => {
      try {
        await mockApi.patchUser(userId, { addresses: final });
      } catch (e) {}
    })();
  };

  const deleteAddress = (userId: string, addressId: string) => {
    const existing = users.find((u) => u.id === userId) ?? null;
    if (!existing) return;
    const newAddrs = (existing.addresses ?? []).filter((a) => a.id !== addressId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, addresses: newAddrs } : u)));
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, addresses: newAddrs } : prev));
    (async () => {
      try {
        await mockApi.patchUser(userId, { addresses: newAddrs });
      } catch (e) {}
    })();
  };

  const addPaymentMethod = (userId: string, p: Partial<PaymentMethod>) => {
    const id = String(Date.now());
    const pm: PaymentMethod = { id, type: p.type ?? 'card', label: p.label ?? 'Thẻ mới', cardHolder: p.cardHolder ?? '', cardLast4: p.cardLast4 ?? '', expiry: p.expiry ?? '', isDefault: p.isDefault ?? false };
    const existing = users.find((u) => u.id === userId) ?? null;
    const prevP = existing?.paymentMethods ?? [];
    const updatedPrev = pm.isDefault ? prevP.map((q) => ({ ...q, isDefault: false })) : prevP;
    const newPms = [pm, ...updatedPrev];
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, paymentMethods: newPms } : u)));
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, paymentMethods: newPms } : prev));
    (async () => {
      try {
        await mockApi.patchUser(userId, { paymentMethods: newPms });
      } catch (e) {}
    })();
    return pm;
  };

  const updatePaymentMethod = (userId: string, pmId: string, updates: Partial<PaymentMethod>) => {
    const existing = users.find((u) => u.id === userId) ?? null;
    if (!existing) return;
    const pms = (existing.paymentMethods ?? []).map((m) => (m.id === pmId ? { ...m, ...updates } : m));
    const final = updates.isDefault ? pms.map((m) => ({ ...m, isDefault: m.id === pmId })) : pms;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, paymentMethods: final } : u)));
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, paymentMethods: final } : prev));
    (async () => {
      try {
        await mockApi.patchUser(userId, { paymentMethods: final });
      } catch (e) {}
    })();
  };

  const deletePaymentMethod = (userId: string, pmId: string) => {
    const existing = users.find((u) => u.id === userId) ?? null;
    if (!existing) return;
    const newPms = (existing.paymentMethods ?? []).filter((m) => m.id !== pmId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, paymentMethods: newPms } : u)));
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, paymentMethods: newPms } : prev));
    (async () => {
      try {
        await mockApi.patchUser(userId, { paymentMethods: newPms });
      } catch (e) {}
    })();
  };

  const createOrder = (o: Partial<Order>) => {
    const id = String(Date.now());
    // try given userId, then currentUser.id, then match users by username/email, otherwise guest
    const matchedUserId = (() => {
      if (o.userId) return o.userId;
      if (currentUser?.id) return currentUser.id;
      if (currentUser && (currentUser.username || currentUser.email)) {
        const found = users.find((u) => u.username === currentUser.username || u.email === currentUser.email);
        if (found) return found.id;
      }
      return undefined;
    })();
    const userId = matchedUserId ?? `guest-${Date.now()}`;
    const items = o.items ?? cart;
    const address = o.address ?? (currentUser?.addresses?.find((a) => a.isDefault) ?? null) ?? null;
    const paymentMethod = o.paymentMethod ?? (currentUser?.paymentMethods?.find((m) => m.isDefault) ?? null) ?? null;
    const total = o.total ?? cartTotal;
    const order: Order = {
      id,
      userId,
      items,
      address,
      paymentMethod,
      status: o.status ?? 'Đang xử lý',
      createdAt: new Date().toISOString(),
      total,
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const getOrdersForUser = (userId: string) => orders.filter((o) => o.userId === userId);

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        wishlistCount,
        cartTotal,
        isAuthenticated,
        isAdmin,
        isShopOwner,
        setShopOwner: (flag: boolean) => setIsShopOwner(flag),
        currentUser,
        users,
        createUser,
        updateUser,
        deleteUser,
        getUserById,
        login,
        logout,
        products,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        addAddress,
        updateAddress,
        deleteAddress,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        orders,
        createOrder,
        updateOrderStatus,
        getOrdersForUser,
        reviews,
        addReview,
        deleteReview,
        getReviewsForUser,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
