import {ActivityIndicator, StyleSheet} from 'react-native';
import {useRouter} from 'expo-router';
import {ThemedView} from '@/components/themed-view';
import {QrScanner} from '@/components/qr-scanner';
import {CardWarning} from '@/components/card-warning';
import {ThemedButton} from '@/components/themed-button';
import {useSavedCard} from '@/hooks/use-saved-card';

export default function WelcomeScreen() {
    const {data: savedCard, isLoading} = useSavedCard();
    const router = useRouter();

    const hasCard = savedCard !== null && savedCard !== undefined && savedCard.trim().length > 0;

    if (isLoading) {
        return <ThemedView style={styles.container}>
            <ActivityIndicator />
        </ThemedView>
    }

    return (
        <ThemedView style={styles.container}>
            {!hasCard && <CardWarning />}
            <QrScanner cardId={savedCard ?? null} />
            <ThemedButton variant="secondary" title="Settings" onPress={() => router.push('/settings')}/>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 8,
    },
});
