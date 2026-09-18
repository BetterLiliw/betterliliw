import { Navigate, Route, Routes } from 'react-router-dom';

import ComponentsPage from './Components';
import DesignSystemPage from './DesignSystem';
import DevShell from './DevShell';

/**
 * Dev-only reference pages for the Tsinelas design system.
 *
 *   /dev/design-system  tokens, type, spacing, layers, motion, grid
 *   /dev/components     every src/components/ui component, live
 *
 * App.tsx only imports this module when `import.meta.env.DEV` is true, so
 * none of it reaches a production bundle.
 */
export default function DevRoutes() {
  return (
    <Routes>
      <Route element={<DevShell />}>
        <Route index element={<Navigate to='design-system' replace />} />
        <Route path='design-system' element={<DesignSystemPage />} />
        <Route path='components' element={<ComponentsPage />} />
        <Route path='*' element={<Navigate to='design-system' replace />} />
      </Route>
    </Routes>
  );
}
