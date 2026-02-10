import { Link } from 'react-router-dom';
import { Building2, Users, BarChart3, Shield, Layers } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Multi-tenant platform for
            <span className="block text-blue-400">CRM & HRMS</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Onboard and manage organizations with modular product activation. 
            Enable CRM and HRMS per organization from a single Super Admin control panel.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Login as Super Admin
            </Link>
            <a
              href="#request-demo"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-500 bg-transparent px-6 py-3 font-semibold text-white transition hover:border-slate-400 hover:bg-white/5"
            >
              Request Demo
            </a>
          </div>
        </div>
      </header>

      {/* Supported Modules */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">Supported Modules</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
          Activate CRM and HRMS per organization. Scale with a plug-and-play module architecture.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">CRM</h3>
            <p className="mt-2 text-slate-600">
              Core product. Leads, deals, and pipeline management. Enabled by default for every new organization.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">HRMS</h3>
            <p className="mt-2 text-slate-600">
              Optional add-on. Employees, attendance, and payroll. Enable per organization as needed.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">Key Benefits</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
            Built for Super Admin–driven setup and multi-tenant isolation.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">Organization-first</h3>
              <p className="mt-2 text-sm text-slate-600">
                Create and manage multiple organizations. Enable or disable modules per org in minutes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">Strict isolation</h3>
              <p className="mt-2 text-sm text-slate-600">
                Each organization’s data is isolated. Role-based access and module-level control.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">Modular & scalable</h3>
              <p className="mt-2 text-sm text-slate-600">
                Add new modules without changing core. Support 10,000+ organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login CTA (repeat) + Request Demo anchor */}
      <section id="request-demo" className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Ready to get started?</h2>
          <p className="mt-2 text-slate-600">
            Sign in as Super Admin to create organizations and manage modules.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-500"
            >
              Login as Super Admin
            </Link>
            <span className="text-slate-400">or</span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        CacheOne — Super Admin–driven organization & module setup platform
      </footer>
    </div>
  );
}
