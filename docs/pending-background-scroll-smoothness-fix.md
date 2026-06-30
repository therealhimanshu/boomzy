# Pending Fix: Smooth Background While Scrolling

## Problem

On Android Chrome, the black-hole background appears to adjust or jump while scrolling.

The likely cause is that `BlackHoleBackground` sizes the WebGL canvas from `window.innerHeight`. Mobile browsers change `window.innerHeight` while scrolling because the address bar collapses and expands. That fires `resize`, resizes the canvas, updates `uResolution`, and makes the shader reframe itself mid-scroll.

Relevant current code:

- `src/components/BlackHoleBackground.tsx`
- `resize()` uses `window.innerWidth` and `window.innerHeight`
- wrapper uses `fixed inset-0 ... h-full`
- the WebGL shader runs continuously with `requestAnimationFrame`

## Recommended Fix

Keep the black-hole viewport stable during normal mobile scroll, and only rebuild the WebGL canvas on meaningful size changes.

1. Track the last committed canvas size.
2. Use a stable viewport height on mobile:
   - Prefer `window.visualViewport?.height` for initial sizing if available.
   - Do not resize the canvas for small height-only changes caused by browser UI.
   - Resize normally when width changes or orientation changes.
3. Use a stable CSS viewport unit for the fixed background:
   - `height: 100lvh`
   - fallback to `100vh`
4. Lower mobile DPR if scroll still feels heavy:
   - mobile cap: `1.25`
   - desktop cap: `1.8`
5. If jank remains, reduce mobile `backdrop-blur` over the animated background.

## Suggested Implementation Shape

In `BlackHoleBackground.tsx`, replace the current resize block with a guarded version:

```ts
let lastCssWidth = 0;
let lastCssHeight = 0;

const getStableViewportSize = () => {
  const cssWidth = window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const cssHeight = Math.round(viewportHeight);

  return { cssWidth, cssHeight };
};

const resize = (force = false) => {
  const { cssWidth, cssHeight } = getStableViewportSize();
  const widthChanged = Math.abs(cssWidth - lastCssWidth) > 2;
  const heightChanged = Math.abs(cssHeight - lastCssHeight) > 120;

  if (!force && !widthChanged && !heightChanged) {
    return;
  }

  lastCssWidth = cssWidth;
  lastCssHeight = cssHeight;

  const mobile = cssWidth < 720;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.8);
  const w = Math.max(1, Math.floor(cssWidth * dpr));
  const h = Math.max(1, Math.floor(cssHeight * dpr));

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  gl.uniform2f(resLoc, w, h);
  gl.uniform2f(centerLoc, mobile ? 0.12 : 0.29, mobile ? 0.55 : 0.52);
};

window.addEventListener("resize", () => resize(false), { passive: true });
resize(true);
```

For the returned wrapper, use stable viewport sizing:

```tsx
<div
  className="fixed inset-0 z-0 w-full pointer-events-none bg-[#03060d]"
  style={{ height: "100vh", minHeight: "100lvh" }}
>
```

## Follow-Up Optimization

If the background still feels heavy on Android after the resize fix:

- reduce mobile shader DPR to `1`
- pause the black-hole animation while scrolling and resume after scroll settles
- remove `backdrop-blur-md/xl` on mobile service/contact cards
- replace mobile black-hole animation with a static rendered frame

## Validation Checklist

Test on Android Chrome through the local network preview:

1. Load the home page.
2. Scroll slowly from hero to services.
3. Watch whether the black-hole center or scale jumps when the address bar hides.
4. Scroll quickly up and down.
5. Rotate the phone and confirm the canvas resizes correctly.
6. Confirm desktop still fills the viewport.
