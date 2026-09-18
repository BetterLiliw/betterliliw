import { useState } from 'react';

import { cn } from '@/lib/utils';

import {
  Example,
  Mono,
  Section,
  SpecTable,
  SubSection,
  Swatch,
} from './primitives';
import {
  brandType,
  containers,
  durations,
  easings,
  fluidType,
  layout,
  productiveType,
  ramps,
  semanticColorGroups,
  spacing,
} from './tokens';

const breakpoints = [
  ['tsinelas-sm', '320px', '4', '16px', '0'],
  ['tsinelas-md', '672px', '8', '32px', '16px'],
  ['tsinelas-lg', '1056px', '16', '32px', '16px'],
  ['tsinelas-xlg', '1312px', '16', '32px', '16px'],
  ['tsinelas-max', '1584px', '16', '32px', '24px'],
];

export default function DesignSystemPage() {
  return (
    <div>
      <header className='pb-tsinelas-07'>
        <p className='text-tsinelas-text-secondary tsinelas-eyebrow'>
          BetterLiliw design system
        </p>
        <h1 className='mt-tsinelas-02 text-tsinelas-text-primary tsinelas-fluid-heading-05'>
          Tsinelas
        </h1>
        <p className='mt-tsinelas-04 max-w-3xl text-tsinelas-text-secondary tsinelas-body-02'>
          IBM&rsquo;s Carbon Design System wearing the BetterLiliw brand. Carbon
          supplies the architecture — token roles, the 2x grid, the spacing and
          type scales, motion, sharp corners and flat elevation. The Brand
          Guidelines supply every value: five brand colors, four neutrals,
          Poppins for headings and Source Sans 3 for everything else.
        </p>
      </header>

      <Section
        id='overview'
        title='Overview'
        lede='Where Carbon and the brand disagree, the brand wins on what (colors, fonts, weights) and Carbon wins on how (roles, scales, anatomy).'
      >
        <div className='grid gap-tsinelas-05 md:grid-cols-3'>
          {[
            {
              h: 'From Carbon',
              items: [
                'Token model: background → layer-01 → layer-02 → layer-03',
                'Spacing 01–13, layout 01–07, container 01–05',
                'Type scale heading-01…07, body, label, helper, code, fluid display',
                'Motion: fast/moderate/slow, productive vs expressive curves',
                '2x grid: 5 breakpoints, 16px gutters',
                '0px corners, no drop shadows except overlays',
                '2px inset focus ring',
              ],
            },
            {
              h: 'From the brand',
              items: [
                'Deep Navy #1C3A5B — interactive, primary',
                'Sunrise Gold #D28A22 — accent CTA, warning',
                'Lake Teal #306F8E — links, info, secondary',
                'Field Green #305E51 — success, barangay',
                'Sky Tint #CEE2EE — highlight, bands',
                'Poppins 600/700 headings, Source Sans 3 400/600 body',
                'One gold CTA per screen; gold never carries white text',
              ],
            },
            {
              h: 'Where it lives',
              items: [
                'src/styles/tsinelas.css — every token',
                'src/components/ui — Carbon-anatomy components',
                'ARCHITECTURE.md § Design System — rules',
                'docs/reference-implementation-patterns.md § 15 — token cheatsheet',
                'Figma: IBM Carbon Design System (Community) copy',
                'This page: /dev/design-system (dev builds only)',
              ],
            },
          ].map(col => (
            <div key={col.h} className='bg-tsinelas-layer-01 p-tsinelas-05'>
              <h3 className='text-tsinelas-text-primary tsinelas-heading-compact-02'>
                {col.h}
              </h3>
              <ul className='mt-tsinelas-03 space-y-tsinelas-02 text-tsinelas-text-secondary tsinelas-body-compact-01'>
                {col.items.map(i => (
                  <li key={i} className='flex gap-tsinelas-03'>
                    <span
                      className='mt-[7px] size-tsinelas-02 shrink-0 bg-tsinelas-interactive'
                      aria-hidden='true'
                    />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id='color'
        title='Color'
        lede='Semantic roles are the public API. Reach for a primitive ramp only for data visualisation or a documented brand moment. Hex values below are read live from the rendered page.'
      >
        <SubSection
          title='Semantic roles'
          lede={
            <>
              Read a token as role + emphasis + state:{' '}
              <Mono>bg-tsinelas-layer-hover-01</Mono>,{' '}
              <Mono>text-tsinelas-text-secondary</Mono>,{' '}
              <Mono>border-tsinelas-border-subtle-01</Mono>.
            </>
          }
        >
          <div className='space-y-tsinelas-06'>
            {semanticColorGroups.map(group => (
              <div key={group.group}>
                <h4 className='mb-tsinelas-03 text-tsinelas-text-secondary tsinelas-heading-compact-01'>
                  {group.group}
                </h4>
                <div className='grid grid-cols-2 gap-tsinelas-04 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6'>
                  {group.tokens.map(t => (
                    <Swatch key={t.name} {...t} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection
          title='Primitive ramps'
          lede='The brand anchor sits at step 600 of every ramp; 50–500 tint toward white, 700–950 shade toward a cool near-black.'
        >
          <div className='space-y-tsinelas-05'>
            {ramps.map(r => (
              <div key={r.scale}>
                <div className='mb-tsinelas-02 flex items-baseline gap-tsinelas-03'>
                  <span className='text-tsinelas-text-primary tsinelas-heading-compact-01'>
                    {r.label}
                  </span>
                  <Mono>tsinelas-{r.scale}-*</Mono>
                </div>
                <div className='grid grid-cols-11'>
                  {r.steps.map(s => (
                    <RampStep key={s.step} cls={s.cls} step={s.step} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title='Contrast rules'>
          <SpecTable
            head={['Pair', 'Ratio', 'Use']}
            rows={[
              ['Navy on white', '11.6', 'Headings, primary buttons'],
              ['Navy on Sky Tint', '8.7', 'Text on highlight bands'],
              ['White on Field Green', '7.4', 'Success fills'],
              ['White on Lake Teal', '5.5', 'Secondary buttons'],
              ['text-secondary on white', '5.3', 'Supporting text (AA)'],
              ['text-primary on Sunrise Gold', '5.1', 'Accent button label'],
              ['gold-700 on white', '5.1', 'The only gold that may be text'],
              ['White on gold', '2.7', 'Never'],
            ]}
          />
        </SubSection>
      </Section>

      <Section
        id='typography'
        title='Typography'
        lede='Carbon type tokens on the brand faces. Productive tokens are fixed; expressive fluid tokens step up at the 2x-grid breakpoints. Headings are Poppins 600, display is Poppins 700, body is Source Sans 3. Sentence case for headings; all caps only for the eyebrow.'
      >
        <SubSection title='Productive'>
          <div className='divide-y divide-tsinelas-border-subtle-00'>
            {productiveType.map(t => (
              <TypeRow key={t.token} {...t} />
            ))}
          </div>
        </SubSection>
        <SubSection
          title='Expressive (fluid)'
          lede='Resize the window to watch these step through sm → md → lg → xlg → max.'
        >
          <div className='divide-y divide-tsinelas-border-subtle-00'>
            {fluidType.map(t => (
              <TypeRow key={t.token} {...t} sample='Liliw' />
            ))}
          </div>
        </SubSection>
        <SubSection
          title='Brand extensions and legacy names'
          lede='Kept so existing pages keep working. Prefer the Carbon names in new code.'
        >
          <div className='divide-y divide-tsinelas-border-subtle-00'>
            {brandType.map(t => (
              <TypeRow key={t.token} {...t} />
            ))}
          </div>
        </SubSection>
      </Section>

      <Section
        id='spacing'
        title='Spacing'
        lede='Three scales from Carbon: spacing (inside components), layout (between components and sections) and container (fixed control heights).'
      >
        <SubSection
          title='Spacing 01–13'
          lede={
            <>
              Utilities: <Mono>p-tsinelas-05</Mono>,{' '}
              <Mono>gap-tsinelas-03</Mono>, <Mono>mt-tsinelas-07</Mono>.
            </>
          }
        >
          <div className='space-y-tsinelas-02'>
            {spacing.map(s => (
              <ScaleBar
                key={s.token}
                label={s.token}
                px={s.px}
                rem={s.rem}
                cls={s.cls}
              />
            ))}
          </div>
        </SubSection>
        <SubSection
          title='Layout 01–07'
          lede={
            <>
              <Mono>py-tsinelas-layout-04</Mono> between sections.
            </>
          }
        >
          <div className='space-y-tsinelas-02'>
            {layout.map(s => (
              <ScaleBar
                key={s.token}
                label={s.token}
                px={s.px}
                rem={s.rem}
                cls={s.cls}
              />
            ))}
          </div>
        </SubSection>
        <SubSection
          title='Container 01–05'
          lede='Fixed heights: 01 tag, 02 small field, 03 field and default button, 04 large field, 05 extra-large button and list row.'
        >
          <div className='flex items-end gap-tsinelas-05'>
            {containers.map(c => (
              <div key={c.token} className='text-center'>
                <div
                  className={cn('w-tsinelas-09 bg-tsinelas-interactive', c.cls)}
                />
                <div className='mt-tsinelas-02 text-tsinelas-text-primary tsinelas-label-01'>
                  {c.token}
                </div>
                <div className='text-tsinelas-text-helper tsinelas-code-01'>
                  {c.px}px
                </div>
              </div>
            ))}
          </div>
        </SubSection>
        <SubSection title='Icons and fluid spacing'>
          <SpecTable
            head={['Token', 'Value', 'Utility']}
            rows={[
              ['icon-01', '16px', <Mono key='a'>size-tsinelas-icon-01</Mono>],
              ['icon-02', '20px', <Mono key='b'>size-tsinelas-icon-02</Mono>],
              ['fluid-01', '0', <Mono key='c'>py-tsinelas-fluid-01</Mono>],
              ['fluid-02', '2vw', <Mono key='d'>py-tsinelas-fluid-02</Mono>],
              ['fluid-03', '5vw', <Mono key='e'>py-tsinelas-fluid-03</Mono>],
              ['fluid-04', '10vw', <Mono key='f'>py-tsinelas-fluid-04</Mono>],
            ]}
          />
        </SubSection>
      </Section>

      <Section
        id='layers'
        title='Layers'
        lede='The page is background; a tile on it is layer-01; content inside a tile is layer-02; and so on, alternating tint so each is visible on the one below without a border. Components use the contextual tokens and the parent declares the level.'
      >
        <Example
          code={`<div className="bg-tsinelas-background">                      {/* page */}
  <div className="bg-tsinelas-layer-01 tsinelas-layer-02">     {/* tile */}
    <input className="bg-tsinelas-field border-b border-tsinelas-border-strong" />
    <div className="bg-tsinelas-layer tsinelas-layer-03">       {/* nested tile: resolves to layer-02 */}
      <div className="bg-tsinelas-layer">                     {/* resolves to layer-03 */}
    </div>
  </div>
</div>`}
        >
          <div className='bg-tsinelas-background p-tsinelas-05'>
            <LayerLabel>background</LayerLabel>
            <div className='tsinelas-layer-02 mt-tsinelas-03 bg-tsinelas-layer-01 p-tsinelas-05'>
              <LayerLabel>layer-01 · children are layer-02</LayerLabel>
              <div className='mt-tsinelas-03 flex h-tsinelas-container-03 items-center border-b border-tsinelas-border-strong bg-tsinelas-field px-tsinelas-05 text-tsinelas-text-placeholder tsinelas-body-compact-01'>
                field (contextual → field-02)
              </div>
              <div className='tsinelas-layer-03 mt-tsinelas-03 bg-tsinelas-layer p-tsinelas-05'>
                <LayerLabel>
                  layer (→ layer-02) · children are layer-03
                </LayerLabel>
                <div className='mt-tsinelas-03 bg-tsinelas-layer p-tsinelas-05'>
                  <LayerLabel>layer (→ layer-03)</LayerLabel>
                </div>
              </div>
            </div>
          </div>
        </Example>
      </Section>

      <Section
        id='shape'
        title='Shape & elevation'
        lede='Carbon is sharp-cornered and flat. Every Tailwind radius resolves to 0 (rounded-full is untouched, for tags and avatars). The only shadow is the one floating surfaces get.'
      >
        <div className='grid gap-tsinelas-05 md:grid-cols-3'>
          <Example title='rounded-xl → 0'>
            <div className='size-tsinelas-10 rounded-xl bg-tsinelas-interactive' />
          </Example>
          <Example title='rounded-full stays round'>
            <div className='size-tsinelas-10 rounded-full bg-tsinelas-interactive' />
          </Example>
          <Example title='shadow-lg → overlay shadow'>
            <div className='size-tsinelas-10 bg-tsinelas-layer-02 shadow-lg' />
          </Example>
        </div>
        <SpecTable
          head={['Tailwind', 'Resolves to', 'Carbon use']}
          rows={[
            ['rounded-xs … rounded-4xl', '0', 'Every container, button, field'],
            ['rounded-full', '9999px', 'Tags, toggles, avatars'],
            [
              'shadow-2xs, xs, sm, md, inner',
              'none',
              'Tiles and cards are flat',
            ],
            [
              'shadow-lg, xl, 2xl',
              '0 2px 6px 30% navy',
              'Menus, popovers, dialogs',
            ],
          ]}
        />
      </Section>

      <Section
        id='motion'
        title='Motion'
        lede='Productive motion is for interface feedback; expressive motion for moments that carry meaning. Hover a card to play its duration with the standard-productive curve.'
      >
        <SubSection title='Durations'>
          <div className='grid gap-tsinelas-04 sm:grid-cols-2 lg:grid-cols-3'>
            {durations.map(d => (
              <MotionCard
                key={d.token}
                label={d.token}
                detail={`${d.ms}ms · ${d.use}`}
                cls={d.cls}
              />
            ))}
          </div>
        </SubSection>
        <SubSection
          title='Curves'
          lede='All demos use moderate-02 (240ms) so the curve shape is visible.'
        >
          <div className='grid gap-tsinelas-04 sm:grid-cols-2 lg:grid-cols-3'>
            {easings.map(e => (
              <MotionCard
                key={e.token}
                label={e.token}
                detail={e.curve}
                cls={cn('duration-tsinelas-moderate-02', e.cls)}
              />
            ))}
          </div>
        </SubSection>
      </Section>

      <Section
        id='grid'
        title='Grid & breakpoints'
        lede="Carbon's 2x grid. Tailwind's own sm/md/lg/xl/2xl variants are untouched so existing responsive classes keep their meaning; the Carbon set is available as tsinelas-md: and friends."
      >
        <SpecTable
          head={['Variant', 'Min width', 'Columns', 'Gutter', 'Margin']}
          rows={breakpoints.map(b => [
            <Mono key={b[0]}>{b[0]}:</Mono>,
            ...b.slice(1),
          ])}
        />
        <Example
          title='tsinelas-grid container'
          code={`<div className="tsinelas-grid">
  <div className="grid grid-cols-4 gap-tsinelas-07 tsinelas-md:grid-cols-8 tsinelas-lg:grid-cols-16">…</div>
</div>`}
        >
          <div className='grid grid-cols-4 gap-tsinelas-07 tsinelas-md:grid-cols-8 tsinelas-lg:grid-cols-16'>
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-tsinelas-07 bg-tsinelas-highlight',
                  i >= 4 && 'hidden tsinelas-md:block',
                  i >= 8 && 'tsinelas-md:hidden tsinelas-lg:block'
                )}
              />
            ))}
          </div>
        </Example>
      </Section>

      <Section
        id='focus'
        title='Focus'
        lede='A 2px navy outline drawn inside the box so it never shifts layout, on keyboard focus only. Filled controls add the white focus-inset hairline. Tab through the examples.'
      >
        <Example
          code={`<button className="tsinelas-focus">…</button>
<button className="bg-tsinelas-button-primary tsinelas-focus tsinelas-focus-inset">…</button>`}
        >
          <div className='flex flex-wrap gap-tsinelas-05'>
            <button className='h-tsinelas-container-03 bg-tsinelas-layer-02 px-tsinelas-05 text-tsinelas-text-primary tsinelas-body-compact-01 tsinelas-focus'>
              tsinelas-focus
            </button>
            <button className='h-tsinelas-container-03 bg-tsinelas-button-primary px-tsinelas-05 text-tsinelas-text-on-color tsinelas-body-compact-01 tsinelas-focus tsinelas-focus-inset'>
              tsinelas-focus + inset
            </button>
            <input
              placeholder='field'
              className='h-tsinelas-container-03 border-b border-tsinelas-border-strong-01 bg-tsinelas-field-01 px-tsinelas-05 tsinelas-body-compact-01 tsinelas-focus'
            />
          </div>
        </Example>
      </Section>
    </div>
  );
}

function LayerLabel({ children }: { children: string }) {
  return (
    <span className='text-tsinelas-text-secondary tsinelas-label-01'>
      {children}
    </span>
  );
}

function RampStep({ cls, step }: { cls: string; step: number }) {
  return (
    <div className='min-w-0'>
      <div className={cn('h-tsinelas-08', cls)} />
      <div
        className={cn(
          'py-tsinelas-01 text-center tsinelas-code-01',
          step === 600
            ? 'text-tsinelas-text-primary font-semibold'
            : 'text-tsinelas-text-helper'
        )}
      >
        {step}
      </div>
    </div>
  );
}

function TypeRow({
  token,
  spec,
  cls,
  sample = 'Serbisyong tapat para sa bawat Liliweño',
}: {
  token: string;
  spec: string;
  cls: string;
  sample?: string;
}) {
  return (
    <div className='grid items-baseline gap-tsinelas-04 py-tsinelas-04 md:grid-cols-[14rem_1fr]'>
      <div>
        <div className='text-tsinelas-text-primary tsinelas-code-01'>
          tsinelas-{token}
        </div>
        <div className='text-tsinelas-text-helper tsinelas-helper-text-01'>
          {spec}
        </div>
      </div>
      <div className={cn('min-w-0 truncate text-tsinelas-text-primary', cls)}>
        {sample}
      </div>
    </div>
  );
}

function ScaleBar({
  label,
  px,
  rem,
  cls,
}: {
  label: string;
  px: number;
  rem: string;
  cls: string;
}) {
  return (
    <div className='flex items-center gap-tsinelas-04'>
      <div className='w-24 shrink-0 text-tsinelas-text-primary tsinelas-code-01'>
        {label}
      </div>
      <div className={cn('h-tsinelas-04 bg-tsinelas-interactive', cls)} />
      <div className='text-tsinelas-text-helper tsinelas-helper-text-01'>
        {px}px · {rem}
      </div>
    </div>
  );
}

function MotionCard({
  label,
  detail,
  cls,
}: {
  label: string;
  detail: string;
  cls: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <button
      type='button'
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className='bg-tsinelas-layer-01 p-tsinelas-05 text-left tsinelas-focus'
    >
      <div className='h-tsinelas-04 w-full bg-tsinelas-layer-accent-01'>
        <div
          className={cn(
            'h-full bg-tsinelas-interactive transition-[width]',
            cls,
            on ? 'w-full' : 'w-tsinelas-06'
          )}
        />
      </div>
      <div className='mt-tsinelas-03 text-tsinelas-text-primary tsinelas-code-01'>
        {label}
      </div>
      <div className='text-tsinelas-text-helper tsinelas-helper-text-01'>
        {detail}
      </div>
    </button>
  );
}
