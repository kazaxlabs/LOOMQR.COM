import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="status-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <Link href="/" className="home-link">
          Return Home
        </Link>
      </div>
      <style jsx>{`
        .not-found-container {
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

        .not-found-content {
          max-width: 480px;
          text-align: center;
        }

        .status-code {
          font-size: 8rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 8px;
          background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .not-found-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .not-found-message {
          font-size: 1.125rem;
          line-height: 1.6;
          opacity: 0.6;
          margin-bottom: 32px;
        }

        .home-link {
          display: inline-block;
          padding: 12px 32px;
          background: var(--primary, #fff);
          color: var(--background, #000);
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s, opacity 0.2s;
        }

        .home-link:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .home-link:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
