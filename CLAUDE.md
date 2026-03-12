# CLAUDE.md

> **Keep this file up to date.** If you discover new conventions, architectural patterns, or project details that would help future sessions, update this file accordingly.

## Project Overview

CG Cardless is a React Native + Expo mobile/web app for "cardless login" in supported arcade games. Users store a card ID, scan a QR code from a game station, and the app submits the card ID to the game's endpoint. On Android, FeliCa HCE-F (NFC card emulation) is also supported.

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Framework:** React Native 0.81 / React 19 / Expo ~54
- **Routing:** Expo Router 6 (file-based, screens in `app/`)
- **State:** TanStack Query (async/server state) + local `useState` (no Redux/Zustand)
- **Persistence:** AsyncStorage (`saved_card` key), wrapped in TanStack Query hooks
- **Package manager:** npm

## Directory Structure

```
app/               # Expo Router screens (file-based routing)
components/        # Reusable themed UI components
hooks/             # Custom React hooks
constants/         # Fonts, navigation theme colors
lib/               # NativeWind utilities (cn helper)
utils/             # Card encoding (3DES), scan submission, close-app helper
modules/           # Custom Expo native modules (exit-app, felica-emulator)
__tests__/         # Jest unit tests (mirrors source structure)
e2e/               # Playwright E2E tests (web only)
scripts/           # Node utility scripts (icon generation, reset)
assets/            # Images, icons, splash screens
public/            # Static web assets (favicon, apple-touch-icon)
```

## Commands

| Command | Purpose |
|---|---|
| `npm start` | Expo dev server |
| `npm run android` / `ios` / `web` | Platform-specific dev |
| `npm run lint` | ESLint (`expo lint`) |
| `npm test` | Jest unit tests |
| `npm run test:watch` | Jest watch mode |
| `npm run test:ci` | Jest with coverage + forceExit |
| `npm run test:e2e` | Build web export + Playwright |
| `npm run test:e2e:ui` | Playwright UI mode |

## Code Conventions

- **4-space indentation**, `curly` always required, `1tbs` brace style (ESLint enforced)
- **`@/` path alias** for all internal imports (e.g., `@/components/ui/button`)
- **Named exports** for components/hooks; **default exports** only for route screens (Expo Router requirement)
- **NativeWind/Tailwind CSS** for styling via `className` props
- **Vector icons on native:** prefer explicit `color` props over Tailwind text color classes for `@expo/vector-icons`, because web CSS interop can differ from Android/iOS rendering
- **UI primitives** in `components/ui/` (`Text`, `Button`, `Card`, etc.) built on `@rn-primitives` with NativeWind
- **Custom error classes:** `CardConversionError`, `ScanError` extend `Error` with `.name` set

## Architecture Notes

- **Routing:** Root layout (`app/_layout.tsx`) sets up Stack navigator. On web, `pushState`/`replaceState` are patched to always point to `/`.
- **Card encoding:** `utils/card.ts` handles Card ID <-> Display ID conversion using Triple DES (CBC), XOR chaining, 5-bit symbol packing, and a weighted checksum via `crypto-js`.
- **QR scanning:** `expo-camera` CameraView with regex validation (`/^https:\/\/.+\/sppass\/[a-zA-Z0-9]{64}$/`). Camera only active when screen is focused.
- **Native modules:** Custom Expo Modules in `modules/` — `exit-app` (Android/iOS force-quit) and `felica-emulator` (Android-only HCE-F NFC emulation with config plugin for AndroidManifest).
- **Web/PWA:** Static export (`web.output: "static"`). FeliCa disabled on web (stub). Close-app navigates to `/closed` route instead of exiting.

## Testing

- **Jest:** `jest-expo` preset. Setup in `jest.setup.js` (React 19 compat, mocks for expo-camera, expo-router, AsyncStorage, native modules). Test helper `__tests__/helpers.tsx` provides `createWrapper()` for QueryClientProvider.
- **Playwright:** Chromium only, serves `dist/` on port 3000. Tests in `e2e/`.
- Always fix all test errors and warnings when working on tests, especially the one with "A worker process has failed to exit gracefully and has been force exited."

## Key Files

- `app.json` — Expo config (scheme: `cgcardless`, plugins, experiments including `reactCompiler` and `typedRoutes`)
- `eas.json` — EAS build profiles (development, preview, production — all Android)
- `tsconfig.json` — Extends `expo/tsconfig.base`, strict, `@/*` path alias
- `eslint.config.js` — Flat config with `eslint-config-expo`
