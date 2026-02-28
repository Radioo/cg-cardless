import {ActivityIndicator, Button, StyleSheet} from 'react-native';
import {Link} from 'expo-router';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useState} from "react";
import {BarcodeScanningResult, CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {useSavedCard} from '@/hooks/use-saved-card';

export default function WelcomeScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const {data: savedCard, isLoading} = useSavedCard();
    const [scannedData, setScannedData] = useState<string | null>(null);

    const hasCard = savedCard !== null && savedCard !== undefined && savedCard.trim().length > 0;

    function handleBarcodeScanned(result: BarcodeScanningResult) {
        setScannedData(result.data);
    }

    if(!permission || isLoading) {
        return <ThemedView style={styles.container}>
            <ActivityIndicator/>
        </ThemedView>
    }

    if(!permission.granted) {
        return <ThemedView style={styles.container}>
            <ThemedText style={styles.body}>
                Missing camera permission.
            </ThemedText>
            <Button title={"Grant permission"} onPress={requestPermission}/>
        </ThemedView>
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Welcome</ThemedText>
            {!hasCard && (
                <ThemedView style={styles.warning}>
                    <ThemedText style={styles.warningText}>
                        No card saved. Please go to Settings to add your card.
                    </ThemedText>
                </ThemedView>
            )}
            <CameraView
                facing={facing}
                style={styles.cameraView}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={handleBarcodeScanned}
            />
            {scannedData && (
                <ThemedView style={styles.scannedContainer}>
                    <ThemedText type="subtitle">Scanned QR Code</ThemedText>
                    <ThemedText style={styles.scannedData} selectable>{scannedData}</ThemedText>
                    <Button title="Clear" onPress={() => setScannedData(null)} />
                </ThemedView>
            )}
            <Button title={"Flip camera"} onPress={toggleCameraFacing}/>
            <Link href="/settings" style={styles.link}>
                <ThemedText type="link">Go to Settings</ThemedText>
            </Link>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 8,
    },
    body: {
        marginTop: 12,
        textAlign: 'center',
    },
    link: {
        marginTop: 24,
        paddingVertical: 15,
    },
    warning: {
        backgroundColor: '#FFF3CD',
        padding: 12,
        borderRadius: 8,
        width: '100%',
    },
    warningText: {
        color: '#856404',
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
    }
});
