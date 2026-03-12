import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { NAV_THEME } from '@/constants/theme';
import { CardConversionError, formatDisplayId, generateCardId, displayIdFromCardId } from '@/utils/card';
import { useCopyFeedback } from '@/hooks/use-copy-feedback';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSaveCard } from '@/hooks/use-saved-card';
import { Fonts } from '@/constants/fonts';

type CardSettingsProps = {
    savedCard: string | null | undefined;
    showDialog: (title: string, message: string) => void;
};

function CardSettings({ savedCard, showDialog }: CardSettingsProps) {
    const [card, setCard] = useState('');
    const saveCardMutation = useSaveCard();
    const { copiedKey: copiedField, copy } = useCopyFeedback<'card' | 'display'>(1000);
    const { isDarkColorScheme } = useColorScheme();
    const iconColor = isDarkColorScheme ? NAV_THEME.dark.mutedForeground : NAV_THEME.light.mutedForeground;

    const displayId = useMemo(() => {
        if (!savedCard) {
            return null;
        }
        try {
            return displayIdFromCardId(savedCard);
        } catch {
            return null;
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
                            <Pressable className="flex-row items-center gap-2" onPress={() => copy(savedCard, 'card')}>
                                <View className="h-4 w-4 items-center justify-center">
                                    <Ionicons
                                        name={copiedField === 'card' ? 'checkmark' : 'copy-outline'}
                                        size={16}
                                        color={iconColor}
                                    />
                                </View>
                                <Text testID="card-id-value" className="text-[15px] tracking-wider" style={{ fontFamily: Fonts.mono }}>
                                    {savedCard}
                                </Text>
                            </Pressable>
                            {displayId && (
                                <>
                                    <Text testID="display-id-label" variant="small" className="mt-2 text-muted-foreground">Display ID</Text>
                                    <Pressable className="flex-row items-center gap-2" onPress={() => copy(displayId, 'display')}>
                                        <View className="h-4 w-4 items-center justify-center">
                                            <Ionicons
                                                name={copiedField === 'display' ? 'checkmark' : 'copy-outline'}
                                                size={16}
                                                color={iconColor}
                                            />
                                        </View>
                                        <Text className="text-[15px] tracking-wider" style={{ fontFamily: Fonts.mono }}>
                                            {formatDisplayId(displayId)}
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

export { CardSettings };
