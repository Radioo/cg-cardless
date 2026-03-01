import {useQuery} from '@tanstack/react-query';
import {ScanError, submitScan} from '@/utils/scan';

export function useSubmitScan(url: string | undefined, cardId: string | undefined) {
    return useQuery({
        queryKey: ['scan', url, cardId],
        queryFn: () => {
            if (!url || !cardId) throw new ScanError('Missing scan parameters');
            return submitScan(url, cardId);
        },
        retry: false,
    });
}
