'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loader">
        <div className="loader-inner"></div>
      </div>
      <p className="loading-text">Preparing your experience...</p>
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
          background: var(--background, #000);
          color: var(--foreground, #fff);
          font-family: var(--font-sans, sans-serif);
        }

        .loader {
          width: 64px;
          height: 64px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          position: relative;
          margin-bottom: 24px;
        }

        .loader-inner {
          position: absolute;
          top: -2px;
          left: -2px;
          width: 64px;
          height: 64px;
          border: 2px solid transparent;
          border-top-color: var(--primary, #fff);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .loading-text {
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          opacity: 0.6;
          animation: pulse 2s infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
