import { gsap } from "./gsap";

/**
 * Los cinco presets de movimiento del sistema de diseño (docs/design-system.md).
 * Todos animan solo transform y opacity; ninguno cambia layout.
 */
export const motion = {
  /** Titular por palabras. `words` son los spans ya partidos. */
  headline(words: Element[]) {
    return gsap.from(words, {
      opacity: 0,
      y: 18,
      duration: 0.55,
      stagger: 0.045,
      ease: "expo.out",
    });
  },
  /** Reveal al scroll de los hijos de una sección. */
  reveal(trigger: Element, targets: ArrayLike<Element>) {
    return gsap.from(targets, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger, start: "top 85%" },
    });
  },
  /** Stagger de grilla (mosaico, boxes, posts). */
  grid(targets: ArrayLike<Element>, delay = 0) {
    return gsap.from(targets, {
      opacity: 0,
      y: 16,
      scale: 0.96,
      duration: 0.45,
      delay,
      stagger: { each: 0.06, grid: "auto" },
      ease: "back.out(1.4)",
    });
  },
  /** Hover lift sutil. Devuelve las dos funciones para enter/leave. */
  lift(el: Element) {
    const up = gsap.quickTo(el, "y", { duration: 0.15, ease: "power1.out" });
    return {
      enter: () => {
        up(-2);
      },
      leave: () => {
        up(0);
      },
    };
  },
} as const;
