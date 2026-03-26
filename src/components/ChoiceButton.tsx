'use client';

import type { ChoiceWithLabel } from '@/lib/types';

interface ChoiceButtonProps {
  choice: ChoiceWithLabel;
  onSelect: (nextSceneId: string) => void;
}

export function ChoiceButton({ choice, onSelect }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(choice.next_scene_id)}
      className="
        w-full rounded-xl border border-indigo-400/20 bg-indigo-900/40 px-5 py-4 text-left
        text-sm leading-relaxed text-amber-100 transition-all duration-200
        hover:border-amber-400/30 hover:bg-indigo-800/50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
      "
    >
      {choice.label} -&gt;
    </button>
  );
}
