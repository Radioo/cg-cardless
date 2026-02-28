import {ActivityIndicator, Button, StyleSheet} from 'react-native';
import {useState} from 'react';
import {BarcodeScanningResult, CameraType, CameraView, useCameraPermissions} from 'expo-camera';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';

export function QrScanner() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scannedData, setScannedData] = useState<string | null>(null);

    function handleBarcodeScanned(result: BarcodeScanningResult) {
        setScannedData(result.data);
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    if (!permission) {
        return <ActivityIndicator />;
    }

    if (!permission.granted) {
        return (
            <>
                <ThemedText style={styles.body}>
                    Missing camera permission.
                </ThemedText>
                <Button title="Grant permission" onPress={requestPermission} />
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
            {scannedData && (
                <ThemedView style={styles.scannedContainer}>
                    <ThemedText type="subtitle">Scanned QR Code</ThemedText>
                    <ThemedText style={styles.scannedData} selectable>{scannedData}</ThemedText>
                    <Button title="Clear" onPress={() => setScannedData(null)} />
                </ThemedView>
            )}
            <Button title="Flip camera" onPress={toggleCameraFacing} />
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
    scannedContainer: {
        width: '100%',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        gap: 8,
        alignItems: 'center',
    },
    scannedData: {
        textAlign: 'center',
        fontSize: 14,
    },
});
