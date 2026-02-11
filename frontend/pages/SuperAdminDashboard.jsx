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
import { createInvite } from '@/shared/services/inviteService';
import { MODULE_LABELS } from '@/shared/constants/modules';
import { ROLES } from '@/shared/constants/roles';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { UserPlus } from 'lucide-react';
import { InviteUserDrawer } from '@/components/invite/InviteUserDrawer';

function OrgAdminDashboard({ user }) {
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [orgName, setOrgName] = useState('Your organization');
  useEffect(() => {
    if (user?.org_id) {
      getOrganisationsApi(true).then((list) => {
        const o = list?.find((x) => x.id === user.org_id);
        if (o?.name) setOrgName(o.name);
      }).catch(() => {});
    }
  }, [user?.org_id]);
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <Button variant="primary" onClick={() => setShowInviteUser(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>
      <Card>
        <p className="text-primary">Invite team members and assign them roles and module access.</p>
        <p className="mt-2 text-sm text-secondary">Use the button above to send an invite link.</p>
      </Card>
      <InviteUserDrawer
        open={showInviteUser}
        onClose={() => setShowInviteUser(false)}
        organizationId={user?.org_id}
        organisationName={orgName}
      />
    </div>
  );
}

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
  const [showInviteOrgAdmin, setShowInviteOrgAdmin] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteOrgId, setInviteOrgId] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(null);

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

  async function handleInviteOrgAdmin(e) {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess(null);
    if (!inviteEmail.trim()) {
      setInviteError('Email is required');
      return;
    }
    if (!inviteOrgId) {
      setInviteError('Organization is required');
      return;
    }
    setInviteSubmitting(true);
    try {
      const data = await createInvite({ email: inviteEmail.trim(), organizationId: inviteOrgId });
      setInviteSuccess(data.inviteLink || 'Invite sent. They can set their password via the email link.');
      setInviteEmail('');
      setInviteOrgId('');
    } catch (err) {
      setInviteError(err.message || 'Failed to send invite');
    } finally {
      setInviteSubmitting(false);
    }
  }

  if (!isSuperAdmin) {
    if (user?.role === ROLES.ORG_ADMIN) {
      return (
        <OrgAdminDashboard user={user} />
      );
    }
    return (
      <Card>
        <p className="text-primary">You do not’t have access to the Super Admin panel.</p>
        <p className="mt-2 text-sm text-secondary">Select a module from the navigation.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">Super Admin</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setShowInviteOrgAdmin(true); setInviteSuccess(null); setInviteError(''); }}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Org Admin
          </Button>
          <Button variant="primary" onClick={() => setShowCreate((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
        </div>
      </div>

      {showInviteOrgAdmin && (
        <Card>
          <h2 className="text-lg font-semibold text-primary">Invite Org Admin</h2>
          <p className="mt-1 text-sm text-secondary">They will receive an email to set their password.</p>
          <form onSubmit={handleInviteOrgAdmin} className="mt-4 max-w-md space-y-4">
            {inviteError && <p className="text-sm text-red-500">{inviteError}</p>}
            {inviteSuccess && <p className="text-sm text-[var(--accent-to)]">{inviteSuccess}</p>}
            <Input
              label="Email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="admin@organisation.com"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Organization</label>
              <select
                value={inviteOrgId}
                onChange={(e) => setInviteOrgId(e.target.value)}
                className="w-full rounded-lg border border-subtle bg-elevated px-3 py-2.5 text-primary"
                required
              >
                <option value="">Select organization</option>
                {organisations.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="gradient" disabled={inviteSubmitting}>
                {inviteSubmitting ? 'Sending…' : 'Send invite'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => { setShowInviteOrgAdmin(false); setInviteError(''); setInviteSuccess(null); }}>
                Close
              </Button>
            </div>
          </form>
        </Card>
      )}

      {showCreate && (
        <Card>
          <h2 className="text-lg font-semibold text-primary">Create Organization</h2>
          <form onSubmit={handleCreateOrg} className="mt-4 max-w-md space-y-4">
            {createError && <p className="text-sm text-red-500">{createError}</p>}
            <Input
              label="Name *"
              value={createName}
              onChange={(e) => {
                setCreateName(e.target.value);
                if (!createSlug) setCreateSlug(slugFromName(e.target.value));
              }}
              placeholder="Acme Inc"
            />
            <Input
              label="Slug"
              value={createSlug}
              onChange={(e) => setCreateSlug(e.target.value)}
              placeholder="acme-inc"
            />
            <div className="flex gap-2">
              <Button type="submit" variant="gradient" disabled={createSubmitting}>
                {createSubmitting ? 'Creating…' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreate(false);
                  setCreateError('');
                  setCreateName('');
                  setCreateSlug('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* System Status */}
      <Card>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Activity className="h-5 w-5 text-[var(--accent-to)]" />
          System Status
        </h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="rounded-lg bg-surface px-4 py-3">
            <span className="text-2xl font-bold text-primary">{organisations.length}</span>
            <span className="ml-2 text-secondary">Organizations</span>
          </div>
          <Badge variant="success" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-current" />
            Operational
          </Badge>
        </div>
      </Card>

      {/* Module Overview */}
      <Card>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Layers className="h-5 w-5 text-secondary" />
          Module Overview
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border border-subtle bg-surface p-4 transition-theme">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-gradient text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-primary">{MODULE_LABELS.organisation}</p>
              <p className="text-xs text-secondary">Core • Always enabled</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-subtle bg-surface p-4 transition-theme">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-gradient text-white">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-primary">{MODULE_LABELS.crm}</p>
              <p className="text-xs text-secondary">Default • Locked on create</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-subtle bg-surface p-4 transition-theme">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-gradient text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-primary">{MODULE_LABELS.hrms}</p>
              <p className="text-xs text-secondary">Optional • Toggle per org</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Organizations List */}
      <Card>
        <h2 className="text-lg font-semibold text-primary">Organizations</h2>
        {loading ? (
          <div className="mt-6 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : error ? (
          <p className="mt-4 text-red-500">{error}</p>
        ) : organisations.length === 0 ? (
          <p className="mt-6 text-secondary">No organizations yet. Create one to get started.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-subtle text-secondary">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Slug</th>
                  <th className="pb-3 font-medium">Active Modules</th>
                  <th className="pb-3 font-medium">Created</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organisations.map((org) => (
                  <tr key={org.id} className="border-b border-subtle transition-theme">
                    <td className="py-3 font-medium text-primary">{org.name}</td>
                    <td className="py-3 text-secondary">{org.slug}</td>
                    <td className="py-3">
                      <span className="flex flex-wrap gap-1">
                        {(org.enabled_modules || []).map((slug) => (
                          <Badge key={slug} variant="muted">
                            {MODULE_LABELS[slug] ?? slug}
                          </Badge>
                        ))}
                        {(org.enabled_modules || []).length === 0 && (
                          <span className="text-secondary">—</span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 text-secondary">
                      {org.created_at
                        ? new Date(org.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/dashboard/organisation/${org.id}`}
                        className="font-medium text-primary hover:underline"
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
      </Card>
    </div>
  );
}
