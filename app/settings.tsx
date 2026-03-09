import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
    AlertDialog, AlertDialogAction, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CardSettings } from '@/components/card-settings';
import { FelicaSettings } from '@/components/felica-settings';

type DialogState = {
    open: boolean;
    title: string;
    message: string;
};

export default function SettingsScreen() {
    const router = useRouter();
    const [dialog, setDialog] = useState<DialogState>({ open: false, title: '', message: '' });

    function showDialog(title: string, message: string) {
        setDialog({ open: true, title, message });
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerClassName="grow" keyboardShouldPersistTaps="handled">
                <View className="flex-1 items-center justify-center gap-6 bg-background p-5">
                    <Text variant="h1">Settings</Text>

                    <CardSettings showDialog={showDialog} />
                    <FelicaSettings />

                    <Button variant="secondary" onPress={() => router.back()} testID="back-btn">
                        <Text>Back</Text>
                    </Button>
                </View>
            </ScrollView>

            <AlertDialog open={dialog.open} onOpenChange={(open) => setDialog(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle testID="dialog-title">{dialog.title}</AlertDialogTitle>
                        <AlertDialogDescription testID="dialog-message">{dialog.message}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction testID="dialog-ok-btn" onPress={() => setDialog(prev => ({ ...prev, open: false }))}>
                            <Text>OK</Text>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </KeyboardAvoidingView>
    );
}
