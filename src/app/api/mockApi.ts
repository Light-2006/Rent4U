// Supports two modes:
// - Remote mock API: set `VITE_MOCK_URL` to the mock server base URL (e.g. http://localhost:4001)
// - Fallback static mode: when `VITE_MOCK_URL` is not set, use bundled `mock-data/db.json`
//   and simulate CRUD in-memory (persisting changes to localStorage during the session).

const REMOTE_BASE = import.meta.env.VITE_MOCK_URL ?? null;

// Implementation below provides the same exported functions used across the app.
import rawDb from '../../../mock-data/db.json';

const USE_REMOTE = !!REMOTE_BASE;

// Local in-memory DB (copy of the bundled data). We persist to localStorage for session state.
const LOCAL_STORAGE_KEY = 'rent4u_local_db_v1';
let localDb: any;

function loadLocalDb() {
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      // If the bundled rawDb has a dbVersion and it differs from stored one, replace local db with bundled
      const rawVer = rawDb && rawDb.dbVersion ? String(rawDb.dbVersion) : null;
      const localVer = parsed && parsed.dbVersion ? String(parsed.dbVersion) : null;
      if (rawVer && rawVer !== localVer) {
        localDb = JSON.parse(JSON.stringify(rawDb));
        persistLocalDb();
      } else {
        localDb = parsed;
      }
    } else {
      localDb = JSON.parse(JSON.stringify(rawDb));
      persistLocalDb();
    }
  } catch (e) {
    // In non-browser environments fall back to raw copy
    localDb = JSON.parse(JSON.stringify(rawDb));
  }
}

function persistLocalDb() {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localDb));
  } catch (e) {
    // ignore
  }
}

if (!USE_REMOTE) loadLocalDb();

async function remoteRequest(path: string, opts: RequestInit = {}) {
  const url = `${REMOTE_BASE}${path}`;
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  if (!res.ok) throw new Error(`Mock API error ${res.status} ${res.statusText}`);
  return res.json();
}

// Helpers for local mode
function nextId(collection: string) {
  const items = localDb[collection] || [];
  const max = items.reduce((m: number, it: any) => Math.max(m, Number(it.id) || 0), 0);
  return String(max + 1);
}

export async function fetchProducts() {
  if (USE_REMOTE) return remoteRequest('/products');
  return Promise.resolve(localDb.products.slice());
}

export async function fetchProduct(id: string) {
  if (USE_REMOTE) return remoteRequest(`/products/${id}`);
  return Promise.resolve(localDb.products.find((p: any) => String(p.id) === String(id)) || null);
}

export async function fetchUsers() {
  if (USE_REMOTE) return remoteRequest('/users');
  return Promise.resolve(localDb.users.slice());
}

export async function fetchUser(id: string) {
  if (USE_REMOTE) return remoteRequest(`/users/${id}`);
  return Promise.resolve(localDb.users.find((u: any) => String(u.id) === String(id)) || null);
}

export async function createUser(user: any) {
  if (USE_REMOTE) return remoteRequest('/users', { method: 'POST', body: JSON.stringify(user) });
  const id = nextId('users');
  const toSave = { ...user, id };
  localDb.users.push(toSave);
  persistLocalDb();
  return Promise.resolve(toSave);
}

export async function patchUser(id: string, updates: any) {
  if (USE_REMOTE) return remoteRequest(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  const idx = localDb.users.findIndex((u: any) => String(u.id) === String(id));
  if (idx === -1) throw new Error('User not found');
  localDb.users[idx] = { ...localDb.users[idx], ...updates };
  persistLocalDb();
  return Promise.resolve(localDb.users[idx]);
}

export async function deleteUser(id: string) {
  if (USE_REMOTE) return remoteRequest(`/users/${id}`, { method: 'DELETE' });
  localDb.users = localDb.users.filter((u: any) => String(u.id) !== String(id));
  persistLocalDb();
  return Promise.resolve(true);
}

export async function createProduct(product: any) {
  if (USE_REMOTE) return remoteRequest('/products', { method: 'POST', body: JSON.stringify(product) });
  const id = nextId('products');
  const toSave = { ...product, id };
  localDb.products.push(toSave);
  persistLocalDb();
  return Promise.resolve(toSave);
}

export async function updateProduct(id: string, updates: any) {
  if (USE_REMOTE) return remoteRequest(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  const idx = localDb.products.findIndex((p: any) => String(p.id) === String(id));
  if (idx === -1) throw new Error('Product not found');
  localDb.products[idx] = { ...localDb.products[idx], ...updates };
  persistLocalDb();
  return Promise.resolve(localDb.products[idx]);
}

export async function deleteProduct(id: string) {
  if (USE_REMOTE) return remoteRequest(`/products/${id}`, { method: 'DELETE' });
  localDb.products = localDb.products.filter((p: any) => String(p.id) !== String(id));
  persistLocalDb();
  return Promise.resolve(true);
}

export async function fetchOrders() {
  if (USE_REMOTE) return remoteRequest('/orders');
  return Promise.resolve(localDb.orders.slice());
}

export async function fetchOrdersForUser(userId: string) {
  if (USE_REMOTE) return remoteRequest(`/orders?userId=${encodeURIComponent(userId)}`);
  return Promise.resolve(localDb.orders.filter((o: any) => String(o.userId) === String(userId)));
}

export async function createOrder(order: any) {
  if (USE_REMOTE) return remoteRequest('/orders', { method: 'POST', body: JSON.stringify(order) });
  const id = nextId('orders');
  const toSave = { ...order, id, createdAt: new Date().toISOString() };
  localDb.orders.push(toSave);
  persistLocalDb();
  return Promise.resolve(toSave);
}

export async function patchOrder(id: string, updates: any) {
  if (USE_REMOTE) return remoteRequest(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  const idx = localDb.orders.findIndex((o: any) => String(o.id) === String(id));
  if (idx === -1) throw new Error('Order not found');
  localDb.orders[idx] = { ...localDb.orders[idx], ...updates };
  persistLocalDb();
  return Promise.resolve(localDb.orders[idx]);
}

export async function fetchReviews() {
  if (USE_REMOTE) return remoteRequest('/reviews');
  return Promise.resolve((localDb.reviews || []).slice());
}

export async function createReview(review: any) {
  if (USE_REMOTE) return remoteRequest('/reviews', { method: 'POST', body: JSON.stringify(review) });
  const id = nextId('reviews');
  const toSave = { ...review, id };
  localDb.reviews = localDb.reviews || [];
  localDb.reviews.push(toSave);
  persistLocalDb();
  return Promise.resolve(toSave);
}

export async function deleteReview(id: string) {
  if (USE_REMOTE) return remoteRequest(`/reviews/${id}`, { method: 'DELETE' });
  localDb.reviews = (localDb.reviews || []).filter((r: any) => String(r.id) !== String(id));
  persistLocalDb();
  return Promise.resolve(true);
}

export default {
  fetchProducts,
  fetchProduct,
  fetchUsers,
  fetchUser,
  createUser,
  patchUser,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
  fetchOrdersForUser,
  createOrder,
  patchOrder,
  createReview,
  deleteReview,
  fetchReviews,
};
