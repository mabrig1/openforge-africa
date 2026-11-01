# OpenForge Africa — Mobile/Desktop PWA Release (November 2026)

## What this enables
OpenForge runs from the same HTTPS website on desktop, Android and iPhone. It can also be added to the device home screen as an **installable Progressive Web App (PWA)**. This is NOT a Google Play/iOS App Store package, and an installed web app is still subject to the device browser's capabilities.

### Browser-controlled installation (no forced downloads)
- **Android Chrome/Edge/Samsung Internet:** visitors see an install suggestion as soon as the homepage loads. When the browser emits the standard beforeinstallprompt event, the button asks the browser to display its native installation permission flow. Browsers decide when the event is eligible; installation cannot be forced silently on page open. If eligibility is not met, the UI explains the browser's menu-based Install app / Add to Home Screen route.
- **iPhone/iPad:** no browser install prompt API. The banner tells users to use Share > Add to Home Screen, preferably in Safari.
- **Desktop Chrome/Edge:** installation via the prompt or browser's Install icon/menu. Users can always continue using the ordinary website.
- **Already installed:** standalone mode hides the suggestion. Dismissing the banner hides it for the current browser session, not permanently.

### Built for multiple screen widths
- Responsive Academy Discover page adapts its hero, course grid, study tools and filters to 320px/390px phones, 768px tablets and 1440px desktops. Tab navigation adopts a left sidebar on wider web desktops and a safe-area-aware bottom navigation on phones.
- Course progress continues to use existing on-device Academy stores. No new login for free offline learning.

### Offline and safe updates
- Expo Metro web export is augmented after build using scripts/pwa-postbuild.mjs. It generates original PNGs at 180/192/512px, manifest.webmanifest, and a versioned service worker from public/sw.js.
- The worker caches only same-origin static assets and the public app shell. Navigations are network-first so users receive fresh deployments while online. It must not cache /api/*, Authorization requests, POSTs, cross-origin requests, provider responses, user documents or private notes.
- Offline availability depends on what the user loaded before losing connectivity and the browser's storage policies. Do not claim all courses, videos or server-backed AI work offline.
- The app's local browser storage is not synchronized across devices. Home-screen installation can use isolated storage on iOS.

## Verification
Run npm test, npm run typecheck, npm run build, npm run check:web, npm run check:browser.

Browser smoke checks manifest, 512px PNG, worker, install guidance and overflow at 320x700, 390x844, 768x1024, 844x390, 1440x900. Real Android Chrome/Samsung Internet and iOS Safari installation still needs phone acceptance. A browser-controlled native prompt may not fire in automation.

Post-deployment URLs:
- https://openforge.mabrigkorie.org/
- https://openforge.mabrigkorie.org/manifest.webmanifest
- https://openforge.mabrigkorie.org/icons/openforge-192.png
- https://openforge.mabrigkorie.org/icons/openforge-512.png
- https://openforge.mabrigkorie.org/sw.js
- https://openforge.mabrigkorie.org/academy
- https://openforge.mabrigkorie.org/classroom

Paid LLM inference remains OFF until separate Cloudflare Access and provider monetary caps are configured. PWA installation does not enable inference.
