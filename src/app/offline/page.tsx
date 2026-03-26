export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
      <h1 className="text-3xl" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
        You&apos;re offline
      </h1>
      <p className="mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Gospel Story needs a connection to load. Come back when you&apos;re online.
      </p>
    </main>
  );
}
