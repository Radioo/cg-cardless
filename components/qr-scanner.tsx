import {ActivityIndicator, Alert, Button, StyleSheet} from 'react-native';
import {useRef, useState} from 'react';
import {BarcodeScanningResult, CameraType, CameraView, useCameraPermissions} from 'expo-camera';
import {useMutation} from '@tanstack/react-query';
import {ThemedText} from '@/components/themed-text';

const QR_PATTERN = /sppass\/[a-zA-Z0-9]{64}$/;

export function QrScanner({cardId}: { cardId: string | null }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const lastScanTime = useRef(0);

    const {mutate, isPending} = useMutation({
        mutationFn: async (url: string) => {
            const res = await fetch(`${url}/${cardId}`);
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            if (!json.success) throw new Error('Unexpected response');
            return json;
        },
        onSuccess: () => {
            Alert.alert('Success', 'Request completed successfully.');
            setScannedData(null);
            setValidationError(null);
        },
        onError: (error: Error) => {
            Alert.alert('Error', error.message);
            setScannedData(null);
        },
    });

    function handleBarcodeScanned(result: BarcodeScanningResult) {
        if (!cardId) return;
        if (result.data === scannedData) return;

        const now = Date.now();
        if (now - lastScanTime.current < 1000) return;
        lastScanTime.current = now;

        setScannedData(result.data);
        setValidationError(null);

        if (!QR_PATTERN.test(result.data)) {
            setValidationError('Invalid QR code');
            return;
        }

        mutate(result.data);
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
            {isPending && <ActivityIndicator/>}
            {validationError && (
                <ThemedText style={styles.errorText}>{validationError}</ThemedText>
            )}
            {validationError && (
                <Button title="Clear" onPress={() => {
                    setScannedData(null);
                    setValidationError(null);
                }}/>
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
