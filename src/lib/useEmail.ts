'use client';
import useSWR from 'swr';

import { JsonEmail } from '@/app/jsonEmail';

/**
 * useEmail hook fetches email data from /api/db/json
 * Returns the full SWR response (data, error, isLoading, etc.)
 */
export default function useEmail() {
  return useSWR('/api/db/json');
}
export function useEmailById(id: string) {
  const { data, error, isLoading } = useSWR(id ? `/api/db/json/${id}` : null);
  return { data: data as JsonEmail | undefined, error, isLoading };
}
