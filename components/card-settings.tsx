import { Pressable, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { CardConversionError, generateCardId, getDisplayIdFromCardId } from '@/utils/card';
import { useSavedCard, useSaveCard } from '@/hooks/use-saved-card';
import { Fonts } from '@/constants/fonts';

type CardSettingsProps = {
    showDialog: (title: string, message: string) => void;
};

export function CardSettings({ showDialog }: CardSettingsProps) {
    const [card, setCard] = useState('');
    const { data: savedCard } = useSavedCard();
    const saveCardMutation = useSaveCard();
    const [copiedField, setCopiedField] = useState<'card' | 'display' | null>(null);
    const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const handleCopy = useCallback((value: string, field: 'card' | 'display') => {
        Clipboard.setStringAsync(value);
        setCopiedField(field);
        if (copiedTimerRef.current) {
            clearTimeout(copiedTimerRef.current);
        }
        copiedTimerRef.current = setTimeout(() => setCopiedField(null), 1000);
    }, []);

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
                            <Pressable className="flex-row items-center gap-2" onPress={() => handleCopy(savedCard, 'card')}>
                                <Ionicons name={copiedField === 'card' ? 'checkmark' : 'copy-outline'} size={16} className="text-muted-foreground" />
                                <Text testID="card-id-value" className="text-[15px] tracking-wider" style={{ fontFamily: Fonts.mono }}>
                                    {savedCard}
                                </Text>
                            </Pressable>
                            {displayId && (
                                <>
                                    <Text testID="display-id-label" variant="small" className="mt-2 text-muted-foreground">Display ID</Text>
                                    <Pressable className="flex-row items-center gap-2" onPress={() => handleCopy(displayId, 'display')}>
                                        <Ionicons name={copiedField === 'display' ? 'checkmark' : 'copy-outline'} size={16} className="text-muted-foreground" />
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
    );
}
