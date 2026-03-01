import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedTextInput } from '@/components/themed-text-input';

describe('ThemedTextInput', () => {
  it('renders and accepts text input', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemedTextInput placeholder="Enter text" onChangeText={onChangeText} />,
    );
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });
});
