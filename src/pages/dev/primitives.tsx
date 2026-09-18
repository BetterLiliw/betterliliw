import { ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/** Anchor-linked section with a Carbon heading and optional lede. */
export function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className='scroll-mt-tsinelas-07 border-b border-tsinelas-border-subtle-00 py-tsinelas-09'
    >
      <h2 className='text-tsinelas-text-primary tsinelas-heading-04'>
        {title}
      </h2>
      {lede && (
        <p className='mt-tsinelas-03 max-w-3xl text-tsinelas-text-secondary tsinelas-body-02'>
          {lede}
        </p>
      )}
      <div className='mt-tsinelas-06 space-y-tsinelas-07'>{children}</div>
    </section>
  );
}

export function SubSection({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className='text-tsinelas-text-primary tsinelas-heading-03'>
        {title}
      </h3>
      {lede && (
        <p className='mt-tsinelas-02 max-w-3xl text-tsinelas-text-secondary tsinelas-body-01'>
          {lede}
        </p>
      )}
      <div className='mt-tsinelas-05'>{children}</div>
    </div>
  );
}

/** A live example on a layer-01 tile, with the JSX that produced it. */
export function Example({
  title,
  children,
  code,
  className,
}: {
  title?: string;
  children: ReactNode;
  code?: string;
  className?: string;
}) {
  return (
    <div className='tsinelas-layer-02 bg-tsinelas-layer-01'>
      {title && (
        <div className='border-b border-tsinelas-border-subtle-01 px-tsinelas-05 py-tsinelas-03 text-tsinelas-text-secondary tsinelas-label-01'>
          {title}
        </div>
      )}
      <div className={cn('p-tsinelas-05', className)}>{children}</div>
      {code && <Code>{code}</Code>}
    </div>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre className='overflow-x-auto border-t border-tsinelas-border-subtle-01 bg-tsinelas-background-inverse px-tsinelas-05 py-tsinelas-04 text-tsinelas-text-inverse tsinelas-code-01'>
      <code>{children.trim()}</code>
    </pre>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className='bg-tsinelas-layer-accent-01 px-tsinelas-02 text-tsinelas-text-primary tsinelas-code-01'>
      {children}
    </code>
  );
}

function toHex(rgb: string): string {
  const m = rgb.match(/rgba?\(([^)]+)\)/);
  if (!m) return rgb;
  const parts = m[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  const [r, g, b, a] = parts;
  const hex =
    '#' +
    [r, g, b].map(n => Math.round(n).toString(16).padStart(2, '0')).join('');
  if (a !== undefined && a < 1) return `${hex} @ ${Math.round(a * 100)}%`;
  return hex.toUpperCase();
}

/** Reads the color a token class actually resolves to in the browser. */
function useResolvedColor(
  property: 'backgroundColor' | 'color' | 'borderColor'
) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (ref.current) {
      setValue(toHex(getComputedStyle(ref.current)[property]));
    }
  }, [property]);
  return { ref, value };
}

/** Color swatch that labels itself with the resolved hex. */
export function Swatch({
  cls,
  kind,
  name,
  compact = false,
}: {
  cls: string;
  kind: 'bg' | 'text' | 'border';
  name: string;
  compact?: boolean;
}) {
  const prop =
    kind === 'bg'
      ? 'backgroundColor'
      : kind === 'text'
        ? 'color'
        : 'borderColor';
  const { ref, value } = useResolvedColor(prop);
  return (
    <div className='min-w-0'>
      <div
        ref={ref}
        className={cn(
          'flex items-end border border-tsinelas-border-subtle-00',
          compact ? 'h-tsinelas-08' : 'h-tsinelas-09',
          kind === 'border' && 'border-4',
          kind === 'bg' && 'bg-tsinelas-background',
          cls
        )}
      >
        {kind === 'text' && (
          <span className='p-tsinelas-02 tsinelas-heading-02'>Aa</span>
        )}
      </div>
      <div className='mt-tsinelas-02 truncate text-tsinelas-text-primary tsinelas-label-01'>
        {name}
      </div>
      <div className='truncate text-tsinelas-text-helper tsinelas-code-01'>
        {value}
      </div>
    </div>
  );
}

/** Two-column spec table used for scales. */
export function SpecTable({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full border-collapse text-left'>
        <thead>
          <tr className='border-b border-tsinelas-border-strong-01'>
            {head.map(h => (
              <th
                key={h}
                className='px-tsinelas-04 py-tsinelas-03 text-tsinelas-text-secondary tsinelas-heading-compact-01'
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className='border-b border-tsinelas-border-subtle-00'>
              {r.map((c, j) => (
                <td
                  key={j}
                  className='px-tsinelas-04 py-tsinelas-03 align-middle text-tsinelas-text-primary tsinelas-body-compact-01'
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
