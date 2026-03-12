import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSubmitScan } from '@/hooks/use-submit-scan';
import { useSavedCard } from '@/hooks/use-saved-card';
import { ScanError, QR_PATTERN } from '@/utils/scan';
import { closeApp } from '@/utils/close-app';

export default function ScanResultScreen() {
    const { url } = useLocalSearchParams<{ url: string }>();
    const router = useRouter();
    const { data: cardId } = useSavedCard();
    const { isPending, isSuccess, isError, error, mutate } = useSubmitScan();

    const isValidUrl = url && QR_PATTERN.test(url);

    useEffect(() => {
        if (isValidUrl && cardId) {
            mutate({ url, cardId });
        }
    }, [isValidUrl, url, cardId, mutate]);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => closeApp(() => router.replace('/closed')), 1000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    if (!isValidUrl) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-background p-5">
                <Text variant="h1">Invalid QR Code</Text>
                <Text className="text-center text-muted-foreground">The scanned URL is not valid.</Text>
                <Button onPress={() => router.back()}>
                    <Text>Go Back</Text>
                </Button>
            </View>
        );
    }

    return (
        <View className="flex-1 items-center justify-center gap-4 bg-background p-5">
            {isPending && <ActivityIndicator size="large" />}
            {isSuccess && (
                <>
                    <Text variant="h1">Success</Text>
                    <Text className="text-center">Request completed successfully.</Text>
                </>
            )}
            {isError && (
                <>
                    <Card className="w-full">
                        <CardContent>
                            <Text variant="code" className="text-destructive">
                                {error instanceof ScanError ? error.message : 'An unexpected error occurred'}
                            </Text>
                        </CardContent>
                    </Card>
                    {cardId && (
                        <Button onPress={() => mutate({ url, cardId })}>
                            <Text>Retry</Text>
                        </Button>
                    )}
                </>
            )}
        </View>
    );
}
