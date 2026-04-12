import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { AppProvider } from './contexts/AppContext';
import ThemeToggle from './components/ui/ThemeToggle';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <ThemeToggle />
      <Toaster position="bottom-right" richColors={false} closeButton />
    </AppProvider>
  );
}
