# ReelRadar

Sort, explore, and analyze Instagram Reels and TikToks with an open-source Chrome extension.

## Install

### Video walkthrough

<video src="landing/public/tutorial.mp4" controls width="100%"></video>

### Option A — Download release (easiest)

1. **[Download the latest release ZIP](https://github.com/abdullah-elbedwehy/reelradar/releases/latest/download/reelradar-extension-v9.53.zip)**
2. Unzip it — you'll get an `extension/` folder
3. Open `chrome://extensions` → enable **Developer mode** → click **Load unpacked**
4. Select the `extension/` folder → done

### Option B — Clone (for contributors)

```bash
git clone https://github.com/abdullah-elbedwehy/reelradar.git
```

Then follow steps 3–4 above, selecting the `extension/` subfolder.

## What It Does

- Sorts Instagram and TikTok content by views, likes, comments, shares, saves, or date
- Exports sorted results to CSV and XLSX
- Adds in-page download and action buttons on supported content
- Runs entirely in your browser — no account, no server, no telemetry

## Repository Layout

| Path                          | Contents                                           |
| ----------------------------- | -------------------------------------------------- |
| `extension/manifest.json`     | MV3 entry point and permissions                    |
| `extension/background.js`     | Service worker for message routing and local state |
| `extension/popup.html`        | Extension popup                                    |
| `extension/popup_scripts/`    | Popup behavior and UI logic                        |
| `extension/popup_styles/`     | Popup CSS and design tokens                        |
| `extension/Instagram/`        | Instagram content script and page-world script     |
| `extension/Tiktok/`           | TikTok content script and page-world script        |
| `extension/Animate/`          | Vendored Animate.css                               |
| `extension/lib/`              | Vendored SheetJS build                             |
| `landing/`                    | Marketing landing page (React + Vite)              |

## Permissions

| Permission              | Reason                                                 |
| ----------------------- | ------------------------------------------------------ |
| `activeTab`             | Read the active tab URL and detect the platform        |
| `tabs`                  | Coordinate popup and content-script behavior           |
| `declarativeNetRequest` | Intercept TikTok network traffic for metric extraction |
| `webNavigation`         | Detect route changes on SPA navigations                |
| `storage`               | Persist local UI state and feature toggles             |

## DOM Fragility Warning

ReelRadar depends on Instagram and TikTok DOM structure, route formats, `data-e2e` hooks, and embedded data blobs. Expect breakage when either platform changes markup, attributes, or response shapes. Check [Issues](https://github.com/abdullah-elbedwehy/reelradar/issues) for the latest status.

## Third-Party Software

See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for vendored dependency notices.

## License

MIT — see [LICENSE](./LICENSE).
