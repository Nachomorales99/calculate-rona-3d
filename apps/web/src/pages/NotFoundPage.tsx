import { Button, Ficha } from "@/components/ui";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Component() {
  useDocumentTitle("No encontrado");
  return (
    <div className="grid justify-items-start gap-4 py-16">
      <Ficha className="size-12" />
      <h1 className="text-[2.4rem]">Esa página no se imprimió.</h1>
      <p className="max-w-[48ch] text-muted">
        No encontramos lo que buscabas. Puede que el enlace esté viejo o que todavía no exista.
      </p>
      <Button to="/" variant="secondary">
        Volver al inicio
      </Button>
    </div>
  );
}
