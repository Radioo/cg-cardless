const {withAndroidManifest} = require('expo/config-plugins');

function addNfcPermissionsAndService(config) {
    return withAndroidManifest(config, (config) => {
        const manifest = config.modResults.manifest;

        // Add NFC permission
        if (!manifest['uses-permission']) {
            manifest['uses-permission'] = [];
        }
        const hasNfcPerm = manifest['uses-permission'].some(
            (p) => p.$?.['android:name'] === 'android.permission.NFC'
        );
        if (!hasNfcPerm) {
            manifest['uses-permission'].push({
                $: {'android:name': 'android.permission.NFC'},
            });
        }

        // Add uses-feature for HCE-F (not required)
        if (!manifest['uses-feature']) {
            manifest['uses-feature'] = [];
        }
        const hasHcefFeature = manifest['uses-feature'].some(
            (f) => f.$?.['android:name'] === 'android.hardware.nfc.hcef'
        );
        if (!hasHcefFeature) {
            manifest['uses-feature'].push({
                $: {
                    'android:name': 'android.hardware.nfc.hcef',
                    'android:required': 'false',
                },
            });
        }

        // Add HCEFService to the application
        const application = manifest.application?.[0];
        if (!application) return config;

        if (!application.service) {
            application.service = [];
        }

        const serviceClass = 'expo.modules.felicaemulator.HCEFService';
        const hasService = application.service.some(
            (s) => s.$?.['android:name'] === serviceClass
        );
        if (!hasService) {
            application.service.push({
                $: {
                    'android:name': serviceClass,
                    'android:exported': 'true',
                    'android:permission': 'android.permission.BIND_NFC_SERVICE',
                },
                'intent-filter': [
                    {
                        action: [
                            {
                                $: {
                                    'android:name': 'android.nfc.cardemulation.action.HOST_NFCF_SERVICE',
                                },
                            },
                        ],
                    },
                ],
                'meta-data': [
                    {
                        $: {
                            'android:name': 'android.nfc.cardemulation.host_nfcf_service',
                            'android:resource': '@xml/host_nfcf_service',
                        },
                    },
                ],
            });
        }

        return config;
    });
}

module.exports = addNfcPermissionsAndService;
