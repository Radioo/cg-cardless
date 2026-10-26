import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, TextClassContext } from '@/components/ui/text';

describe('Text', () => {
    it('renders children', async () => {
        const { getByText } = await render(<Text>Hello</Text>);
        expect(getByText('Hello')).toBeTruthy();
    });

    it('renders with h1 variant and heading role', async () => {
        const { getByRole } = await render(<Text variant="h1">Title</Text>);
        expect(getByRole('heading')).toBeTruthy();
    });

    it('renders with muted variant', async () => {
        const { getByText } = await render(<Text variant="muted">Subtle</Text>);
        expect(getByText('Subtle')).toBeTruthy();
    });

    it('applies TextClassContext value', async () => {
        const { getByText } = await render(
            <TextClassContext.Provider value="custom-class">
                <Text>Styled</Text>
            </TextClassContext.Provider>,
        );
        expect(getByText('Styled')).toBeTruthy();
    });

    it('renders with default variant when none specified', async () => {
        const { getByText } = await render(<Text>Default</Text>);
        expect(getByText('Default')).toBeTruthy();
    });
});
