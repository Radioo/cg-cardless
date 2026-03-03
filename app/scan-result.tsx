import {useEffect} from 'react';
import {ActivityIndicator, Platform, StyleSheet} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {ThemedButton} from '@/components/themed-button';
import {useThemeColor} from '@/hooks/use-theme-color';
import {useSubmitScan} from '@/hooks/use-submit-scan';
import {ScanError} from '@/utils/scan';
import {closeApp} from '@/utils/close-app';

export default function ScanResultScreen() {
    const {url, cardId} = useLocalSearchParams<{ url: string; cardId: string }>();
    const router = useRouter();
    const errorColor = useThemeColor('error');
    const {isPending, isSuccess, isError, error, refetch} = useSubmitScan(url, cardId);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => closeApp(router), 1000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    return (
        <ThemedView style={styles.container}>
            {isPending && <ActivityIndicator size="large"/>}
            {isSuccess && (
                <>
                    <ThemedText type="title">Success</ThemedText>
                    <ThemedText style={styles.body}>Request completed successfully.</ThemedText>
                </>
            )}
            {isError && (
                <>
                    <ThemedText style={[styles.errorText, {color: errorColor}]}>
                        {error instanceof ScanError ? error.message : 'An unexpected error occurred'}
                    </ThemedText>
                    <ThemedView style={[styles.errorBox, {borderColor: errorColor}]}>
                        <ThemedText style={[styles.errorDetail, {color: errorColor}]}>
                            {error?.name}: {error?.message}
                        </ThemedText>
                    </ThemedView>
                    <ThemedButton title="Retry" onPress={() => refetch()}/>
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
    errorBox: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        width: '100%',
    },
    errorDetail: {
        fontSize: 13,
        fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    },
});
