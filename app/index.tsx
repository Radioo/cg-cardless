import {ActivityIndicator, StyleSheet} from 'react-native';
import {Link} from 'expo-router';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {QrScanner} from '@/components/qr-scanner';
import {CardWarning} from '@/components/card-warning';
import {useSavedCard} from '@/hooks/use-saved-card';

export default function WelcomeScreen() {
    const {data: savedCard, isLoading} = useSavedCard();

    const hasCard = savedCard !== null && savedCard !== undefined && savedCard.trim().length > 0;

    if (isLoading) {
        return <ThemedView style={styles.container}>
            <ActivityIndicator />
        </ThemedView>
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Welcome</ThemedText>
            {!hasCard && <CardWarning />}
            <QrScanner />
            <Link href="/settings" style={styles.link}>
                <ThemedText type="link">Go to Settings</ThemedText>
            </Link>
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
    link: {
        marginTop: 24,
        paddingVertical: 15,
    },
});
