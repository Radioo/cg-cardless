import React from 'react';
import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from '@/app/settings';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('@/components/themed-text-input', () => ({
  ThemedTextInput: 'ThemedTextInput',
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SettingsScreen', () => {
  it('renders title', () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(<SettingsScreen />, {
      wrapper: createWrapper(),
    });

    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders input and buttons', () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(<SettingsScreen />, {
      wrapper: createWrapper(),
    });

    expect(getByText('Save Card')).toBeTruthy();
    expect(getByText('Generate Card')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('shows card info box when card exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('E00401000008F3E3');

    const { findByText } = render(<SettingsScreen />, {
      wrapper: createWrapper(),
    });

    expect(await findByText('Card ID')).toBeTruthy();
  });
});
