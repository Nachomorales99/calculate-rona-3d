import type { SVGProps } from "react";

/** La ficha extruida: cuatro pips calados, sombra desplazada. Tinta = currentColor, ficha = acento. */
export function Ficha({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="-108 -108 228 228"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path
        d="M -90 10 A 100 100 0 1 1 110 10 A 100 100 0 1 1 -90 10 Z M -52 -34 A 18 18 0 1 1 -16 -34 A 18 18 0 1 1 -52 -34 Z M 36 -34 A 18 18 0 1 1 72 -34 A 18 18 0 1 1 36 -34 Z M -52 54 A 18 18 0 1 1 -16 54 A 18 18 0 1 1 -52 54 Z M 36 54 A 18 18 0 1 1 72 54 A 18 18 0 1 1 36 54 Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M -100 0 A 100 100 0 1 1 100 0 A 100 100 0 1 1 -100 0 Z M -62 -44 A 18 18 0 1 1 -26 -44 A 18 18 0 1 1 -62 -44 Z M 26 -44 A 18 18 0 1 1 62 -44 A 18 18 0 1 1 26 -44 Z M -62 44 A 18 18 0 1 1 -26 44 A 18 18 0 1 1 -62 44 Z M 26 44 A 18 18 0 1 1 62 44 A 18 18 0 1 1 26 44 Z"
        fill="var(--color-accent)"
        fillRule="evenodd"
      />
    </svg>
  );
}
