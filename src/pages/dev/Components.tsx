import { useState } from 'react';

import {
  ArrowRightIcon,
  BuildingIcon,
  DownloadIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Banner, BannerType } from '@/components/ui/Banner';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/Button';
import {
  Card,
  CardAvatar,
  CardContactInfo,
  CardContent,
  CardDescription,
  CardFooter,
  CardGrid,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Checkbox } from '@/components/ui/Checkbox';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { PaginationControls } from '@/components/ui/Pagination';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Textarea } from '@/components/ui/Textarea';
import SearchInput from '@/components/ui/SearchInput';
import SelectPicker from '@/components/ui/SelectPicker';
import {
  CardSkeleton,
  DirectoryGridSkeleton,
  PageLoadingState,
} from '@/components/ui/Skeletons';
import { StatCard, StatGrid } from '@/components/ui/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';

import { Example, Mono, Section, SpecTable, SubSection } from './primitives';

const buttonVariants: ButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'accent',
  'ghost',
  'link',
];
const buttonSizes: ButtonSize[] = ['sm', 'md', 'lg', 'xl'];
const bannerTypes: BannerType[] = [
  'info',
  'success',
  'warning',
  'error',
  'default',
];
const badgeVariants = [
  'primary',
  'secondary',
  'yellow',
  'success',
  'warning',
  'error',
  'slate',
  'outline',
] as const;

export default function ComponentsPage() {
  return (
    <div>
      <header className='pb-tsinelas-07'>
        <p className='text-tsinelas-text-secondary tsinelas-eyebrow'>
          BetterLiliw design system
        </p>
        <h1 className='mt-tsinelas-02 text-tsinelas-text-primary tsinelas-fluid-heading-05'>
          Components
        </h1>
        <p className='mt-tsinelas-04 max-w-3xl text-tsinelas-text-secondary tsinelas-body-02'>
          Every component in <Mono>src/components/ui</Mono>, rendered live with
          the props it accepts. The first five follow Carbon&rsquo;s component
          anatomy from the Figma kit; the rest predate the Carbon pass and
          inherit its tokens, corners and elevation.
        </p>
      </header>

      <Section
        id='button'
        title='Button'
        lede={
          <>
            Carbon anatomy: label aligned left, icon pinned to the right edge,
            fixed heights from the container scale, a 2px inset focus ring. Text
            is capped at 320px unless <Mono>fullWidth</Mono>. Source:{' '}
            <Mono>src/components/ui/Button.tsx</Mono>
          </>
        }
      >
        <SubSection title='Kinds'>
          <Example
            code={`<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="danger">Danger</Button>
<Button variant="accent">Accent — one per screen</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}
          >
            <div className='flex flex-wrap items-start gap-tsinelas-03'>
              {buttonVariants.map(v => (
                <Button key={v} variant={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </Example>
        </SubSection>

        <SubSection
          title='Sizes'
          lede='sm 32 · md 40 (default, matches field height) · lg 48 (Carbon default) · xl 64.'
        >
          <Example
            code={`<Button size="sm" rightIcon={<ArrowRightIcon className="size-tsinelas-icon-01" />}>Small</Button>`}
          >
            <div className='flex flex-wrap items-start gap-tsinelas-03'>
              {buttonSizes.map(s => (
                <Button
                  key={s}
                  size={s}
                  rightIcon={
                    <ArrowRightIcon className='size-tsinelas-icon-01' />
                  }
                >
                  Size {s}
                </Button>
              ))}
            </div>
          </Example>
        </SubSection>

        <SubSection title='States and icons'>
          <Example
            code={`<Button disabled>Disabled</Button>
<Button isLoading>Saving</Button>
<Button leftIcon={<PlusIcon />}>Add record</Button>
<Button variant="tertiary" rightIcon={<DownloadIcon />}>Download</Button>
<Button iconOnly aria-label="Delete" variant="danger"><TrashIcon /></Button>
<Button fullWidth>Full width</Button>`}
          >
            <div className='flex flex-wrap items-start gap-tsinelas-03'>
              <Button disabled>Disabled</Button>
              <Button variant='tertiary' disabled>
                Disabled tertiary
              </Button>
              <Button isLoading>Saving</Button>
              <Button leftIcon={<PlusIcon className='size-tsinelas-icon-01' />}>
                Add record
              </Button>
              <Button
                variant='tertiary'
                rightIcon={<DownloadIcon className='size-tsinelas-icon-01' />}
              >
                Download
              </Button>
              <Button iconOnly aria-label='Delete' variant='danger'>
                <TrashIcon className='size-tsinelas-icon-01' />
              </Button>
              <Button iconOnly aria-label='Add' variant='ghost'>
                <PlusIcon className='size-tsinelas-icon-01' />
              </Button>
            </div>
            <div className='mt-tsinelas-05'>
              <Button
                fullWidth
                rightIcon={<ArrowRightIcon className='size-tsinelas-icon-01' />}
              >
                Full width
              </Button>
            </div>
          </Example>
        </SubSection>

        <SpecTable
          head={['Prop', 'Type', 'Notes']}
          rows={[
            [
              <Mono key='v'>variant</Mono>,
              'primary | secondary | tertiary | outline | danger | accent | ghost | link',
              'outline is an alias of tertiary',
            ],
            [<Mono key='s'>size</Mono>, 'sm | md | lg | xl', 'default md'],
            [
              <Mono key='f'>fullWidth</Mono>,
              'boolean',
              'removes the 320px cap',
            ],
            [
              <Mono key='l'>isLoading</Mono>,
              'boolean',
              'spinner replaces icons, disables',
            ],
            [
              <Mono key='li'>leftIcon / rightIcon</Mono>,
              'ReactNode',
              'right icon sits 16px from the edge',
            ],
            [
              <Mono key='io'>iconOnly</Mono>,
              'boolean',
              'square; aria-label required',
            ],
          ]}
        />
      </Section>

      <Section
        id='input'
        title='Input & Label'
        lede={
          <>
            Carbon text field: a filled box with one bottom rule, 16px side
            padding, no radius. Uses the contextual <Mono>field</Mono> token, so
            it re-tints inside <Mono>.tsinelas-layer-02</Mono>. Source:{' '}
            <Mono>Input.tsx</Mono>, <Mono>Label.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<Label htmlFor="name">Full name</Label>
<Input id="name" placeholder="Juan dela Cruz" />

<Input size="sm" /> <Input size="lg" />
<Input invalid aria-describedby="err" /> <p id="err" className="tsinelas-helper-text-01 text-tsinelas-text-error">…</p>
<Input disabled value="Read only" />`}
        >
          <div className='grid gap-tsinelas-06 md:grid-cols-2'>
            <div>
              <Label htmlFor='ds-name'>Full name</Label>
              <Input id='ds-name' placeholder='Juan dela Cruz' />
              <p className='mt-tsinelas-02 text-tsinelas-text-helper tsinelas-helper-text-01'>
                As it appears on your ID.
              </p>
            </div>
            <div>
              <Label htmlFor='ds-email'>Email (invalid)</Label>
              <Input
                id='ds-email'
                invalid
                defaultValue='juan@'
                aria-describedby='ds-email-err'
              />
              <p
                id='ds-email-err'
                className='mt-tsinelas-02 text-tsinelas-text-error tsinelas-helper-text-01'
              >
                Enter a complete email address.
              </p>
            </div>
            <div>
              <Label htmlFor='ds-sm'>Small (32)</Label>
              <Input id='ds-sm' size='sm' placeholder='Compact rows' />
            </div>
            <div>
              <Label htmlFor='ds-lg'>Large (48)</Label>
              <Input id='ds-lg' size='lg' placeholder='Hero search' />
            </div>
            <div>
              <Label htmlFor='ds-dis' aria-disabled='true'>
                Disabled
              </Label>
              <Input id='ds-dis' disabled defaultValue='Read only' />
            </div>
            <div className='tsinelas-layer-02 bg-tsinelas-layer-01 p-tsinelas-04'>
              <Label htmlFor='ds-l2'>On layer-01 (field → field-02)</Label>
              <Input id='ds-l2' placeholder='White field on a gray tile' />
            </div>
          </div>
        </Example>
      </Section>

      <Section
        id='dropdown'
        title='Dropdown, Checkbox & Textarea'
        lede={
          <>
            Carbon&apos;s single-select dropdown on the Input recipe: the field
            is the trigger, the list is the shared menu (layer-01, hairline
            border, 40px rows, check on the selected row). Built on Radix, so it
            gets arrow keys, type-ahead and Escape and looks the same on every
            phone — <strong>never use a native</strong>{' '}
            <Mono>&lt;select&gt;</Mono>. Multi-select or filterable lists use{' '}
            <Mono>SelectPicker</Mono>. Source: <Mono>Dropdown.tsx</Mono>,{' '}
            <Mono>Checkbox.tsx</Mono>, <Mono>Textarea.tsx</Mono>
          </>
        }
      >
        <DropdownDemo />
      </Section>

      <Section
        id='banner'
        title='Banner'
        lede={
          <>
            Carbon inline notification: low-contrast fill, a 3px status edge, a
            20px status icon, 48px minimum height, ghost action and a 48×48
            close. Source: <Mono>Banner.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<Banner type="success" title="Saved" description="Your changes are live." onDismiss={…} />
<Banner type="warning" title="Office closed" description="…" cta={{ label: 'See hours', onClick }} />
<Banner type="default" icon={false} title="…" cta={[{ label: 'Primary', variant: 'primary' }, { label: 'Docs', href: '/' }]} />`}
        >
          <div className='space-y-tsinelas-04'>
            {bannerTypes.map(t => (
              <Banner
                key={t}
                type={t}
                title={`${t.charAt(0).toUpperCase() + t.slice(1)} notification`}
                description='Short, specific, and actionable. One sentence is enough.'
                onDismiss={() => undefined}
              />
            ))}
            <Banner
              type='warning'
              title='Municipal Hall is closed on Monday'
              description='Holiday under Proclamation No. 368. Online services stay available.'
              cta={{ label: 'See office hours', onClick: () => undefined }}
            />
            <Banner
              type='default'
              icon={false}
              title='Official directory'
              description='Find contact information for offices at national and local levels.'
              cta={[
                { label: 'View directory', variant: 'primary', size: 'md' },
                { label: 'Learn more', href: '#banner' },
              ]}
            />
          </div>
        </Example>
      </Section>

      <Section
        id='badge'
        title='Badge (Tag)'
        lede={
          <>
            Carbon tag: a 24px pill (18px small), label-01 text, a tinted fill
            with a deep text of the same hue. Source: <Mono>Badge.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<Badge>Ordinance</Badge>
<Badge variant="success" dot>Active</Badge>
<Badge variant="error" size="sm">Closed</Badge>`}
        >
          <div className='flex flex-wrap items-center gap-tsinelas-03'>
            {badgeVariants.map(v => (
              <Badge key={v} variant={v}>
                {v}
              </Badge>
            ))}
          </div>
          <div className='mt-tsinelas-04 flex flex-wrap items-center gap-tsinelas-03'>
            {badgeVariants.map(v => (
              <Badge key={v} variant={v} dot size='sm'>
                {v}
              </Badge>
            ))}
          </div>
        </Example>
      </Section>

      <Section
        id='card'
        title='Card (Tile)'
        lede={
          <>
            Carbon tile: a layer-01 fill defines the box — no border, radius or
            shadow — and it declares layer-02 for its children. Hover steps the
            fill to layer-hover. Source: <Mono>Card.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<Card>
  <CardHeader><CardTitle>Office of the Mayor</CardTitle></CardHeader>
  <CardContent>
    <CardDescription>…</CardDescription>
    <CardContactInfo contact={{ address, phone, email, website }} />
  </CardContent>
  <CardFooter>…</CardFooter>
</Card>
<Card variant="featured" /> <Card variant="slate" hover={false} /> <Card variant="compact" />`}
        >
          <CardGrid columns={3}>
            <Card>
              <CardHeader>
                <div className='flex items-center gap-tsinelas-04'>
                  <CardAvatar name='Mayor' size='sm' />
                  <CardTitle level='h4'>Office of the Mayor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Executive branch of the municipal government.
                </CardDescription>
                <div className='mt-tsinelas-04'>
                  <CardContactInfo
                    contact={{
                      address: 'Municipal Hall, Liliw, Laguna',
                      phone: '(049) 563-2000',
                      email: 'mayor@liliw.gov.ph',
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant='ghost'
                  size='sm'
                  rightIcon={
                    <ArrowRightIcon className='size-tsinelas-icon-01' />
                  }
                >
                  View profile
                </Button>
              </CardFooter>
            </Card>
            <Card variant='featured'>
              <CardContent>
                <Badge variant='primary'>Featured</Badge>
                <CardTitle level='h4' className='mt-tsinelas-03'>
                  Featured tile
                </CardTitle>
                <CardDescription>
                  1px interactive outline, like a selected Carbon tile.
                </CardDescription>
              </CardContent>
            </Card>
            <Card variant='slate' hover={false}>
              <CardContent>
                <CardTitle level='h4'>Slate, no hover</CardTitle>
                <CardDescription>
                  Tile outline (border-tile-01) for static information.
                </CardDescription>
              </CardContent>
            </Card>
          </CardGrid>
        </Example>
      </Section>

      <Section
        id='statcard'
        title='StatCard'
        lede={
          <>
            Key figures with optional trend and icon. Source:{' '}
            <Mono>StatCard.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<StatGrid columns={3} stats={[
  { label: 'Population', value: '38,101', subtext: '2020 census', icon: UsersIcon, trend: { value: 3.2, positive: true } },
  …
]} />`}
        >
          <StatGrid
            columns={3}
            stats={[
              {
                label: 'Population',
                value: '38,101',
                subtext: '2020 census',
                icon: UsersIcon,
                trend: { value: 3.2, positive: true },
              },
              {
                label: 'Barangays',
                value: 33,
                subtext: 'Municipality of Liliw',
                icon: BuildingIcon,
              },
              {
                label: 'Ordinances (2025)',
                value: 47,
                subtext: 'vs 52 last year',
                trend: { value: 9.6, positive: false },
              },
            ]}
          />
          <div className='mt-tsinelas-05 max-w-sm'>
            <StatCard
              label='Single StatCard'
              value='₱ 152.4M'
              subtext='Annual income, 2024'
            />
          </div>
        </Example>
      </Section>

      <Section
        id='tabs'
        title='Tabs'
        lede={
          <>
            Radix tabs. Source: <Mono>Tabs.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>`}
        >
          <Tabs defaultValue='overview'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='documents'>Documents</TabsTrigger>
              <TabsTrigger value='sessions'>Sessions</TabsTrigger>
            </TabsList>
            <TabsContent
              value='overview'
              className='pt-tsinelas-04 text-tsinelas-text-secondary tsinelas-body-01'
            >
              Overview panel.
            </TabsContent>
            <TabsContent
              value='documents'
              className='pt-tsinelas-04 text-tsinelas-text-secondary tsinelas-body-01'
            >
              Documents panel.
            </TabsContent>
            <TabsContent
              value='sessions'
              className='pt-tsinelas-04 text-tsinelas-text-secondary tsinelas-body-01'
            >
              Sessions panel.
            </TabsContent>
          </Tabs>
        </Example>
      </Section>

      <Section
        id='searchinput'
        title='SearchInput'
        lede={
          <>
            Controlled search box with clear control. Source:{' '}
            <Mono>SearchInput.tsx</Mono>
          </>
        }
      >
        <SearchDemo />
      </Section>

      <Section
        id='selectpicker'
        title='SelectPicker'
        lede={
          <>
            Single or multi select with search. Source:{' '}
            <Mono>SelectPicker.tsx</Mono>
          </>
        }
      >
        <SelectDemo />
      </Section>

      <Section
        id='pagination'
        title='Pagination'
        lede={
          <>
            Page and page-size controls for directories. Source:{' '}
            <Mono>Pagination.tsx</Mono>
          </>
        }
      >
        <PaginationDemo />
      </Section>

      <Section
        id='emptystate'
        title='EmptyState'
        lede={
          <>
            Zero-result state with an optional action. Source:{' '}
            <Mono>EmptyState.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<EmptyState title="No results" message="Try a broader search." actionHref="/services" actionLabel="Browse all services" />`}
        >
          <EmptyState
            title='No results'
            message='Try a broader search or clear a filter.'
            actionHref='#emptystate'
            actionLabel='Browse all services'
          />
        </Example>
      </Section>

      <Section
        id='skeletons'
        title='Skeletons'
        lede={
          <>
            Loading placeholders using skeleton-background / skeleton-element.
            Source: <Mono>Skeletons.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<CardSkeleton /> <DirectoryGridSkeleton /> <PageLoadingState message="Loading directory…" />`}
        >
          <div className='space-y-tsinelas-06'>
            <div className='max-w-sm'>
              <CardSkeleton />
            </div>
            <DirectoryGridSkeleton />
            <PageLoadingState message='Loading directory…' />
          </div>
        </Example>
      </Section>

      <Section
        id='timeline'
        title='Timeline'
        lede={
          <>
            Dated milestones. Source: <Mono>Timeline.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<Timeline>
  <TimelineItem year="1571" title="Founding">…</TimelineItem>
  <TimelineItem year="1605" title="Parish established">…</TimelineItem>
</Timeline>`}
        >
          <Timeline>
            <TimelineItem year='1571' title='Founding'>
              Liliw is founded by Gat Tayaw.
            </TimelineItem>
            <TimelineItem year='1605' title='Parish established'>
              The parish of San Juan Bautista is established.
            </TimelineItem>
            <TimelineItem year='1900s' title='Tsinelas capital'>
              Footwear-making becomes the town&rsquo;s signature craft.
            </TimelineItem>
          </Timeline>
        </Example>
      </Section>

      <Section
        id='dialog'
        title='Dialog'
        lede={
          <>
            Radix modal. Source: <Mono>Dialog.tsx</Mono>
          </>
        }
      >
        <Example
          code={`<Dialog>
  <DialogTrigger asChild><Button variant="tertiary">Open dialog</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>…</DialogTitle><DialogDescription>…</DialogDescription></DialogHeader>
    <DialogFooter><Button>Confirm</Button></DialogFooter>
  </DialogContent>
</Dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='tertiary'>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Flag this record for review</DialogTitle>
                <DialogDescription>
                  A volunteer will check the source and correct the entry.
                </DialogDescription>
              </DialogHeader>
              <div className='py-tsinelas-04'>
                <Label htmlFor='ds-reason'>Reason</Label>
                <Input id='ds-reason' placeholder='What looks wrong?' />
              </div>
              <DialogFooter>
                <Button variant='ghost'>Cancel</Button>
                <Button>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Example>
      </Section>

      <Section
        id='scrollarea'
        title='ScrollArea'
        lede={
          <>
            Scroll pane with the slim scrollbar. Source:{' '}
            <Mono>ScrollArea.tsx</Mono>
          </>
        }
      >
        <Example code={`<ScrollArea className="h-48">…</ScrollArea>`}>
          <ScrollArea className='h-48 bg-tsinelas-layer-02 p-tsinelas-04'>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className='border-b border-tsinelas-border-subtle-01 py-tsinelas-03 text-tsinelas-text-primary tsinelas-body-compact-01'
              >
                Barangay {i + 1}
              </div>
            ))}
          </ScrollArea>
        </Example>
      </Section>
    </div>
  );
}

function DropdownDemo() {
  const [office, setOffice] = useState('');
  const options = [
    { value: 'mho', label: 'Municipal Health Office' },
    { value: 'bplo', label: 'Business Permits and Licensing Office' },
    { value: 'mswdo', label: 'Municipal Social Welfare and Development' },
    { value: 'assessor', label: "Municipal Assessor's Office" },
  ];
  return (
    <Example
      code={`<Label htmlFor="office">Office</Label>
<Dropdown id="office" value={office} onChange={setOffice} options={options} placeholder="Choose an office" />

<Dropdown size="sm" … /> <Dropdown invalid … /> <Dropdown disabled … />
<Checkbox label="Online services only" hint={12} checked={v} onChange={…} />
<Textarea id="notes" rows={4} placeholder="…" />`}
    >
      <div className='grid gap-tsinelas-06 md:grid-cols-2'>
        <div>
          <Label htmlFor='ds-office'>Office</Label>
          <Dropdown
            id='ds-office'
            value={office}
            onChange={setOffice}
            options={options}
            placeholder='Choose an office'
          />
        </div>
        <div>
          <Label htmlFor='ds-office-inv'>Invalid</Label>
          <Dropdown
            id='ds-office-inv'
            value=''
            onChange={() => {}}
            options={options}
            invalid
            aria-describedby='ds-office-err'
          />
          <p
            id='ds-office-err'
            className='mt-tsinelas-02 text-tsinelas-text-error tsinelas-helper-text-01'
          >
            Choose the office that handles this.
          </p>
        </div>
        <div>
          <Label htmlFor='ds-office-sm'>Small (32)</Label>
          <Dropdown
            id='ds-office-sm'
            size='sm'
            value={office}
            onChange={setOffice}
            options={options}
          />
        </div>
        <div>
          <Label htmlFor='ds-office-dis' aria-disabled='true'>
            Disabled
          </Label>
          <Dropdown
            id='ds-office-dis'
            value='mho'
            onChange={() => {}}
            options={options}
            disabled
          />
        </div>
        <div className='flex flex-col gap-tsinelas-03 md:col-span-2'>
          <Checkbox label='Online services only' hint={12} defaultChecked />
          <Checkbox label='Include archived' />
          <Checkbox label='Needs a source' disabled />
        </div>
        <div className='md:col-span-2'>
          <Label htmlFor='ds-notes'>Notes</Label>
          <Textarea
            id='ds-notes'
            rows={4}
            placeholder='Anything else a volunteer should know.'
          />
        </div>
      </div>
    </Example>
  );
}

function SearchDemo() {
  const [value, setValue] = useState('');
  return (
    <Example
      code={`<SearchInput value={q} onChangeValue={setQ} placeholder="Search services…" clearable />
<SearchInput size="sm" … /> <SearchInput size="lg" … />`}
    >
      <div className='space-y-tsinelas-04'>
        <SearchInput
          value={value}
          onChangeValue={setValue}
          placeholder='Search services…'
          clearable
        />
        <SearchInput
          value={value}
          onChangeValue={setValue}
          size='sm'
          placeholder='Small'
        />
        <SearchInput
          value={value}
          onChangeValue={setValue}
          size='lg'
          placeholder='Large'
        />
      </div>
    </Example>
  );
}

const barangays = [
  { label: 'Bagong Anyo', value: 'bagong-anyo' },
  { label: 'Bayate', value: 'bayate' },
  { label: 'Calumpang', value: 'calumpang' },
  { label: 'Ilayang Sungi', value: 'ilayang-sungi' },
  { label: 'Kanlurang Bukal', value: 'kanlurang-bukal' },
  { label: 'San Isidro', value: 'san-isidro' },
];

function SelectDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Example
      code={`<SelectPicker options={barangays} selectedValues={selected} onSelect={opts => setSelected(opts.map(o => o.value))} placeholder="Select barangay" searchable clearable />`}
    >
      <div className='grid gap-tsinelas-04 md:grid-cols-2'>
        <SelectPicker
          options={barangays}
          selectedValues={selected}
          onSelect={opts => setSelected(opts.map(o => o.value))}
          placeholder='Select barangay'
          searchable
          clearable
        />
        <SelectPicker
          options={barangays}
          onSelect={() => undefined}
          placeholder='Disabled'
          disabled
        />
      </div>
    </Example>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(3);
  const [perPage, setPerPage] = useState(20);
  return (
    <Example
      code={`<PaginationControls currentPage={page} totalPages={12} resultsPerPage={20} totalItems={231} onPageChange={setPage} onResultsPerPageChange={setPerPage} />`}
    >
      <PaginationControls
        currentPage={page}
        totalPages={Math.ceil(231 / perPage)}
        resultsPerPage={perPage}
        totalItems={231}
        onPageChange={setPage}
        onResultsPerPageChange={n => {
          setPerPage(n);
          setPage(1);
        }}
      />
    </Example>
  );
}
