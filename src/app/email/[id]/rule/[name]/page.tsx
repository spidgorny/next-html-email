'use client';

import { useParams } from 'next/navigation';
import * as React from 'react';

import { useEmailById } from '@/lib/useEmail';

import EmailRuleEditor from './EmailRuleEditor';
import { EmailTemplateConfig } from '@/app/jsonEmail';

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

  // Handle loading/error/invalid states
  if (!id || !name) {
    return (
      <div className='text-red-500 p-4'>Invalid email ID or rule name.</div>
    );
  }
  if (isLoading) {
    return <div className='p-4'>Loading...</div>;
  }
  if (error) {
    return <div className='text-red-500 p-4'>Error loading email.</div>;
  }
  if (!data) {
    return <div className='p-4'>No email found.</div>;
  }
  if (!foundRule) {
    return <div className='text-gray-500 p-4'>Rule not found.</div>;
  }

  // Pass props to EmailRuleEditor
  return (
    <EmailRuleEditor
      id={id}
      ruleName={name}
      foundRule={foundRule}
      emailBody={emailBody}
      data={data}
    />
  );
}
