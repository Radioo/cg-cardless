import React from 'react';
import { render } from '@testing-library/react-native';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
    it('renders with default horizontal orientation', async () => {
        const { getByTestId } = await render(<Separator testID="separator" />);
        expect(getByTestId('separator')).toBeTruthy();
    });

    it('renders with vertical orientation', async () => {
        const { getByTestId } = await render(<Separator testID="separator" orientation="vertical" />);
        expect(getByTestId('separator')).toBeTruthy();
    });

    it('renders as decorative by default', async () => {
        const { getByTestId } = await render(<Separator testID="separator" />);
        expect(getByTestId('separator')).toBeTruthy();
    });

    it('renders as non-decorative', async () => {
        const { getByTestId } = await render(<Separator testID="separator" decorative={false} />);
        expect(getByTestId('separator')).toBeTruthy();
    });
});
