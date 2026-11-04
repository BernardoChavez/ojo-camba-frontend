import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SCZ_DEFAULT_CENTER } from '../utils/geoAdapter.ts';

export type ViewMode = 'CITIZEN' | 'COMMAND';
export type TimeSlot = 'ALL' | 'DAY' | 'NIGHT';

export interface AppZoneStats {
  redCount: number;
  yellowCount: number;
  greenCount: number;
  totalIncidents: number;
}

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  timeSlot: TimeSlot;
  setTimeSlot: (slot: TimeSlot) => void;
  activeCoords: [number, number];
  setActiveCoords: (coords: [number, number]) => void;
  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  chatDrawerOpen: boolean;
  setChatDrawerOpen: (open: boolean) => void;
  patrolActive: boolean;
  setPatrolActive: (active: boolean) => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (category: string | null) => void;
  openReportAtCoords: (lat: number, lng: number) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  stats: AppZoneStats;
  setStats: (stats: AppZoneStats) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('CITIZEN');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('ALL');
  const [activeCoords, setActiveCoords] = useState<[number, number]>([SCZ_DEFAULT_CENTER[0], SCZ_DEFAULT_CENTER[1]]);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState<boolean>(false);
  const [patrolActive, setPatrolActive] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [stats, setStats] = useState<AppZoneStats>({
    redCount: 5,
    yellowCount: 2,
    greenCount: 2,
    totalIncidents: 12,
  });

  const openReportAtCoords = (lat: number, lng: number) => {
    setActiveCoords([lat, lng]);
    setReportModalOpen(true);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        timeSlot,
        setTimeSlot,
        activeCoords,
        setActiveCoords,
        reportModalOpen,
        setReportModalOpen,
        chatDrawerOpen,
        setChatDrawerOpen,
        patrolActive,
        setPatrolActive,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        openReportAtCoords,
        refreshTrigger,
        triggerRefresh,
        stats,
        setStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
