'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';

import { useEmailById } from '@/lib/useEmail';

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

  // Export handler
  function handleExport() {
    if (!data?.body) return;
    const json = JSON.stringify(data.body, null, 2);
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const filename = `email-body-${timestamp}.json`;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

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
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-2xl font-bold'>Email Details</h1>
            <button
              type='button'
              className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
              onClick={handleExport}
              disabled={!data?.body}
            >
              Export
            </button>
          </div>
          <pre className='bg-gray-100 p-4 rounded w-full max-w-2xl overflow-x-auto text-xs'>
            {JSON.stringify(data, null, 2)}
          </pre>
        </main>
      </div>
    </section>
  );
}
