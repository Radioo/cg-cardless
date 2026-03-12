import {
    generateCardId,
    parseCardFormat,
    cardIdFromDisplayId,
    displayIdFromCardId,
    validateAndConvertCard,
    CardConversionError,
} from '@/utils/card';

describe('generateCardId', () => {
    it('returns a 16-character HCE-F compatible hex string starting with 02FE', () => {
        const id = generateCardId();
        expect(id).toHaveLength(16);
        expect(id.startsWith('02FE')).toBe(true);
        expect(/^[0-9A-F]{16}$/.test(id)).toBe(true);
    });
});

describe('parseCardFormat', () => {
    it('identifies hex card IDs', () => {
        expect(parseCardFormat('E004AABBCCDDEE01')).toBe('card_id');
    });

    it('identifies display IDs by non-hex alpha chars', () => {
        expect(parseCardFormat('G123HJKLMNPRSTUW')).toBe('display_id');
    });

    it('throws on wrong length', () => {
        expect(() => parseCardFormat('E004')).toThrow(CardConversionError);
        expect(() => parseCardFormat('E004')).toThrow('16 characters');
    });

    it('throws on unknown format (16 chars but invalid)', () => {
    // 'I', 'O', 'Q', 'V' are not in the display ID alphabet and not hex
        expect(() => parseCardFormat('IIIIIIIIIIIIIIII')).toThrow('Unknown card format');
    });

    it('normalizes whitespace and case', () => {
        expect(parseCardFormat('e004 aabb ccdd ee01')).toBe('card_id');
    });
});

describe('cardIdFromDisplayId', () => {
    it('throws on invalid characters', () => {
        expect(() => cardIdFromDisplayId('IIIIIIIIIIIIIIII')).toThrow(CardConversionError);
    });

    it('throws on wrong length', () => {
        expect(() => cardIdFromDisplayId('ABCD')).toThrow('16 characters');
    });
});

describe('displayIdFromCardId', () => {
    it('accepts E004-prefixed card IDs', () => {
        const displayId = displayIdFromCardId('E004010000088tried');
        expect(displayId).toBeDefined();
        expect(typeof displayId).toBe('string');
    });

    it('throws on unknown prefix', () => {
        expect(() => displayIdFromCardId('FFFF000000000001')).toThrow('Unknown card type');
    });
});

describe('round-trip: cardId -> displayId -> cardId', () => {
    const testCardIds = [
        'E00401000008F3E3',
        'E00401000008F3E4',
        'E00401000008F3E5',
    ];

    it.each(testCardIds)('round-trips %s', (cardId) => {
        const displayId = displayIdFromCardId(cardId);
        expect(displayId).toHaveLength(16);
        const recovered = cardIdFromDisplayId(displayId);
        expect(recovered).toBe(cardId);
    });
});

describe('validateAndConvertCard', () => {
    it('throws on empty input', () => {
        expect(() => validateAndConvertCard('')).toThrow('empty');
        expect(() => validateAndConvertCard('   ')).toThrow('empty');
    });

    it('passes through hex card IDs', () => {
        expect(validateAndConvertCard('E00401000008F3E3')).toBe('E00401000008F3E3');
    });

    it('normalizes whitespace and case', () => {
        expect(validateAndConvertCard('e004 0100 0008 f3e3')).toBe('E00401000008F3E3');
    });

    it('converts display IDs to card IDs', () => {
        const cardId = 'E00401000008F3E3';
        const displayId = displayIdFromCardId(cardId);
        expect(validateAndConvertCard(displayId)).toBe(cardId);
    });
});
