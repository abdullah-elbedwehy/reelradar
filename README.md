# ReelRadar

> Sort, explore, and analyze Instagram Reels and TikToks — right in your browser.

[![Version](https://img.shields.io/badge/version-v1.1-00d4ff?style=flat-square)](https://github.com/abdullah-elbedwehy/reelradar/releases/latest)
[![License](https://img.shields.io/badge/license-MIT-00d4ff?style=flat-square)](./LICENSE)
[![Chrome Extension](https://img.shields.io/badge/platform-Chrome%20MV3-00d4ff?style=flat-square)](#install)

ReelRadar is an open-source Chrome extension that lets you sort, filter, and export Instagram and TikTok content by views, likes, comments, shares, saves, and date — no account required, no data ever leaves your browser.

---

## Install

### Option A — Download release (recommended)

1. **[Download v1.1 ZIP](https://github.com/abdullah-elbedwehy/reelradar/releases/latest/download/reelradar-extension-v1.1.zip)**
2. Unzip it to get the `extension/` folder
3. Open `chrome://extensions` → enable **Developer mode** → click **Load unpacked**
4. Select the `extension/` folder — done

### Option B — Clone & load

```bash
git clone https://github.com/abdullah-elbedwehy/reelradar.git
cd reelradar
```

Then follow steps 3–4 above, pointing to the `extension/` subfolder.

### Video walkthrough

<video src="landing/public/tutorial.mp4" controls width="100%"></video>

---

## Features

| Feature | Details |
|---|---|
| **Sort by metric** | Views, likes, comments, shares, saves, or date |
| **Multi-platform** | Works on Instagram Reels and TikTok |
| **Export** | Download sorted results as CSV or XLSX |
| **In-page actions** | Download and copy buttons injected directly on supported content |
| **Zero telemetry** | No account, no server, no tracking — runs entirely locally |

---

## How It Works

1. Navigate to an Instagram profile or TikTok page
2. Click the ReelRadar extension icon
3. Choose a sort metric — the page reorders instantly
4. Optionally export to CSV or XLSX for analysis

---

## Repository Layout

| Path | Contents |
|---|---|
| `extension/manifest.json` | MV3 entry point and permissions |
| `extension/background.js` | Service worker for message routing and local state |
| `extension/popup.html` | Extension popup shell |
| `extension/popup_scripts/` | Popup behavior and UI logic |
| `extension/popup_styles/` | Popup CSS and design tokens |
| `extension/Instagram/` | Instagram content script and page-world script |
| `extension/Tiktok/` | TikTok content script and page-world script |
| `extension/platforms/` | Shared platform abstractions |
| `extension/Animate/` | Vendored Animate.css |
| `extension/lib/` | Vendored SheetJS build |
| `landing/` | Marketing landing page (React + Vite, deployed on Vercel) |

---

## Permissions

| Permission | Reason |
|---|---|
| `activeTab` | Detect the current platform from the tab URL |
| `tabs` | Coordinate popup and content-script behavior |
| `declarativeNetRequest` | Intercept TikTok network responses for metric extraction |
| `webNavigation` | Detect route changes in single-page app navigations |
| `storage` | Persist UI state and feature toggles locally |

---

## DOM Fragility

ReelRadar depends on Instagram and TikTok DOM structure, route formats, `data-e2e` hooks, and embedded data blobs. Expect breakage when either platform pushes markup or API changes. Check [Issues](https://github.com/abdullah-elbedwehy/reelradar/issues) for the latest compatibility status before reporting a bug.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports and PRs are welcome.

---

## Third-Party Software

See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for vendored dependency notices.

---

## License

MIT — see [LICENSE](./LICENSE).
