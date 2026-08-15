# Mobile Responsiveness Analysis

## Architecture Overview

The project uses a **viewport-aware responsive system** combining:
- CSS media queries (`@media max-width: 600px, 768px`)
- JavaScript viewport detection (`window.innerWidth` checks)
- Tailwind `clamp()` for fluid scaling
- Mobile-specific video sources (`mobileSrc` pattern)

---

## Breakpoint Strategy

| Breakpoint | Usage |
|------------|-------|
| 600px | Mobile/desktop nav toggle (SiteHeader, SiteFooter) |
| 768px | Video resolution switch (VideoBackground) |
| 768px | Layout collapsing (globals.css) |
| 900px | Column collapsing (globals.css) |

**Issue**: Inconsistent breakpoints create edge cases. At 650px viewport:
- Navigation is desktop mode (600px threshold not met)
- Video still serves desktop resolution (768px threshold not met)
- Layout already collapsed (768px threshold met)

**Recommendation**: Standardize on **768px** across all components.

---

## Good Patterns

### Fluid Typography
```css
fontSize: "clamp(1.06rem, 1.24vw, 1.2rem)"
fontSize: "clamp(3rem, 9.6vw, 9.4rem)"
```
Scales smoothly between min/max without hard breakpoint jumps.

### Responsive Spacing
```css
padding: "clamp(24px, 5.5vw, 96px)"
gap: "clamp(16px, 4vw, 48px)"
```

### Mobile Video Delivery
```tsx
mobileSrc="/movies/diagnose/mobile/02-request-720p.webm"
```
720p served to mobile (bandwidth savings).

### Mobile Navigation
- Hamburger menu with staggered animations
- Touch-friendly button sizing
- Desktop nav hidden completely on mobile

### Reduced Motion Support
```tsx
const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
```
Animations respect accessibility preferences.

---

## Issues & Fixes

### 1. Fixed Header/Footer on Mobile (Medium Risk)

**Problem**: Fixed positioning eats viewport space on small phones.
```tsx
position: "fixed", top: 0  // Header
position: "fixed", bottom: 0  // Footer
```

**Impact**: On iPhone SE (375x667), header+footer consume ~11% of viewport.

**Fix**:
```tsx
position: isMobile ? "relative" : "fixed"
```

### 2. Hardcoded 3D Section Sizing

**Problem**:
```tsx
const SQUARE_SIDE = 260;  // Doesn't scale
const DIMENSION_SIZE = 90;  // Fixed circle size
height: 450  // Fixed model height
```

**Impact**: At 375px width, circles take 24% of viewport, cramped layout.

**Fix**:
```tsx
const SQUARE_SIDE = Math.min(260, window.innerWidth * 0.6);
height: "clamp(250px, 60vh, 450px)"
```

### 3. RealitySection Grid Not Mobile-Aware

**Problem**:
```tsx
gridTemplateColumns: "minmax(0,10ch) minmax(280px, 1fr) minmax(400px, 1.2fr)"
```

**Impact**: `minmax(400px, ...)` exceeds 375px viewport, causes overflow.

**Fix**: Add mobile media query to collapse to single column at 768px.

### 4. Fixed Font Sizes

**Problem**:
```tsx
fontSize: 13  // Nav links
fontSize: 11  // Footer text
```

**Impact**: 11px = 2.9% of 375px screen, difficult to read.

**Fix**:
```tsx
fontSize: "clamp(11px, 1.5vw, 15px)"
```

### 5. No Horizontal Scroll Protection

**Problem**: Only `app/page.tsx` has `overflowX: "hidden"`. Other sections may cause horizontal scroll.

**Fix**: Add to all section containers:
```tsx
overflowX: "hidden"
```

### 6. Tap Target Sizing

**Current**: Hamburger = 32x32px (24 + 4px padding each side)

**WCAG Minimum**: 44x44px

**Fix**: Increase padding or button size:
```tsx
width: 44, height: 44, padding: 10
```

---

## Responsiveness Score by Feature

| Feature | Status | Risk |
|---------|--------|------|
| Breakpoints | Fixed | Very Low |
| Typography | Excellent | Very Low |
| Spacing | Excellent | Very Low |
| Mobile Video | Excellent | Very Low |
| Navigation | Excellent | Very Low |
| Fixed Header/Footer | Fixed | Very Low |
| 3D Sections | Fixed | Very Low |
| Grid Layouts | Excellent | Very Low |
| Touch Events | Good | Very Low |
| Reduced Motion | Excellent | Very Low |
| Horizontal Scroll | Fixed | Very Low |
| Font Sizing | Fixed | Very Low |

---

## Completed Fixes (2026-08-14)

1. **Standardize breakpoint** to 768px across all components
   - SiteHeader.tsx: 600px → 768px
   - SiteFooter.tsx: 600px → 768px
   - globals.css: nav media query 600px → 767px

2. **Add mobile media query** to RealitySection grid
   - Single column layout on mobile
   - Responsive diagram sizing (SQUARE_SIDE, DIMENSION_SIZE, SYNTHESIS_SIZE)
   - Adjusted padding and spacing

3. **Header/footer remain fixed** on mobile
   - Kept position: fixed (absolute caused scroll issues)
   - Consistent behavior across breakpoints

4. **Constrain 3D model height** responsively
   - height: 450px → clamp(280px, 50vh, 450px)
   - Section 04 grid collapses to single column on mobile

5. **Convert fixed font sizes** to clamp()
   - SiteHeader logo: 13px → clamp(12px, 1.5vw, 14px)
   - SiteFooter year: 11px → clamp(10px, 1.2vw, 12px)

6. **Add horizontal scroll guard** to all sections
   - body: overflow-x: hidden
   - section: overflow-x: hidden

7. **Increase tap targets** to 44x44px minimum
   - Hamburger: 24x24 → 44x44 with proper centering

---

## Test Checklist

- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] Android small (360px)
- [ ] Landscape orientation
- [ ] Slow network (3G throttle)
- [ ] Reduced motion preference
- [ ] Touch interactions (no hover)
