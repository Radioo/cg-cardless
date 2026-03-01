import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {useThemeColor} from '@/hooks/use-theme-color';

export function ThemedTextInput({style, ...rest}: TextInputProps) {
    const borderColor = useThemeColor('border');
    const backgroundColor = useThemeColor('inputBackground');
    const color = useThemeColor('text');
    const placeholderColor = useThemeColor('muted');

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
        padding: 12,
        fontSize: 16,
    },
});
