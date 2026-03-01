import {StyleSheet, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {useEffect, useMemo, useState} from 'react';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {ThemedTextInput} from '@/components/themed-text-input';
import {ThemedButton} from '@/components/themed-button';
import {CardConversionError, generateCardId, getDisplayIdFromCardId} from '@/utils/card';
import {useSavedCard, useSaveCard} from '@/hooks/use-saved-card';
import {useFelicaEmulation} from '@/hooks/use-felica-emulation';
import {useThemeColor} from '@/hooks/use-theme-color';
import {Fonts} from '@/constants/fonts';

export default function SettingsScreen() {
    const router = useRouter();
    const [card, setCard] = useState('');
    const {data: savedCard} = useSavedCard();
    const saveCardMutation = useSaveCard();
    const mutedColor = useThemeColor('muted');
    const borderColor = useThemeColor('border');
    const felica = useFelicaEmulation(savedCard);

    const displayId = useMemo(() => {
        if (!savedCard) return null;
        try {
            return getDisplayIdFromCardId(savedCard);
        } catch (e) {
            if (e instanceof CardConversionError) return null;
            throw e;
        }
    }, [savedCard]);

    useEffect(() => {
        if (savedCard) {
            setCard(savedCard);
        }
    }, [savedCard]);

    function handleGenerate() {
        setCard(generateCardId());
    }

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
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedView style={styles.container}>
                    <ThemedText type="title">Settings</ThemedText>

                    <ThemedView style={styles.cardSection}>
                        <ThemedText type="subtitle">Card</ThemedText>
                        <ThemedText style={[styles.hint, {color: mutedColor}]}>
                            Enter a Card ID (hex) or Display ID
                        </ThemedText>
                        <ThemedTextInput
                            value={card}
                            onChangeText={setCard}
                            placeholder="Enter your card"
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                        <ThemedView style={styles.buttonRow}>
                            <ThemedButton
                                title="Generate Card"
                                variant="secondary"
                                onPress={handleGenerate}
                            />
                            <ThemedButton
                                title="Save Card"
                                onPress={handleSave}
                                disabled={saveCardMutation.isPending}
                                loading={saveCardMutation.isPending}
                            />
                        </ThemedView>
                        {savedCard && (
                            <ThemedView style={[styles.cardInfoBox, {borderColor}]}>
                                <ThemedText style={[styles.cardInfoLabel, {color: mutedColor}]}>Card ID</ThemedText>
                                <Pressable style={styles.cardInfoRow} onPress={() => Clipboard.setStringAsync(savedCard)}>
                                    <Ionicons name="copy-outline" size={16} color={mutedColor}/>
                                    <ThemedText style={styles.cardInfoValue}>{savedCard}</ThemedText>
                                </Pressable>
                                {displayId && (
                                    <>
                                        <ThemedText style={[styles.cardInfoLabel, {color: mutedColor}]}>Display ID</ThemedText>
                                        <Pressable style={styles.cardInfoRow} onPress={() => Clipboard.setStringAsync(displayId)}>
                                            <Ionicons name="copy-outline" size={16} color={mutedColor}/>
                                            <ThemedText style={styles.cardInfoValue}>
                                                {displayId.replace(/(.{4})/g, '$1 ').trim()}
                                            </ThemedText>
                                        </Pressable>
                                    </>
                                )}
                            </ThemedView>
                        )}
                    </ThemedView>

                    {Platform.OS === 'android' && felica.isSupported && (
                        <ThemedView style={styles.cardSection}>
                            <ThemedText type="subtitle">FeliCa Emulation</ThemedText>
                            {!felica.isNfcEnabled && (
                                <ThemedText style={styles.errorText}>
                                    NFC is disabled. Enable it in system settings.
                                </ThemedText>
                            )}
                            {savedCard && !felica.canEmulate && (
                                <ThemedText style={[styles.hint, {color: mutedColor}]}>
                                    Card must start with 02FE to be emulated via HCE-F.
                                </ThemedText>
                            )}
                            {felica.error && (
                                <ThemedText style={styles.errorText}>{felica.error}</ThemedText>
                            )}
                            <ThemedButton
                                title={felica.isActive ? 'Disable Emulation' : 'Enable Emulation'}
                                variant={felica.isActive ? 'secondary' : 'primary'}
                                onPress={felica.isActive ? felica.disable : felica.enable}
                                disabled={felica.loading || !felica.isActive && (!felica.canEmulate || !felica.isNfcEnabled)}
                                loading={felica.loading}
                            />
                        </ThemedView>
                    )}

                    <ThemedButton variant="secondary" title="Back" onPress={() => router.back()}/>
                </ThemedView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
        fontSize: 13,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cardInfoBox: {
        width: '100%',
        borderWidth: 1,
        padding: 16,
        gap: 4,
    },
    cardInfoLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 8,
    },
    cardInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardInfoValue: {
        fontSize: 15,
        fontFamily: Fonts.mono,
        letterSpacing: 1,
    },
    errorText: {
        fontSize: 13,
        color: '#e53e3e',
    },
});
