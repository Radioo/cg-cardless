import { useMutation } from '@tanstack/react-query';
import { submitScan } from '@/utils/scan';

export function useSubmitScan() {
    return useMutation({
        mutationFn: ({ url, cardId }: { url: string; cardId: string }) =>
            submitScan(url, cardId),
        retry: false,
    });
}
