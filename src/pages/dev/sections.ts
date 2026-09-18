/** Anchor lists for the dev shell side nav. */
export type NavSection = { id: string; label: string };

export const designSystemSections: NavSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'color', label: 'Color' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'layers', label: 'Layers' },
  { id: 'shape', label: 'Shape & elevation' },
  { id: 'motion', label: 'Motion' },
  { id: 'grid', label: 'Grid & breakpoints' },
  { id: 'focus', label: 'Focus' },
];

export const componentSections: NavSection[] = [
  { id: 'button', label: 'Button' },
  { id: 'input', label: 'Input & Label' },
  { id: 'banner', label: 'Banner' },
  { id: 'badge', label: 'Badge (Tag)' },
  { id: 'card', label: 'Card (Tile)' },
  { id: 'statcard', label: 'StatCard' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'searchinput', label: 'SearchInput' },
  { id: 'selectpicker', label: 'SelectPicker' },
  { id: 'pagination', label: 'Pagination' },
  { id: 'emptystate', label: 'EmptyState' },
  { id: 'skeletons', label: 'Skeletons' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'dialog', label: 'Dialog' },
  { id: 'scrollarea', label: 'ScrollArea' },
];
