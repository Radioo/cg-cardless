import {useEffect} from 'react';
import {ActivityIndicator, BackHandler, Platform, StyleSheet} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {ThemedButton} from '@/components/themed-button';
import {useThemeColor} from '@/hooks/use-theme-color';
import {useSubmitScan} from '@/hooks/use-submit-scan';
import {ScanError} from '@/utils/scan';

export default function ScanResultScreen() {
    const {url, cardId} = useLocalSearchParams<{ url: string; cardId: string }>();
    const router = useRouter();
    const errorColor = useThemeColor('error');
    const {isPending, isSuccess, isError, error, refetch} = useSubmitScan(url, cardId);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                if (Platform.OS === 'android') {
                    BackHandler.exitApp();
                } else if (Platform.OS === 'web') {
                    window.close();
                } else {
                    router.replace('/');
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

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
});
