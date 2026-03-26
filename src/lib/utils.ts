type ClassInput =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>
  | ClassInput[];

function flattenClasses(input: ClassInput): string[] {
  if (!input) return [];
  if (typeof input === 'string' || typeof input === 'number') return [String(input)];
  if (Array.isArray(input)) return input.flatMap(flattenClasses);
  if (typeof input === 'object') {
    return Object.entries(input)
      .filter(([, value]) => Boolean(value))
      .map(([key]) => key);
  }
  return [];
}

export function cn(...inputs: ClassInput[]) {
  return inputs.flatMap(flattenClasses).join(' ');
}
