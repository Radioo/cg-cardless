import { View } from 'react-native';

import { Text } from '@/components/ui/text';

type BannerProps = {
    message: string;
    variant?: 'warning' | 'error';
    testID?: string;
};

export function Banner({ message, variant = 'warning', testID }: BannerProps) {
    return (
        <View testID={testID} className={`w-full p-3 ${variant === 'warning' ? 'bg-warning' : 'bg-destructive'}`}>
            <Text className={`text-center ${variant === 'warning' ? 'text-warning-foreground' : 'text-destructive-foreground'}`}>
                {message}
            </Text>
        </View>
    );
}
