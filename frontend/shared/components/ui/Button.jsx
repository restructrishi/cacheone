export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50';

  const variants = {
    primary: 'bg-accent-gradient text-white focus:ring-[var(--accent-from)]',
    secondary:
      'bg-surface border border-subtle text-primary hover:bg-elevated focus:ring-border-subtle',
    ghost: 'text-primary hover:bg-elevated focus:ring-border-subtle',
    gradient: 'bg-accent-gradient text-white focus:ring-[var(--accent-from)]',
  };

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`.trim();

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
