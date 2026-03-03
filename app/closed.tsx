import {StyleSheet} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';

export default function ClosedScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Done</ThemedText>
            <ThemedText>You can close this page now.</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
});
