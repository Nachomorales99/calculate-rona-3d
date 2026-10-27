import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Acción rápida ("+ Argolla"). Borde punteado hasta que se activa. */
export function Chip({ className, ...rest }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-pill border-[1.5px] border-dashed border-line bg-field px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent",
        className,
      )}
      {...rest}
    />
  );
}
