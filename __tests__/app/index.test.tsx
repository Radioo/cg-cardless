import React from 'react';
import { render } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '@/app/index';
import { createWrapper } from '../helpers';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('HomeScreen', () => {
    it('shows empty view while loading', () => {
        (AsyncStorage.getItem as jest.Mock).mockReturnValue(new Promise(() => {}));

        const { queryByText } = render(<HomeScreen />, {
            wrapper: createWrapper(),
        });

        // While loading, no content is shown (just a blank background view)
        expect(queryByText('Settings')).toBeNull();
        expect(queryByText(/No card saved/)).toBeNull();
    });

    it('shows card warning when no card is saved', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { findByText } = render(<HomeScreen />, {
            wrapper: createWrapper(),
        });

        expect(await findByText(/No card saved/)).toBeTruthy();
    });

    it('shows settings button', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

        const { findByText } = render(<HomeScreen />, {
            wrapper: createWrapper(),
        });

        expect(await findByText('Settings')).toBeTruthy();
    });
});
