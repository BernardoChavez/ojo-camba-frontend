import React from 'react';
import { AppProvider } from '@/core/store/AppContext.tsx';
import { MainLayout } from '@/shared/components/MainLayout.tsx';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
