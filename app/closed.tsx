import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function ClosedScreen() {
    window.close();

    return (
        <View className="flex-1 items-center justify-center gap-3 bg-background">
            <Text variant="h1">Done</Text>
            <Text>You can close this page now.</Text>
        </View>
    );
}
