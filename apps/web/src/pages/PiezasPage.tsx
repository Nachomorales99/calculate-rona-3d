import { PieceTile } from "@/components/PieceTile";
import { Button, SectionHeader } from "@/components/ui";
import { CONTACT } from "@/content/contact";
import { PIECES } from "@/content/pieces";
import { useGridStagger, useHoverLift } from "@/lib/motion";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Component() {
  useDocumentTitle("Piezas");
  const lift = useHoverLift<HTMLDivElement>("figure");
  const grid = useGridStagger<HTMLDivElement>();
  return (
    <div ref={lift} className="py-10">
      <SectionHeader
        as="h1"
        title="Del taller"
        text="Piezas que imprimimos para RONA GAMES, para clientes y por gusto. Las fotos reales llegan con la próxima versión de la web; mientras tanto, las siluetas."
      />
      <div ref={grid} className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {PIECES.map((p) => (
          <PieceTile key={p.name} piece={p} />
        ))}
      </div>
      <p className="mt-8 flex flex-wrap items-center gap-3 text-muted">
        Lo nuevo sale primero en Instagram.
        <Button to={CONTACT.instagram} external variant="ghost" size="sm">
          {CONTACT.instagramHandle} →
        </Button>
      </p>
    </div>
  );
}
