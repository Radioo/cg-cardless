import {requireNativeModule} from 'expo-modules-core';

type ExitAppModuleType = {
    exitApp(): void;
};

export default requireNativeModule<ExitAppModuleType>('ExitApp');
