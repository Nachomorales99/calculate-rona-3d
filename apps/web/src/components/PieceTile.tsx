import type { Piece } from "@/content/pieces";
import { cn } from "@/lib/cn";

const shapes = {
  key: "w-[26%] aspect-[1/2] rounded-[12%_12%_50%_50%] bg-ink shadow-[0.25em_0.25em_0_var(--color-accent)]",
  round: "w-[44%] aspect-square rounded-full bg-ink shadow-[0.25em_0.25em_0_var(--color-accent)]",
  hex: "w-[44%] aspect-square bg-accent [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]",
  box: "w-[44%] aspect-square rounded-[18%] bg-ink shadow-[0.25em_0.25em_0_var(--color-accent)]",
} as const;

/** Pieza del taller. Hasta tener fotos reales, una silueta con la extrusión de la marca. */
export function PieceTile({ piece, className }: { piece: Piece; className?: string }) {
  return (
    <figure
      className={cn(
        "relative grid aspect-square place-items-center overflow-hidden rounded-lg border border-line bg-surface transition-[box-shadow,border-color] duration-150 hover:border-ink hover:shadow-hard-lg",
        className,
      )}
    >
      {piece.imageUrl ? (
        <img
          src={piece.imageUrl}
          alt={piece.name}
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="grid size-full place-items-center pb-6">
          <div className={shapes[piece.shape]} aria-hidden="true" />
        </div>
      )}
      <figcaption className="absolute right-2 bottom-2 left-3 truncate text-xs text-muted">
        {piece.name} · {piece.material}
      </figcaption>
    </figure>
  );
}
