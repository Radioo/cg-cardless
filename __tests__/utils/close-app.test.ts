import { Platform } from 'react-native';
import { ExitApp } from '@/modules/exit-app';
import { closeApp } from '@/utils/close-app';

const originalPlatformOS = Platform.OS;

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    Platform.OS = originalPlatformOS;
});

describe('closeApp', () => {
    it('calls the onWeb callback on web', () => {
        Platform.OS = 'web' as typeof Platform.OS;
        const onWeb = jest.fn();

        closeApp(onWeb);

        expect(onWeb).toHaveBeenCalled();
        expect(ExitApp.exitApp).not.toHaveBeenCalled();
    });

    it('calls ExitApp.exitApp on native platforms', () => {
        Platform.OS = 'android' as typeof Platform.OS;
        const onWeb = jest.fn();

        closeApp(onWeb);

        expect(ExitApp.exitApp).toHaveBeenCalled();
        expect(onWeb).not.toHaveBeenCalled();
    });
});
