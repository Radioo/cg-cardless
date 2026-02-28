import {StyleSheet} from 'react-native';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';

export function CardWarning() {
    return (
        <ThemedView style={styles.warning}>
            <ThemedText style={styles.warningText}>
                No card saved. Please go to Settings to add your card.
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    warning: {
        backgroundColor: '#FFF3CD',
        padding: 12,
        borderRadius: 8,
        width: '100%',
    },
    warningText: {
        color: '#856404',
        textAlign: 'center',
    },
});
