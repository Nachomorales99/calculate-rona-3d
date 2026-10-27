import { useEffect } from "react";

const BASE = "Rona 3D";

/** Título del documento: "Página · Rona 3D" o solo la marca en la home. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} · Taller de impresión 3D`;
  }, [title]);
}
