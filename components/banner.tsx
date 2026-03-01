import {StyleSheet, View} from 'react-native';
import {ThemedText} from '@/components/themed-text';
import {useThemeColor} from '@/hooks/use-theme-color';

type BannerProps = {
    message: string;
    variant?: 'warning' | 'error';
};

export function Banner({message, variant = 'warning'}: BannerProps) {
    const backgroundColor = useThemeColor(variant === 'warning' ? 'warning' : 'error');
    const color = useThemeColor(variant === 'warning' ? 'warningText' : 'errorText');

    return (
        <View style={[styles.banner, {backgroundColor}]}>
            <ThemedText style={[styles.text, {color}]}>{message}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        padding: 12,
        width: '100%',
    },
    text: {
        textAlign: 'center',
    },
});
