import React from 'react';
import { render } from '@testing-library/react-native';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
    it('renders with default horizontal orientation', () => {
        const { getByTestId } = render(<Separator testID="separator" />);
        expect(getByTestId('separator')).toBeTruthy();
    });

    it('renders with vertical orientation', () => {
        const { getByTestId } = render(<Separator testID="separator" orientation="vertical" />);
        expect(getByTestId('separator')).toBeTruthy();
    });

    it('renders as decorative by default', () => {
        const { getByTestId } = render(<Separator testID="separator" />);
        expect(getByTestId('separator')).toBeTruthy();
    });

    it('renders as non-decorative', () => {
        const { getByTestId } = render(<Separator testID="separator" decorative={false} />);
        expect(getByTestId('separator')).toBeTruthy();
    });
});
