import { Link } from 'react-router-dom';

/** Placeholder: signup page. Business logic to be implemented. */
export function SignupPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Create your account</h1>
        <p className="mt-2 text-secondary text-sm">Signup flow to be implemented.</p>
      </div>
      <p className="text-sm text-secondary">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in to your workspace
        </Link>
      </p>
    </div>
  );
}
