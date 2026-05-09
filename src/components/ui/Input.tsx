import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label className="input-label">{label}</label>}
        <div className="input-wrapper">
          <input
            ref={ref}
            className={`input-base ${error ? 'input-error' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="input-error-text">{error}</p>}
        {helperText && !error && <p className="input-helper-text">{helperText}</p>}

        <style jsx>{`
          .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .input-label {
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--text, #1e293b);
            margin-left: 0.25rem;
          }

          .input-wrapper {
            position: relative;
          }

          .input-base {
            width: 100%;
            padding: 0.75rem 1rem;
            background: var(--surface-raised, #f8fafc);
            border: 1px solid var(--border, rgba(0,0,0,0.1));
            border-radius: var(--radius-md, 8px);
            color: var(--text, #1e293b);
            font-size: 0.9375rem;
            font-family: inherit;
            transition: var(--transition, all 0.2s);
          }

          .input-base:focus {
            outline: none;
            border-color: var(--accent, #3b82f6);
            background: var(--surface, #ffffff);
            box-shadow: 0 0 0 4px var(--accent-soft, rgba(59,130,246,0.1));
          }

          .input-base::placeholder {
            color: var(--text-muted, #94a3b8);
          }

          .input-error {
            border-color: var(--danger, #ef4444);
          }

          .input-error:focus {
            border-color: var(--danger, #ef4444);
            box-shadow: 0 0 0 4px var(--danger-soft, rgba(239,68,68,0.1));
          }

          .input-error-text {
            font-size: 0.75rem;
            color: var(--danger, #ef4444);
            font-weight: 500;
            margin-left: 0.25rem;
          }

          .input-helper-text {
            font-size: 0.75rem;
            color: var(--text-muted, #64748b);
            margin-left: 0.25rem;
          }
        `}</style>
      </div>
    );
  }
);

Input.displayName = 'Input';
