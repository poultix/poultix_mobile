import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
  persistent?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification Provider
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notificationData: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const notification: Notification = {
      id,
      duration: 4000, // Default 4 seconds
      ...notificationData,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-hide notification if not persistent
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        hideNotification(id);
      }, notification.duration);
    }
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      hideNotification,
      clearAllNotifications,
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification container component
const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <View style={tw`absolute top-12 left-4 right-4 z-50`} pointerEvents="box-none">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </View>
  );
};

// Individual notification item
const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { hideNotification } = useNotifications();
  const { theme } = useTheme();
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    // Slide in animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    return () => {
      // Cleanup animation
      animation.setValue(0);
    };
  }, []);

  const handleDismiss = () => {
    // Slide out animation
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      hideNotification(notification.id);
    });
  };

  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          backgroundColor: theme.success,
          iconName: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
          iconColor: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: theme.error,
          iconName: 'alert-circle' as keyof typeof Ionicons.glyphMap,
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: theme.warning,
          iconName: 'warning' as keyof typeof Ionicons.glyphMap,
          iconColor: '#FFFFFF',
        };
      case 'info':
        return {
          backgroundColor: theme.info,
          iconName: 'information-circle' as keyof typeof Ionicons.glyphMap,
          iconColor: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: theme.primary,
          iconName: 'notifications' as keyof typeof Ionicons.glyphMap,
          iconColor: '#FFFFFF',
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <Animated.View
      style={[
        tw`mb-3 mx-4 rounded-xl p-4 shadow-lg`,
        {
          backgroundColor: styles.backgroundColor,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: animation,
        },
      ]}
    >
      <View style={tw`flex-row items-start`}>
        {/* Icon */}
        <View style={tw`mr-3 mt-1`}>
          <Ionicons name={styles.iconName} size={24} color={styles.iconColor} />
        </View>

        {/* Content */}
        <View style={tw`flex-1`}>
          <Text style={tw`text-white font-semibold text-base`}>
            {notification.title}
          </Text>
          {notification.message && (
            <Text style={tw`text-white opacity-90 text-sm mt-1`}>
              {notification.message}
            </Text>
          )}

          {/* Action Button */}
          {notification.action && (
            <TouchableOpacity
              style={tw`bg-white bg-opacity-20 self-start px-3 py-2 rounded-lg mt-3`}
              onPress={notification.action.onPress}
            >
              <Text style={tw`text-white font-medium text-sm`}>
                {notification.action.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dismiss Button */}
        <TouchableOpacity style={tw`ml-2`} onPress={handleDismiss}>
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Convenience functions for different notification types
export const createNotificationHelpers = () => {
  const { showNotification } = useNotifications();

  return {
    success: (title: string, message?: string, action?: Notification['action']) =>
      showNotification({ type: 'success', title, message, action }),
    
    error: (title: string, message?: string, action?: Notification['action']) =>
      showNotification({ type: 'error', title, message, action, duration: 6000 }),
    
    warning: (title: string, message?: string, action?: Notification['action']) =>
      showNotification({ type: 'warning', title, message, action }),
    
    info: (title: string, message?: string, action?: Notification['action']) =>
      showNotification({ type: 'info', title, message, action }),
    
    persistent: (type: NotificationType, title: string, message?: string, action?: Notification['action']) =>
      showNotification({ type, title, message, action, persistent: true }),
  };
};

// Toast-style notifications (bottom of screen)
export const ToastNotification: React.FC<{
  visible: boolean;
  message: string;
  type?: NotificationType;
  onDismiss: () => void;
}> = ({ visible, message, type = 'info', onDismiss }) => {
  const { theme } = useTheme();
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(onDismiss);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getToastColor = () => {
    switch (type) {
      case 'success': return theme.success;
      case 'error': return theme.error;
      case 'warning': return theme.warning;
      case 'info': return theme.info;
      default: return theme.primary;
    }
  };

  return (
    <Animated.View
      style={[
        tw`absolute bottom-20 left-4 right-4 p-4 rounded-xl shadow-lg z-50`,
        {
          backgroundColor: getToastColor(),
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
          opacity: animation,
        },
      ]}
    >
      <Text style={tw`text-white font-medium text-center`}>
        {message}
      </Text>
    </Animated.View>
  );
};

// Banner notification (persistent at top)
export const BannerNotification: React.FC<{
  visible: boolean;
  title: string;
  message?: string;
  type?: NotificationType;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}> = ({ visible, title, message, type = 'info', onDismiss, action }) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const getBannerColor = () => {
    switch (type) {
      case 'success': return theme.success;
      case 'error': return theme.error;
      case 'warning': return theme.warning;
      case 'info': return theme.info;
      default: return theme.primary;
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      default: return 'notifications';
    }
  };

  return (
    <View
      style={[
        tw`p-4 flex-row items-center`,
        { backgroundColor: getBannerColor() }
      ]}
    >
      <Ionicons name={getIconName() as any} size={24} color="#FFFFFF" style={tw`mr-3`} />
      
      <View style={tw`flex-1`}>
        <Text style={tw`text-white font-semibold`}>{title}</Text>
        {message && (
          <Text style={tw`text-white opacity-90 text-sm mt-1`}>{message}</Text>
        )}
      </View>

      <View style={tw`flex-row items-center`}>
        {action && (
          <TouchableOpacity
            style={tw`bg-white bg-opacity-20 px-3 py-2 rounded-lg mr-2`}
            onPress={action.onPress}
          >
            <Text style={tw`text-white font-medium text-sm`}>
              {action.label}
            </Text>
          </TouchableOpacity>
        )}

        {onDismiss && (
          <TouchableOpacity onPress={onDismiss}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
