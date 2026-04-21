'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--sl-text)' }}>
      <h1 style={{ fontFamily: 'var(--sl-font-serif)', fontStyle: 'italic' }}>
        Something went wrong
      </h1>
      <p style={{ color: 'var(--sl-text-muted)', marginTop: '0.5rem' }}>
        {error.digest ? `Reference: ${error.digest}` : 'Please try again.'}
      </p>
      <button
        onClick={() => unstable_retry()}
        style={{
          marginTop: '1.5rem',
          padding: '0.625rem 1.25rem',
          background: 'var(--sl-accent)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--sl-radius-md)',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </main>
  );
}
