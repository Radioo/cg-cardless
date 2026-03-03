import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '@/components/themed-text';

describe('ThemedText', () => {
    it('renders children text', () => {
        const { getByText } = render(<ThemedText>Hello</ThemedText>);
        expect(getByText('Hello')).toBeTruthy();
    });

    it('renders with title type', () => {
        const { getByText } = render(<ThemedText type="title">Title</ThemedText>);
        expect(getByText('Title')).toBeTruthy();
    });

    it('renders with subtitle type', () => {
        const { getByText } = render(<ThemedText type="subtitle">Subtitle</ThemedText>);
        expect(getByText('Subtitle')).toBeTruthy();
    });
});
