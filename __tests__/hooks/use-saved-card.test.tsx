import { renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSavedCard, useSaveCard } from '@/hooks/use-saved-card';
import { createWrapper } from '../helpers';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSavedCard', () => {
  it('returns null when no card is stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useSavedCard(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('returns stored card value', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('E00401000008F3E3');

    const { result } = renderHook(() => useSavedCard(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe('E00401000008F3E3');
  });
});

describe('useSaveCard', () => {
  it('stores converted card ID', async () => {
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useSaveCard(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('E00401000008F3E3');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'saved_card',
      'E00401000008F3E3',
    );
  });

  it('rejects invalid input', async () => {
    const { result } = renderHook(() => useSaveCard(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('invalid');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
