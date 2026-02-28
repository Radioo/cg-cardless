import {StyleSheet} from 'react-native';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useThemeColor} from '@/hooks/use-theme-color';

type Props = {
    message: string;
    variant?: 'warning' | 'error';
};

export function Banner({message, variant = 'warning'}: Props) {
    const backgroundColor = useThemeColor(
        {},
        variant === 'warning' ? 'warning' : 'error',
    );
    const color = useThemeColor(
        {},
        variant === 'warning' ? 'warningText' : 'primaryText',
    );

    return (
        <ThemedView style={[styles.banner, {backgroundColor}]}>
            <ThemedText style={[styles.text, {color}]}>{message}</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    banner: {
        padding: 12,
        borderRadius: 0,
        width: '100%',
    },
    text: {
        textAlign: 'center',
    },
});
