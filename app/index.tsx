import {ActivityIndicator, StyleSheet} from 'react-native';
import {useRouter} from 'expo-router';
import {ThemedView} from '@/components/themed-view';
import {QrScanner} from '@/components/qr-scanner';
import {Banner} from '@/components/banner';
import {ThemedButton} from '@/components/themed-button';
import {useSavedCard} from '@/hooks/use-saved-card';
import {closeApp} from '@/utils/close-app';

export default function WelcomeScreen() {
    const {data: savedCard, isLoading} = useSavedCard();
    const router = useRouter();

    const hasCard = !!savedCard?.trim();

    if (isLoading) {
        return <ThemedView style={styles.container}>
            <ActivityIndicator />
        </ThemedView>
    }

    return (
        <ThemedView style={styles.container}>
            {!hasCard && <Banner variant="warning" message="No card saved. Please go to Settings to add your card." />}
            <QrScanner cardId={savedCard ?? null} />
            <ThemedButton variant="secondary" title="Settings" onPress={() => router.push('/settings')}/>
            <ThemedButton variant="secondary" title="Test Close App" onPress={() => closeApp(router)}/>
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
