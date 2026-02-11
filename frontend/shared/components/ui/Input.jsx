export function Input({
  label,
  type = 'text',
  error,
  className = '',
  id: idProp,
  ...props
}) {
  const id = idProp || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full rounded-lg border border-subtle bg-elevated px-3 py-2.5 text-primary
          placeholder:text-secondary transition-theme
          focus:outline-none focus:ring-2 focus:ring-[var(--accent-from)] focus:border-transparent
          disabled:opacity-50
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `.trim()}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
