import type { FeeItem } from '@/types/servicesTypes';

interface FeeScheduleProps {
  items: FeeItem[];
}

const headCell =
  'tsinelas-label-01 py-tsinelas-03 pr-tsinelas-04 font-semibold text-tsinelas-text-secondary';

/**
 * FeeSchedule — for services that are really a price list ("pay other
 * payments"): a data table grouped by category, amounts right-aligned in
 * tabular figures.
 */
export function FeeSchedule({ items }: FeeScheduleProps) {
  if (items.length === 0) return null;

  const groups = new Map<string, FeeItem[]>();
  for (const item of items) {
    const key = item.category || 'Other fees';
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const showOffice = items.some(i => i.office);
  const showTime = items.some(i => i.processing_time);
  const columns = 2 + Number(showOffice) + Number(showTime);

  return (
    <div className='overflow-x-auto'>
      <table className='w-full border-collapse text-left'>
        <thead>
          <tr className='border-b border-tsinelas-border-strong-01'>
            <th scope='col' className={headCell}>
              Fee
            </th>
            {showOffice && (
              <th scope='col' className={headCell}>
                Office
              </th>
            )}
            {showTime && (
              <th scope='col' className={headCell}>
                Processing time
              </th>
            )}
            <th
              scope='col'
              className='tsinelas-label-01 py-tsinelas-03 text-right font-semibold text-tsinelas-text-secondary'
            >
              Amount
            </th>
          </tr>
        </thead>
        {[...groups.entries()].map(([category, rows]) => (
          <tbody key={category}>
            {groups.size > 1 && (
              <tr className='bg-tsinelas-layer-01'>
                <th
                  scope='rowgroup'
                  colSpan={columns}
                  className='tsinelas-heading-compact-01 px-tsinelas-03 py-tsinelas-03 text-tsinelas-text-primary'
                >
                  {category}
                </th>
              </tr>
            )}
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className='border-b border-tsinelas-border-subtle-00 align-top'
              >
                <td className='tsinelas-body-01 py-tsinelas-03 pr-tsinelas-04 text-tsinelas-text-primary'>
                  {row.url ? (
                    <a
                      href={row.url}
                      target='_blank'
                      rel='noreferrer'
                      className='text-tsinelas-link-primary hover:underline tsinelas-focus'
                    >
                      {row.name}
                    </a>
                  ) : (
                    row.name
                  )}
                </td>
                {showOffice && (
                  <td className='tsinelas-body-01 py-tsinelas-03 pr-tsinelas-04 text-tsinelas-text-secondary'>
                    {row.office}
                  </td>
                )}
                {showTime && (
                  <td className='tsinelas-body-01 py-tsinelas-03 pr-tsinelas-04 whitespace-nowrap text-tsinelas-text-secondary'>
                    {row.processing_time}
                  </td>
                )}
                <td className='tsinelas-body-01 tsinelas-tabular py-tsinelas-03 text-right whitespace-nowrap text-tsinelas-text-primary'>
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
