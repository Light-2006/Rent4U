const BASE = import.meta.env.VITE_MOCK_URL ?? 'http://localhost:4001';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  if (!res.ok) throw new Error(`Mock API error ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchProducts() {
  return request('/products');
}

export async function fetchProduct(id: string) {
  return request(`/products/${id}`);
}

export async function fetchUsers() {
  return request('/users');
}

export async function fetchUser(id: string) {
  return request(`/users/${id}`);
}

export async function createUser(user: any) {
  return request('/users', { method: 'POST', body: JSON.stringify(user) });
}

export async function patchUser(id: string, updates: any) {
  return request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function deleteUser(id: string) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

export async function createProduct(product: any) {
  return request('/products', { method: 'POST', body: JSON.stringify(product) });
}

export async function updateProduct(id: string, updates: any) {
  return request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function deleteProduct(id: string) {
  return request(`/products/${id}`, { method: 'DELETE' });
}

export async function fetchOrders() {
  return request('/orders');
}

export async function fetchOrdersForUser(userId: string) {
  return request(`/orders?userId=${encodeURIComponent(userId)}`);
}

export async function createOrder(order: any) {
  return request('/orders', { method: 'POST', body: JSON.stringify(order) });
}

export async function patchOrder(id: string, updates: any) {
  return request(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function fetchReviews() {
  return request('/reviews');
}

export async function createReview(review: any) {
  return request('/reviews', { method: 'POST', body: JSON.stringify(review) });
}

export async function deleteReview(id: string) {
  return request(`/reviews/${id}`, { method: 'DELETE' });
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
