import { NumberingConfig } from '../types/ticket';

export function generateTicketNumbers(config: NumberingConfig): string[] {
  const { prefix = '', suffix = '', startNumber = 1, totalCount = 10, digits = 4, step = 1, mode = 'sequential', customNumbers = [] } = config;

  if (mode === 'custom' && customNumbers.length > 0) {
    return customNumbers.map((num) => num.trim()).filter(Boolean);
  }

  const safeTotal = Math.max(1, Math.min(totalCount, 5000));
  const numbers: string[] = [];

  if (mode === 'sequential') {
    for (let i = 0; i < safeTotal; i++) {
      const numVal = startNumber + i * step;
      const formatted = String(numVal).padStart(digits, '0');
      numbers.push(`${prefix}${formatted}${suffix}`);
    }
  } else if (mode === 'random') {
    // Generate unique random numbers within a reasonable spread
    const maxVal = Math.max(startNumber + safeTotal * 10, Math.pow(10, digits) - 1);
    const set = new Set<number>();
    
    // Fallback if space is tight
    const availableRange = maxVal - startNumber + 1;
    if (availableRange >= safeTotal) {
      while (set.size < safeTotal) {
        const rand = Math.floor(Math.random() * (maxVal - startNumber + 1)) + startNumber;
        set.add(rand);
      }
      const sortedArray = Array.from(set).sort((a, b) => a - b);
      // Or keep randomized order
      for (const val of sortedArray) {
        const formatted = String(val).padStart(digits, '0');
        numbers.push(`${prefix}${formatted}${suffix}`);
      }
    } else {
      // sequential fallback if range is too small
      for (let i = 0; i < safeTotal; i++) {
        const numVal = startNumber + i;
        const formatted = String(numVal).padStart(digits, '0');
        numbers.push(`${prefix}${formatted}${suffix}`);
      }
    }
  }

  return numbers;
}

export function parseCustomNumbers(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
