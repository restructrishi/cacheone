export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-subtle bg-elevated p-6 transition-theme ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 text-lg font-semibold text-primary ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`text-secondary text-sm ${className}`}>{children}</div>;
}
