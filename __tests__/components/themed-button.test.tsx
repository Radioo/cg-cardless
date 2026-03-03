import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedButton } from '@/components/themed-button';

describe('ThemedButton', () => {
    it('renders title text', () => {
        const { getByText } = render(
            <ThemedButton title="Press me" onPress={jest.fn()} />,
        );
        expect(getByText('Press me')).toBeTruthy();
    });

    it('fires onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <ThemedButton title="Press me" onPress={onPress} />,
        );
        fireEvent.press(getByText('Press me'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('shows ActivityIndicator when loading', () => {
        const { queryByText, UNSAFE_getByType } = render(
            <ThemedButton title="Press me" onPress={jest.fn()} loading />,
        );
        expect(queryByText('Press me')).toBeNull();
        const { ActivityIndicator } = require('react-native');
        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('does not fire onPress when disabled', () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <ThemedButton title="Press me" onPress={onPress} disabled />,
        );
        fireEvent.press(getByText('Press me'));
        expect(onPress).not.toHaveBeenCalled();
    });
});
