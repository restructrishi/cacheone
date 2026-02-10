import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  BarChart3,
  Users,
  Layers,
  Activity,
  Loader2,
} from 'lucide-react';
import {
  getOrganisations as getOrganisationsApi,
  createOrganisation,
} from '@/apps/organisation/services/organisationService';
import { MODULE_LABELS } from '@/shared/constants/modules';
import { ROLES } from '@/shared/constants/roles';

export function SuperAdminDashboard() {
  const { user } = useAuth();
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createSlug, setCreateSlug] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  useEffect(() => {
    if (!isSuperAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getOrganisationsApi(true);
        if (!cancelled) setOrganisations(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load organisations');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isSuperAdmin]);

  function slugFromName(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || '';
  }

  async function handleCreateOrg(e) {
    e.preventDefault();
    setCreateError('');
    if (!createName.trim()) {
      setCreateError('Name is required');
      return;
    }
    const slug = createSlug.trim() || slugFromName(createName);
    if (!slug) {
      setCreateError('Slug is required');
      return;
    }
    setCreateSubmitting(true);
    try {
      await createOrganisation({ name: createName.trim(), slug });
      setOrganisations(await getOrganisationsApi(true));
      setShowCreate(false);
      setCreateName('');
      setCreateSlug('');
    } catch (err) {
      setCreateError(err.message || 'Failed to create organization');
    } finally {
      setCreateSubmitting(false);
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-slate-600">You don’t have access to the Super Admin panel.</p>
        <p className="mt-2 text-sm text-slate-500">Select a module from the navigation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Super Admin</h1>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          Create Organization
        </button>
      </div>

      {showCreate && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Create Organization</h2>
          <form onSubmit={handleCreateOrg} className="mt-4 max-w-md space-y-4">
            {createError && (
              <p className="text-sm text-red-600">{createError}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">Name *</label>
              <input
                type="text"
                value={createName}
                onChange={(e) => {
                  setCreateName(e.target.value);
                  if (!createSlug) setCreateSlug(slugFromName(e.target.value));
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Acme Inc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Slug</label>
              <input
                type="text"
                value={createSlug}
                onChange={(e) => setCreateSlug(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="acme-inc"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {createSubmitting ? 'Creating…' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setCreateError('');
                  setCreateName('');
                  setCreateSlug('');
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* System Status */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Activity className="h-5 w-5 text-emerald-500" />
          System Status
        </h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-2xl font-bold text-slate-900">{organisations.length}</span>
            <span className="ml-2 text-slate-600">Organizations</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Operational
          </div>
        </div>
      </section>

      {/* Module Overview */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Layers className="h-5 w-5 text-slate-600" />
          Module Overview
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{MODULE_LABELS.organisation}</p>
              <p className="text-xs text-slate-500">Core • Always enabled</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{MODULE_LABELS.crm}</p>
              <p className="text-xs text-slate-500">Default • Locked on create</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{MODULE_LABELS.hrms}</p>
              <p className="text-xs text-slate-500">Optional • Toggle per org</p>
            </div>
          </div>
        </div>
      </section>

      {/* Organizations List */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Organizations</h2>
        {loading ? (
          <div className="mt-6 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <p className="mt-4 text-red-600">{error}</p>
        ) : organisations.length === 0 ? (
          <p className="mt-6 text-slate-500">No organizations yet. Create one to get started.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Slug</th>
                  <th className="pb-3 font-medium">Active Modules</th>
                  <th className="pb-3 font-medium">Created</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organisations.map((org) => (
                  <tr key={org.id} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-900">{org.name}</td>
                    <td className="py-3 text-slate-600">{org.slug}</td>
                    <td className="py-3">
                      <span className="flex flex-wrap gap-1">
                        {(org.enabled_modules || []).map((slug) => (
                          <span
                            key={slug}
                            className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                          >
                            {MODULE_LABELS[slug] ?? slug}
                          </span>
                        ))}
                        {(org.enabled_modules || []).length === 0 && (
                          <span className="text-slate-400">—</span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {org.created_at
                        ? new Date(org.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/dashboard/organisation/${org.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
