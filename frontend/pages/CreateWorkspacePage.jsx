import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { api } from '@/shared/utils/api';

export function CreateWorkspacePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function slugFromName(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const s = slug.trim() || slugFromName(name);
    if (!name.trim()) {
      setError('Organisation name is required');
      return;
    }
    if (!s) {
      setError('Slug is required');
      return;
    }
    setLoading(true);
    try {
      await api('/organisations', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), slug: s }),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Create your CacheOne workspace</h1>
        <p className="mt-2 text-secondary text-sm">
          Set up your organisation to start using CRM and optional HRMS modules.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}
        <Input
          label="Organisation name"
          placeholder="Acme Inc"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slug) setSlug(slugFromName(e.target.value));
          }}
          required
        />
        <Input
          label="Workspace slug"
          placeholder="acme-inc"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <Button type="submit" variant="gradient" disabled={loading} className="w-full py-3">
          {loading ? 'Creating…' : 'Create workspace'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-secondary">
        Already have a workspace?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in to your workspace
        </Link>
      </p>
    </div>
  );
}
