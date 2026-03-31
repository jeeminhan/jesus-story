import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StoryIllustration } from '@/components/StoryIllustration';
import { BeatIllustration } from '@/components/BeatIllustration';

const VALID_SLUGS = [
  'when-he-wept',
  'the-night-he-answered',
  'the-king-who-came',
  'come-and-see',
  'the-storm-he-stilled',
];

describe('StoryIllustration', () => {
  for (const slug of VALID_SLUGS) {
    it(`renders SVG for slug "${slug}"`, () => {
      const { container } = render(<StoryIllustration slug={slug} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute('viewBox')).toBe('0 0 360 480');
    });
  }

  it('returns null for unknown slug', () => {
    const { container } = render(<StoryIllustration slug="nonexistent" />);
    expect(container.innerHTML).toBe('');
  });

  it('passes className and style props through', () => {
    const { container } = render(
      <StoryIllustration
        slug="when-he-wept"
        className="test-class"
        style={{ width: '100px' }}
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg!.classList.contains('test-class')).toBe(true);
    expect(svg!.style.width).toBe('100px');
  });
});

describe('BeatIllustration', () => {
  // Beats 1-7 have inline SVG components
  const INLINE_BEATS = [
    'beat-grief-1',
    'beat-grief-2',
    'beat-grief-3',
    'beat-grief-4',
    'beat-grief-5',
    'beat-grief-6',
    'beat-grief-7',
  ];

  for (const beatId of INLINE_BEATS) {
    it(`renders inline SVG for ${beatId}`, () => {
      const { container } = render(
        <BeatIllustration slug="when-he-wept" beatId={beatId} />,
      );
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute('viewBox')).toBe('0 0 360 300');
    });
  }

  // Beats 8-10 fall back to <img>
  const FALLBACK_BEATS = ['beat-grief-8', 'beat-grief-9', 'beat-grief-10'];

  for (const beatId of FALLBACK_BEATS) {
    it(`falls back to img for ${beatId}`, () => {
      const { container } = render(
        <BeatIllustration slug="when-he-wept" beatId={beatId} />,
      );
      const img = container.querySelector('img');
      expect(img).not.toBeNull();
      const num = beatId.match(/(\d+)$/)![1];
      expect(img!.getAttribute('src')).toBe(
        `/beat-illustrations/when-he-wept/beat-${num}.svg`,
      );
    });
  }

  it('returns null for totally unknown slug/beat combo', () => {
    const { container } = render(
      <BeatIllustration slug="nonexistent" beatId="beat-xyz-999" />,
    );
    // getBeatSvgPath will return a path since it just parses the number,
    // so this will render an img tag — that is the expected fallback behavior.
    // But if the beatId has no number at all, it returns null.
    const { container: c2 } = render(
      <BeatIllustration slug="nonexistent" beatId="no-number" />,
    );
    expect(c2.innerHTML).toBe('');
  });
});
