import {ActivityIndicator, Button, StyleSheet} from 'react-native';
import {useRef, useState} from 'react';
import {BarcodeScanningResult, CameraType, CameraView, useCameraPermissions} from 'expo-camera';
import {useRouter} from 'expo-router';
import {ThemedText} from '@/components/themed-text';

const QR_PATTERN = /sppass\/[a-zA-Z0-9]{64}$/;

export function QrScanner({cardId}: { cardId: string | null }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [validationError, setValidationError] = useState<string | null>(null);
    const navigated = useRef(false);
    const router = useRouter();

    function handleBarcodeScanned(result: BarcodeScanningResult) {
        if (!cardId) return;
        if (navigated.current) return;

        setValidationError(null);

        if (!QR_PATTERN.test(result.data)) {
            setValidationError('Invalid QR code');
            return;
        }

        navigated.current = true;
        router.push({pathname: '/scan-result', params: {url: result.data, cardId}});
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    if (!permission) {
        return <ActivityIndicator/>;
    }

    if (!permission.granted) {
        return (
            <>
                <ThemedText style={styles.body}>
                    Missing camera permission.
                </ThemedText>
                <Button title="Grant permission" onPress={requestPermission}/>
            </>
        );
    }

    return (
        <>
            <CameraView
                facing={facing}
                style={styles.cameraView}
                barcodeScannerSettings={{barcodeTypes: ['qr']}}
                onBarcodeScanned={handleBarcodeScanned}
            />
            {validationError && (
                <ThemedText style={styles.errorText}>{validationError}</ThemedText>
            )}
            {validationError && (
                <Button title="Clear" onPress={() => setValidationError(null)}/>
            )}
            <Button title="Flip camera" onPress={toggleCameraFacing}/>
        </>
    );
}

const styles = StyleSheet.create({
    body: {
        marginTop: 12,
        textAlign: 'center',
    },
    cameraView: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        overflow: 'hidden',
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        fontSize: 14,
    },
});
