import axios from 'axios';
import * as React from 'react';
import invariant from 'tiny-invariant';
import { EmailTemplateConfig } from '@/app/jsonEmail';
import { useEmailById } from '@/lib/useEmail';

interface EmailRuleEditorProps {
  id: string;
  ruleName: string;
  foundRule: EmailTemplateConfig;
  emailBody: string;
}

export default function EmailRuleEditor({
  id,
  ruleName,
  foundRule,
  emailBody,
}: EmailRuleEditorProps) {
  const [bodyText, setBodyText] = React.useState(emailBody);
  React.useEffect(() => {
    setBodyText(emailBody);
  }, [emailBody]);

  const { handlePost, postError, postLoading, postSuccess } = useEmailById(id);

  // Test mail states
  const [testMailLoading, setTestMailLoading] = React.useState(false);
  const [testMailError, setTestMailError] = React.useState<string | null>(null);
  const [testMailSuccess, setTestMailSuccess] = React.useState(false);

  async function handleSendTestMail() {
    setTestMailLoading(true);
    setTestMailError(null);
    setTestMailSuccess(false);
    try {
      const subject = foundRule['E-mail']?.Subject || ruleName || 'Test Email';
      const html = bodyText;
      const res = await axios.post('/api/test-mail', { subject, html });
      if (res.status !== 200 || !res.data?.success) {
        throw new Error(res.data?.error || 'Failed to send test mail');
      }
      setTestMailSuccess(true);
    } catch (err) {
      invariant(err instanceof Error);
      setTestMailError(err.message || 'Unknown error');
    } finally {
      setTestMailLoading(false);
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
          <h1 className='text-xl font-bold'>Rule: {ruleName}</h1>
        </div>
        <div className='flex items-center mt-2 gap-2'>
          <button
            type='button'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
            onClick={() => handlePost(foundRule, bodyText)}
            disabled={postLoading || !foundRule || !id}
          >
            {postLoading ? 'Posting...' : 'Save'}
          </button>
          {postSuccess && <span className='text-green-600'>Saved!</span>}
          {postError && (
            <span className='text-red-600'>Error: {postError}</span>
          )}
          <button
            type='button'
            className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
            onClick={handleSendTestMail}
            disabled={testMailLoading}
          >
            {testMailLoading ? 'Sending...' : 'Send Test Mail'}
          </button>
          {testMailSuccess && (
            <span className='text-green-600'>Test mail sent!</span>
          )}
          {testMailError && (
            <span className='text-red-600'>Error: {testMailError}</span>
          )}
        </div>
      </div>
      <div className='layout relative flex min-h-screen flex-row items-start justify-between gap-3'>
        <aside className='basis-3/6 min-h-screen py-3 ps-3 flex'>
          {foundRule['E-mail']?.EmailBody?.[0]?.Body ? (
            <textarea
              className='bg-gray-100 p-4 rounded w-full max-w-2xl overflow-x-auto text-xs min-h-[300px]'
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            />
          ) : (
            <div className='text-gray-500'>No email body found.</div>
          )}
        </aside>

        <main className='basis-3/6 shadow rounded bg-white p-3 my-3 me-3'>
          <div
            className='prose max-w-none'
            dangerouslySetInnerHTML={{ __html: bodyText }}
          />
        </main>
      </div>
    </section>
  );
}
