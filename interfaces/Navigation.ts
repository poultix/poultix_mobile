import { StackNavigationProp } from '@react-navigation/stack';
import { Device } from './Bluetooth';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Pharmacy } from './Pharmacy';

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    VerifyCode: { email: string };
    VerifyYou: undefined;
    GoogleSignIn: undefined;
    Home: undefined;
    News: undefined;
    AiScreen: undefined;
    Bluetooth_Setting: undefined;
    Bluetooth_Result: { devices: Device[] | null };
    Bluetooth_Pairing: undefined;
    Farmer: undefined;
    Farm: undefined;
    Ph_Reader: undefined;
    Settings: undefined;
    CreateNewPassword: undefined;
    NetworkError: undefined;
    Testing: undefined;
    Veterinary: undefined;
    Pharmacies: {
        pharmacies: Pharmacy[];
    };
    Drawer: undefined; // DrawerNavigator
    Tester: undefined;
};

// Define drawer param list
export type DrawerParamList = {
    Home: undefined;
    Farmer: undefined;
    Farm: undefined;
    Pharmacies: undefined;
    Veterinary: undefined;
    AiScreen: undefined;
    Settings: undefined;
    News: undefined;
};

export type NavigationProps = StackNavigationProp<RootStackParamList> & DrawerNavigationProp<DrawerParamList>;
