# Poultix Mobile 🐔

A comprehensive mobile application for smart poultry farm management in Rwanda. Built with React Native and Expo, Poultix helps farmers manage their poultry operations efficiently through modern technology.

## Features

- **Farm Management**: Track chicken health, production, and farm statistics
- **Veterinary Services**: Connect with local veterinarians and schedule visits
- **Vaccination Tracking**: Manage vaccination schedules and records
- **News & Updates**: Stay informed with poultry industry news
- **Chat System**: Communicate with veterinarians and other farmers
- **Pharmacy Integration**: Find and connect with local pharmacies
- **Multi-language Support**: Available in multiple languages for Rwandan users

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Styling**: TailwindCSS with NativeWind
- **State Management**: React Context API
- **Authentication**: Custom auth system with Google OAuth support
- **Location Services**: Expo Location for GPS features
- **Bluetooth**: React Native BLE for IoT device connectivity

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd poultix_mobile
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - **Android**: Press `a` or scan QR code with Expo Go
   - **iOS**: Press `i` or scan QR code with Expo Go
   - **Web**: Press `w` for web version

### Configuration

1. **Server Configuration**: Update the `SERVER_URL` in `services/constants.ts` to point to your backend server

2. **Google OAuth**: The app is pre-configured with Google OAuth credentials in `app.json`

3. **Environment Variables**: Configure any additional environment variables in your Expo configuration

## Project Structure

```
poultix_mobile/
├── app/                    # Main application screens (file-based routing)
│   ├── auth/              # Authentication screens
│   ├── farm/              # Farm management screens
│   ├── chat/              # Messaging functionality
│   ├── news/              # News and articles
│   ├── settings/          # App settings
│   └── user/              # User profile management
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── services/              # API services and utilities
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── constants/             # App constants and configuration
```

## Key Features Implementation

### User Roles
- **Farmers**: Manage farms, track livestock, schedule veterinary visits
- **Veterinarians**: Manage appointments, provide consultations
- **Admins**: System administration and user management

### Real-time Features
- Chat messaging between users
- Live farm health status updates
- Push notifications for important events

### Offline Support
- Critical data cached for offline access
- Sync when connection is restored

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run web version

### Code Style

- ESLint configuration included
- TypeScript for type safety
- Consistent file naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and questions:
- Email: support@poultix.rw
- Technical issues: Create an issue in this repository

## License

© 2024 Poultix. All rights reserved.

---

**Made with ❤️ in Rwanda**
