import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { api } from '@/shared/utils/api';

export function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [valid, setValid] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }
    fetch(`/api/auth/invite/validate?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        setValid(data.data?.valid ?? false);
        setEmail(data.data?.email ?? '');
      })
      .catch(() => setValid(false));
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to set password');
      navigate('/login', { state: { message: 'Password set. You can sign in now.' } });
    } catch (err) {
      setError(err.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  }

  if (valid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <p className="text-secondary">Validating invite link…</p>
      </div>
    );
  }
  if (!valid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-6">
        <h1 className="text-xl font-semibold text-primary">Invalid or expired link</h1>
        <p className="mt-2 text-secondary text-sm">This invite link is invalid or has expired.</p>
        <a href="/login" className="mt-6 text-sm font-medium text-primary hover:underline">
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-primary">Set your password</h1>
        <p className="mt-2 text-secondary text-sm">Create a password for {email}</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" variant="gradient" disabled={loading} className="w-full py-3">
            {loading ? 'Setting password…' : 'Set password'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-secondary">
          <a href="/login" className="hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
