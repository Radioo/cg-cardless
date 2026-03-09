import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import {
    AlertDialog, AlertDialogAction, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { CardConversionError, generateCardId, getDisplayIdFromCardId } from '@/utils/card';
import { useSavedCard, useSaveCard } from '@/hooks/use-saved-card';
import { useFelicaEmulation } from '@/hooks/use-felica-emulation';
import { Fonts } from '@/constants/fonts';

type DialogState = {
    open: boolean;
    title: string;
    message: string;
};

export default function SettingsScreen() {
    const router = useRouter();
    const [card, setCard] = useState('');
    const { data: savedCard } = useSavedCard();
    const saveCardMutation = useSaveCard();
    const felica = useFelicaEmulation(savedCard);
    const [dialog, setDialog] = useState<DialogState>({ open: false, title: '', message: '' });

    const displayId = useMemo(() => {
        if (!savedCard) {
            return null;
        }
        try {
            return getDisplayIdFromCardId(savedCard);
        } catch (e) {
            if (e instanceof CardConversionError) {
                return null;
            }
            throw e;
        }
    }, [savedCard]);

    useEffect(() => {
        if (savedCard) {
            setCard(savedCard);
        }
    }, [savedCard]);

    function showDialog(title: string, message: string) {
        setDialog({ open: true, title, message });
    }

    function handleGenerate() {
        setCard(generateCardId());
    }

    function handleSave() {
        saveCardMutation.mutate(card, {
            onSuccess: (cardId) => {
                setCard(cardId);
                showDialog('Saved', 'Card saved successfully.');
            },
            onError: (e) => {
                const message = e instanceof CardConversionError ? e.message : 'Invalid card';
                showDialog('Error', message);
            },
        });
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerClassName="grow" keyboardShouldPersistTaps="handled">
                <View className="flex-1 items-center justify-center gap-6 bg-background p-5">
                    <Text variant="h1">Settings</Text>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Card</CardTitle>
                            <Text variant="muted">
                                Enter a Card ID (hex) or Display ID
                            </Text>
                        </CardHeader>
                        <CardContent className="gap-3">
                            <Input
                                value={card}
                                onChangeText={setCard}
                                placeholder="Enter your card"
                                autoCapitalize="characters"
                                autoCorrect={false}
                                testID="card-input"
                            />
                            <View className="flex-row gap-3">
                                <Button
                                    variant="secondary"
                                    onPress={handleGenerate}
                                    testID="generate-card-btn"
                                >
                                    <Text>Generate Card</Text>
                                </Button>
                                <Button
                                    onPress={handleSave}
                                    disabled={saveCardMutation.isPending}
                                    testID="save-card-btn"
                                >
                                    <Text>{saveCardMutation.isPending ? 'Saving...' : 'Save Card'}</Text>
                                </Button>
                            </View>
                            {savedCard && (
                                <>
                                    <Separator />
                                    <View className="gap-1" testID="saved-card-info">
                                        <Text variant="small" className="text-muted-foreground">Card ID</Text>
                                        <Pressable className="flex-row items-center gap-2" onPress={() => Clipboard.setStringAsync(savedCard)}>
                                            <Ionicons name="copy-outline" size={16} className="text-muted-foreground" />
                                            <Text testID="card-id-value" className="text-[15px] tracking-wider" style={{ fontFamily: Fonts.mono }}>
                                                {savedCard}
                                            </Text>
                                        </Pressable>
                                        {displayId && (
                                            <>
                                                <Text testID="display-id-label" variant="small" className="mt-2 text-muted-foreground">Display ID</Text>
                                                <Pressable className="flex-row items-center gap-2" onPress={() => Clipboard.setStringAsync(displayId)}>
                                                    <Ionicons name="copy-outline" size={16} className="text-muted-foreground" />
                                                    <Text className="text-[15px] tracking-wider" style={{ fontFamily: Fonts.mono }}>
                                                        {displayId.replace(/(.{4})/g, '$1 ').trim()}
                                                    </Text>
                                                </Pressable>
                                            </>
                                        )}
                                    </View>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {Platform.OS === 'android' && felica.isSupported && (
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>FeliCa Emulation</CardTitle>
                            </CardHeader>
                            <CardContent className="items-center gap-3">
                                {!felica.isNfcEnabled && (
                                    <Text className="text-sm text-destructive">
                                        NFC is disabled. Enable it in system settings.
                                    </Text>
                                )}
                                {savedCard && !felica.canEmulate && (
                                    <Text variant="muted">
                                        Card must start with 02FE to be emulated via HCE-F.
                                    </Text>
                                )}
                                {felica.error && (
                                    <Text className="text-sm text-destructive">{felica.error}</Text>
                                )}
                                <Button
                                    variant={felica.isActive ? 'secondary' : 'default'}
                                    onPress={felica.isActive ? felica.disable : felica.enable}
                                    disabled={felica.loading || !felica.isActive && (!felica.canEmulate || !felica.isNfcEnabled)}
                                >
                                    <Text>{felica.isActive ? 'Disable Emulation' : 'Enable Emulation'}</Text>
                                </Button>
                                {felica.isActive && (
                                    <Text variant="muted">
                                        Keep the app open while scanning. Emulation stops when the app is closed or backgrounded.
                                    </Text>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <Button variant="secondary" onPress={() => router.back()} testID="back-btn">
                        <Text>Back</Text>
                    </Button>
                </View>
            </ScrollView>

            <AlertDialog open={dialog.open} onOpenChange={(open) => setDialog(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle testID="dialog-title">{dialog.title}</AlertDialogTitle>
                        <AlertDialogDescription testID="dialog-message">{dialog.message}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction testID="dialog-ok-btn" onPress={() => setDialog(prev => ({ ...prev, open: false }))}>
                            <Text>OK</Text>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </KeyboardAvoidingView>
    );
}
