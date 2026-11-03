# kryfsec desktop

kryfsec is a desktop app to plan, track and write down your cyber security learning.
Everything stays on your computer, unless you turn on encrypted sync with the phone app.
Website: [kryfsec.com](https://kryfsec.com)

There is also a phone app: [kryfsec-mobile](https://github.com/0xbasinas/kryfsec-mobile).

![kryfsec dashboard](screenshots/01-dashboard.png)

## What you can do

- **Dashboard** – study streak, hours this week, 30-day chart, skill radar, activity map, next goals and exams.
- **Roadmap** – 8 skill areas (Networking, Linux, Web, Crypto, Pentesting, Blue team, Cloud, Scripting) with topics. Click a topic to mark it *To do → Learning → Done*. Add your own areas and topics.
- **Journal** – daily notes in Markdown with live preview, tags, study time and a linked topic.
- **Labs & CTFs** – board or list of boxes and challenges (TryHackMe, HTB, PortSwigger, picoCTF…), with flags and a write-up for each.
- **Resources** – courses, books, videos, tools and links, with status and rating.
- **Certifications** – Security+, eJPT, OSCP or any other: steps, progress and exam date timeline.
- **Goals** – goals with deadlines and checklists.
- **Search everywhere** – press `Ctrl+K` for the command palette. `Ctrl+J` starts a new journal entry.
- **Your data** – export / import JSON backups, export everything as Markdown, remove the sample data in one click.
- **Sync** – keep the desktop and phone app in sync. End-to-end encrypted, no account: pair with a QR code. Changes are merged field by field and note text line by line, so edits on two devices are both kept. See below.
- Dark and light theme, a calm, mostly gray palette with one soft accent (Periwinkle, Sage or Rose). Inspired by Linear and Vercel Geist. All text passes WCAG AA contrast.

## Install

- **Windows:** run `kryfsec-Setup-<version>-x64.exe`. The installer is not signed, so Windows SmartScreen may say "Windows protected your PC" → click **More info → Run anyway**. A portable `.zip` is also built.
- **Linux:** `chmod +x kryfsec-<version>-x86_64.AppImage` and run it.

Your data is one file: `kryfsec.json` in the app data folder
(Windows: `%APPDATA%\kryfsec`). Settings → *Your data* shows the exact path. A `.bak` copy is kept next to it.
If you used the app under its old name, your data is copied over the first time kryfsec starts (the old file is kept).

## Sync

Settings → **Sync** → *Turn on sync* makes a sync key and shows it as a QR code.
In the phone app open Settings → Sync and scan it (or paste the key).
Another computer can join with *I have a key*.

- The key never leaves your devices. Data is encrypted (AES-256-GCM) before it is sent,
  so the server at `sync.kryfsec.com` only stores locked data.
- The key is kept with the OS key store (Electron `safeStorage`, DPAPI on Windows).
- **If you lose the key, the synced copy cannot be recovered.** Your data on each device stays.
- Syncs when the app opens, a few seconds after a change, when the window gets focus, every 5 minutes,
  and with *Sync now*. Works offline: changes are kept and sent later.
- Two devices changing different things: both kept. The same note changed in different
  places: merged line by line. The same lines changed on both: the newer one stays and the
  other is saved as "(conflict copy)". Details: [how merging works](https://github.com/0xbasinas/kryfsec-sync/blob/main/docs/merging.md).

Server, shared sync code and self-hosting: [kryfsec-sync](https://github.com/0xbasinas/kryfsec-sync).
The shared code is copied into `src/sync-core/` (do not edit it there).

![Sync settings, dark](screenshots/22-sync-dark.png)
![Sync settings, light](screenshots/23-sync-light.png)

## Develop

Needs Node.js 22+.

```bash
npm install
npm run dev          # start with hot reload
npm run typecheck
npm run lint
npm run build        # typecheck + production build into out/
npm run package:win  # Windows NSIS installer + zip into release/
npm run package:linux
npm run screenshots  # needs an X display, default :5 (e.g. Xvfb)
```

`package:win` works on Linux without Wine: `scripts/nsis-no-wine` lets electron-builder
pull the uninstaller out of the installer with its own built-in reader.

## Stack

Electron 38, electron-vite, React 19, TypeScript, Tailwind CSS 4, zustand,
recharts, react-markdown + remark-gfm, cmdk, Radix UI, Tabler icons, date-fns, sonner.
Sync: @noble/ciphers, @noble/hashes, fflate, node-diff3, qrcode.

## Licenses

MIT – see [LICENSE](LICENSE). Third-party packages: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
