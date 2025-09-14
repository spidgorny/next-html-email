'use client';

import axios from 'axios';
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

  // POST state
  const [postLoading, setPostLoading] = React.useState(false);
  const [postError, setPostError] = React.useState<string | null>(null);
  const [postSuccess, setPostSuccess] = React.useState(false);

  // POST handler
  async function handlePost() {
    setPostLoading(true);
    setPostError(null);
    setPostSuccess(false);
    try {
      // Prepare updated rule
      if (!foundRule || !id) throw new Error('No rule or email ID');
      const updatedRule = {
        ...foundRule,
        ['E-mail']: {
          ...foundRule['E-mail'],
          EmailBody: [
            {
              ...foundRule['E-mail'].EmailBody[0],
              Body: bodyText,
            },
            ...foundRule['E-mail'].EmailBody.slice(1),
          ],
        },
      };
      // Prepare payload: update the rule in the email body
      const updatedBody = Array.isArray(data.body)
        ? data.body.map((ruleSet) => ({
            ...ruleSet,
            Rules: Array.isArray(ruleSet.Rules)
              ? ruleSet.Rules.map((rule) =>
                  rule.Name === name ? updatedRule : rule
                )
              : ruleSet.Rules,
          }))
        : data.body;
      const payload = {
        body: updatedBody,
      };
      const res = await axios.post(`/api/db/json/${id}`, payload);
      if (res.status !== 200) {
        throw new Error('Failed to update email');
      }
      setPostSuccess(true);
    } catch (err: Error) {
      setPostError(err.message || 'Unknown error');
    } finally {
      setPostLoading(false);
    }
  }

  return (
    <section className='p-4 bg-gray-50 min-h-screen'>
      <div className='flex items-center mb-4 justify-between'>
        <div className='flex gap-3 items-center'>
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
        <div className='flex items-center mt-2 gap-2'>
          <button
            type='button'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
            onClick={handlePost}
            disabled={postLoading || !foundRule || !id}
          >
            {postLoading ? 'Posting...' : 'Save'}
          </button>
          {postSuccess && <span className='text-green-600'>Saved!</span>}
          {postError && (
            <span className='text-red-600'>Error: {postError}</span>
          )}
        </div>
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
              <>
                <textarea
                  className='bg-gray-100 p-4 rounded w-full max-w-2xl overflow-x-auto text-xs min-h-[300px]'
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                />
              </>
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
