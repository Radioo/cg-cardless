import { Platform } from 'react-native';
import { ExitApp } from '@/modules/exit-app';

export function closeApp(onWeb: () => void) {
    if (Platform.OS === 'web') {
        onWeb();
    } else {
        ExitApp.exitApp();
    }
}
