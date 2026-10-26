import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

describe('Button', () => {
    it('renders children', async () => {
        const { getByText } = await render(
            <Button><Text>Click me</Text></Button>,
        );
        expect(getByText('Click me')).toBeTruthy();
    });

    it('calls onPress when pressed', async () => {
        const onPress = jest.fn();
        const { getByRole } = await render(
            <Button onPress={onPress}><Text>Press</Text></Button>,
        );
        await fireEvent.press(getByRole('button'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders with disabled state', async () => {
        const onPress = jest.fn();
        const { getByRole } = await render(
            <Button disabled onPress={onPress}><Text>Disabled</Text></Button>,
        );
        expect(getByRole('button').props.accessibilityState?.disabled).toBe(true);
    });

    it('renders with different variants', async () => {
        const { getByText: getDestructive } = await render(
            <Button variant="destructive"><Text>Delete</Text></Button>,
        );
        expect(getDestructive('Delete')).toBeTruthy();

        const { getByText: getOutline } = await render(
            <Button variant="outline"><Text>Outline</Text></Button>,
        );
        expect(getOutline('Outline')).toBeTruthy();
    });

    it('renders with different sizes', async () => {
        const { getByText } = await render(
            <Button size="sm"><Text>Small</Text></Button>,
        );
        expect(getByText('Small')).toBeTruthy();
    });
});
