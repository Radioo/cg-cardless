import * as Clipboard from 'expo-clipboard';
import { useCallback, useRef, useState } from 'react';

const DEFAULT_DURATION_MS = 2000;

export function useCopyFeedback<CopyKey extends string = never>(durationMs = DEFAULT_DURATION_MS) {
    const [copiedKey, setCopiedKey] = useState<CopyKey | true | null>(null);
    const [copyFailed, setCopyFailed] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const copy = useCallback(async (text: string, key?: CopyKey) => {
        setCopyFailed(false);
        try {
            await Clipboard.setStringAsync(text);
            setCopiedKey(key ?? true);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => setCopiedKey(null), durationMs);
        } catch {
            setCopyFailed(true);
        }
    }, [durationMs]);

    return { copiedKey, copyFailed, copy };
}
