/** @type {Detox.DetoxConfig} */
module.exports = {
    testRunner: {
        args: {
            $0: 'jest',
            config: 'e2e-ios/jest.config.js',
        },
        jest: {
            setupTimeout: 120000,
            teardownTimeout: 30000,
        },
    },

    apps: {
        'ios.release': {
            type: 'ios.app',
            binaryPath:
                'ios/build/Build/Products/Release-iphonesimulator/CGCardless.app',
            build: [
                'xcodebuild',
                '-workspace ios/CGCardless.xcworkspace',
                '-scheme CGCardless',
                '-configuration Release',
                '-sdk iphonesimulator',
                '-derivedDataPath ios/build',
                '-destination "platform=iOS Simulator,name=iPhone 16,OS=latest"',
                'CODE_SIGNING_ALLOWED=NO',
                '-quiet',
            ].join(' '),
        },
    },

    devices: {
        simulator: {
            type: 'ios.simulator',
            device: {
                type: 'iPhone 16',
            },
        },
    },

    configurations: {
        'ios.sim.release': {
            device: 'simulator',
            app: 'ios.release',
        },
    },
};
