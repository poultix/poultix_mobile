import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BottomTabsContextType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isTabsVisible: boolean;
    setTabsVisible: (visible: boolean) => void;
    currentRoute: string;
    setCurrentRoute: (route: string) => void;
}

const BottomTabsContext = createContext<BottomTabsContextType | undefined>(undefined);

interface BottomTabsProviderProps {
    children: ReactNode;
}

export function BottomTabsProvider({ children }: BottomTabsProviderProps) {
    const [activeTab, setActiveTab] = useState('home');
    const [isTabsVisible, setTabsVisible] = useState(true);
    const [currentRoute, setCurrentRoute] = useState('/');

    return (
        <BottomTabsContext.Provider value={{
            activeTab,
            setActiveTab,
            isTabsVisible,
            setTabsVisible,
            currentRoute,
            setCurrentRoute,
        }}>
            {children}
        </BottomTabsContext.Provider>
    );
}

export function useBottomTabsContext() {
    const context = useContext(BottomTabsContext);
    if (context === undefined) {
        throw new Error('useBottomTabsContext must be used within a BottomTabsProvider');
    }
    return context;
}
