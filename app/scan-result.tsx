import {ActivityIndicator, StyleSheet} from 'react-native';
import {useEffect} from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useMutation} from '@tanstack/react-query';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {ThemedButton} from '@/components/themed-button';
import {useThemeColor} from '@/hooks/use-theme-color';

export default function ScanResultScreen() {
    const {url, cardId} = useLocalSearchParams<{ url: string; cardId: string }>();
    const router = useRouter();
    const errorColor = useThemeColor({}, 'error');

    const {mutate, isPending, isSuccess, isError, error} = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${url}/${cardId}`);
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            if (!json.success) throw new Error('Unexpected response');
            return json;
        },
    });

    useEffect(() => {
        mutate();
    }, []);

    return (
        <ThemedView style={styles.container}>
            {isPending && <ActivityIndicator size="large"/>}
            {isSuccess && (
                <>
                    <ThemedText type="title">Success</ThemedText>
                    <ThemedText style={styles.body}>Request completed successfully.</ThemedText>
                    <ThemedButton title="Back to home" onPress={() => router.replace('/')}/>
                </>
            )}
            {isError && (
                <>
                    <ThemedText style={[styles.errorText, {color: errorColor}]}>{error.message}</ThemedText>
                    <ThemedButton title="Retry" onPress={() => router.replace('/')}/>
                </>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 16,
    },
    body: {
        textAlign: 'center',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
    },
});
