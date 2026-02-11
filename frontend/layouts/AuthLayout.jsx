import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-primary flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 w-full max-w-lg mx-auto">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
      <div className="hidden lg:flex flex-1 bg-surface flex-col justify-center px-12 py-16 border-l border-subtle">
        <div className="max-w-md">
          <BadgePill className="mb-6">Enterprise-grade, boardroom-ready</BadgePill>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-to)]" />
            <h2 className="text-sm font-medium uppercase tracking-wider text-secondary">
              Secure by design
            </h2>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-3">
            Quietly powerful. Deliberately governed.
          </h3>
          <p className="text-secondary text-sm leading-relaxed mb-8">
            CacheOne operates as the connective tissue between organisations, modules, and access
            control—so your platform runs as a single, accountable system.
          </p>
          <div className="space-y-4">
            <AuthFeatureCard
              title="Security & integrity"
              text="Role-based access with clear separation. Module-level enablement per organisation. Policy-aware controls."
            />
            <AuthFeatureCard
              title="Performance & scale"
              text="Designed for multi-tenant, multi-module use. Consistent operating model across CRM and HRMS."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgePill({ children, className = '' }) {
  return (
    <span
      className={`inline-flex rounded-full border border-subtle bg-elevated px-3 py-1 text-xs text-secondary ${className}`}
    >
      {children}
    </span>
  );
}

function AuthFeatureCard({ title, text }) {
  return (
    <div className="rounded-xl border border-subtle bg-elevated/80 p-4 transition-theme">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
        {title}
      </h4>
      <p className="text-secondary text-sm leading-relaxed">{text}</p>
    </div>
  );
}
