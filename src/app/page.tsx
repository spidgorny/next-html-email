'use client';

import Link from 'next/link';
import * as React from 'react';
import '@/lib/env';

import useEmail from '@/lib/useEmail';

import { JsonEmail } from '@/app/jsonEmail';
import { UploadForm } from '@/app/upload-form';

export default function HomePage() {
  const { data, error, isLoading } = useEmail();

  // Loading state
  if (isLoading) {
    return (
      <div className='layout flex items-center justify-center min-h-screen'>
        Loading...
      </div>
    );
  }

  // No data or empty array
  // const isEmpty = !data || (Array.isArray(data) && data.length === 0);

  return (
    <main>
      <section className='bg-gray-50'>
        <div className='layout relative flex min-h-screen flex-col gap-3 p-3'>
          <div className='shadow rounded bg-white p-3'>
            <EmailList emails={data} />
            {error && <div className='text-red-500'>Error loading emails.</div>}
          </div>
          <div className='shadow rounded bg-white p-3'>
            <UploadForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function EmailList({ emails }: { emails: JsonEmail[] }) {
  return (
    <div>
      <h2 className='text-lg font-semibold mb-4'>Email Data</h2>
      <ul className='space-y-2'>
        {emails.map((email, idx) => (
          <li key={email.id || idx} className='border p-2 rounded'>
            <Link
              href={`/email/${email.id}`}
              className='text-blue-600 underline block w-full text-left px-2 py-1'
            >
              {email.id} - {email.name || '(no name)'}
            </Link>
            <div className='text-xs text-gray-500 mt-1'>
              Created:{' '}
              {email.createdAt
                ? new Date(email.createdAt).toLocaleString()
                : 'N/A'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
