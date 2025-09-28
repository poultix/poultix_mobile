import React from 'react';
import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import { UserProvider } from './UserContext';
import { FarmProvider } from './FarmContext';
import { ScheduleProvider } from './ScheduleContext';
import { ChatProvider } from './ChatContext';
import { NewsProvider } from './NewsContext';
import { PharmacyProvider } from './PharmacyContext';
import { BottomTabsProvider } from './BottomTabsContext';

interface RootProviderProps {
  children: React.ReactNode;
}


export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AdminProvider>
        <UserProvider>
          <FarmProvider>
            <ScheduleProvider>
                <ChatProvider>
                  <NewsProvider>
                    <PharmacyProvider>
                      <BottomTabsProvider>
                        {children}
                      </BottomTabsProvider>
                    </PharmacyProvider>
                  </NewsProvider>
                </ChatProvider>
            </ScheduleProvider>
          </FarmProvider>
        </UserProvider>
      </AdminProvider>
    </AuthProvider>
  );
};

export default RootProvider;
