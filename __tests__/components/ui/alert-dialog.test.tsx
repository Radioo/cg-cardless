import React from 'react';
import { render } from '@testing-library/react-native';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';

describe('AlertDialog', () => {
    it('renders dialog content when open', () => {
        const { getByText } = render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <Text>Confirm</Text>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <Text>Are you sure?</Text>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            <Text>Cancel</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction>
                            <Text>OK</Text>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>,
        );
        expect(getByText('Confirm')).toBeTruthy();
        expect(getByText('Are you sure?')).toBeTruthy();
    });

    it('does not render when closed', () => {
        const { queryByText } = render(
            <AlertDialog open={false}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <Text>Hidden</Text>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>,
        );
        expect(queryByText('Hidden')).toBeNull();
    });

    it('renders action and cancel buttons', () => {
        const { getByText } = render(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            <Text>No</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction>
                            <Text>Yes</Text>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>,
        );
        expect(getByText('No')).toBeTruthy();
        expect(getByText('Yes')).toBeTruthy();
    });
});
