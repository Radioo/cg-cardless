import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform, Text } from 'react-native';
import { NativeOnlyAnimatedView } from '@/components/ui/native-only-animated-view';

const originalPlatformOS = Platform.OS;

afterEach(() => {
    Platform.OS = originalPlatformOS;
});

describe('NativeOnlyAnimatedView', () => {
    it('renders children without animation wrapper on web', () => {
        Platform.OS = 'web' as typeof Platform.OS;

        const { getByText, toJSON } = render(
            <NativeOnlyAnimatedView>
                <Text>child</Text>
            </NativeOnlyAnimatedView>
        );

        expect(getByText('child')).toBeTruthy();
        // On web, should render just the child without a wrapping View
        expect(toJSON()).toEqual(expect.objectContaining({ type: 'Text' }));
    });

    it('wraps children in Animated.View on native', () => {
        Platform.OS = 'android' as typeof Platform.OS;

        const { getByText, toJSON } = render(
            <NativeOnlyAnimatedView>
                <Text>child</Text>
            </NativeOnlyAnimatedView>
        );

        expect(getByText('child')).toBeTruthy();
        // On native, should have a wrapping View around the child
        expect(toJSON()).toEqual(
            expect.objectContaining({
                type: 'View',
                children: [expect.objectContaining({ type: 'Text' })],
            })
        );
    });
});
