import { describe, it, expect } from 'vitest';
import {
  mockStories,
  mockBeats,
  mockBeatChoices,
  getMockStory,
  getMockBeat,
  getMockStoryWithBeats,
} from '@/lib/mock-skeletons';

describe('mock-skeletons data integrity', () => {
  // ── Beat chain validity ──

  it('every story has exactly one start beat', () => {
    for (const story of mockStories) {
      const startBeats = mockBeats.filter(
        (b) => b.story_id === story.id && b.is_start,
      );
      expect(startBeats).toHaveLength(1);
    }
  });

  it('every story has at least one end beat', () => {
    for (const story of mockStories) {
      const endBeats = mockBeats.filter(
        (b) => b.story_id === story.id && b.is_end,
      );
      expect(endBeats.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('all choices reference existing beats (beat_id and next_beat_id)', () => {
    const beatIds = new Set(mockBeats.map((b) => b.id));
    for (const choice of mockBeatChoices) {
      expect(beatIds.has(choice.beat_id)).toBe(true);
      expect(beatIds.has(choice.next_beat_id)).toBe(true);
    }
  });

  it('no orphan beats (every non-start beat is reachable from start)', () => {
    for (const story of mockStories) {
      const storyBeats = mockBeats.filter((b) => b.story_id === story.id);
      const startBeat = storyBeats.find((b) => b.is_start);
      expect(startBeat).toBeDefined();

      // BFS from start beat
      const reachable = new Set<string>();
      const queue = [startBeat!.id];
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (reachable.has(current)) continue;
        reachable.add(current);
        const choices = mockBeatChoices.filter((c) => c.beat_id === current);
        for (const choice of choices) {
          if (!reachable.has(choice.next_beat_id)) {
            queue.push(choice.next_beat_id);
          }
        }
      }

      for (const beat of storyBeats) {
        expect(reachable.has(beat.id)).toBe(true);
      }
    }
  });

  it('beat orders are sequential per story (1, 2, 3, ...)', () => {
    for (const story of mockStories) {
      const storyBeats = mockBeats
        .filter((b) => b.story_id === story.id)
        .sort((a, b) => a.order - b.order);

      for (let i = 0; i < storyBeats.length; i++) {
        expect(storyBeats[i].order).toBe(i + 1);
      }
    }
  });

  it('every story has exactly 5 beats', () => {
    for (const story of mockStories) {
      const storyBeats = mockBeats.filter((b) => b.story_id === story.id);
      expect(storyBeats).toHaveLength(5);
    }
  });

  it('all grief beats have illustration_url set', () => {
    const griefBeats = mockBeats.filter((b) => b.story_id === 'story-grief');
    for (const beat of griefBeats) {
      expect(beat.illustration_url).toBeTruthy();
      expect(beat.illustration_url).toMatch(/^\/beat-illustrations\//);
    }
  });

  // ── Check-in prompts ──

  it('every non-end beat has a checkin_prompt', () => {
    for (const story of mockStories) {
      const storyBeats = mockBeats.filter((b) => b.story_id === story.id && !b.is_end);
      for (const beat of storyBeats) {
        expect(beat.checkin_prompt).toBeTruthy();
      }
    }
  });

  it('end beats never have checkin_prompt', () => {
    const endBeats = mockBeats.filter((b) => b.is_end);
    for (const beat of endBeats) {
      expect(beat.checkin_prompt).toBeNull();
    }
  });

  // ── Scripture bounds ──

  it('every grief beat has scripture_bounds set', () => {
    const griefBeats = mockBeats.filter((b) => b.story_id === 'story-grief');
    for (const beat of griefBeats) {
      expect(beat.scripture_bounds).toBeTruthy();
    }
  });

  it('non-grief beats have scripture_bounds as null', () => {
    const nonGriefBeats = mockBeats.filter((b) => b.story_id !== 'story-grief');
    for (const beat of nonGriefBeats) {
      expect(beat.scripture_bounds).toBeNull();
    }
  });

  // ── Helper function tests ──

  it('getMockStory returns story by slug', () => {
    const story = getMockStory('when-he-wept');
    expect(story).toBeDefined();
    expect(story!.slug).toBe('when-he-wept');
    expect(story!.emotional_key).toBe('grief');
  });

  it('getMockStory returns null for unknown slug', () => {
    expect(getMockStory('nonexistent')).toBeNull();
  });

  it('getMockBeat returns beat with choices attached', () => {
    const beat = getMockBeat('beat-grief-1');
    expect(beat).toBeDefined();
    expect(beat!.choices).toHaveLength(1);
  });

  it('getMockBeat returns null for unknown beat', () => {
    expect(getMockBeat('nonexistent')).toBeNull();
  });

  it('getMockStoryWithBeats returns full story structure', () => {
    const full = getMockStoryWithBeats('when-he-wept');
    expect(full).toBeDefined();
    expect(full!.beats).toHaveLength(5);
    expect(full!.beats[0].is_start).toBe(true);
    expect(full!.beats[full!.beats.length - 1].is_end).toBe(true);
  });

  it('getMockStoryWithBeats returns null for unknown slug', () => {
    expect(getMockStoryWithBeats('nonexistent')).toBeNull();
  });

  // ── End beats have no choices ──

  it('end beats have no outgoing choices', () => {
    const endBeats = mockBeats.filter((b) => b.is_end);
    for (const beat of endBeats) {
      const outgoing = mockBeatChoices.filter((c) => c.beat_id === beat.id);
      expect(outgoing).toHaveLength(0);
    }
  });

  // ── Non-end, non-terminal beats have at least one choice ──

  it('non-end beats have at least one outgoing choice', () => {
    const nonEndBeats = mockBeats.filter((b) => !b.is_end);
    for (const beat of nonEndBeats) {
      const outgoing = mockBeatChoices.filter((c) => c.beat_id === beat.id);
      expect(outgoing.length).toBeGreaterThanOrEqual(1);
    }
  });
});
