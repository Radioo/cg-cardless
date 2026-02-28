import {ActivityIndicator, Button, StyleSheet} from 'react-native';
import {Link, useFocusEffect} from 'expo-router';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {useCallback, useState} from "react";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CARD_STORAGE_KEY = 'saved_card';

export default function WelcomeScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [hasCard, setHasCard] = useState<boolean | null>(null);

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem(CARD_STORAGE_KEY).then((value) => {
                setHasCard(value !== null && value.trim().length > 0);
            });
        }, [])
    );

    if(!permission) {
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
            {hasCard === false && (
                <ThemedView style={styles.warning}>
                    <ThemedText style={styles.warningText}>
                        No card saved. Please go to Settings to add your card.
                    </ThemedText>
                </ThemedView>
            )}
            <CameraView facing={facing} style={styles.cameraView}/>
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
    }
});
