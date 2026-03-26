import Link from 'next/link';
import type { ArcWithTranslation } from '@/lib/types';

export function ArcCard({ arc, lang }: { arc: ArcWithTranslation; lang: string }) {
  return (
    <Link
      href={`/${lang}/${arc.slug}`}
      className="
        block rounded-2xl border border-indigo-500/20
        bg-gradient-to-br from-indigo-900/60 to-red-900/40 p-6
        transition-all duration-300 hover:border-amber-400/40 hover:from-indigo-800/60
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
      "
    >
      <div className="mb-2 text-sm font-medium uppercase tracking-widest text-amber-300">Story</div>
      <h2 className="mb-2 text-xl font-bold text-amber-100" style={{ fontFamily: 'Lora, serif' }}>
        {arc.title}
      </h2>
      <p className="text-sm leading-relaxed text-white/60">{arc.tagline}</p>
      <div className="mt-4 text-sm font-medium text-amber-400">Begin -&gt;</div>
    </Link>
  );
}
