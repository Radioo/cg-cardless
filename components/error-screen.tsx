import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import {useState} from 'react';
import {Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Colors} from '@/constants/theme';
import {useColorScheme} from '@/hooks/use-color-scheme';
import {type ErrorReport, formatReportAsText} from '@/utils/error-report';

type ErrorScreenProps = {
    report: ErrorReport;
    onReset: () => void;
};

export function ErrorScreen({report, onReset}: ErrorScreenProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const [copied, setCopied] = useState(false);
    const [stackOpen, setStackOpen] = useState(true);
    const [componentStackOpen, setComponentStackOpen] = useState(false);
    const [envOpen, setEnvOpen] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(formatReportAsText(report));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const monoFont = Platform.select({
        ios: 'Menlo',
        android: 'monospace',
        default: 'monospace',
    });

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Header */}
                <View style={[styles.header, {backgroundColor: colors.error}]}>
                    <Ionicons name="alert-circle" size={28} color={colors.errorText} />
                    <Text style={[styles.headerTitle, {color: colors.errorText}]}>
                        {report.errorName}
                    </Text>
                </View>
                <View style={styles.sourceBadgeRow}>
                    <View style={[styles.sourceBadge, {backgroundColor: colors.error}]}>
                        <Text style={[styles.sourceBadgeText, {color: colors.errorText}]}>
                            {report.source}
                        </Text>
                    </View>
                </View>

                {/* Error message */}
                <View style={[styles.messageBox, {borderColor: colors.border}]}>
                    <Text style={[styles.messageText, {color: colors.text}]}>
                        {report.errorMessage}
                    </Text>
                </View>

                {/* Stack Trace */}
                {report.stackTrace ? (
                    <CollapsibleSection
                        title="Stack Trace"
                        open={stackOpen}
                        onToggle={() => setStackOpen(!stackOpen)}
                        colors={colors}
                    >
                        <Text style={[styles.mono, {color: colors.text, fontFamily: monoFont}]}>
                            {report.stackTrace}
                        </Text>
                    </CollapsibleSection>
                ) : null}

                {/* Component Stack */}
                {report.componentStack ? (
                    <CollapsibleSection
                        title="Component Stack"
                        open={componentStackOpen}
                        onToggle={() => setComponentStackOpen(!componentStackOpen)}
                        colors={colors}
                    >
                        <Text style={[styles.mono, {color: colors.text, fontFamily: monoFont}]}>
                            {report.componentStack}
                        </Text>
                    </CollapsibleSection>
                ) : null}

                {/* Environment */}
                <CollapsibleSection
                    title="Environment"
                    open={envOpen}
                    onToggle={() => setEnvOpen(!envOpen)}
                    colors={colors}
                >
                    <EnvRow label="Timestamp" value={report.timestamp} colors={colors} />
                    <EnvRow label="Platform" value={report.platform} colors={colors} />
                    <EnvRow label="OS Version" value={report.osVersion} colors={colors} />
                    <EnvRow label="App Version" value={report.appVersion} colors={colors} />
                    <EnvRow label="Device" value={report.deviceName} colors={colors} />
                </CollapsibleSection>

                {/* Actions */}
                <View style={styles.actions}>
                    <Pressable
                        style={[styles.button, {backgroundColor: colors.primary}]}
                        onPress={handleCopy}
                    >
                        <Text style={[styles.buttonText, {color: colors.primaryText}]}>
                            {copied ? 'Copied!' : 'Copy Error Report'}
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, {backgroundColor: colors.secondary}]}
                        onPress={onReset}
                    >
                        <Text style={[styles.buttonText, {color: colors.secondaryText}]}>
                            Try Again
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

type CollapsibleSectionProps = {
    title: string;
    open: boolean;
    onToggle: () => void;
    colors: typeof Colors.light;
    children: React.ReactNode;
};

function CollapsibleSection({title, open, onToggle, colors, children}: CollapsibleSectionProps) {
    return (
        <View style={[styles.section, {borderColor: colors.border}]}>
            <Pressable style={styles.sectionHeader} onPress={onToggle} testID={`toggle-${title}`}>
                <Text style={[styles.sectionTitle, {color: colors.text}]}>{title}</Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.muted}
                />
            </Pressable>
            {open ? <View style={styles.sectionContent}>{children}</View> : null}
        </View>
    );
}

type EnvRowProps = {
    label: string;
    value: string;
    colors: typeof Colors.light;
};

function EnvRow({label, value, colors}: EnvRowProps) {
    return (
        <View style={styles.envRow}>
            <Text style={[styles.envLabel, {color: colors.muted}]}>{label}</Text>
            <Text style={[styles.envValue, {color: colors.text}]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 16,
        paddingBottom: 48,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    sourceBadgeRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    sourceBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    sourceBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    messageBox: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    section: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionContent: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    mono: {
        fontSize: 12,
        lineHeight: 18,
    },
    envRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    envLabel: {
        fontSize: 13,
    },
    envValue: {
        fontSize: 13,
        fontWeight: '500',
    },
    actions: {
        gap: 10,
        marginTop: 8,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
