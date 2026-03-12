import React from 'react';
import { render } from '@testing-library/react-native';
import { Input } from '@/components/ui/input';

describe('Input', () => {
    it('renders', () => {
        const { getByTestId } = render(<Input testID="input" />);
        expect(getByTestId('input')).toBeTruthy();
    });

    it('renders with placeholder', () => {
        const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
        expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('renders with value', () => {
        const { getByDisplayValue } = render(<Input value="hello" />);
        expect(getByDisplayValue('hello')).toBeTruthy();
    });

    it('renders when editable is false', () => {
        const { getByTestId } = render(<Input testID="input" editable={false} />);
        expect(getByTestId('input')).toBeTruthy();
    });

    it('passes custom className', () => {
        const { getByTestId } = render(<Input testID="input" className="custom-class" />);
        expect(getByTestId('input')).toBeTruthy();
    });
});
