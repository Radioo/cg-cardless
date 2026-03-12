import React from 'react';
import { render } from '@testing-library/react-native';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

describe('Card', () => {
    it('renders Card with children', () => {
        const { getByText } = render(
            <Card><Text>Content</Text></Card>,
        );
        expect(getByText('Content')).toBeTruthy();
    });

    it('renders CardHeader and CardTitle', () => {
        const { getByText, getByRole } = render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                </CardHeader>
            </Card>,
        );
        expect(getByText('Title')).toBeTruthy();
        expect(getByRole('heading')).toBeTruthy();
    });

    it('renders CardDescription', () => {
        const { getByText } = render(
            <Card>
                <CardHeader>
                    <CardDescription>Desc</CardDescription>
                </CardHeader>
            </Card>,
        );
        expect(getByText('Desc')).toBeTruthy();
    });

    it('renders CardContent and CardFooter', () => {
        const { getByText } = render(
            <Card>
                <CardContent><Text>Body</Text></CardContent>
                <CardFooter><Text>Footer</Text></CardFooter>
            </Card>,
        );
        expect(getByText('Body')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
    });
});
