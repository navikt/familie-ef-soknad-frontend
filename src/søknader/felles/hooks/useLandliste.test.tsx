import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import axios from 'axios';
import { _resetLandlisteCacheForTest, useLandliste } from './useLandliste';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

vi.mock('../../../context/SpråkContext', () => ({
  useSpråkContext: () => ['nb', vi.fn()],
}));

const apiResponse = [
  { kode: 'NOR', navn: 'Norge', erEøsland: true },
  { kode: 'BRA', navn: 'Brasil', erEøsland: false },
];

beforeEach(() => {
  _resetLandlisteCacheForTest();
  vi.clearAllMocks();
});

afterEach(() => {
  _resetLandlisteCacheForTest();
});

describe('useLandliste', () => {
  test('returnerer mappet liste fra API', async () => {
    (axios.get as any).mockResolvedValueOnce({ data: apiResponse });

    const { result } = renderHook(() => useLandliste());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.land).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.land).toEqual([
      { id: 'NOR', svar_tekst: 'Norge', erEøsland: true },
      { id: 'BRA', svar_tekst: 'Brasil', erEøsland: false },
    ]);
    expect(result.current.error).toBeUndefined();
  });

  test('dedupliserer parallelle kall for samme språk', async () => {
    (axios.get as any).mockResolvedValue({ data: apiResponse });

    const { result: first } = renderHook(() => useLandliste());
    const { result: second } = renderHook(() => useLandliste());

    await waitFor(() => {
      expect(first.current.isLoading).toBe(false);
      expect(second.current.isLoading).toBe(false);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('eksponerer error når kallet feiler', async () => {
    (axios.get as any).mockRejectedValueOnce(new Error('Nettverksfeil'));

    const { result } = renderHook(() => useLandliste());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.land).toEqual([]);
  });
});
