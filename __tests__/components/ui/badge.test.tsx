import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
    it('renders children', () => {
        const { getByTestId } = render(
            <Badge testID="badge">
                <></>
            </Badge>,
        );
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders with default variant', () => {
        const { getByTestId } = render(<Badge testID="badge" />);
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders with secondary variant', () => {
        const { getByTestId } = render(<Badge testID="badge" variant="secondary" />);
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders with destructive variant', () => {
        const { getByTestId } = render(<Badge testID="badge" variant="destructive" />);
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders with outline variant', () => {
        const { getByTestId } = render(<Badge testID="badge" variant="outline" />);
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders as slot when asChild is true', () => {
        const { getByTestId } = render(<Badge testID="badge" asChild />);
        expect(getByTestId('badge')).toBeTruthy();
    });
});
