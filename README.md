# Webmarks

A  Chrome extension that lets you highlight and save text from any webpage. Like a highlighter pen, but for the internet.

---

## Description

Webmarks is a lightweight browser extension for anyone who reads a lot online- students, researchers, writers or just curious people. We can select any text on a webpage, do right click on that and click on save to webmarks, and it's saved. No accounts, no cloud, no tracking. Everything stays on your machine.

You can search through all your saved highlights, organize them by color, and export everything as a clean Markdown file whenever you need it.

---

### Popup Dashboard
Click the Webmarks icon in your toolbar to see all your saved highlights. They're grouped by website and each one shows the text, source link, and when you saved it.

### Markdown Export
One click and all your highlights get exported as a `.md` file, neatly organized by site.

---

## How It Works

1. **Select text** — Highlight any text on any webpage with your mouse
2. **Pick a color** — A small toolbar pops up with 5 color dots (amber, green, pink, blue, purple)
3. **Saved instantly** — Your highlight is stored locally in your browser
4. **View anytime** — Click the Webmarks icon in your toolbar to see all highlights
5. **Search** — Use the search bar in the popup to find any highlight instantly
6. **Export** — Click "Export" to download everything as a Markdown file
7. **Right-click option** — You can also save selected text using the right-click context menu (saves in amber by default)

---

## Files

Here's what each file in the `extension/` folder does:

| File | Purpose |
|------|---------|
| `manifest.json` | Tells Chrome what the extension is, what permissions it needs, and which files to load |
| `background.js` | Runs in the background — handles saving, deleting, and exporting highlights using `chrome.storage.local` |
| `content.js` | Injected into every webpage — shows the floating color picker when you select text |
| `content.css` | Styles for the floating toolbar and the "Saved!" toast notification |
| `popup.html` | The popup window that opens when you click the Webmarks icon — shows all your highlights |
| `popup.js` | Logic for the popup — search, render grouped highlights, delete, export to Markdown |
| `icon.png` | The extension icon (shows in toolbar and Chrome extensions page) |

---

## How to Load in Chrome

1. Download the ZIP file from the website (or grab the `extension/` folder from this repo)
2. Unzip the file on your computer
3. Open your browser and go to `chrome://extensions`
4. Turn on **Developer mode** (toggle in the top-right corner)
5. Click **Load unpacked**
6. Select the unzipped folder (the one that has `manifest.json` inside it)
7. Done — you'll see the Webmarks icon in your toolbar

Works on Chrome, Edge, Brave, Arc, Opera, and any Chromium-based browser.

---

## How to Test

Once loaded:

1. Go to any webpage (Wikipedia, a news article, a blog post — anything)
2. Select some text with your mouse (more than 2 characters)
3. You should see a small dark toolbar with 5 colored dots appear above your selection
4. Click any color dot — the text gets saved and a "Saved to Webmarks" toast appears
5. Click the Webmarks icon in your toolbar to open the popup
6. You should see your saved highlight, grouped under the website's domain
7. Try the search bar — type a word from your highlight
8. Click "Export" — a Markdown file should download with your highlights
9. Try right-clicking selected text → "Save highlight to Webmarks"
10. Click "Clear all" in the popup to delete everything

If something doesn't work, open `chrome://extensions`, find Webmarks, and click "Inspect views: service worker" to check for errors.

---

## Tech Stack

| Technology | Usage |
|-----------|-------|
| **Manifest V3** | Latest Chrome extension standard |
| **Vanilla JavaScript** | No frameworks — pure JS for content script, background worker, and popup |
| **Chrome Storage API** | `chrome.storage.local` for saving highlights — data stays on the user's machine |
| **Chrome Context Menus API** | Adds a right-click option to save selected text |
| **HTML + CSS** | Popup UI built with plain HTML and custom CSS (no libraries) |
| **React + Tailwind CSS** | Landing page / marketing site (separate from the extension itself) |
| **Vite** | Build tool for the landing page |

---

## Design

### Colors
The extension uses 5 highlight colors, each meant for a different purpose (though users can use them however they like):

| Color | Hex | Suggested Use |
|-------|-----|---------------|
| Amber | `#F5CE6E` | Ideas and thoughts |
| Green | `#A8D8B9` | Facts and data |
| Pink | `#F4A4A4` | Quotes and opinions |
| Blue | `#A4C8F4` | References and links |
| Purple | `#D4A4F4` | Personal notes |

### UI Style
- **Floating toolbar**: Dark background (`#1a1a1a`), rounded corners, smooth fade-in animation
- **Popup dashboard**: Light, warm background (`#fafaf8`), cards with colored left borders, grouped by website
- **Typography**: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI"`)
- **Toast notification**: Dark pill that slides up from the bottom-right when a highlight is saved
- **Overall feel**: Minimal, warm, paper-like — designed to feel like a real notebook, not a tech product

---

## Privacy

- All data is stored locally on your computer
- Nothing is sent to any server
- No tracking, no analytics, no accounts
- You can delete everything anytime from the popup

---

## License

Free to use. Do whatever you want with it.

Made with love for hackclub
