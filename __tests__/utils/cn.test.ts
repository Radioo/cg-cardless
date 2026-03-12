import { cn } from '@/utils/cn';

// Bypass the global mock to test the real cn function
jest.unmock('@/utils/cn');

describe('cn', () => {
    it('merges class names', () => {
        const result = cn('foo', 'bar');
        expect(result).toBe('foo bar');
    });

    it('handles conditional classes', () => {
        const result = cn('base', false && 'hidden', 'visible');
        expect(result).toBe('base visible');
    });

    it('handles undefined and null', () => {
        const result = cn('base', undefined, null, 'end');
        expect(result).toBe('base end');
    });

    it('returns empty string for no args', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('deduplicates conflicting tailwind classes', () => {
        const result = cn('p-4', 'p-2');
        expect(result).toBe('p-2');
    });
});
