import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import {ThemedText} from '@/components/themed-text';
import {useThemeColor} from '@/hooks/use-theme-color';

type Props = {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    loading?: boolean;
};

export function ThemedButton({title, onPress, variant = 'primary', disabled, loading}: Props) {
    const bg = useThemeColor({}, variant === 'primary' ? 'primary' : 'secondary');
    const textColor = useThemeColor({}, variant === 'primary' ? 'primaryText' : 'secondaryText');

    return (
        <Pressable
            style={[styles.button, {backgroundColor: bg}, (disabled || loading) && styles.disabled]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={textColor} size="small"/>
            ) : (
                <ThemedText style={[styles.text, {color: textColor}]}>{title}</ThemedText>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 0,
        alignItems: 'center',
    },
    text: {
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.6,
    },
});
