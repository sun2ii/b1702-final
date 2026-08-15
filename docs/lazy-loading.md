# Predictive Asset Loading Architecture

## Status: Implemented (2026-08-14)

---

## Goal

**NOT:** "Load assets only when visible."

**YES:** "The visitor should ideally never reach a section before its assets are ready, while avoiding downloading the entire site upfront."

This is a cinematic, scroll-based site with a deliberate 7.2-second intro sequence. That intro is a **preload window** to be exploited.

---

## Architecture Overview

```
PHASE 1: BEFORE ENTER              PHASE 2: ENTER PRESSED (7.2s window)
──────────────────────             ─────────────────────────────────────
HTML, CSS, JS                      Section 01 video (immediate)
Fonts                              Section 02 video (if medium/fast)
Welcome modal only                 Section 03 video (if fast only)
Posters (via video poster attr)

NO: videos, GLBs, audio            Section 04: NOT preloaded
```

```
PHASE 3: INTRO COMPLETE → ROLLING PREFETCH
──────────────────────────────────────────
User viewing Section 01 → Section 02 ready, start preparing 03
User viewing Section 02 → Section 03 ready, start preparing 04
User viewing Section 03 → Section 04 ready

IntersectionObserver with rootMargin: "100% 0px" (~1 viewport ahead)
```

---

## Intro Timeline

```
0.0s  → Enter pressed, preload starts
2.0s  → Modal fade complete
3.8s  → Typing begins
7.2s  → introComplete (scroll unlocks)
8.0s  → Music starts
```

We have **7 seconds** to prepare assets while user watches the intro.

---

## Asset States

```
UNREQUESTED (preload="none")
    ↓
PREFETCHING (preload="auto", browser fetching)
    ↓
READY (video can play)
    ↓
PLAYING (section active)
    ↓
PAUSED (section not active, but STAYS MOUNTED)
```

**Note:** `preload` is a browser hint, not a hard network gate. Browsers retain discretion. Verify actual behavior in Network panel.

Key rule: **Videos remain mounted after loading.** Scrolling backward does not trigger re-fetch.

---

## Current Assets

| Category | Size | Notes |
|----------|------|-------|
| Videos | 49MB | 4 homepage + 5 diagnose page |
| Audio | 3.3MB | 782KB Opus + 2.5MB MP3 fallback |
| 3D Models | 2.9MB | 3 GLBs (only 1 displayed at a time) |
| **Total** | **55MB** | |

### Homepage Videos

| Section | Desktop | Mobile |
|---------|---------|--------|
| 01 Threshold | 2.3MB | 1.9MB |
| 02 The Named Thing | 2.3MB | 1.0MB |
| 03 The Sequence | 1.5MB | 0.7MB |
| 04 The Door | 2.5MB | 2.7MB |
| **Total** | **8.6MB** | **6.3MB** |

---

## Network-Aware Loading

| Connection | Sections Preloaded on Enter |
|------------|----------------------------|
| `saveData === true` | 01 only |
| `slow-2g` / `2g` | 01 only |
| `3g` | 01, 02 |
| `4g` / unknown | 01, 02, 03 |

**Important:** Unknown connection (Safari, unsupported browsers) defaults to fast behavior.

---

## What Was Implemented

### 1. VideoBackground Component

**Added `preload` prop:**
```tsx
type Props = {
  src: string;
  mobileSrc?: string;
  poster?: string;
  preload?: "none" | "metadata" | "auto";  // NEW - defaults to "auto"
  // ... existing props
};
```

**SSR poster fallback:**
```tsx
// Before hydration, show poster as background-image to prevent flash
if (!hasMounted) {
  return (
    <div style={{ backgroundImage: `url(${poster})`, ... }} />
  );
}
```

**Mobile source selection:**
- Detected on mount only (not resize, to prevent video reload mid-session)
- Uses JS `window.innerWidth < 768` check
- Note: `<source media="...">` was NOT used because media queries on video sources have poor browser support

### 2. Homepage Preload System

**State-driven preloading in `app/page.tsx`:**
```tsx
const [preloadSections, setPreloadSections] = useState<Set<string>>(new Set());

const shouldPreload = useCallback((sectionId: string) => {
  return preloadSections.has(sectionId);
}, [preloadSections]);

// On Enter:
const speed = getNetworkSpeed();
const sectionsToPreload = ["01 Threshold"];
if (speed === "medium" || speed === "fast") sectionsToPreload.push("02 The Named Thing");
if (speed === "fast") sectionsToPreload.push("03 The Sequence");
setPreloadSections(new Set(sectionsToPreload));
```

**VideoBackground usage:**
```tsx
<VideoBackground
  src="/movies/homepage/desktop/01-cityscapes.webm"
  poster="/poster/cityscape.webp"
  preload={shouldPreload("01 Threshold") ? "auto" : "none"}
  paused={...}
/>
```

### 3. Rolling Prefetch (Post-Intro)

**IntersectionObserver in `app/page.tsx`:**
```tsx
useEffect(() => {
  if (!introComplete) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("data-screen-label");
          // Add next section to preloadSections
        }
      });
    },
    { rootMargin: "100% 0px" }  // ~1 viewport ahead
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}, [introComplete]);
```

### 4. AudioProvider - Singleton Codec Detection

```tsx
let cachedCodec: "opus" | "mp3" | null = null;

function getCodec(): "opus" | "mp3" {
  if (cachedCodec !== null) return cachedCodec;
  if (typeof window === "undefined") return "mp3";

  const audio = document.createElement("audio");
  const canPlayOpus = audio.canPlayType("audio/ogg; codecs=opus");
  cachedCodec = canPlayOpus ? "opus" : "mp3";
  return cachedCodec;
}

const getAudioPath = (baseName: string) => `/music/${baseName}.${getCodec()}`;
```

### 5. Scene3D - On-Demand GLB Loading

**Removed:**
```tsx
// DELETED: Global preload of all models
Object.values(MODELS).forEach((m) => useGLTF.preload(m.path));
```

**Added:**
```tsx
// Preload current model on mount
useEffect(() => {
  useGLTF.preload(MODELS[model].path);
}, [model]);

// Opportunistically preload others during idle time
useEffect(() => {
  if (typeof requestIdleCallback === "undefined") return;

  const otherModels = Object.keys(MODELS).filter((k) => k !== model);
  const ids = otherModels.map((key) =>
    requestIdleCallback(() => useGLTF.preload(MODELS[key].path))
  );
  return () => ids.forEach((id) => cancelIdleCallback(id));
}, [model]);
```

### 6. Cache Headers

**`next.config.mjs`:**
```js
async headers() {
  return [
    { source: "/movies/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    { source: "/music/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    { source: "/3d/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    { source: "/poster/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
  ];
}
```

**Important: Immutable assets require filename versioning.**

Because `immutable` tells browsers to never revalidate, changing file contents without changing the filename will cause returning visitors to see stale assets indefinitely.

When updating any static asset, use versioned filenames:
```
01-cityscapes-v1.webm  →  01-cityscapes-v2.webm
homepage-v1.opus       →  homepage-v2.opus
system-map-v1.glb      →  system-map-v2.glb
```

Or content hashes:
```
01-cityscapes.a81f3.webm
```

---

## What Was NOT Implemented

| Planned | Status | Reason |
|---------|--------|--------|
| `<source media="...">` for mobile/desktop | Skipped | Poor browser support for media queries on video sources |
| `shouldLoad` prop on VideoBackground | Skipped | `preload="none"` achieves same goal more simply |
| Deferred Audio creation until Enter | Skipped | AudioProvider already handles this via play() timing |
| Audio in preload queue | Skipped | AudioProvider manages independently; plays at ~8s anyway |
| Diagnose page preloading | Not yet | Lower priority; users navigate there from homepage |

---

## Files Modified

| File | Changes |
|------|---------|
| `components/VideoBackground.tsx` | Added `preload` prop, SSR poster fallback, mount-only mobile detection |
| `app/page.tsx` | `preloadSections` state, network-aware preload on Enter, IntersectionObserver |
| `components/AudioProvider.tsx` | Singleton codec detection with caching |
| `components/Scene3D.tsx` | Removed global preload, added `requestIdleCallback` prefetch |
| `next.config.mjs` | Cache headers for static assets |
| `docs/lazy-loading.md` | This file |

---

## Verification Checklist

### Network Panel - Initial Load

Should show:
- HTML, CSS, JS, fonts
- Welcome modal assets

Should NOT show:
- Video files (webm)
- Audio files (opus/mp3)
- GLB files

### Network Panel - After Enter

In order:
1. Section 01 video
2. Section 02 video (if medium/fast connection)
3. Section 03 video (if fast connection)

### Test Scenarios

- [ ] Fast 4G: Videos 01-03 preload during intro
- [ ] Slow 3G: Only 01-02 preload
- [ ] Data Saver: Only 01 preloads
- [ ] 375px mobile: Mobile videos served (not desktop)
- [ ] Scroll quickly forward: Posters visible, no blank sections
- [ ] Scroll quickly backward: No re-fetch
- [ ] Hard refresh: Clean preload sequence
- [ ] Returning visitor (skippedModal): All sections preload immediately

### Visual Checks

- [ ] No black video flash
- [ ] No layout shift
- [ ] Posters visible immediately
- [ ] Audio starts at ~8s
- [ ] Intro timing unchanged (7.2s)

---

## Graceful Degradation

If next video isn't ready when user scrolls:
- **Show poster** (already loaded via `poster` attribute)
- **DO NOT:** block scrolling, freeze section, extend intro, show loader

The 7.2s intro is an **experience decision**, not a loading screen. `introComplete` fires at 7.2s regardless of asset state.

---

## What We Did NOT Do

- Large third-party loading library
- Rewriting page architecture
- Making intro dependent on asset completion
- Over-engineering GLB loading (only 2.9MB total)
- Visible loading spinners
- Mount/unmount videos on section change
- Conditional rendering of VideoBackground components
