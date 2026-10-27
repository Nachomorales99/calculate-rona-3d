import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router";
import { gsap, prefersReducedMotion } from "./gsap";

/**
 * Transición de ruta sutil: fade de 200 ms al cambiar de pathname.
 * Nunca bloquea la navegación (la página nueva ya está montada cuando arranca la entrada).
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power1.inOut" },
    );
    return () => {
      tween.kill();
    };
  }, [pathname]);

  return (
    <div ref={ref} className="contents md:block">
      {children}
    </div>
  );
}
