import CryptoJS from 'crypto-js';

const DISPLAY_ID_ALPHABET = "0123456789ABCDEFGHJKLMNPRSTUWXYZ";

const DISPLAY_ID_ALPHABET_MAP: Record<string, number> = {
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
    "8": 8, "9": 9, "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15,
    "G": 16, "H": 17, "J": 18, "K": 19, "L": 20, "M": 21, "N": 22, "P": 23,
    "R": 24, "S": 25, "T": 26, "U": 27, "W": 28, "X": 29, "Y": 30, "Z": 31,
};

const TYPE_ICODE_SLI = 1;
const TYPE_FELICA = 2;

const MAGSTRIPE_PREFIX = 'E004';
const FELICA_PREFIX = '0';
const CARD_ID_LENGTH = 16;

const BITS_PER_SYMBOL = 5;
const BITS_PER_BYTE = 8;
const SYMBOL_MASK = (1 << BITS_PER_SYMBOL) - 1; // 0x1F (31)
const CHECKSUM_DATA_LENGTH = 15;

// Public key for card display ID encoding (part of the published card specification)
const CARD_DES_KEY_BYTES = [
    0x7e, 0x92, 0x4e, 0xd8, 0xd8, 0x84, 0x64, 0xc6,
    0x5c, 0xb2, 0xde, 0xea, 0xb0, 0xb0, 0xb0, 0xca,
    0x9a, 0xca, 0x90, 0xc2, 0xb2, 0xe0, 0xf2, 0x42,
];

type CardFormatType = 'display_id' | 'card_id';

export class CardConversionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CardConversionError';
    }
}

function bytesToWordArray(bytes: number[]): CryptoJS.lib.WordArray {
    const words: number[] = [];
    for (let i = 0; i < bytes.length; i += 4) {
        words.push(
            ((bytes[i] ?? 0) << 24) |
            ((bytes[i + 1] ?? 0) << 16) |
            ((bytes[i + 2] ?? 0) << 8) |
            (bytes[i + 3] ?? 0)
        );
    }
    return CryptoJS.lib.WordArray.create(words, bytes.length);
}

function wordArrayToBytes(wa: CryptoJS.lib.WordArray): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < wa.sigBytes; i++) {
        bytes.push((wa.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
    }
    return bytes;
}

function getChecksum(symbols: number[]): number {
    let checksum = 0;
    for (let i = 0; i < CHECKSUM_DATA_LENGTH; i++) {
        checksum += symbols[i] * ((i % 3) + 1);
    }
    // Reduce to single base-32 digit via repeated digit-sum
    while (checksum > SYMBOL_MASK) {
        checksum = (checksum >> BITS_PER_SYMBOL) + (checksum & SYMBOL_MASK);
    }
    return checksum;
}

/** Packs an array of 5-bit symbols into 8-bit bytes. */
function pack5Bit(symbols: number[]): number[] {
    const packed: number[] = [];
    let idx = 0;
    let bits = 0;
    const boundary = BITS_PER_BYTE - BITS_PER_SYMBOL; // 3

    for (const symbol of symbols) {
        if (packed[idx] === undefined) {
            packed[idx] = 0;
        }

        if (bits <= boundary) {
            packed[idx] |= symbol << (boundary - bits);
            if (bits === boundary) {
                idx++;
                bits = 0;
            } else {
                bits += BITS_PER_SYMBOL;
            }
        } else {
            packed[idx] |= symbol >> (bits - boundary);
            idx++;
            packed[idx] = (symbol & (SYMBOL_MASK >> (BITS_PER_SYMBOL - (bits - boundary)))) << (BITS_PER_BYTE - (bits - boundary));
            bits -= boundary;
        }
    }

    return packed;
}

/** Unpacks 8-bit bytes into an array of 5-bit symbols. */
function unpack5Bit(packed: number[]): number[] {
    const unpacked: number[] = [];
    let unpackedBytes = 0;
    let unpackedBits = 0;

    for (const byte of packed) {
        let remainingBits = BITS_PER_BYTE;

        while (remainingBits > 0) {
            const freeBits = BITS_PER_SYMBOL - unpackedBits;

            if (unpacked[unpackedBytes] === undefined) {
                unpacked[unpackedBytes] = 0;
            }

            if (remainingBits >= freeBits) {
                unpacked[unpackedBytes++] |= (byte >> (remainingBits - BITS_PER_SYMBOL + unpackedBits)) & (SYMBOL_MASK >> (BITS_PER_SYMBOL - freeBits));
                unpackedBits = 0;
                remainingBits -= freeBits;
            } else {
                const valueMasked = byte & (0xFF >> (BITS_PER_BYTE - remainingBits));
                unpacked[unpackedBytes] |= valueMasked << (BITS_PER_SYMBOL - unpackedBits - remainingBits);
                unpackedBits += remainingBits;
                remainingBits = 0;

                if (unpackedBits === BITS_PER_SYMBOL) {
                    unpackedBits = 0;
                    unpackedBytes++;
                }
            }
        }
    }

    return unpacked;
}

export function getCardFormatType(input: string): CardFormatType {
    const card = input.replace(/\s/g, '').toUpperCase();

    if (card.length !== CARD_ID_LENGTH) {
        throw new CardConversionError('Card must be 16 characters long');
    }

    if (/[GHJKLMNPRSTUWXYZ]/.test(card)) {
        return 'display_id';
    }

    if (/^[0-9A-F]+$/.test(card)) {
        return 'card_id';
    }

    throw new CardConversionError('Unknown card format');
}

export function getCardIdFromDisplayId(displayId: string): string {
    const bytes: number[] = [];

    for (const char of displayId.toUpperCase()) {
        if (char === ' ') {
            continue;
        }
        const val = DISPLAY_ID_ALPHABET_MAP[char];
        if (val === undefined) {
            throw new CardConversionError(`Invalid character in display ID: ${char}`);
        }
        bytes.push(val);
    }

    if (bytes.length !== CARD_ID_LENGTH) {
        throw new CardConversionError('Display ID must be 16 characters long');
    }

    // Validate parity, encoding, and checksum
    if (bytes[11] % 2 !== bytes[12] % 2) {
        throw new CardConversionError('Display ID parity check failed');
    }

    if (bytes[13] !== (bytes[12] ^ 1)) {
        throw new CardConversionError('Display ID encoding check failed');
    }

    if (bytes[15] !== getChecksum(bytes.slice(0, 15))) {
        throw new CardConversionError('Display ID checksum failed');
    }

    let cardType: number;
    if (bytes[14] === 1) {
        cardType = TYPE_ICODE_SLI;
    } else if (bytes[14] === 2) {
        cardType = TYPE_FELICA;
    } else {
        throw new CardConversionError('Unknown card type');
    }

    // Reverse the XOR chain to recover original 5-bit symbols
    for (let i = 13; i >= 1; i--) {
        bytes[i] ^= bytes[i - 1];
    }
    bytes[0] ^= cardType;

    // Pack 5-bit symbols into 8-bit bytes for decryption
    const trimmed = bytes.slice(0, 13);
    const packed = pack5Bit(trimmed);
    const packedBytes = packed.slice(0, 8);

    const key = bytesToWordArray(CARD_DES_KEY_BYTES);
    const iv = CryptoJS.lib.WordArray.create([0, 0], 8);
    const ciphertext = bytesToWordArray(packedBytes);

    let decrypted: CryptoJS.lib.WordArray;
    try {
        decrypted = CryptoJS.TripleDES.decrypt(
            CryptoJS.lib.CipherParams.create({ciphertext}),
            key,
            {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding, iv},
        );
    } catch {
        throw new CardConversionError('Failed to decrypt display ID');
    }

    const decryptedBytes = wordArrayToBytes(decrypted);

    let output = '';
    for (let i = decryptedBytes.length - 1; i >= 0; i--) {
        output += decryptedBytes[i].toString(16).toUpperCase().padStart(2, '0');
    }

    return output;
}

export function getDisplayIdFromCardId(cardId: string): string {
    let cardType: number;
    if (cardId.startsWith(MAGSTRIPE_PREFIX)) {
        cardType = TYPE_ICODE_SLI;
    } else if (cardId.startsWith(FELICA_PREFIX)) {
        cardType = TYPE_FELICA;
    } else {
        throw new CardConversionError('Unknown card type');
    }

    const hexBytes: number[] = [];
    for (let i = 0; i < cardId.length; i += 2) {
        hexBytes.push(parseInt(cardId.substring(i, i + 2), 16));
    }

    const reversed = hexBytes.reverse();

    const key = bytesToWordArray(CARD_DES_KEY_BYTES);
    const iv = CryptoJS.lib.WordArray.create([0, 0], 8);
    const plaintext = bytesToWordArray(reversed);

    let encrypted: CryptoJS.lib.WordArray;
    try {
        const result = CryptoJS.TripleDES.encrypt(
            plaintext,
            key,
            {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding, iv},
        );
        encrypted = result.ciphertext;
    } catch {
        throw new CardConversionError('Failed to encrypt card ID');
    }

    // Unpack encrypted bytes into 5-bit symbols
    const encryptedBytes = wordArrayToBytes(encrypted);
    const unpacked = unpack5Bit(encryptedBytes).slice(0, 13);
    const card = [...unpacked, 0, 0, 0];

    // Apply XOR chain: seed with card type, set propagation value, then forward-propagate
    card[0] ^= cardType;
    card[13] = 1;
    for (let i = 0; i <= 13; i++) {
        card[i + 1] ^= card[i];
    }

    // Append card type identifier and checksum
    card[14] = cardType;
    card[15] = getChecksum(card);

    let displayId = '';
    for (const byte of card) {
        if (byte < 0 || byte >= DISPLAY_ID_ALPHABET.length) {
            throw new CardConversionError(`Invalid byte in card ID: ${byte}`);
        }
        displayId += DISPLAY_ID_ALPHABET[byte];
    }

    return displayId;
}

export function isHceFCompatible(cardId: string): boolean {
    return /^02FE[0-9A-F]{12}$/i.test(cardId);
}

const HCEF_PREFIX = '02FE';

export function generateCardId(): string {
    const hex = '0123456789ABCDEF';
    let id = HCEF_PREFIX;
    for (let i = 0; i < CARD_ID_LENGTH - HCEF_PREFIX.length; i++) {
        id += hex[Math.floor(Math.random() * 16)];
    }
    return id;
}

export function validateAndConvertCard(input: string): string {
    const cleaned = input.replace(/\s/g, '').toUpperCase();

    if (!cleaned) {
        throw new CardConversionError('Card cannot be empty');
    }

    const formatType = getCardFormatType(cleaned);

    if (formatType === 'card_id') {
        if (!cleaned.startsWith(MAGSTRIPE_PREFIX) && !cleaned.startsWith(FELICA_PREFIX)) {
            throw new CardConversionError('Unknown card type');
        }
        return cleaned;
    }

    return getCardIdFromDisplayId(cleaned);
}
