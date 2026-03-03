import {Platform} from 'react-native';
import {Router} from 'expo-router';
import {ExitApp} from '@/modules/exit-app';

export function closeApp(router: Router) {
    if (Platform.OS === 'web') {
        router.replace('/closed');
    } else {
        ExitApp.exitApp();
    }
}
