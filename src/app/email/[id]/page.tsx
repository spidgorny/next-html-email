'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';
import useSWR from 'swr';

import { JsonEmail } from '@/app/jsonEmail';

export function useEmailById(id: string) {
  const { data, error, isLoading } = useSWR(id ? `/api/db/json/${id}` : null);
  return { data: data as JsonEmail | undefined, error, isLoading };
}

export default function EmailDetailPage() {
  const params = useParams();
  const id =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : '';
  const { data, error, isLoading } = useEmailById(id);

  if (!id) {
    return (
      <div className='layout flex items-center justify-center min-h-screen text-red-500'>
        Invalid email ID.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='layout flex items-center justify-center min-h-screen'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='layout flex items-center justify-center min-h-screen text-red-500'>
        Error loading email.
      </div>
    );
  }

  if (!data) {
    return (
      <div className='layout flex items-center justify-center min-h-screen'>
        No email found.
      </div>
    );
  }

  const rules = data.body.flatMap((section) => section.Rules);

  return (
    <section className='bg-gray-50'>
      <div className='layout relative flex min-h-screen flex-row items-start justify-between gap-3'>
        <aside className='basis-1/6 min-h-screen py-3 ps-3 flex'>
          <div className='shadow rounded bg-white p-3 w-full'>
            <h1 className='text-center'>MENU</h1>
            <ul className='mt-4 space-y-2'>
              {rules.map((rule, index) => (
                <li key={index}>
                  <a
                    href={`/email/${id}/rule/${rule.Name}`}
                    className='text-blue-600 hover:underline text-xs whitespace-no-wrap ws-nowrap block no-overflow'
                  >
                    {rule.Name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className='basis-5/6 shadow rounded bg-white p-3 my-3 me-3'>
          <h1 className='text-2xl font-bold mb-4'>Email Details</h1>
          <pre className='bg-gray-100 p-4 rounded w-full max-w-2xl overflow-x-auto text-xs'>
            {JSON.stringify(data, null, 2)}
          </pre>
        </main>
      </div>
    </section>
  );
}
