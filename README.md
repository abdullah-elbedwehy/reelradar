# ReelRadar

Sort, explore, and analyze Instagram Reels and TikToks with an open-source Chrome extension.

## What It Does

- Sorts Instagram and TikTok content by views, likes, comments, shares, saves, or date.
- Exports sorted results to CSV and XLSX.
- Adds in-page download and action buttons on supported content.
- Runs locally for core popup, sorting, and export flows without an external account.

## Current Open-Source Scope

This repository keeps the core extension self-contained. Sorting, export, and download flows work locally without requiring an account or external service.

## Design System

ReelRadar uses an OLED Cyan design language. The full specification lives in [`design/DESIGN.md`](./design/DESIGN.md).

## Load Locally

1. Clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `sortify` folder.

## Repository Layout

| Path                   | Contents                                           |
| ---------------------- | -------------------------------------------------- |
| `manifest.json`        | MV3 entry point and permissions                    |
| `background.js`        | Service worker for message routing and local state |
| `popup.html`           | Extension popup                                    |
| `popup_scripts/`       | Popup behavior and UI logic                        |
| `popup_styles/`        | Popup CSS and ReelRadar design tokens              |
| `Instagram/`           | Instagram content script and page-world script     |
| `Tiktok/`              | TikTok content script and page-world script        |
| `design/`              | Design system specification                        |
| `plan/`                | Transformation plan and project history            |
| `Animate/animate.css`  | Vendored Animate.css                               |
| `lib/xlsx.full.min.js` | Vendored SheetJS build                             |

## Permissions

| Permission              | Reason                                                 |
| ----------------------- | ------------------------------------------------------ |
| `activeTab`             | Read the active tab URL and detect the platform        |
| `tabs`                  | Coordinate popup and content-script behavior           |
| `declarativeNetRequest` | Intercept TikTok network traffic for metric extraction |
| `webNavigation`         | Detect route changes on SPA navigations                |
| `storage`               | Persist local UI state and feature toggles             |

## DOM Fragility Warning

ReelRadar depends on Instagram and TikTok DOM structure, route formats, `data-e2e` hooks, and embedded data blobs. Those selectors are preserved intentionally. Expect breakage when either platform changes markup, attributes, or response shapes.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Third-Party Software

See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for vendored dependency notices.

## License

MIT — see [LICENSE](./LICENSE).
