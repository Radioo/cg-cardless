import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

describe('Button', () => {
    it('renders children', () => {
        const { getByText } = render(
            <Button><Text>Click me</Text></Button>,
        );
        expect(getByText('Click me')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByRole } = render(
            <Button onPress={onPress}><Text>Press</Text></Button>,
        );
        fireEvent.press(getByRole('button'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders with disabled state', () => {
        const onPress = jest.fn();
        const { getByRole } = render(
            <Button disabled onPress={onPress}><Text>Disabled</Text></Button>,
        );
        expect(getByRole('button').props.accessibilityState?.disabled).toBe(true);
    });

    it('renders with different variants', () => {
        const { getByText: getDestructive } = render(
            <Button variant="destructive"><Text>Delete</Text></Button>,
        );
        expect(getDestructive('Delete')).toBeTruthy();

        const { getByText: getOutline } = render(
            <Button variant="outline"><Text>Outline</Text></Button>,
        );
        expect(getOutline('Outline')).toBeTruthy();
    });

    it('renders with different sizes', () => {
        const { getByText } = render(
            <Button size="sm"><Text>Small</Text></Button>,
        );
        expect(getByText('Small')).toBeTruthy();
    });
});
