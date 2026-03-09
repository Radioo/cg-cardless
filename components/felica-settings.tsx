import { Platform } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSavedCard } from '@/hooks/use-saved-card';
import { useFelicaEmulation } from '@/hooks/use-felica-emulation';

export function FelicaSettings() {
    const { data: savedCard } = useSavedCard();
    const felica = useFelicaEmulation(savedCard);

    if (Platform.OS !== 'android' || !felica.isSupported) {
        return null;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>FeliCa Emulation</CardTitle>
            </CardHeader>
            <CardContent className="items-center gap-3">
                {!felica.isNfcEnabled && (
                    <Text className="text-sm text-destructive">
                        NFC is disabled. Enable it in system settings.
                    </Text>
                )}
                {savedCard && !felica.canEmulate && (
                    <Text variant="muted">
                        Card must start with 02FE to be emulated via HCE-F.
                    </Text>
                )}
                {felica.error && (
                    <Text className="text-sm text-destructive">{felica.error}</Text>
                )}
                <Button
                    variant={felica.isActive ? 'secondary' : 'default'}
                    onPress={felica.isActive ? felica.disable : felica.enable}
                    disabled={felica.loading || !felica.isActive && (!felica.canEmulate || !felica.isNfcEnabled)}
                >
                    <Text>{felica.isActive ? 'Disable Emulation' : 'Enable Emulation'}</Text>
                </Button>
                {felica.isActive && (
                    <Text variant="muted">
                        Keep the app open while scanning. Emulation stops when the app is closed or backgrounded.
                    </Text>
                )}
            </CardContent>
        </Card>
    );
}
