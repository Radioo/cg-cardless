import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSubmitScan } from '@/hooks/use-submit-scan';
import { ScanError } from '@/utils/scan';
import { closeApp } from '@/utils/close-app';

export default function ScanResultScreen() {
    const { url, cardId } = useLocalSearchParams<{ url: string; cardId: string }>();
    const router = useRouter();
    const { isPending, isSuccess, isError, error, refetch } = useSubmitScan(url, cardId);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => closeApp(router), 1000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

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
                    <Text className="text-center text-destructive">
                        {error instanceof ScanError ? error.message : 'An unexpected error occurred'}
                    </Text>
                    <Card className="w-full">
                        <CardContent>
                            <Text variant="code" className="text-destructive">
                                {error?.name}: {error?.message}
                            </Text>
                        </CardContent>
                    </Card>
                    <Button onPress={() => refetch()}>
                        <Text>Retry</Text>
                    </Button>
                </>
            )}
        </View>
    );
}
