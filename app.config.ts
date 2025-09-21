import 'dotenv/config'

export default {
  "expo": {
    "name": "poultix",
    "slug": "poultix",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/logo.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "permissions": {
        "BLUETOOTH_PERIPHERAL_USAGE_DESCRIPTION": "Allow this app to use Bluetooth to connect to devices."
      },
      "bundleIdentifier": "com.anonymous.poultix",
      "config": {
        "googleMapsApiKey": process.env.GOOGLE_MAP_KEY
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/logo.png",
        "backgroundColor": "#ffffff"
      },
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAP_KEY
        },
      },
      "permissions": [
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_CONNECT",
        "BLUETOOTH_SCAN",
        "ACCESS_FINE_LOCATION",
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_CONNECT"
      ],
      "package": "com.anonymous.poultix"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/logo.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/logo.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "react-native-ble-manager",
      [
        "react-native-permissions",
        {
          "ios": [
            "BluetoothPeripheral",
            "LocationAlways",
            "LocationWhenInUse"
          ]
        }
      ],
      [
        "@react-native-google-signin/google-signin", {
          "iosUrlScheme": "com.googleusercontent.apps.480918748504-96eo9ab0g4uac9p4r7kshh2fep039k9g"
        }]
    ],
    "experiments": {
      "typedRoutes": true
    }, 
    extra: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID, 
    }
  }
}