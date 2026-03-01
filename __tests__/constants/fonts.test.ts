import { Fonts } from '@/constants/fonts';

describe('Fonts', () => {
    it('provides mono font family', () => {
        expect(Fonts?.mono).toBeDefined();
        expect(typeof Fonts?.mono).toBe('string');
    });

    it('provides sans font family', () => {
        expect(Fonts?.sans).toBeDefined();
    });
});
