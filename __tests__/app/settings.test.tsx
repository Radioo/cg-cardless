import React from 'react';
import { act, render } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from '@/app/settings';
import { createWrapper } from '../helpers';

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('@/components/themed-text-input', () => ({
    ThemedTextInput: 'ThemedTextInput',
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('SettingsScreen', () => {
    it('renders title', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { getByText } = render(<SettingsScreen />, {
            wrapper: createWrapper(),
        });

        expect(getByText('Settings')).toBeTruthy();
        await act(async () => {});
    });

    it('renders input and buttons', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { getByText } = render(<SettingsScreen />, {
            wrapper: createWrapper(),
        });

        expect(getByText('Save Card')).toBeTruthy();
        expect(getByText('Generate Card')).toBeTruthy();
        expect(getByText('Back')).toBeTruthy();
        await act(async () => {});
    });

    it('shows card info box when card exists', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('E00401000008F3E3');

        const { findByText } = render(<SettingsScreen />, {
            wrapper: createWrapper(),
        });

        expect(await findByText('Card ID')).toBeTruthy();
    });
});
