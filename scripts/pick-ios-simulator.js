#!/usr/bin/env node
// Prints the device type name of an iPhone simulator that exists on this machine,
// taken from the newest available iOS runtime. Used to set DETOX_IOS_DEVICE in CI.
//
// Usage: xcrun simctl list --json | node scripts/pick-ios-simulator.js

const fs = require("fs");

function versionParts(version) {
    return String(version).split(".").map((part) => Number(part) || 0);
}

function compareVersionsDesc(a, b) {
    const left = versionParts(a.version);
    const right = versionParts(b.version);
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        const diff = (right[i] ?? 0) - (left[i] ?? 0);
        if (diff !== 0) {
            return diff;
        }
    }
    return 0;
}

function pickIphoneDeviceType({ runtimes = [], devicetypes = [], devices = {} }) {
    const iphoneTypeNames = new Map(
        devicetypes
            .filter((type) => type.productFamily === "iPhone")
            .map((type) => [type.identifier, type.name]),
    );
    const iosRuntimes = runtimes
        .filter((runtime) => runtime.isAvailable && runtime.platform === "iOS")
        .sort(compareVersionsDesc);

    for (const runtime of iosRuntimes) {
        const typeNames = (devices[runtime.identifier] ?? [])
            .filter((device) => device.isAvailable && iphoneTypeNames.has(device.deviceTypeIdentifier))
            .map((device) => iphoneTypeNames.get(device.deviceTypeIdentifier))
            .sort();
        if (typeNames.length > 0) {
            return typeNames[0];
        }
    }
    return null;
}

const simctl = JSON.parse(fs.readFileSync(0, "utf8"));
const typeName = pickIphoneDeviceType(simctl);
if (!typeName) {
    console.error("No available iPhone simulator found in `xcrun simctl list --json` output.");
    process.exit(1);
}
console.log(typeName);
