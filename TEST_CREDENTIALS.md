# Test Credentials for Poultix Mobile

## Problem Fixed
The Custom Drawer was not updating when switching between user roles because:
1. It only loaded user info from AsyncStorage once on mount
2. It wasn't listening to changes in the AppContext's currentUser state

## Solution Implemented
1. ✅ Modified `CustomDrawer` to listen to `state.currentUser` from AppContext
2. ✅ Updated `login` function to store role and email in AsyncStorage
3. ✅ Updated `logout` function to clear all user data from AsyncStorage
4. ✅ Drawer now dynamically updates items based on the current user's role

## Test Accounts

### Admin Account
- **Email:** admin@poultix.rw
- **Password:** admin123
- **Access:** All drawer items including Admin Panel and Data Management

### Farmer Accounts
- **Email:** john@gmail.com
- **Password:** farmer123
- **Access:** All drawer items except Admin Panel and Data Management

- **Email:** marie.mukamana@gmail.com
- **Password:** farmer123

### Veterinary Accounts  
- **Email:** dr.patricia@vetcare.rw
- **Password:** vet123
- **Access:** All drawer items except Admin Panel and Data Management

- **Email:** dr.mutesi@animalhealth.rw
- **Password:** vet123

## How to Test

1. Start the app with `npm start` or `expo start`
2. Sign in with a farmer account
3. Open the drawer - you should NOT see Admin Panel or Data Management
4. Sign out (using the drawer's Sign Out button)
5. Sign in with the admin account
6. Open the drawer - you SHOULD now see Admin Panel and Data Management
7. The drawer items should update immediately based on the logged-in user's role

## Key Changes Made

### `/components/CustomDrawer.tsx`
- Added `state` from `useApp()` hook
- Modified `useEffect` to watch `state.currentUser` changes
- User info now updates when currentUser changes in AppContext

### `/contexts/AppContext.tsx`
- `login()` now stores role and email in AsyncStorage
- `logout()` now clears all user data from AsyncStorage
- `loadInitialData()` syncs AsyncStorage with current user data

The drawer will now correctly show/hide admin-only items based on the current user's role!
