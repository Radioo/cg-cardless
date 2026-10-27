import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// Web close-app flow: closeApp() in utils/close-app.ts navigates here,
// then this screen attempts window.close(). The fallback UI shows if the
// browser blocks the close (e.g. tab wasn't opened by script).
export default function ClosedScreen() {
    const router = useRouter();

    useEffect(() => {
        if (Platform.OS === 'web') {
            window.close();
        }
    }, []);

    return (
        <View className="flex-1 items-center justify-center gap-3 bg-background">
            <Text variant="h1">Done</Text>
            <Text>You can close this page now.</Text>
            <Button variant="secondary" onPress={() => router.dismissTo('/')} testID="scan-again-btn">
                <Text>Scan again</Text>
            </Button>
        </View>
    );
}
