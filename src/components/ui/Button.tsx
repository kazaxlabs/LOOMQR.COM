import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <span className="spinner" />}
        <span className="btn-content">{children}</span>
        
        <style jsx>{`
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            border-radius: var(--radius-md, 8px);
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition, all 0.2s);
            border: 1px solid transparent;
            font-family: inherit;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
          }

          .btn:active {
            transform: scale(0.98);
          }

          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Variants */
          .btn-primary {
            background: var(--accent, #3b82f6);
            color: #fff;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
          }
          .btn-primary:hover:not(:disabled) {
            background: #2563eb;
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
          }

          .btn-secondary {
            background: var(--surface-raised, #f1f5f9);
            color: var(--text, #1e293b);
          }
          .btn-secondary:hover:not(:disabled) {
            background: var(--border, #e2e8f0);
          }

          .btn-outline {
            background: transparent;
            border-color: var(--border, #e2e8f0);
            color: var(--text, #1e293b);
          }
          .btn-outline:hover:not(:disabled) {
            background: var(--surface-raised, #f1f5f9);
            border-color: var(--text-muted, #94a3b8);
          }

          .btn-ghost {
            background: transparent;
            color: var(--text-muted, #64748b);
          }
          .btn-ghost:hover:not(:disabled) {
            background: var(--accent-soft, rgba(59, 130, 246, 0.05));
            color: var(--accent, #3b82f6);
          }

          .btn-danger {
            background: var(--danger, #ef4444);
            color: #fff;
          }
          .btn-danger:hover:not(:disabled) {
            background: #dc2626;
          }

          /* Sizes */
          .btn-sm { padding: 0.5rem 1rem; font-size: 0.8125rem; }
          .btn-md { padding: 0.75rem 1.5rem; font-size: 0.9375rem; }
          .btn-lg { padding: 1rem 2rem; font-size: 1rem; }
          .btn-icon { padding: 0.75rem; aspect-ratio: 1; }

          /* Loading */
          .spinner {
            width: 1rem;
            height: 1rem;
            border: 2px solid currentColor;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </button>
    );
  }
);

Button.displayName = 'Button';
