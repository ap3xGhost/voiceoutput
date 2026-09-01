# Voice Output

A small, dependency-free text-to-speech app. Type or paste text, hit Speak, and it reads it aloud using your device's own built-in voices — no API keys, no subscriptions, no cloud service required.

Because it's a Progressive Web App (PWA), you can install it on any device as if it were a native app.

## Deploy it

1. Create a new GitHub repo and push these files to it.
2. Go to [vercel.com](https://vercel.com), import the repo, and deploy (no build settings needed — it's static files).
3. Vercel gives you an HTTPS URL — that's required for the app to be installable.

## Install it on a device

- **Mac / Chrome (any OS):** open the URL, click the install icon in the address bar (or menu → "Install Voice Output").
- **iPhone / iPad (Safari):** open the URL, tap Share → **Add to Home Screen**.
- **Android (Chrome):** open the URL, tap the menu → **Install app**.

Each install creates its own app icon that opens standalone — no browser bar.

## Notes

- Voice quality and the list of available voices come from the device itself (macOS voices on the Mac, iOS voices on iPhone/iPad, Google voices on Android/Pixel), so it'll sound a little different per device. That's the trade-off for not depending on any single paid service.
- Works fully offline after the first load, thanks to the included service worker (`sw.js`).
- Speed and pitch are adjustable per session; there's no saved-settings/account system by design — it stays a simple, dependency-free tool.
