import React from 'react';
import { AuthProvider } from './AuthContext';
import { AdminProvider } from './AdminContext';
import { UserProvider } from './UserContext';
import { FarmProvider } from './FarmContext';
import { ScheduleProvider } from './ScheduleContext';
import { MessageProvider } from './MessageContext';
import { ChatProvider } from './ChatContext';
import { NewsProvider } from './NewsContext';
import { PharmacyProvider } from './PharmacyContext';

interface RootProviderProps {
  children: React.ReactNode;
}

/**
 * Root provider that wraps all context providers in the correct order.
 * This ensures all contexts are available throughout the app.
 * 
 * Order matters:
 * 1. AuthProvider - Must be first as other contexts may depend on auth state
 * 2. AdminProvider - Admin functionality that may depend on auth
 * 3. Domain-specific providers - User, Farm, Schedule, Message, News, Pharmacy
 */
export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AdminProvider>
        <UserProvider>
          <FarmProvider>
            <ScheduleProvider>
              <MessageProvider>
                <ChatProvider>
                  <NewsProvider>
                    <PharmacyProvider>
                      {children}
                    </PharmacyProvider>
                  </NewsProvider>
                </ChatProvider>
              </MessageProvider>
            </ScheduleProvider>
          </FarmProvider>
        </UserProvider>
      </AdminProvider>
    </AuthProvider>
  );
};

export default RootProvider;
