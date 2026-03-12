import { buildErrorReport, formatReportAsText, type ErrorReport } from '@/utils/error-report';

describe('buildErrorReport', () => {
    it('builds report from Error instance', () => {
        const error = new TypeError('test error');
        const report = buildErrorReport(error, 'test source');

        expect(report.errorName).toBe('TypeError');
        expect(report.errorMessage).toBe('test error');
        expect(report.source).toBe('test source');
        expect(report.stackTrace).toBeTruthy();
        expect(report.timestamp).toBeTruthy();
    });

    it('builds report from non-Error value', () => {
        const report = buildErrorReport('string error', 'test source');

        expect(report.errorName).toBe('Error');
        expect(report.errorMessage).toBe('string error');
    });

    it('includes component stack when provided', () => {
        const report = buildErrorReport(new Error('test'), 'test', '<App>\n  <Screen>');
        expect(report.componentStack).toBe('<App>\n  <Screen>');
    });
});

describe('formatReportAsText', () => {
    const report: ErrorReport = {
        errorName: 'TypeError',
        errorMessage: 'Cannot read property',
        stackTrace: 'at foo (bar.ts:1)',
        componentStack: '<App>',
        source: 'ErrorBoundary',
        timestamp: '2026-01-01T00:00:00.000Z',
        platform: 'android',
        appVersion: '1.0.0',
        deviceName: 'Test Device',
        osVersion: 'android 14',
    };

    it('includes error name and message', () => {
        const text = formatReportAsText(report);
        expect(text).toContain('TypeError');
        expect(text).toContain('Cannot read property');
    });

    it('includes environment info', () => {
        const text = formatReportAsText(report);
        expect(text).toContain('Platform: android');
        expect(text).toContain('App Version: 1.0.0');
    });

    it('includes stack trace', () => {
        const text = formatReportAsText(report);
        expect(text).toContain('Stack Trace');
        expect(text).toContain('at foo (bar.ts:1)');
    });

    it('includes component stack', () => {
        const text = formatReportAsText(report);
        expect(text).toContain('Component Stack');
        expect(text).toContain('<App>');
    });
});
