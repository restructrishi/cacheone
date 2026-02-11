import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Plus } from 'lucide-react';

export function MarketingLayout() {
  return (
    <div className="min-h-screen bg-primary transition-theme">
      <header className="sticky top-0 z-10 border-b border-subtle bg-primary/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gradient">
              <Plus className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold text-primary">CACHEONE</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-primary hover:text-secondary transition-theme">
              Login
            </Link>
            <ThemeToggle />
            <Link
              to="/login"
              className="rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-white transition-theme hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
