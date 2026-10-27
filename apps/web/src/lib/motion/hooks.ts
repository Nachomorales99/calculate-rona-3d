import { useRef } from "react";
import { prefersReducedMotion, useGSAP } from "./gsap";
import { motion } from "./presets";

/** Sección que revela sus hijos al entrar en pantalla. Uso: <section ref={useReveal()}>. */
export function useReveal<T extends HTMLElement = HTMLElement>(selector = ":scope > *") {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      motion.reveal(el, el.querySelectorAll(selector));
    },
    { scope: ref },
  );
  return ref;
}

/** Grilla cuyos hijos entran escalonados al montar. */
export function useGridStagger<T extends HTMLElement = HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      motion.grid(el.children, delay);
    },
    { scope: ref },
  );
  return ref;
}

/** Titular que entra palabra por palabra. El componente debe partir el texto en <span data-word>. */
export function useHeadline<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      motion.headline(Array.from(el.querySelectorAll("[data-word]")));
    },
    { scope: ref },
  );
  return ref;
}

/** Hover lift de 2 px en todos los elementos que matcheen el selector dentro del contenedor. */
export function useHoverLift<T extends HTMLElement = HTMLElement>(selector: string) {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const cleanups: Array<() => void> = [];
      root.querySelectorAll(selector).forEach((el) => {
        const { enter, leave } = motion.lift(el);
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        });
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope: ref },
  );
  return ref;
}
