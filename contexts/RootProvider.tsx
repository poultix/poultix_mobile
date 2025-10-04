import React from 'react';
import { AdminProvider } from './AdminContext';
import { AuthProvider } from './AuthContext';
import { BottomTabsProvider } from './BottomTabsContext';
import { ChatProvider } from './ChatContext';
import { ErrorProvider } from './ErrorContext';
import { FarmProvider } from './FarmContext';
import { NewsProvider } from './NewsContext';
import { PharmacyProvider } from './PharmacyContext';
import { ScheduleProvider } from './ScheduleContext';
import { UserProvider } from './UserContext';

interface RootProviderProps {
  children: React.ReactNode;
}


export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  return (
    <ErrorProvider>
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
    </ErrorProvider>
  );
};
