import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { createInvite } from '@/shared/services/inviteService';
import { listModules } from '@/shared/services/moduleService';

export function InviteUserDrawer({ open, onClose, organizationId, organisationName }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [moduleSlugs, setModuleSlugs] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      listModules().then(setModules).catch(() => setModules([]));
      setError('');
      setSuccess('');
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      await createInvite({
        email: email.trim(),
        organizationId,
        role,
        moduleIds: role === 'USER' ? moduleSlugs : undefined,
      });
      setSuccess('Invite sent. They can set their password via the email link.');
      setEmail('');
      setModuleSlugs([]);
    } catch (err) {
      setError(err.message || 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-subtle bg-elevated p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-primary">Invite User</h2>
        {organisationName && <p className="mt-1 text-sm text-secondary">{organisationName}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-[var(--accent-to)]">{success}</p>}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-subtle bg-elevated px-3 py-2.5 text-primary"
            >
              <option value="USER">User (module access)</option>
              <option value="ADMIN">Admin (full org)</option>
            </select>
          </div>
          {role === 'USER' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Module access</label>
              <div className="flex flex-wrap gap-2 rounded-lg border border-subtle bg-elevated p-2">
                {modules.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 text-sm text-primary">
                    <input
                      type="checkbox"
                      checked={moduleSlugs.includes(m.slug)}
                      onChange={(e) =>
                        setModuleSlugs((prev) =>
                          e.target.checked ? [...prev, m.slug] : prev.filter((s) => s !== m.slug)
                        )
                      }
                      className="rounded border-subtle"
                    />
                    {m.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit" variant="gradient" disabled={loading}>
              {loading ? 'Sending…' : 'Send invite'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
