/**
 * Service requests API
 * POST /api/service-requests
 *
 * Lets residents suggest a new service or a correction without a GitHub
 * account. The request is filed as an issue in the portal repository with
 * the same shape as the "Service Contribution" issue template, so it lands
 * in the queue maintainers already triage.
 *
 * Needs `GITHUB_ISSUES_TOKEN` (a fine-grained token with Issues: write on
 * the repo) and `GITHUB_REPO` (owner/name, set in wrangler.jsonc). Without
 * the token the endpoint answers 503 `NOT_CONFIGURED` and the page falls
 * back to email.
 */
import { errorResponse } from '../utils/error-response';
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIdentifier,
} from '../utils/rate-limit';
import { parseJsonBody, validateJsonContentType } from '../utils/request';
import type { Env } from '../types';

export interface ServiceRequestBody {
  type: 'new' | 'update';
  serviceName: string;
  serviceSlug?: string;
  category?: string;
  office?: string;
  details: string;
  sourceUrl?: string;
  submitterName?: string;
  /** Honeypot: real users never see this field, so any value is a bot. */
  website?: string;
}

const LIMITS = {
  serviceName: 120,
  category: 80,
  office: 120,
  details: 5000,
  sourceUrl: 500,
  submitterName: 80,
  serviceSlug: 120,
} as const;

const RATE_LIMIT = { limit: 5, window: 60 * 60 };

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function buildIssue(
  body: ServiceRequestBody,
  portalBaseUrl: string
): { title: string; body: string; labels: string[] } {
  const isUpdate = body.type === 'update';
  const title = `[Contribution] ${isUpdate ? 'Update' : 'New service'}: ${body.serviceName}`;

  const lines = [
    '### Service Name',
    '',
    body.serviceName,
    '',
    '### Type',
    '',
    isUpdate ? 'Update to Existing Service' : 'New Service',
    '',
  ];
  if (isUpdate && body.serviceSlug) {
    lines.push(
      '### Current page',
      '',
      `${portalBaseUrl}/services/${body.serviceSlug}`,
      ''
    );
  }
  if (body.category) lines.push('### Category', '', body.category, '');
  if (body.office) lines.push('### Office / department', '', body.office, '');
  lines.push('### Details', '', body.details, '');
  lines.push('### Source URL', '', body.sourceUrl || '_Not provided_', '');
  lines.push(
    '### Submitted via',
    '',
    `${portalBaseUrl}/services/request` +
      (body.submitterName ? ` by ${body.submitterName}` : ''),
    ''
  );

  return {
    title,
    body: lines.join('\n'),
    labels: ['contribution', isUpdate ? 'service-update' : 'new-service'],
  };
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  if (!validateJsonContentType(request)) {
    return errorResponse('Expected application/json', 415, 'INVALID_INPUT');
  }

  const rate = await checkRateLimit(
    env.WEATHER_KV,
    'service-requests:' + getClientIdentifier(request),
    RATE_LIMIT
  );
  if (!rate.allowed) {
    return createRateLimitResponse(rate, RATE_LIMIT.limit);
  }

  let raw: Partial<ServiceRequestBody>;
  try {
    raw = await parseJsonBody<Partial<ServiceRequestBody>>(request, 20_000);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Invalid request body',
      400,
      'INVALID_INPUT'
    );
  }

  // Bots fill every field; the form never renders this one.
  if (clean(raw.website, 10)) {
    return Response.json({ ok: true });
  }

  const body: ServiceRequestBody = {
    type: raw.type === 'update' ? 'update' : 'new',
    serviceName: clean(raw.serviceName, LIMITS.serviceName),
    serviceSlug: clean(raw.serviceSlug, LIMITS.serviceSlug),
    category: clean(raw.category, LIMITS.category),
    office: clean(raw.office, LIMITS.office),
    details: clean(raw.details, LIMITS.details),
    sourceUrl: clean(raw.sourceUrl, LIMITS.sourceUrl),
    submitterName: clean(raw.submitterName, LIMITS.submitterName),
  };

  const missing = (['serviceName', 'details'] as const).filter(
    field => !body[field]
  );
  if (missing.length > 0) {
    return errorResponse(
      'Please fill in the required fields',
      400,
      'MISSING_REQUIRED_FIELD',
      { fields: missing }
    );
  }
  if (body.details.length < 20) {
    return errorResponse(
      'Please describe the service in a little more detail',
      400,
      'INVALID_INPUT',
      { fields: ['details'] }
    );
  }
  if (body.sourceUrl && !isHttpUrl(body.sourceUrl)) {
    return errorResponse(
      'The source must be a full web address',
      400,
      'INVALID_INPUT',
      { fields: ['sourceUrl'] }
    );
  }

  const token = env.GITHUB_ISSUES_TOKEN;
  const repo = env.GITHUB_REPO;
  if (!token || !repo) {
    return errorResponse(
      'Service requests are not configured on this deployment',
      503,
      'NOT_CONFIGURED'
    );
  }

  const issue = buildIssue(body, new URL(request.url).origin);

  const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'betterliliw-service-requests',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify(issue),
  });

  if (!response.ok) {
    console.error(
      'GitHub issue creation failed',
      response.status,
      await response.text().catch(() => '')
    );
    return errorResponse(
      'We could not file your request right now',
      502,
      'UPSTREAM_ERROR'
    );
  }

  const created = (await response.json()) as {
    number: number;
    html_url: string;
  };
  return Response.json(
    { ok: true, number: created.number, url: created.html_url },
    { status: 201 }
  );
}
