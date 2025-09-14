'use client';

import React from 'react';
import { SWRConfig } from 'swr';

import { fetcher } from '@/app/fetcher';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
