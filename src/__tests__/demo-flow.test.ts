import { describe, it, expect } from 'vitest';
import {
  mockBeats,
  mockBeatChoices,
  mockStories,
} from '@/lib/mock-skeletons';

describe('demo flow — story beat chains', () => {
  it('all grief beats form a connected chain from beat 1 to beat 5', () => {
    const griefBeats = mockBeats.filter((b) => b.story_id === 'story-grief');
    const griefChoices = mockBeatChoices.filter((c) =>
      c.beat_id.startsWith('beat-grief-'),
    );

    // Start from beat-grief-1 and walk all paths
    const visited = new Set<string>();
    const queue = ['beat-grief-1'];
    const endBeats: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const beat = griefBeats.find((b) => b.id === current);
      if (beat?.is_end) {
        endBeats.push(current);
        continue;
      }

      const choices = griefChoices.filter((c) => c.beat_id === current);
      for (const choice of choices) {
        queue.push(choice.next_beat_id);
      }
    }

    expect(visited.size).toBe(5);
    expect(endBeats).toEqual(['beat-grief-5']);

    for (const beat of griefBeats) {
      expect(visited.has(beat.id)).toBe(true);
    }
  });

  it('every story is a connected linear flow from start to end', () => {
    for (const story of mockStories) {
      const storyBeats = mockBeats.filter((b) => b.story_id === story.id);
      const startBeat = storyBeats.find((b) => b.is_start)!;

      const visited = new Set<string>();
      const queue = [startBeat.id];
      let foundEnd = false;

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);

        const beat = storyBeats.find((b) => b.id === current);
        if (beat?.is_end) {
          foundEnd = true;
          continue;
        }

        const choices = mockBeatChoices.filter((c) => c.beat_id === current);
        for (const choice of choices) {
          queue.push(choice.next_beat_id);
        }
      }

      expect(visited.size).toBe(storyBeats.length);
      expect(foundEnd).toBe(true);
    }
  });
});
