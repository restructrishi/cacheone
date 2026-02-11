import { Link } from 'react-router-dom';
import { Building2, Users, BarChart3, Shield, Layers } from 'lucide-react';

export function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary">
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="text-xs font-medium uppercase tracking-wider text-secondary mb-4">
            Enterprise operating system for CRM-native organisations
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            CRM, redefined as your{' '}
            <span className="bg-accent-gradient bg-clip-text text-transparent">
              enterprise operating system.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-secondary">
            Onboard and manage organisations with modular product activation. Enable CRM and HRMS
            per organisation from a single Super Admin control panel.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg bg-accent-gradient px-6 py-3 font-semibold text-white transition-theme hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg border border-subtle bg-surface px-6 py-3 font-semibold text-primary transition-theme hover:bg-elevated"
            >
              Login as Super Admin
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-subtle bg-surface py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-primary">
            Why traditional CRMs break at enterprise scale
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-secondary">
            Multi-tenant, module-level control, and strict isolation.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <LandingCard
              icon={<Building2 className="h-6 w-6" />}
              title="Organisation-first"
              text="Create and manage multiple organisations. Enable or disable modules per org in minutes."
            />
            <LandingCard
              icon={<Shield className="h-6 w-6" />}
              title="Strict isolation"
              text="Each organisation's data is isolated. Role-based access and module-level control."
            />
            <LandingCard
              icon={<Layers className="h-6 w-6" />}
              title="Modular & scalable"
              text="Add new modules without changing core. Support 10,000+ organisations."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-subtle bg-primary py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-primary">Supported modules</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-secondary">
            Activate CRM and HRMS per organisation.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-subtle bg-elevated p-8 transition-theme">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gradient text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-primary">CRM</h3>
              <p className="mt-2 text-secondary">
                Core product. Leads, deals, and pipeline. Enabled by default for every new
                organisation.
              </p>
            </div>
            <div className="rounded-xl border border-subtle bg-elevated p-8 transition-theme">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gradient text-white">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-primary">HRMS</h3>
              <p className="mt-2 text-secondary">
                Optional add-on. Employees, attendance, and payroll. Enable per organisation as
                needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="request-demo" className="border-t border-subtle bg-surface py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-primary">Ready to get started?</h2>
          <p className="mt-2 text-secondary">
            Sign in as Super Admin to create organisations and manage modules.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex rounded-lg bg-accent-gradient px-6 py-3 font-semibold text-white transition-theme hover:opacity-90"
            >
              Login as Super Admin
            </Link>
            <button
              type="button"
              className="inline-flex rounded-lg border border-subtle bg-elevated px-6 py-3 font-semibold text-primary transition-theme hover:bg-surface"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-subtle py-6 text-center text-sm text-secondary">
        © {new Date().getFullYear()} CacheOne. Super Admin–driven organisation & module setup
        platform.
      </footer>
    </>
  );
}

function LandingCard({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-subtle bg-elevated p-6 transition-theme">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-secondary">{text}</p>
    </div>
  );
}
