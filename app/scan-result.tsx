import {ActivityIndicator, StyleSheet} from 'react-native';
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
