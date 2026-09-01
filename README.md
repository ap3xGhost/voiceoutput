# Voice Output

A small, dependency-free text-to-speech app. Type or paste text, hit Speak, and it reads it aloud using your device's own built-in voices — no API keys, no subscriptions, no cloud service required.

Because it's a Progressive Web App (PWA), you can install it on any device as if it were a native app.

You can also paste an article URL and it'll fetch the page, strip out the navigation/ads/clutter, and load just the readable article text into the box for you.

## Deploy it

1. Create a new GitHub repo and push these files to it (including the `api` folder and `package.json`).
2. Go to [vercel.com](https://vercel.com), import the repo, and deploy. Vercel will detect `package.json` and install the two dependencies automatically — no manual setup needed.
3. Vercel gives you an HTTPS URL — that's required for the app to be installable.

## Install it on a device

- **Mac / Chrome (any OS):** open the URL, click the install icon in the address bar (or menu → "Install Voice Output").
- **iPhone / iPad (Safari):** open the URL, tap Share → **Add to Home Screen**.
- **Android (Chrome):** open the URL, tap the menu → **Install app**.

Each install creates its own app icon that opens standalone — no browser bar.

## Notes

- Voice quality and the list of available voices come from the device itself (macOS voices on the Mac, iOS voices on iPhone/iPad, Google voices on Android/Pixel), so it'll sound a little different per device. That's the trade-off for not depending on any single paid service.
- Works fully offline after the first load, thanks to the included service worker (`sw.js`) — except for the URL-fetch feature, which needs a connection since it calls the server-side function.
- Article extraction uses Mozilla's open-source Readability library (the same one behind Firefox's Reader View), running in a free Vercel serverless function — no API key or subscription involved.
- Some sites block automated fetches or require a login, so occasionally a URL won't extract cleanly. Pasting the text directly always works as a fallback.
- Speed and pitch are adjustable per session; there's no saved-settings/account system by design — it stays a simple, dependency-free tool.
