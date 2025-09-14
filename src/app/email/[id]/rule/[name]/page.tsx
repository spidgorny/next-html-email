'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';

import { EmailTemplateConfig } from '@/app/jsonEmail';

import { useEmailById } from '../../page';

export default function EmailRuleDetail() {
  const params = useParams();
  const id =
    typeof params.id === 'string'
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : '';
  const name =
    typeof params.name === 'string'
      ? decodeURIComponent(params.name)
      : Array.isArray(params.name)
      ? decodeURIComponent(params.name[0])
      : '';
  const { data, error, isLoading } = useEmailById(id);

  // Find the rule by name
  let foundRule: EmailTemplateConfig | undefined;
  if (Array.isArray(data?.body)) {
    for (const ruleSet of data.body) {
      if (Array.isArray(ruleSet.Rules)) {
        foundRule = ruleSet.Rules.find(
          (rule: EmailTemplateConfig) => rule.Name === name
        );
        if (foundRule) break;
      }
    }
  }

  // Extract email body from foundRule
  const emailBody = foundRule?.['E-mail']?.EmailBody?.[0]?.Body ?? '';
  const [bodyText, setBodyText] = React.useState(emailBody);

  React.useEffect(() => {
    setBodyText(emailBody);
  }, [emailBody]);

  return (
    <section className='p-4 bg-gray-50 min-h-screen'>
      <div className='flex items-center mb-4'>
        <button
          type='button'
          aria-label='Back'
          onClick={() => window.history.back()}
          className='mr-2 p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M15 18L9 12L15 6'
              stroke='#333'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
        <h1 className='text-xl font-bold'>Rule: {name}</h1>
      </div>
      <div className='layout relative flex min-h-screen flex-row items-start justify-between gap-3'>
        <aside className='basis-3/6 min-h-screen py-3 ps-3 flex'>
          {!id || !name ? (
            <div className='text-red-500'>Invalid email ID or rule name.</div>
          ) : isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className='text-red-500'>Error loading email.</div>
          ) : !data ? (
            <div>No email found.</div>
          ) : foundRule ? (
            foundRule['E-mail']?.EmailBody?.[0]?.Body ? (
              <textarea
                className='bg-gray-100 p-4 rounded w-full max-w-2xl overflow-x-auto text-xs min-h-[300px]'
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
              />
            ) : (
              <div className='text-gray-500'>No email body found.</div>
            )
          ) : (
            <div className='text-gray-500'>Rule not found.</div>
          )}
        </aside>
        <main className='basis-3/6 shadow rounded bg-white p-3 my-3 me-3'>
          <div dangerouslySetInnerHTML={{ __html: bodyText }} />
        </main>
      </div>
    </section>
  );
}
