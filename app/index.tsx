import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Banner } from '@/components/banner';
import { QrScanner } from '@/components/qr-scanner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useSavedCard } from '@/hooks/use-saved-card';

export default function WelcomeScreen() {
    const { data: savedCard, isLoading } = useSavedCard();
    const router = useRouter();

    const hasCard = !!savedCard?.trim();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center gap-2 bg-background p-5">
                <Skeleton className="h-[300px] w-full" />
            </View>
        );
    }

    return (
        <View className="flex-1 items-center justify-center gap-2 bg-background p-5">
            {!hasCard && <Banner variant="warning" message="No card saved. Please go to Settings to add your card." testID="no-card-warning" />}
            <QrScanner cardId={savedCard ?? null} />
            <Button variant="secondary" onPress={() => router.push('/settings')} testID="settings-btn">
                <Text>Settings</Text>
            </Button>
        </View>
    );
}
