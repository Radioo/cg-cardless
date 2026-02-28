import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {useThemeColor} from '@/hooks/use-theme-color';

type Props = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedTextInput({style, lightColor, darkColor, ...rest}: Props) {
    const borderColor = useThemeColor({light: lightColor, dark: darkColor}, 'border');
    const backgroundColor = useThemeColor({}, 'inputBackground');
    const color = useThemeColor({}, 'text');
    const placeholderColor = useThemeColor({}, 'muted');

    return (
        <TextInput
            style={[styles.input, {borderColor, backgroundColor, color}, style]}
            placeholderTextColor={placeholderColor}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 0,
        padding: 12,
        fontSize: 16,
    },
});
