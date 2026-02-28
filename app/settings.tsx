import {StyleSheet, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator} from 'react-native';
import {useRouter} from 'expo-router';
import {useEffect, useState} from 'react';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {CardConversionError} from '@/utils/card';
import {useSavedCard, useSaveCard} from '@/hooks/use-saved-card';

export default function SettingsScreen() {
    const router = useRouter();
    const [card, setCard] = useState('');
    const {data: savedCard} = useSavedCard();
    const saveCardMutation = useSaveCard();

    useEffect(() => {
        if (savedCard) {
            setCard(savedCard);
        }
    }, [savedCard]);

    function handleSave() {
        saveCardMutation.mutate(card, {
            onSuccess: (cardId) => {
                setCard(cardId);
                Alert.alert('Saved', 'Card saved successfully.');
            },
            onError: (e) => {
                const message = e instanceof CardConversionError ? e.message : 'Invalid card';
                Alert.alert('Error', message);
            },
        });
    }

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ThemedView style={styles.container}>
                <ThemedText type="title">Settings</ThemedText>

                <ThemedView style={styles.cardSection}>
                    <ThemedText type="subtitle">Card</ThemedText>
                    <ThemedText style={styles.hint}>
                        Enter a Card ID (hex) or Display ID
                    </ThemedText>
                    <TextInput
                        style={styles.input}
                        value={card}
                        onChangeText={setCard}
                        placeholder="Enter your card"
                        placeholderTextColor="#888"
                        autoCapitalize="characters"
                        autoCorrect={false}
                    />
                    <Pressable
                        style={[styles.button, saveCardMutation.isPending && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={saveCardMutation.isPending}
                    >
                        {saveCardMutation.isPending ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <ThemedText style={styles.buttonText}>Save Card</ThemedText>
                        )}
                    </Pressable>
                    {savedCard && (
                        <ThemedText style={styles.savedLabel}>
                            Saved: {savedCard}
                        </ThemedText>
                    )}
                </ThemedView>

                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ThemedText style={styles.buttonText}>Back to Welcome</ThemedText>
                </Pressable>
            </ThemedView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 24,
    },
    cardSection: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
    },
    hint: {
        opacity: 0.6,
        fontSize: 13,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#fff',
    },
    button: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    backButton: {
        backgroundColor: '#666',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    savedLabel: {
        marginTop: 4,
        opacity: 0.7,
    },
});
