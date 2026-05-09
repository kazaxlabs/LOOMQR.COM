'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1 className="error-title">Something went wrong</h1>
        <p className="error-message">
          We encountered an unexpected error. Please try again or contact support if the issue persists.
        </p>
        <button onClick={() => reset()} className="retry-button">
          Try Again
        </button>
      </div>
      <style jsx>{`
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
          background: var(--background, #000);
          color: var(--foreground, #fff);
          font-family: var(--font-sans, sans-serif);
          padding: 24px;
        }

        .error-content {
          max-width: 480px;
          text-align: center;
        }

        .error-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .error-message {
          font-size: 1.125rem;
          line-height: 1.6;
          opacity: 0.6;
          margin-bottom: 32px;
        }

        .retry-button {
          padding: 12px 32px;
          background: var(--primary, #fff);
          color: var(--background, #000);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .retry-button:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .retry-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
