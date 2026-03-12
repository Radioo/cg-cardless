import { useEffect } from 'react';
import { Platform, View } from 'react-native';

import { Text } from '@/components/ui/text';

// Web close-app flow: closeApp() in utils/close-app.ts navigates here,
// then this screen attempts window.close(). The fallback UI shows if the
// browser blocks the close (e.g. tab wasn't opened by script).
export default function ClosedScreen() {
    useEffect(() => {
        if (Platform.OS === 'web') {
            window.close();
        }
    }, []);

    return (
        <View className="flex-1 items-center justify-center gap-3 bg-background">
            <Text variant="h1">Done</Text>
            <Text>You can close this page now.</Text>
        </View>
    );
}
