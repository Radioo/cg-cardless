import React from 'react';
import { render } from '@testing-library/react-native';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

describe('Card', () => {
    it('renders Card with children', async () => {
        const { getByText } = await render(
            <Card><Text>Content</Text></Card>,
        );
        expect(getByText('Content')).toBeTruthy();
    });

    it('renders CardHeader and CardTitle', async () => {
        const { getByText, getByRole } = await render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                </CardHeader>
            </Card>,
        );
        expect(getByText('Title')).toBeTruthy();
        expect(getByRole('heading')).toBeTruthy();
    });

    it('renders CardDescription', async () => {
        const { getByText } = await render(
            <Card>
                <CardHeader>
                    <CardDescription>Desc</CardDescription>
                </CardHeader>
            </Card>,
        );
        expect(getByText('Desc')).toBeTruthy();
    });

    it('renders CardContent and CardFooter', async () => {
        const { getByText } = await render(
            <Card>
                <CardContent><Text>Body</Text></CardContent>
                <CardFooter><Text>Footer</Text></CardFooter>
            </Card>,
        );
        expect(getByText('Body')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
    });
});
