import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Panel({ className, ...rest }: ComponentProps<"section">) {
  return (
    <section className={cn("rounded-lg border border-line bg-surface p-5", className)} {...rest} />
  );
}

/** Panel oscuro con líneas de capa, para resultados. */
export function Plate({ className, ...rest }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "layers rounded-lg border border-plate-edge bg-plate p-5 text-plate-ink",
        className,
      )}
      {...rest}
    />
  );
}
