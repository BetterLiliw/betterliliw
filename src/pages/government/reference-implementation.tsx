import { PageHero } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

/**
 * Reference Implementation Page
 *
 * This page demonstrates proper design system patterns and serves as a reference
 * for implementing other pages in BetterLB. It showcases:
 * - Tsinelas semantic token usage
 * - Proper component composition
 * - Responsive layout patterns
 * - Accessibility best practices
 */
export default function ReferenceImplementation() {
  return (
    <div className='min-h-screen bg-tsinelas-bg-surface'>
      <PageHero
        title='Reference Implementation'
        subtitle='Demonstrates design system patterns'
        className='bg-tsinelas-bg-surface-bold border-tsinelas-border-weak'
      />

      <main className='container py-tsinelas-lg'>
        <div className='grid gap-tsinelas-md md:grid-cols-2 lg:grid-cols-3'>
          {/* Card Example 1: Basic Card */}
          <Card className='bg-tsinelas-bg-surface border-tsinelas-border-weak'>
            <CardHeader>
              <h3 className='tsinelas-heading-md text-tsinelas-text-strong'>
                Basic Card
              </h3>
            </CardHeader>
            <CardContent>
              <p className='tsinelas-body-md text-tsinelas-text-support'>
                This card demonstrates proper semantic token usage with Tsinelas
                design system tokens for colors, typography, and spacing.
              </p>
            </CardContent>
          </Card>

          {/* Card Example 2: Status Card */}
          <Card className='bg-tsinelas-bg-surface border-tsinelas-border-weak'>
            <CardHeader>
              <h3 className='tsinelas-heading-md text-tsinelas-text-strong'>
                Status Indicators
              </h3>
            </CardHeader>
            <CardContent>
              <p className='tsinelas-body-md text-tsinelas-text-support mb-tsinelas-sm'>
                Semantic tokens for status and feedback:
              </p>
              <div className='flex flex-col gap-tsinelas-sm'>
                <span className='text-tsinelas-text-success tsinelas-body-sm'>
                  ✓ Success state
                </span>
                <span className='text-tsinelas-text-warning tsinelas-body-sm'>
                  ⚠ Warning state
                </span>
                <span className='text-tsinelas-text-danger tsinelas-body-sm'>
                  ✕ Error state
                </span>
                <span className='text-tsinelas-text-info tsinelas-body-sm'>
                  ℹ Info state
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card Example 3: Typography Scale */}
          <Card className='bg-tsinelas-bg-surface border-tsinelas-border-weak'>
            <CardHeader>
              <h3 className='tsinelas-heading-md text-tsinelas-text-strong'>
                Typography Scale
              </h3>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-tsinelas-md'>
                <p className='tsinelas-heading-lg text-tsinelas-text-strong'>
                  Heading Large
                </p>
                <p className='tsinelas-heading-md text-tsinelas-text-strong'>
                  Heading Medium
                </p>
                <p className='tsinelas-body-lg text-tsinelas-text-support'>
                  Body Large text for emphasis
                </p>
                <p className='tsinelas-body-md text-tsinelas-text-support'>
                  Body Medium standard text
                </p>
                <p className='tsinelas-body-sm text-tsinelas-text-disabled'>
                  Body Small muted text
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card Example 4: Spacing System */}
          <Card className='bg-tsinelas-bg-surface border-tsinelas-border-weak'>
            <CardHeader>
              <h3 className='tsinelas-heading-md text-tsinelas-text-strong'>
                Spacing Tokens
              </h3>
            </CardHeader>
            <CardContent>
              <p className='tsinelas-body-md text-tsinelas-text-support mb-tsinelas-sm'>
                Tsinelas spacing scale follows 4px base unit:
              </p>
              <div className='flex flex-col gap-tsinelas-sm'>
                <div className='bg-tsinelas-bg-surface-raised p-tsinelas-sm'>
                  Small padding (tsinelas-sm)
                </div>
                <div className='bg-tsinelas-bg-surface-raised p-tsinelas-md'>
                  Medium padding (tsinelas-md)
                </div>
                <div className='bg-tsinelas-bg-surface-raised p-tsinelas-lg'>
                  Large padding (tsinelas-lg)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Example 5: Border Variants */}
          <Card className='bg-tsinelas-bg-surface border-tsinelas-border-weak'>
            <CardHeader>
              <h3 className='tsinelas-heading-md text-tsinelas-text-strong'>
                Border Variants
              </h3>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-tsinelas-md'>
                <div className='border-tsinelas-border-weak border p-tsinelas-md'>
                  Weak border (subtle)
                </div>
                <div className='border-tsinelas-border-default border p-tsinelas-md'>
                  Default border
                </div>
                <div className='border-tsinelas-border-strong border p-tsinelas-md'>
                  Strong border (prominent)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Example 6: Interactive States */}
          <Card className='bg-tsinelas-bg-surface border-tsinelas-border-weak'>
            <CardHeader>
              <h3 className='tsinelas-heading-md text-tsinelas-text-strong'>
                Interactive States
              </h3>
            </CardHeader>
            <CardContent>
              <p className='tsinelas-body-md text-tsinelas-text-support mb-tsinelas-sm'>
                Links use semantic link colors:
              </p>
              <a
                href='#'
                className='text-tsinelas-text-link hover:text-tsinelas-text-link-hover tsinelas-body-md'
              >
                Link text (hover to see state)
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Code Example Section */}
        <section className='mt-tsinelas-xl'>
          <h2 className='tsinelas-heading-lg text-tsinelas-text-strong mb-tsinelas-md'>
            Implementation Patterns
          </h2>
          <Card className='bg-tsinelas-bg-surface border-tsinelas-border-weak'>
            <CardContent className='p-tsinelas-lg'>
              <h3 className='tsinelas-heading-md text-tsinelas-text-strong mb-tsinelas-sm'>
                DO: Use Semantic Tokens
              </h3>
              <pre className='bg-tsinelas-bg-surface-bold border-tsinelas-border-weak border p-tsinelas-md text-tsinelas-text-inverse tsinelas-body-sm overflow-x-auto rounded-lg'>
                {`// ✅ Correct - Semantic tokens
<div className="bg-tsinelas-bg-surface border-tsinelas-border-weak">
  <h2 className="tsinelas-heading-md text-tsinelas-text-strong">
    Title
  </h2>
  <p className="tsinelas-body-md text-tsinelas-text-support">
    Description
  </p>
</div>`}
              </pre>
            </CardContent>
          </Card>

          <Card className='bg-tsinelas-bg-surface border-tsinelas-border-weak mt-tsinelas-md'>
            <CardContent className='p-tsinelas-lg'>
              <h3 className='tsinelas-heading-md text-tsinelas-text-strong mb-tsinelas-sm'>
                DON&apos;T: Use Raw Colors
              </h3>
              <pre className='bg-tsinelas-bg-surface-bold border-tsinelas-border-weak border p-tsinelas-md text-tsinelas-text-inverse tsinelas-body-sm overflow-x-auto rounded-lg'>
                {`// ❌ Wrong - Raw color classes
<div className="bg-white border-gray-200">
  <h2 className="text-xl font-semibold text-slate-900">
    Title
  </h2>
  <p className="text-base text-slate-600">
    Description
  </p>
</div>`}
              </pre>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
