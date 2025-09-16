'use client';
import useSWR from 'swr';

import { EmailTemplateConfig, JsonEmail, RuleSet } from '@/app/jsonEmail';
import * as React from 'react';
import axios from 'axios';
import invariant from 'tiny-invariant';

/**
 * useEmail hook fetches email data from /api/db/json
 * Returns the full SWR response (data, error, isLoading, etc.)
 */
export default function useEmail() {
  return useSWR('/api/db/json');
}
export function useEmailById(id: string) {
  const { data, error, isLoading } = useSWR(id ? `/api/db/json/${id}` : null);
  const [postLoading, setPostLoading] = React.useState(false);
  const [postError, setPostError] = React.useState<string | null>(null);
  const [postSuccess, setPostSuccess] = React.useState(false);

  async function handlePost(
    foundRule: EmailTemplateConfig,
    bodyText: string,
    subject: string
  ) {
    setPostLoading(true);
    setPostError(null);
    setPostSuccess(false);
    const ruleName = foundRule?.Name;
    invariant(ruleName, 'Rule must have a name');
    try {
      if (!foundRule || !id) {
        throw new Error('No rule or email ID');
      }
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
          Subject: subject,
        },
      };
      const updatedBody = Array.isArray(data?.body)
        ? data.body.map((ruleSet: RuleSet) => ({
            ...ruleSet,
            Rules: Array.isArray(ruleSet.Rules)
              ? ruleSet.Rules.map((rule: EmailTemplateConfig) =>
                  rule.Name === ruleName ? updatedRule : rule
                )
              : ruleSet.Rules,
          }))
        : data?.body;
      const payload = {
        body: updatedBody,
      };
      const res = await axios.post(`/api/db/json/${id}`, payload);
      if (res.status !== 200) {
        throw new Error('Failed to update email');
      }
      setPostSuccess(true);
    } catch (err) {
      invariant(err instanceof Error);
      setPostError(err.message || 'Unknown error');
    } finally {
      setPostLoading(false);
    }
  }

  return {
    data: data as JsonEmail | undefined,
    error,
    isLoading,
    handlePost,
    postLoading,
    postError,
    postSuccess,
  };
}
