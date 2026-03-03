import React from 'react';
import { render } from '@testing-library/react-native';
import { Banner } from '@/components/banner';

describe('Banner', () => {
    it('renders message text', () => {
        const { getByText } = render(<Banner message="Hello world" />);
        expect(getByText('Hello world')).toBeTruthy();
    });

    it('defaults to warning variant', () => {
        const { getByText } = render(<Banner message="Warning" />);
        expect(getByText('Warning')).toBeTruthy();
    });

    it('renders with error variant', () => {
        const { getByText } = render(
            <Banner message="Something went wrong" variant="error" />,
        );
        expect(getByText('Something went wrong')).toBeTruthy();
    });
});
