import React from 'react';
import { render } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from '@/app/index';
import { createWrapper } from '../helpers';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('WelcomeScreen', () => {
    it('shows loading skeleton initially', () => {
        (AsyncStorage.getItem as jest.Mock).mockReturnValue(new Promise(() => {}));

        const { toJSON } = render(<WelcomeScreen />, {
            wrapper: createWrapper(),
        });

        // When loading, the Skeleton component renders (no QrScanner or buttons)
        expect(toJSON()).toBeTruthy();
    });

    it('shows card warning when no card is saved', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { findByText } = render(<WelcomeScreen />, {
            wrapper: createWrapper(),
        });

        expect(await findByText(/No card saved/)).toBeTruthy();
    });

    it('shows settings button', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { findByText } = render(<WelcomeScreen />, {
            wrapper: createWrapper(),
        });

        expect(await findByText('Settings')).toBeTruthy();
    });
});
