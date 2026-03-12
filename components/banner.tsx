import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';

type BannerProps = {
    message: string;
    variant?: 'warning' | 'error';
    testID?: string;
};

function Banner({ message, variant = 'warning', testID }: BannerProps) {
    return (
        <View testID={testID} className={cn('w-full p-3', variant === 'warning' ? 'bg-warning' : 'bg-destructive')}>
            <Text className={cn('text-center', variant === 'warning' ? 'text-warning-foreground' : 'text-destructive-foreground')}>
                {message}
            </Text>
        </View>
    );
}

export { Banner };
