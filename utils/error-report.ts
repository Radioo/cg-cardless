import Constants from 'expo-constants';
import {Platform} from 'react-native';

export type ErrorReport = {
    errorName: string;
    errorMessage: string;
    stackTrace: string;
    componentStack: string;
    source: string;
    timestamp: string;
    platform: string;
    appVersion: string;
    deviceName: string;
    osVersion: string;
};

export function buildErrorReport(
    error: unknown,
    source: string,
    componentStack?: string,
): ErrorReport {
    const err = error instanceof Error ? error : new Error(String(error));

    return {
        errorName: err.name || 'Error',
        errorMessage: err.message || 'Unknown error',
        stackTrace: err.stack || '',
        componentStack: componentStack || '',
        source,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
        appVersion: Constants.expoConfig?.version || 'unknown',
        deviceName: Constants.deviceName || 'unknown',
        osVersion: `${Platform.OS} ${Platform.Version}`,
    };
}

export function formatReportAsText(report: ErrorReport): string {
    const lines = [
        `=== Error Report ===`,
        `Source: ${report.source}`,
        `Time: ${report.timestamp}`,
        `Platform: ${report.platform}`,
        `OS Version: ${report.osVersion}`,
        `App Version: ${report.appVersion}`,
        `Device: ${report.deviceName}`,
        '',
        `--- ${report.errorName} ---`,
        report.errorMessage,
    ];

    if (report.stackTrace) {
        lines.push('', '--- Stack Trace ---', report.stackTrace);
    }

    if (report.componentStack) {
        lines.push('', '--- Component Stack ---', report.componentStack);
    }

    return lines.join('\n');
}
