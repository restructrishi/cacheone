export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-theme';

  const variants = {
    default: 'bg-surface border border-subtle text-primary',
    success: 'badge-success',
    muted: 'bg-surface text-secondary',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`.trim()}>
      {children}
    </span>
  );
}
