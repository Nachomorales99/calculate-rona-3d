import "@testing-library/jest-dom/vitest";

// jsdom no implementa matchMedia; GSAP y el hook de reduced-motion lo consultan.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: query.includes("reduce"),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  });
}
