import { expect, test, type Page } from '@playwright/test';
import { EMOTIONAL_KEYS, type EmotionalKey } from '../src/lib/constants';
import { mockArcs } from '../src/lib/mock-data';

const expectedTokens: Record<
  EmotionalKey,
  {
    bg: string;
    surface: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    transitionDuration: string;
    colorScheme: 'dark' | 'light';
  }
> = {
  grief: {
    bg: '#0d0508',
    surface: '#1a0a10',
    accent: '#8b2d42',
    textPrimary: '#f0e8ec',
    textSecondary: '#c4a0ab',
    transitionDuration: '800ms',
    colorScheme: 'dark',
  },
  doubt: {
    bg: '#0a0d12',
    surface: '#131820',
    accent: '#4a6fa5',
    textPrimary: '#e8ecf0',
    textSecondary: '#8fa0b5',
    transitionDuration: '700ms',
    colorScheme: 'dark',
  },
  searching: {
    bg: '#0d0a05',
    surface: '#1a1508',
    accent: '#c4832a',
    textPrimary: '#f5ede0',
    textSecondary: '#c4a87a',
    transitionDuration: '500ms',
    colorScheme: 'dark',
  },
  curiosity: {
    bg: '#f0f7f5',
    surface: '#e0f0ec',
    accent: '#2a7a6a',
    textPrimary: '#0f2e28',
    textSecondary: '#3d6b60',
    transitionDuration: '400ms',
    colorScheme: 'light',
  },
  anger: {
    bg: '#0d0505',
    surface: '#1a0808',
    accent: '#b52020',
    textPrimary: '#f5e8e8',
    textSecondary: '#c48080',
    transitionDuration: '450ms',
    colorScheme: 'dark',
  },
};

type ThemeSnapshot = {
  bg: string;
  surface: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  transitionDuration: string;
  fontNarrative: string;
  fontUi: string;
  colorScheme: string;
};

async function setTheme(page: Page, key: EmotionalKey) {
  await page.evaluate((currentKey) => {
    document.documentElement.setAttribute('data-key', currentKey);
  }, key);
}

async function readTheme(page: Page): Promise<ThemeSnapshot> {
  return page.evaluate(() => {
    const computed = getComputedStyle(document.documentElement);
    return {
      bg: computed.getPropertyValue('--bg').trim(),
      surface: computed.getPropertyValue('--surface').trim(),
      accent: computed.getPropertyValue('--accent').trim(),
      textPrimary: computed.getPropertyValue('--text-primary').trim(),
      textSecondary: computed.getPropertyValue('--text-secondary').trim(),
      transitionDuration: computed.getPropertyValue('--transition-duration').trim(),
      fontNarrative: computed.getPropertyValue('--font-narrative').trim(),
      fontUi: computed.getPropertyValue('--font-ui').trim(),
      colorScheme: computed.colorScheme,
    };
  });
}

test('emotional token themes swap the full root contract for each key', async ({ page }) => {
  await page.goto('/en');

  for (const key of EMOTIONAL_KEYS) {
    await setTheme(page, key);
    const theme = await readTheme(page);

    expect(theme.bg).toBe(expectedTokens[key].bg);
    expect(theme.surface).toBe(expectedTokens[key].surface);
    expect(theme.accent).toBe(expectedTokens[key].accent);
    expect(theme.textPrimary).toBe(expectedTokens[key].textPrimary);
    expect(theme.textSecondary).toBe(expectedTokens[key].textSecondary);
    expect(theme.transitionDuration).toBe(expectedTokens[key].transitionDuration);
    expect(theme.colorScheme).toBe(expectedTokens[key].colorScheme);
    expect(theme.fontNarrative).toContain('Lora');
    expect(theme.fontUi).toContain('Inter');
  }
});

test('curiosity remains the only light emotional theme', async ({ page }) => {
  await page.goto('/en');

  for (const key of EMOTIONAL_KEYS) {
    await setTheme(page, key);
    const theme = await readTheme(page);

    if (key === 'curiosity') {
      expect(theme.colorScheme).toBe('light');
      expect(theme.bg).toBe(expectedTokens.curiosity.bg);
      expect(theme.textPrimary).toBe(expectedTokens.curiosity.textPrimary);
      continue;
    }

    expect(theme.colorScheme).toBe('dark');
    expect(theme.bg).not.toBe(expectedTokens.curiosity.bg);
    expect(theme.textPrimary).not.toBe(expectedTokens.curiosity.textPrimary);
  }
});

test('mock arcs cover all five emotional keys', () => {
  const keys = new Set(mockArcs.map((arc) => arc.emotional_key).filter((key): key is EmotionalKey => key !== null));

  expect(keys).toEqual(new Set(EMOTIONAL_KEYS));
});
