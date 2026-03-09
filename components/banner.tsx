import { View } from 'react-native';

import { Text } from '@/components/ui/text';

type BannerProps = {
    message: string;
    variant?: 'warning' | 'error';
};

export function Banner({ message, variant = 'warning' }: BannerProps) {
    return (
        <View className={`w-full p-3 ${variant === 'warning' ? 'bg-warning' : 'bg-destructive'}`}>
            <Text className={`text-center ${variant === 'warning' ? 'text-warning-foreground' : 'text-destructive-foreground'}`}>
                {message}
            </Text>
        </View>
    );
}
