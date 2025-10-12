import React from 'react';
import { AdminProvider } from './AdminContext';
import { AuthProvider } from './AuthContext';
import { BottomTabsProvider } from './BottomTabsContext';
import { ChatProvider } from './ChatContext';
import { ErrorProvider } from './ErrorContext';
import { FarmProvider } from './FarmContext';
import { NewsProvider } from './NewsContext';
import { PharmacyProvider } from './PharmacyContext';
import { PharmacyVerificationProvider } from './PharmacyVerificationContext';
import { ScheduleProvider } from './ScheduleContext';
import { UserProvider } from './UserContext';
import { VeterinaryProvider } from './VeterinaryContext';
import { VaccineProvider } from './VaccineContext';
import { SupportProvider } from './SupportContext';
import { ThemeProvider } from './ThemeContext';

interface RootProviderProps {
  children: React.ReactNode;
}


export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  return (
    <ErrorProvider>
      <AuthProvider>
        <ThemeProvider>
          <AdminProvider>
            <UserProvider>
              <FarmProvider>
                <ScheduleProvider>
                    <ChatProvider>
                      <NewsProvider>
                        <PharmacyProvider>
                          <PharmacyVerificationProvider>
                            <VeterinaryProvider>
                              <VaccineProvider>
                                <SupportProvider>
                                  <BottomTabsProvider>
                                    {children}
                                  </BottomTabsProvider>
                                </SupportProvider>
                              </VaccineProvider>
                            </VeterinaryProvider>
                          </PharmacyVerificationProvider>
                        </PharmacyProvider>
                      </NewsProvider>
                    </ChatProvider>
                </ScheduleProvider>
              </FarmProvider>
            </UserProvider>
          </AdminProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorProvider>
  );
};
