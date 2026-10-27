import { formatDate, formatMoney, toSafeFilename, type QuoteData } from "@rona3d/shared";

const RGB = {
  rojo: [225, 68, 36],
  tinta: [22, 22, 26],
  papel: [245, 239, 228],
  muted: [106, 101, 94],
  line: [232, 224, 210],
} as const;

/** Marca que va en el PDF. Default Rona 3D; en fase 3 viene de brand_settings del usuario. */
export interface PdfBrand {
  name: string;
  place: string;
  logoUrl: string;
  /** Relación ancho/alto del logo, para no deformarlo. */
  logoRatio: number;
}

export const RONA_BRAND: PdfBrand = {
  name: "Rona 3D",
  place: "Mendoza, Argentina",
  logoUrl: "/pdf/rona3d-logo.png",
  logoRatio: 2000 / 850,
};

async function fetchBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    let bin = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin);
  } catch {
    return null;
  }
}

/**
 * Genera el PDF del presupuesto. jsPDF, la fuente y el logo se cargan recién acá (import dinámico),
 * así la calculadora no paga ese peso hasta que alguien descarga.
 * Nunca incluye costos, multiplicador ni ganancia: solo recibe QuoteData.
 */
export async function buildQuotePdf(q: QuoteData, brand: PdfBrand = RONA_BRAND) {
  const [{ jsPDF }, font, logo] = await Promise.all([
    import("jspdf"),
    fetchBase64("/pdf/AlfaSlabOne.ttf"),
    fetchBase64(brand.logoUrl),
  ]);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const money = (v: number) => formatMoney(v, q.currency);
  const date = (d: Date) => formatDate(d, q.currency.locale);

  let slabReady = false;
  if (font) {
    try {
      doc.addFileToVFS("AlfaSlabOne.ttf", font);
      doc.addFont("AlfaSlabOne.ttf", "AlfaSlab", "normal");
      slabReady = true;
    } catch {
      slabReady = false;
    }
  }
  const split = (text: string, width: number): string[] => {
    const out: unknown = doc.splitTextToSize(text, width);
    return Array.isArray(out) ? out.map(String) : [String(out)];
  };
  const slab = (size: number) => {
    if (slabReady) doc.setFont("AlfaSlab", "normal");
    else doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
  };
  const sans = (size: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
  };

  const L = 20;
  const R = 190;

  // Banda de marca
  doc.setFillColor(...RGB.papel);
  doc.rect(0, 0, 210, 48, "F");
  if (logo) {
    const w = 56;
    doc.addImage(`data:image/png;base64,${logo}`, "PNG", L - 2, 12, w, w / brand.logoRatio);
  } else {
    slab(18);
    doc.setTextColor(...RGB.tinta);
    doc.text(brand.name, L, 30);
  }
  doc.setTextColor(...RGB.tinta);
  slab(20);
  doc.text("Presupuesto", R, 22, { align: "right" });
  sans(10);
  doc.setTextColor(...RGB.muted);
  doc.text(q.number, R, 29, { align: "right" });
  doc.text(`Fecha: ${date(q.issuedAt)}`, R, 34, { align: "right" });
  doc.text(`Válido hasta: ${date(q.validUntil)}`, R, 39, { align: "right" });

  // Cliente
  sans(9);
  doc.text("Cliente", L, 60);
  doc.setTextColor(...RGB.tinta);
  sans(13, true);
  doc.text(split(q.client, 170)[0] ?? q.client, L, 66.5);

  // Tabla
  let y = 78;
  sans(9, true);
  doc.text("Descripción", L + 1, y);
  doc.text("Cant.", 128, y, { align: "right" });
  doc.text("Precio unit.", 159, y, { align: "right" });
  doc.text("Subtotal", R - 1, y, { align: "right" });
  doc.setDrawColor(...RGB.tinta);
  doc.setLineWidth(0.6);
  doc.line(L, y + 2.5, R, y + 2.5);
  y += 10;
  sans(10.5);
  const descLines = split(q.description, 92);
  doc.text(descLines, L + 1, y);
  doc.text(String(q.qty), 128, y, { align: "right" });
  doc.text(money(q.unitPrice), 159, y, { align: "right" });
  doc.text(money(q.total), R - 1, y, { align: "right" });
  y += descLines.length * 5;
  if (q.includes) {
    sans(9);
    doc.setTextColor(...RGB.muted);
    const il = split(q.includes, 92);
    doc.text(il, L + 1, y);
    y += il.length * 4.3;
    doc.setTextColor(...RGB.tinta);
  }
  y += 3;
  doc.setDrawColor(...RGB.line);
  doc.setLineWidth(0.3);
  doc.line(L, y, R, y);

  // Total
  y += 8;
  doc.setFillColor(...RGB.rojo);
  doc.roundedRect(118, y, R - 118, 15, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  sans(11, true);
  doc.text("Total", 124, y + 9.5);
  slab(16);
  doc.text(money(q.total), R - 5, y + 10, { align: "right" });

  // Notas
  y += 28;
  if (q.notes) {
    doc.setTextColor(...RGB.tinta);
    sans(10, true);
    doc.text("Notas", L, y);
    y += 5.5;
    sans(10);
    doc.setTextColor(...RGB.muted);
    doc.text(split(q.notes, R - L), L, y);
  }

  // Pie
  doc.setDrawColor(...RGB.line);
  doc.line(L, 276, R, 276);
  sans(8.5);
  doc.setTextColor(...RGB.muted);
  doc.text(`${brand.name}, ${brand.place}${q.contact ? `  |  ${q.contact}` : ""}`, L, 282);
  doc.text(
    `Precios en ${q.currency.name.toLowerCase()}. Válido hasta el ${date(q.validUntil)}.`,
    R,
    282,
    {
      align: "right",
    },
  );

  const safe = q.client ? `-${toSafeFilename(q.client)}` : "";
  const filename = `Presupuesto-${q.number.replace(/\D/g, "")}${safe}.pdf`;
  return { doc, filename };
}
