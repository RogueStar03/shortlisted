'use client';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'system-ui', background: '#0a0a0a', color: '#fafafa' }}>
        <main style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p style={{ opacity: 0.7 }}>
            {error.digest ? `Reference: ${error.digest}` : 'A critical error occurred.'}
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{ marginTop: '1.5rem', padding: '0.625rem 1.25rem', cursor: 'pointer' }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
