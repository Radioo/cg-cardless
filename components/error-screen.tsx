import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Fonts } from '@/constants/fonts';
import { NAV_THEME } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCopyFeedback } from '@/hooks/use-copy-feedback';
import { type ErrorReport, formatReportAsText } from '@/utils/error-report';

type ErrorScreenProps = {
    report: ErrorReport;
    onReset: () => void;
};

function ErrorScreen({ report, onReset }: ErrorScreenProps) {
    const { copiedKey: copied, copy } = useCopyFeedback();
    const [stackOpen, setStackOpen] = useState(true);
    const [componentStackOpen, setComponentStackOpen] = useState(false);
    const [envOpen, setEnvOpen] = useState(false);
    const { isDarkColorScheme } = useColorScheme();
    const iconColor = isDarkColorScheme ? NAV_THEME.dark.mutedForeground : NAV_THEME.light.mutedForeground;

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView contentContainerClassName="p-4 pb-12">
                <View className="flex-row items-center gap-2.5 rounded-t-lg bg-destructive p-4">
                    <Ionicons name="alert-circle" size={28} color="white" />
                    <Text className="shrink text-xl font-bold text-destructive-foreground">
                        {report.errorName}
                    </Text>
                </View>
                <View className="mb-4 flex-row">
                    <Badge variant="destructive" className="rounded-none rounded-b-lg">
                        <Text>{report.source}</Text>
                    </Badge>
                </View>

                <Card className="mb-4">
                    <CardContent>
                        <Text>{report.errorMessage}</Text>
                    </CardContent>
                </Card>

                {report.stackTrace ? (
                    <CollapsibleSection
                        title="Stack Trace"
                        open={stackOpen}
                        onToggle={() => setStackOpen(!stackOpen)}
                        iconColor={iconColor}
                    >
                        <Text className="text-xs leading-[18px]" style={{ fontFamily: Fonts.mono }}>
                            {report.stackTrace}
                        </Text>
                    </CollapsibleSection>
                ) : null}

                {report.componentStack ? (
                    <CollapsibleSection
                        title="Component Stack"
                        open={componentStackOpen}
                        onToggle={() => setComponentStackOpen(!componentStackOpen)}
                        iconColor={iconColor}
                    >
                        <Text className="text-xs leading-[18px]" style={{ fontFamily: Fonts.mono }}>
                            {report.componentStack}
                        </Text>
                    </CollapsibleSection>
                ) : null}

                <CollapsibleSection
                    title="Environment"
                    open={envOpen}
                    onToggle={() => setEnvOpen(!envOpen)}
                    iconColor={iconColor}
                >
                    <EnvRow label="Timestamp" value={report.timestamp} />
                    <EnvRow label="Platform" value={report.platform} />
                    <EnvRow label="OS Version" value={report.osVersion} />
                    <EnvRow label="App Version" value={report.appVersion} />
                    <EnvRow label="Device" value={report.deviceName} />
                </CollapsibleSection>

                <View className="mt-2 gap-2.5">
                    <Button onPress={() => copy(formatReportAsText(report))}>
                        <Text>{copied ? 'Copied!' : 'Copy Error Report'}</Text>
                    </Button>
                    <Button variant="secondary" onPress={onReset}>
                        <Text>Try Again</Text>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

type CollapsibleSectionProps = {
    title: string;
    open: boolean;
    onToggle: () => void;
    iconColor: string;
    children: React.ReactNode;
};

function CollapsibleSection({ title, open, onToggle, iconColor, children }: CollapsibleSectionProps) {
    return (
        <Card className="mb-3 overflow-hidden py-0">
            <Pressable className="flex-row items-center justify-between p-3" onPress={onToggle} testID={`toggle-${title}`}>
                <Text className="text-sm font-semibold">{title}</Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={iconColor}
                />
            </Pressable>
            {open ? (
                <>
                    <Separator />
                    <View className="px-3 pb-3 pt-2">{children}</View>
                </>
            ) : null}
        </Card>
    );
}

type EnvRowProps = {
    label: string;
    value: string;
};

function EnvRow({ label, value }: EnvRowProps) {
    return (
        <View className="flex-row justify-between py-1">
            <Text variant="muted">{label}</Text>
            <Text className="text-sm font-medium">{value}</Text>
        </View>
    );
}

export { ErrorScreen };
