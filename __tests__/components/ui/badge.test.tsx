import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
    it('renders children', async () => {
        const { getByTestId } = await render(
            <Badge testID="badge">
                <></>
            </Badge>,
        );
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders with default variant', async () => {
        const { getByTestId } = await render(<Badge testID="badge" />);
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders with secondary variant', async () => {
        const { getByTestId } = await render(<Badge testID="badge" variant="secondary" />);
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders with destructive variant', async () => {
        const { getByTestId } = await render(<Badge testID="badge" variant="destructive" />);
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders with outline variant', async () => {
        const { getByTestId } = await render(<Badge testID="badge" variant="outline" />);
        expect(getByTestId('badge')).toBeTruthy();
    });

    it('renders as slot when asChild is true', async () => {
        const { getByTestId } = await render(<Badge testID="badge" asChild />);
        expect(getByTestId('badge')).toBeTruthy();
    });
});
