import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemedView } from '@/components/themed-view';

describe('ThemedView', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>Child</Text>
      </ThemedView>,
    );
    expect(getByText('Child')).toBeTruthy();
  });
});
