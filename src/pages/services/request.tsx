import { FormEvent, useMemo, useState } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import { CheckCircle2Icon, MailIcon } from 'lucide-react';

import { SEO } from '@/components/layout/SEO';
import { ModuleHeader } from '@/components/layout/PageLayouts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Dropdown } from '@/components/ui/Dropdown';
import { Textarea } from '@/components/ui/Textarea';

import serviceCategories from '@/data/service_categories.json';
import { config } from '@/lib/lguConfig';
import { getMergedServices, getServiceBySlug } from '@/lib/services';
import { cn } from '@/lib/utils';

type RequestType = 'new' | 'update';

interface FormState {
  type: RequestType;
  serviceName: string;
  serviceSlug: string;
  category: string;
  office: string;
  details: string;
  sourceUrl: string;
  submitterName: string;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'sent'; number: number; url: string }
  | { kind: 'fallback'; reason: string }
  | { kind: 'error'; message: string; fields: string[] };

const GITHUB_TEMPLATE = `${config.portal.githubUrl}/issues/new?template=contribution.yml`;

const helpText =
  'tsinelas-helper-text-01 mt-tsinelas-02 text-tsinelas-text-helper';
const errorText =
  'tsinelas-helper-text-01 mt-tsinelas-02 text-tsinelas-text-error';

export default function ServiceRequestPage() {
  const [params] = useSearchParams();
  const requestedSlug = params.get('service') ?? '';
  const requestedService = useMemo(
    () => (requestedSlug ? getServiceBySlug(requestedSlug) : undefined),
    [requestedSlug]
  );
  const services = useMemo(
    () =>
      getMergedServices()
        .map(s => ({ slug: s.slug, name: s.service }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const [form, setForm] = useState<FormState>({
    type:
      params.get('type') === 'update' || requestedService ? 'update' : 'new',
    serviceName: requestedService?.service ?? params.get('name') ?? '',
    serviceSlug: requestedService?.slug ?? '',
    category: requestedService?.category?.name ?? '',
    office: requestedService?.officeDivision ?? '',
    details: '',
    sourceUrl: '',
    submitterName: '',
  });
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const isUpdate = form.type === 'update';
  const invalid = (field: string) =>
    status.kind === 'error' && status.fields.includes(field);

  const selectExisting = (slug: string) => {
    const s = slug ? getServiceBySlug(slug) : undefined;
    setForm(f => ({
      ...f,
      serviceSlug: slug,
      serviceName: s?.service ?? f.serviceName,
      category: s?.category?.name ?? f.category,
      office: s?.officeDivision ?? f.office,
    }));
  };

  const emailHref = useMemo(() => {
    const subject = `[Service request] ${isUpdate ? 'Update' : 'New service'}: ${form.serviceName}`;
    const body = [
      `Type: ${isUpdate ? 'Update to existing service' : 'New service'}`,
      `Service: ${form.serviceName}`,
      form.serviceSlug &&
        `Page: ${config.portal.baseUrl}/services/${form.serviceSlug}`,
      form.category && `Category: ${form.category}`,
      form.office && `Office: ${form.office}`,
      '',
      'Details:',
      form.details,
      '',
      form.sourceUrl && `Source: ${form.sourceUrl}`,
      form.submitterName && `From: ${form.submitterName}`,
    ]
      .filter(line => line !== false && line !== undefined)
      .join('\n');
    return `mailto:${config.portal.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form, isUpdate]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus({ kind: 'submitting' });

    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website: data.get('website') }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        number?: number;
        url?: string;
        error?: string;
        code?: string;
        details?: { fields?: string[] };
      };

      if (response.ok && payload.number && payload.url) {
        setStatus({ kind: 'sent', number: payload.number, url: payload.url });
        return;
      }
      if (response.status === 400) {
        setStatus({
          kind: 'error',
          message: payload.error ?? 'Please check the form',
          fields: payload.details?.fields ?? [],
        });
        return;
      }
      setStatus({
        kind: 'fallback',
        reason:
          response.status === 429
            ? 'You have sent a few requests already — please send this one by email instead.'
            : 'Online submission is unavailable right now.',
      });
    } catch {
      setStatus({
        kind: 'fallback',
        reason: 'Online submission is unavailable right now.',
      });
    }
  };

  if (status.kind === 'sent') {
    return (
      <div className='animate-in fade-in duration-500'>
        <SEO
          title='Request sent'
          description='Your service request was filed.'
        />
        <div className='border border-tsinelas-border-subtle-00 bg-tsinelas-notification-background-success p-tsinelas-06'>
          <div className='flex items-start gap-tsinelas-04'>
            <CheckCircle2Icon
              aria-hidden='true'
              className='mt-tsinelas-01 size-tsinelas-icon-02 shrink-0 text-tsinelas-support-success'
            />
            <div className='space-y-tsinelas-03'>
              <h2 className='tsinelas-heading-md text-tsinelas-text-primary'>
                Request #{status.number} sent
              </h2>
              <p className='tsinelas-body-01 text-tsinelas-text-secondary'>
                Thank you. A volunteer will review it and update the directory.
                You can follow progress at{' '}
                <a
                  href={status.url}
                  target='_blank'
                  rel='noreferrer'
                  className='text-tsinelas-link-primary underline hover:text-tsinelas-link-primary-hover'
                >
                  request #{status.number}
                </a>
                — no account needed to read it.
              </p>
              <div className='flex flex-wrap gap-tsinelas-03 pt-tsinelas-02'>
                <Link to='/services'>
                  <Button variant='tertiary' size='sm'>
                    Back to services
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setForm(f => ({ ...f, details: '', sourceUrl: '' }));
                    setStatus({ kind: 'idle' });
                  }}
                >
                  Send another
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='animate-in fade-in duration-500'>
      <SEO
        title={isUpdate ? 'Suggest an update' : 'Request a service listing'}
        description={`Suggest a new service or a correction for the ${config.lgu.name} services directory. No account needed.`}
        keywords={['services', 'request', 'contribute', 'correction']}
      />

      <ModuleHeader
        title={isUpdate ? 'Suggest an update' : 'Request a service listing'}
        description={`Tell us about a ${config.lgu.name} government service that is missing or out of date. No account needed — a volunteer reviews every request.`}
      />

      <form
        onSubmit={submit}
        noValidate
        className='max-w-2xl space-y-tsinelas-06'
      >
        {/* Request type */}
        <fieldset>
          <legend className='mb-tsinelas-03 text-tsinelas-text-secondary tsinelas-label-01'>
            What would you like to do?
          </legend>
          <div className='grid gap-tsinelas-03 sm:grid-cols-2'>
            {(
              [
                ['new', 'Add a service', 'It is not in the directory yet.'],
                [
                  'update',
                  'Correct a service',
                  'Something listed is wrong or outdated.',
                ],
              ] as const
            ).map(([value, label, hint]) => (
              <label
                key={value}
                className={cn(
                  'flex cursor-pointer items-start gap-tsinelas-03 border bg-tsinelas-layer-01 p-tsinelas-04 transition-colors duration-tsinelas-fast-01 ease-tsinelas-standard-productive hover:bg-tsinelas-layer-hover-01',
                  form.type === value
                    ? 'border-tsinelas-border-interactive'
                    : 'border-tsinelas-border-subtle-00'
                )}
              >
                <input
                  type='radio'
                  name='type'
                  value={value}
                  checked={form.type === value}
                  onChange={() => set('type', value)}
                  className='mt-tsinelas-01 size-tsinelas-icon-01 accent-tsinelas-interactive'
                />
                <span>
                  <span className='block text-tsinelas-text-primary tsinelas-heading-compact-01'>
                    {label}
                  </span>
                  <span className='block text-tsinelas-text-secondary tsinelas-helper-text-01'>
                    {hint}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Which service */}
        {isUpdate ? (
          <div>
            <Label htmlFor='serviceSlug'>Which service?</Label>
            <Dropdown
              id='serviceSlug'
              value={form.serviceSlug}
              onChange={selectExisting}
              options={services.map(s => ({ value: s.slug, label: s.name }))}
              placeholder='Choose from the directory'
            />
            <p className={helpText}>
              Can&apos;t find it? Switch to &ldquo;Add a service&rdquo; above.
            </p>
          </div>
        ) : (
          <div>
            <Label htmlFor='serviceName'>Service name</Label>
            <Input
              id='serviceName'
              value={form.serviceName}
              onChange={e => set('serviceName', e.target.value)}
              placeholder='e.g. Business permit renewal'
              invalid={invalid('serviceName')}
              required
              maxLength={120}
            />
            {invalid('serviceName') && (
              <p className={errorText}>Please name the service.</p>
            )}
          </div>
        )}

        <div className='grid gap-tsinelas-05 sm:grid-cols-2'>
          <div>
            <Label htmlFor='category'>Category</Label>
            <Dropdown
              id='category'
              value={form.category}
              onChange={value => set('category', value)}
              options={[
                { value: '', label: 'Not sure' },
                ...serviceCategories.categories.map(c => ({
                  value: c.name,
                  label: c.name,
                })),
              ]}
              placeholder='Not sure'
            />
          </div>
          <div>
            <Label htmlFor='office'>Office or department</Label>
            <Input
              id='office'
              value={form.office}
              onChange={e => set('office', e.target.value)}
              placeholder='e.g. Municipal Health Office'
              maxLength={120}
            />
          </div>
        </div>

        <div>
          <Label htmlFor='details'>
            {isUpdate ? 'What needs to change?' : 'About the service'}
          </Label>
          <Textarea
            id='details'
            value={form.details}
            onChange={e => set('details', e.target.value)}
            rows={7}
            invalid={invalid('details')}
            required
            maxLength={5000}
            placeholder={
              isUpdate
                ? 'What is wrong, and what is the correct information?'
                : 'Who is it for, the steps to avail it, requirements, fees, and where to go.'
            }
          />
          <p className={invalid('details') ? errorText : helpText}>
            {invalid('details')
              ? 'Please add a few more details so a volunteer can act on it.'
              : 'Requests are posted publicly to our tracker, so please leave out personal details like phone numbers.'}
          </p>
        </div>

        <div>
          <Label htmlFor='sourceUrl'>Source (optional)</Label>
          <Input
            id='sourceUrl'
            type='url'
            inputMode='url'
            value={form.sourceUrl}
            onChange={e => set('sourceUrl', e.target.value)}
            placeholder='https://… an official page, post or document'
            invalid={invalid('sourceUrl')}
            maxLength={500}
          />
          <p className={invalid('sourceUrl') ? errorText : helpText}>
            {invalid('sourceUrl')
              ? 'Please paste the full web address, starting with https://'
              : 'An official page or announcement helps volunteers verify it faster.'}
          </p>
        </div>

        <div>
          <Label htmlFor='submitterName'>Your name (optional)</Label>
          <Input
            id='submitterName'
            value={form.submitterName}
            onChange={e => set('submitterName', e.target.value)}
            placeholder='Shown on the public request'
            maxLength={80}
            autoComplete='name'
          />
        </div>

        {/* Honeypot: hidden from people, filled by bots. */}
        <div
          className='absolute -left-[9999px] h-0 w-0 overflow-hidden'
          aria-hidden='true'
        >
          <label>
            Website
            <input
              type='text'
              name='website'
              tabIndex={-1}
              autoComplete='off'
            />
          </label>
        </div>

        {status.kind === 'error' && status.fields.length === 0 && (
          <p role='alert' className={errorText}>
            {status.message}
          </p>
        )}

        {status.kind === 'fallback' ? (
          <div
            role='alert'
            className='space-y-tsinelas-04 border border-tsinelas-border-subtle-00 bg-tsinelas-notification-background-warning p-tsinelas-05'
          >
            <p className='tsinelas-body-01 text-tsinelas-text-primary'>
              {status.reason} Your answers are kept below — send them by email
              instead and we will file the request for you.
            </p>
            <div className='flex flex-wrap gap-tsinelas-03'>
              <a href={emailHref}>
                <Button
                  size='sm'
                  leftIcon={<MailIcon className='size-tsinelas-icon-01' />}
                >
                  Email {config.portal.contactEmail}
                </Button>
              </a>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setStatus({ kind: 'idle' })}
              >
                Try again
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-wrap items-center gap-tsinelas-04 border-t border-tsinelas-border-subtle-00 pt-tsinelas-05'>
            <Button type='submit' isLoading={status.kind === 'submitting'}>
              {isUpdate ? 'Send correction' : 'Send request'}
            </Button>
            <p className='tsinelas-helper-text-01 text-tsinelas-text-helper'>
              Have a GitHub account?{' '}
              <a
                href={GITHUB_TEMPLATE}
                target='_blank'
                rel='noreferrer'
                className='text-tsinelas-link-primary underline hover:text-tsinelas-link-primary-hover'
              >
                File it there
              </a>{' '}
              or{' '}
              <a
                href={emailHref}
                className='text-tsinelas-link-primary underline hover:text-tsinelas-link-primary-hover'
              >
                email us
              </a>
              .
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
