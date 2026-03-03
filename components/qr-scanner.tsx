import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {useCallback, useRef, useState} from 'react';
import {BarcodeScanningResult, CameraType, CameraView, useCameraPermissions} from 'expo-camera';
import {useRouter} from 'expo-router';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {ThemedText} from '@/components/themed-text';
import {ThemedButton} from '@/components/themed-button';
import {useThemeColor} from '@/hooks/use-theme-color';

const QR_PATTERN = /^https:\/\/.+\/sppass\/[a-zA-Z0-9]{64}$/;

export function QrScanner({cardId}: { cardId: string | null }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [validationError, setValidationError] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const navigated = useRef(false);
    const router = useRouter();
    const errorColor = useThemeColor('error');
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
        router.push({pathname: '/scan-result', params: {url: result.data, cardId}});
    }

    function toggleCameraFacing() {
        setCameraReady(false);
        setCameraError(null);
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
                <ThemedButton title="Grant permission" onPress={requestPermission}/>
            </>
        );
    }

    return (
        <>
            {cameraActive && (
                <View style={styles.cameraContainer}>
                    <CameraView
                        key={facing}
                        facing={facing}
                        style={styles.cameraView}
                        barcodeScannerSettings={{barcodeTypes: ['qr']}}
                        onBarcodeScanned={handleBarcodeScanned}
                        onCameraReady={() => setCameraReady(true)}
                        onMountError={(e) => setCameraError(e.message)}
                    />
                    {!cameraReady && !cameraError && <ActivityIndicator style={styles.cameraOverlay}/>}
                    {cameraError && (
                        <ThemedText style={[styles.cameraOverlay, {color: errorColor}]}>
                            Failed to start camera: {cameraError}
                        </ThemedText>
                    )}
                </View>
            )}
            {validationError && (
                <>
                    <ThemedText style={[styles.errorText, {color: errorColor}]}>{validationError}</ThemedText>
                    <ThemedButton title="Clear" variant="secondary" onPress={() => setValidationError(null)}/>
                </>
            )}
            <ThemedButton title="Flip camera" variant="secondary" onPress={toggleCameraFacing}/>
        </>
    );
}

const styles = StyleSheet.create({
    body: {
        marginTop: 12,
        textAlign: 'center',
    },
    cameraContainer: {
        width: '100%',
        height: 300,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraView: {
        ...StyleSheet.absoluteFillObject,
    },
    cameraOverlay: {
        textAlign: 'center',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 14,
    },
});
