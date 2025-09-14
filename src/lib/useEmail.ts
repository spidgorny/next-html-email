'use client';
import useSWR from 'swr';

/**
 * useEmail hook fetches email data from /api/db/json
 * Returns the full SWR response (data, error, isLoading, etc.)
 */
export default function useEmail() {
  return useSWR('/api/db/json');
}
