import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateAndConvertCard } from '@/utils/card';

const CARD_STORAGE_KEY = 'saved_card';
const CARD_QUERY_KEY = ['saved_card'] as const;

export function useSavedCard() {
    return useQuery({
        queryKey: CARD_QUERY_KEY,
        queryFn: () => AsyncStorage.getItem(CARD_STORAGE_KEY),
        refetchOnMount: 'always',
    });
}

export function useSaveCard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: string) => {
            const cardId = validateAndConvertCard(input);
            await AsyncStorage.setItem(CARD_STORAGE_KEY, cardId);
            return cardId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: CARD_QUERY_KEY});
        },
    });
}
