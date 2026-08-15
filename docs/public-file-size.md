# Public Folder File Size Breakdown

**Total Size: 56MB**

## Summary by Category

| Category | Size | % of Total |
|----------|------|------------|
| Movies   | 49M  | 88%        |
| Music    | 3.3M | 6%         |
| 3D Models| 2.9M | 5%         |
| Posters  | 672K | 1%         |
| Fonts    | 84K  | <1%        |

*Music: 782K Opus (primary) + 2.5M MP3 (Safari fallback)*

## Movies (49MB)

### Homepage Videos (17MB)
| File | Size | Resolution |
|------|------|------------|
| 04-conversation.webm (desktop) | 2.5M | 1080p |
| 01-cityscapes.webm (desktop) | 2.3M | 1080p |
| 02-architectural.webm (desktop) | 2.3M | 1080p |
| 03-diagnosis.webm (desktop) | 1.5M | 1080p |
| 04-conversation.webm (mobile) | 2.7M | 720p |
| 01-cityscapes.webm (mobile) | 1.9M | 720p |
| 02-architectural.webm (mobile) | 1.0M | 720p |
| 03-diagnosis.webm (mobile) | 0.7M | 720p |

### Diagnose Page Videos (27MB)

**Desktop (1080p)**
| File | Size | Duration |
|------|------|----------|
| 03-reality-1080p.webm | 4.0M | 30s |
| 04-effect-1080p.webm | 2.8M | 26s |
| 05-service-1080p.webm | 2.6M | 35s |
| 01-diagnose-1080p.webm | 2.6M | 27s |
| 02-request-1080p.webm | 2.5M | 27s |

**Mobile (720p)**
| File | Size |
|------|------|
| 04-effect-720p.webm | 2.7M |
| 02-request-720p.webm | 2.6M |
| 03-reality-720p.webm | 2.4M |
| 01-diagnose-720p.webm | 2.3M |
| 05-service-720p.webm | 2.2M |

## Posters (672KB)

| File | Format | Size |
|------|--------|------|
| cityscape.webp | WebP | 312K |
| diagnosis.webp | WebP | 146K |
| coffee.webp | WebP | 134K |
| architecture.webp | WebP | 72K |

## Music (782KB primary, 2.5MB with fallbacks)

### Opus (Primary)
| File | Size | Duration |
|------|------|----------|
| homepage.opus | 343K | 75s |
| diagnose.opus | 410K | 75s |
| typewriter.opus | 29K | 8s |
| **Total** | **782K** | |

### MP3 (Safari Fallback, trimmed)
| File | Size | Duration |
|------|------|----------|
| homepage.mp3 | 1.2M | 75s |
| diagnose.mp3 | 1.2M | 75s |
| typewriter.mp3 | 126K | 8s |
| **Total** | **2.5M** | |

## 3D Models (2.9MB)

| File | Size |
|------|------|
| blueprint.glb | 1.9M |
| system-map.glb | 643K |
| strategy.glb | 415K |

## Fonts (84KB)

| File | Size |
|------|------|
| playfair-display-latin.woff2 | 38K |
| playfair-display-italic-latin.woff2 | 21K |
| archivo-narrow-latin.woff2 | 18K |

---

## Optimization Summary

All major optimizations have been applied:

| Asset | Before | After | Savings |
|-------|--------|-------|---------|
| Homepage videos | 17M | 8.5M | 50% |
| Poster images | 20M | 672K | 97% |
| Audio (Opus) | 10.2M | 782K | 92% |
| Audio (MP3 fallback) | 10.2M | 2.5M | 75% |
| **Total public** | **91M** | **56M** | **38%** |

### Applied Optimizations

1. **PNG to WebP conversion**: Removed PNG poster files, using WebP only (saved ~20MB)
2. **Video re-encoding**: Re-encoded 04-conversation and 01-cityscapes to under 3MB each using VP9/WebM
3. **All videos under 3MB target**: Every video file is now under 3MB for fast loading
4. **Audio to Opus conversion**:
   - Trimmed music to 75s loops (vs 3+ minute originals)
   - Trimmed typewriter to 8s (only need ~5s for intro)
   - Encoded at 32kbps Opus (transparent quality for ambient music)
   - Automatic MP3 fallback for older Safari

### Audio Playback Features

- **Seamless loop crossfade**: 3 second crossfade at loop boundary
- **Page transition crossfade**: 3 second crossfade when switching tracks
- **Format detection**: Uses Opus on Chrome/Firefox/Edge, MP3 on Safari

### Remaining Opportunities

**Minimal Impact (3D Models, Fonts)**
Already well-optimized:
- GLB files use binary glTF (efficient)
- WOFF2 fonts are already optimally compressed

**Consider for future**
- Delete MP3 fallbacks once Safari Opus support is universal
- Would save additional 2.5MB
