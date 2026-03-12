import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardSettings } from '@/components/card-settings';
import { createWrapper } from '../helpers';

jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

const showDialog = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

describe('CardSettings', () => {
    it('renders card input and buttons', async () => {
        const { getByTestId, getByText } = render(
            <CardSettings savedCard={null} showDialog={showDialog} />,
            { wrapper: createWrapper() },
        );

        expect(getByTestId('card-input')).toBeTruthy();
        expect(getByText('Save Card')).toBeTruthy();
        expect(getByText('Generate Card')).toBeTruthy();
        await act(async () => {});
    });

    it('shows saved card info when card exists', async () => {
        const { findByTestId } = render(
            <CardSettings savedCard="E00401000008F3E3" showDialog={showDialog} />,
            { wrapper: createWrapper() },
        );

        expect(await findByTestId('saved-card-info')).toBeTruthy();
    });

    it('shows Card ID value when card is saved', async () => {
        const { findByTestId } = render(
            <CardSettings savedCard="E00401000008F3E3" showDialog={showDialog} />,
            { wrapper: createWrapper() },
        );

        const cardIdValue = await findByTestId('card-id-value');
        expect(cardIdValue).toBeTruthy();
    });

    it('generates a card when Generate Card is pressed', async () => {
        const { getByText, getByTestId } = render(
            <CardSettings savedCard={null} showDialog={showDialog} />,
            { wrapper: createWrapper() },
        );

        await act(async () => {
            fireEvent.press(getByText('Generate Card'));
        });

        const input = getByTestId('card-input');
        expect(input.props.value).toBeTruthy();
        expect(input.props.value.length).toBeGreaterThan(0);
    });

    it('saves card and shows success dialog', async () => {
        (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

        const { getByText, getByTestId } = render(
            <CardSettings savedCard={null} showDialog={showDialog} />,
            { wrapper: createWrapper() },
        );

        await act(async () => {
            fireEvent.changeText(getByTestId('card-input'), 'E00401000008F3E3');
        });

        await act(async () => {
            fireEvent.press(getByText('Save Card'));
        });

        // Wait for mutation to complete
        await act(async () => {});

        expect(showDialog).toHaveBeenCalledWith('Saved', 'Card saved successfully.');
    });

    it('shows error dialog for invalid card', async () => {
        const { getByText, getByTestId } = render(
            <CardSettings savedCard={null} showDialog={showDialog} />,
            { wrapper: createWrapper() },
        );

        await act(async () => {
            fireEvent.changeText(getByTestId('card-input'), 'INVALID');
        });

        await act(async () => {
            fireEvent.press(getByText('Save Card'));
        });

        await act(async () => {});

        expect(showDialog).toHaveBeenCalledWith('Error', expect.any(String));
    });
});
