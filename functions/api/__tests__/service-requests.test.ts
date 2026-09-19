/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildIssue, onRequestPost } from '../service-requests';

class MockKV {
  private store = new Map<string, string>();
  async get(key: string, type?: string) {
    const v = this.store.get(key);
    if (v === undefined) return null;
    return type === 'json' ? JSON.parse(v) : v;
  }
  async put(key: string, value: string) {
    this.store.set(key, value);
  }
  async delete(key: string) {
    this.store.delete(key);
  }
}

const valid = {
  type: 'update',
  serviceName: 'Business permit renewal',
  serviceSlug: 'business-permit-renewal',
  category: 'Business, Trade & Investment',
  office: 'BPLO',
  details: 'The fee changed to 500 pesos in January per the posted notice.',
  sourceUrl: 'https://example.gov.ph/notice',
  submitterName: 'Juan',
};

function post(body: unknown, env: Record<string, unknown> = {}) {
  const request = new Request('https://betterliliw.org/api/service-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '1.1.1.1',
    },
    body: JSON.stringify(body),
  });
  return onRequestPost({
    request,
    env: { WEATHER_KV: new MockKV(), ...env } as any,
  });
}

describe('buildIssue', () => {
  it('mirrors the contribution issue template', () => {
    const issue = buildIssue(valid as any, 'https://betterliliw.org');
    expect(issue.title).toBe('[Contribution] Update: Business permit renewal');
    expect(issue.labels).toEqual(['contribution', 'service-update']);
    expect(issue.body).toContain('### Service Name\n\nBusiness permit renewal');
    expect(issue.body).toContain('Update to Existing Service');
    expect(issue.body).toContain(
      'https://betterliliw.org/services/business-permit-renewal'
    );
    expect(issue.body).toContain('### Source URL\n\nhttps://example.gov.ph');
    expect(issue.body).toContain('by Juan');
  });

  it('labels new services and omits empty sections', () => {
    const issue = buildIssue(
      { type: 'new', serviceName: 'X', details: 'Y' } as any,
      'https://betterliliw.org'
    );
    expect(issue.labels).toEqual(['contribution', 'new-service']);
    expect(issue.body).not.toContain('### Category');
    expect(issue.body).toContain('_Not provided_');
  });
});

describe('POST /api/service-requests', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('rejects missing required fields', async () => {
    const res = await post({ type: 'new', serviceName: '', details: '' });
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.code).toBe('MISSING_REQUIRED_FIELD');
    expect(body.details.fields).toEqual(['serviceName', 'details']);
  });

  it('rejects a source that is not a URL', async () => {
    const res = await post({ ...valid, sourceUrl: 'call the office' });
    expect(res.status).toBe(400);
    expect(((await res.json()) as any).details.fields).toEqual(['sourceUrl']);
  });

  it('silently drops honeypot submissions', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const res = await post(
      { ...valid, website: 'http://spam' },
      { GITHUB_ISSUES_TOKEN: 't', GITHUB_REPO: 'a/b' }
    );
    expect(res.status).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('answers 503 NOT_CONFIGURED without a token', async () => {
    const res = await post(valid);
    expect(res.status).toBe(503);
    expect(((await res.json()) as any).code).toBe('NOT_CONFIGURED');
  });

  it('files a GitHub issue and returns its number', async () => {
    const fetchSpy = vi.fn(async (url: string, init: RequestInit) => {
      expect(url).toBe(
        'https://api.github.com/repos/BetterLiliw/betterliliw/issues'
      );
      expect((init.headers as Record<string, string>).Authorization).toBe(
        'Bearer secret'
      );
      const sent = JSON.parse(init.body as string);
      expect(sent.labels).toEqual(['contribution', 'service-update']);
      return Response.json(
        { number: 42, html_url: 'https://github.com/x/issues/42' },
        { status: 201 }
      );
    });
    vi.stubGlobal('fetch', fetchSpy);

    const res = await post(valid, {
      GITHUB_ISSUES_TOKEN: 'secret',
      GITHUB_REPO: 'BetterLiliw/betterliliw',
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({
      ok: true,
      number: 42,
      url: 'https://github.com/x/issues/42',
    });
  });

  it('maps a GitHub failure to 502 without leaking details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('nope', { status: 401 }))
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await post(valid, {
      GITHUB_ISSUES_TOKEN: 'bad',
      GITHUB_REPO: 'a/b',
    });
    expect(res.status).toBe(502);
    expect(((await res.json()) as any).code).toBe('UPSTREAM_ERROR');
  });
});
