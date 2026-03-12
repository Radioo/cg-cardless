import React from 'react';
import { Platform, Text } from 'react-native';

import { ErrorScreen } from '@/components/error-screen';
import { type ErrorReport, buildErrorReport } from '@/utils/error-report';

type ErrorHandler = (error: unknown, isFatal?: boolean) => void;

type ErrorUtilsLike = {
    getGlobalHandler: () => ErrorHandler;
    setGlobalHandler: (handler: ErrorHandler) => void;
};

type GlobalWithErrorUtils = typeof globalThis & {
    ErrorUtils?: ErrorUtilsLike;
};

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
    report: ErrorReport | null;
};

class GlobalErrorBoundary extends React.Component<Props, State> {
    private originalHandler: ((error: unknown, isFatal?: boolean) => void) | null = null;
    private webErrorHandler: ((event: ErrorEvent) => void) | null = null;
    private webRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {hasError: false, report: null};
    }

    static getDerivedStateFromError(error: unknown): State {
        return {
            hasError: true,
            report: buildErrorReport(error, 'React Component Error'),
        };
    }

    componentDidCatch(_error: Error, info: React.ErrorInfo) {
        const { componentStack } = info;
        if (this.state.report && componentStack) {
            this.setState(prev => ({
                ...prev,
                report: prev.report ? { ...prev.report, componentStack } : prev.report,
            }));
        }
    }

    componentDidMount() {
        if (Platform.OS === 'web') {
            this.installWebHandlers();
        } else {
            this.installNativeHandler();
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'web') {
            this.removeWebHandlers();
        } else {
            this.removeNativeHandler();
        }
    }

    private installNativeHandler() {
        const g = global as GlobalWithErrorUtils;
        if (g.ErrorUtils) {
            this.originalHandler = g.ErrorUtils.getGlobalHandler();
            g.ErrorUtils.setGlobalHandler((error, isFatal) => {
                const source = isFatal ? 'Fatal JS Error' : 'Uncaught JS Exception';
                this.setState({
                    hasError: true,
                    report: buildErrorReport(error, source),
                });
            });
        }
    }

    private removeNativeHandler() {
        const g = global as GlobalWithErrorUtils;
        if (g.ErrorUtils && this.originalHandler) {
            g.ErrorUtils.setGlobalHandler(this.originalHandler);
        }
    }

    private installWebHandlers() {
        this.webErrorHandler = (event: ErrorEvent) => {
            event.preventDefault();
            this.setState({
                hasError: true,
                report: buildErrorReport(event.error ?? event.message, 'Uncaught JS Exception'),
            });
        };
        this.webRejectionHandler = (event: PromiseRejectionEvent) => {
            event.preventDefault();
            this.setState({
                hasError: true,
                report: buildErrorReport(event.reason, 'Unhandled Promise Rejection'),
            });
        };
        window.addEventListener('error', this.webErrorHandler);
        window.addEventListener('unhandledrejection', this.webRejectionHandler);
    }

    private removeWebHandlers() {
        if (this.webErrorHandler) {
            window.removeEventListener('error', this.webErrorHandler);
        }
        if (this.webRejectionHandler) {
            window.removeEventListener('unhandledrejection', this.webRejectionHandler);
        }
    }

    private handleReset = () => {
        this.setState({hasError: false, report: null});
    };

    render() {
        if (this.state.hasError && this.state.report) {
            try {
                return <ErrorScreen report={this.state.report} onReset={this.handleReset} />;
            } catch {
                return (
                    <Text style={{padding: 40, fontSize: 16, color: 'red'}}>
                        A fatal error occurred and the error screen could not be displayed.
                    </Text>
                );
            }
        }
        return this.props.children;
    }
}

export { GlobalErrorBoundary };
