import {StyleSheet, Text, type TextProps} from 'react-native';

import {useThemeColor} from '@/hooks/use-theme-color';

type ThemedTextProps = TextProps & {
    type?: 'default' | 'title' | 'subtitle';
};

export function ThemedText({
    style,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    const color = useThemeColor('text');

    return (
        <Text
            style={[{color}, styles[type], style]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
