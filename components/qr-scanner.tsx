import { ActivityIndicator, Platform, View } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const QR_PATTERN = /^https:\/\/.+\/sppass\/[a-zA-Z0-9]{64}$/;

export function QrScanner({ cardId }: { cardId: string | null }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [validationError, setValidationError] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const navigated = useRef(false);
    const router = useRouter();
    const isFocused = useIsFocused();
    const cameraActive = Platform.OS === 'web' || isFocused;

    useFocusEffect(useCallback(() => {
        navigated.current = false;
    }, []));

    function handleBarcodeScanned(result: BarcodeScanningResult) {
        if (!cardId) {
            return;
        }
        if (navigated.current) {
            return;
        }

        setValidationError(null);

        if (!QR_PATTERN.test(result.data)) {
            setValidationError('Invalid QR code');
            return;
        }

        navigated.current = true;
        router.push({ pathname: '/scan-result', params: { url: result.data, cardId } });
    }

    function toggleCameraFacing() {
        setCameraReady(false);
        setCameraError(null);
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    if (!permission) {
        return <ActivityIndicator />;
    }

    if (!permission.granted) {
        return (
            <>
                <Text className="mt-3 text-center">
                    Missing camera permission.
                </Text>
                <Button onPress={requestPermission}>
                    <Text>Grant permission</Text>
                </Button>
            </>
        );
    }

    return (
        <>
            {cameraActive && (
                <View className="h-[300px] w-full items-center justify-center overflow-hidden">
                    <CameraView
                        key={facing}
                        facing={facing}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={handleBarcodeScanned}
                        onCameraReady={() => setCameraReady(true)}
                        onMountError={(e) => setCameraError(e.message)}
                    />
                    {!cameraReady && !cameraError && <ActivityIndicator />}
                    {cameraError && (
                        <Text className="text-center text-destructive">
                            Failed to start camera: {cameraError}
                        </Text>
                    )}
                </View>
            )}
            {validationError && (
                <>
                    <Text className="text-center text-sm text-destructive">{validationError}</Text>
                    <Button variant="secondary" onPress={() => setValidationError(null)}>
                        <Text>Clear</Text>
                    </Button>
                </>
            )}
            <Button variant="secondary" onPress={toggleCameraFacing}>
                <Text>Flip camera</Text>
            </Button>
        </>
    );
}
