import { createBrowserRouter } from 'react-router';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ShopOwnerPage from './pages/ShopOwnerPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/products', Component: ProductListPage },
  { path: '/product/:id', Component: ProductDetailPage },
  { path: '/cart', Component: CartPage },
  { path: '/checkout', Component: CheckoutPage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/profile', Component: ProfilePage },
  { path: '/search', Component: SearchPage },
  { path: '/admin', Component: AdminPage },
  { path: '/shopowner', Component: ShopOwnerPage },
  { path: '/contact', Component: ContactPage },
  { path: '*', Component: NotFoundPage },
]);
