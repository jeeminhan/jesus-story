export default function StoryLoading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, #09080a 0%, #0d0a05 100%)',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
        <p
          className="text-sm text-white/40"
          style={{ fontFamily: 'var(--font-narrative)' }}
        >
          Entering the story...
        </p>
      </div>
    </main>
  );
}
