import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { api } from '@/shared/utils/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Welcome back to CacheOne</h1>
        <p className="mt-2 text-secondary text-sm">
          Sign in to continue managing organisations and modules.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}
        <Input
          label="Work email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="mt-1.5 block text-sm text-secondary">
            <button type="button" className="hover:text-primary transition-theme">
              Forgot password?
            </button>
          </span>
        </div>
        <Button type="submit" variant="gradient" disabled={loading} className="w-full py-3">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-secondary">
        First time here?{' '}
        <Link to="/create-workspace" className="font-medium text-primary hover:underline">
          Create a CacheOne workspace
        </Link>
      </p>
      <p className="mt-8 text-xs text-secondary">
        By continuing, you acknowledge that CacheOne is designed for governed, auditable
        enterprise workflows.
      </p>
    </div>
  );
}
