import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Always scroll to top on route change for consistent UX
    try {
      window.scrollTo({ top: 0, left: 0 });
    } catch {}
  }, [location.pathname, location.search]);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
