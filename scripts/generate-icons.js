#!/usr/bin/env node
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// --- Configuration ---
const LOGO_COLOR = "#2196F3";
const BG_COLOR = "#E6F4FE";
const SOURCE_SVG = "assets/images/cg-cardless-logo.svg";
const OUTPUT_DIR = "assets/images";

const projectDir = path.resolve(__dirname, "..");
process.chdir(projectDir);

const svgSource = fs.readFileSync(SOURCE_SVG, "utf8");

function coloredSvg(color) {
    return Buffer.from(svgSource.replace(/currentColor/g, color));
}

// Render SVG centered on a square canvas
async function renderIcon({ color, canvasSize, contentSize, bgColor, output }) {
    const svg = coloredSvg(color);

    // Render SVG fitted within contentSize box
    const rendered = await sharp(svg)
        .resize(contentSize, contentSize, { fit: "inside" })
        .png()
        .toBuffer();

    // Composite onto canvas with optional background
    const background = bgColor
        ? { r: parseInt(bgColor.slice(1, 3), 16), g: parseInt(bgColor.slice(3, 5), 16), b: parseInt(bgColor.slice(5, 7), 16), alpha: 1 }
        : { r: 0, g: 0, b: 0, alpha: 0 };

    await sharp({
        create: {
            width: canvasSize,
            height: canvasSize,
            channels: 4,
            background,
        },
    })
        .composite([{ input: rendered, gravity: "centre" }])
        .png()
        .toFile(path.join(OUTPUT_DIR, output));

    console.log(`  ${output} (${canvasSize}x${canvasSize})`);
}

async function main() {
    console.log(`Generating icons from ${SOURCE_SVG}...`);

    // --- Android Adaptive Icon ---
    // Foreground: logo in theme color, padded well within safe zone (inner ~50% of 512)
    await renderIcon({
        color: LOGO_COLOR,
        canvasSize: 512,
        contentSize: 260,
        bgColor: null,
        output: "android-icon-foreground.png",
    });

    // Background: solid color
    await sharp({
        create: { width: 512, height: 512, channels: 4, background: BG_COLOR },
    })
        .png()
        .toFile(path.join(OUTPUT_DIR, "android-icon-background.png"));
    console.log("  android-icon-background.png (512x512)");

    // Monochrome: black logo on transparent, same padding as foreground
    await renderIcon({
        color: "#000000",
        canvasSize: 512,
        contentSize: 260,
        bgColor: null,
        output: "android-icon-monochrome.png",
    });

    // --- iOS ---
    await renderIcon({
        color: LOGO_COLOR,
        canvasSize: 1024,
        contentSize: 700,
        bgColor: BG_COLOR,
        output: "icon.png",
    });

    // --- Web / PWA ---
    await renderIcon({
        color: LOGO_COLOR,
        canvasSize: 48,
        contentSize: 36,
        bgColor: BG_COLOR,
        output: "favicon.png",
    });

    await renderIcon({
        color: LOGO_COLOR,
        canvasSize: 192,
        contentSize: 140,
        bgColor: BG_COLOR,
        output: "pwa-icon-192.png",
    });

    await renderIcon({
        color: LOGO_COLOR,
        canvasSize: 512,
        contentSize: 372,
        bgColor: BG_COLOR,
        output: "pwa-icon-512.png",
    });

    await renderIcon({
        color: LOGO_COLOR,
        canvasSize: 180,
        contentSize: 132,
        bgColor: BG_COLOR,
        output: "apple-touch-icon.png",
    });

    // --- Splash ---
    await renderIcon({
        color: LOGO_COLOR,
        canvasSize: 1024,
        contentSize: 624,
        bgColor: null,
        output: "splash-icon.png",
    });

    console.log(`Done! Generated icons in ${OUTPUT_DIR}/`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
