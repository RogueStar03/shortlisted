import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--sl-text)' }}>
      <h1 style={{ fontFamily: 'var(--sl-font-serif)', fontStyle: 'italic' }}>Page not found</h1>
      <p style={{ color: 'var(--sl-text-muted)', marginTop: '0.5rem' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          padding: '0.625rem 1.25rem',
          background: 'var(--sl-accent)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: 'var(--sl-radius-md)',
        }}
      >
        Go home
      </Link>
    </main>
  );
}
