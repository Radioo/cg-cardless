import React from 'react';
import { render, act } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import ScanResultScreen from '@/app/scan-result';
import { createWrapper } from '../helpers';

const TEST_PARAMS = { url: 'https://example.com/api', cardId: 'ABC123' };

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  (useLocalSearchParams as jest.Mock).mockReturnValue(TEST_PARAMS);
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    }),
  ) as jest.Mock;
});

afterEach(() => {
  jest.useRealTimers();
});

describe('ScanResultScreen', () => {
  it('shows success message after successful request', async () => {
    const { findByText } = render(<ScanResultScreen />, {
      wrapper: createWrapper(),
    });

    expect(await findByText('Success')).toBeTruthy();
  });

  it('shows error message on failed request', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });

    const { findAllByText } = render(<ScanResultScreen />, {
      wrapper: createWrapper(),
    });

    const matches = await findAllByText(/Request failed: 500/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
