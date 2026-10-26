import { describe, expect, it } from "vitest";
import { CURRENCIES } from "../currency/currencies.js";
import { buildQuote, describeIncludes, QUOTE_FALLBACKS, type QuoteOptions } from "./quote.js";
import type { SalePrice } from "./types.js";

const sale: SalePrice = { price: 2256.4, rounded: 2300, gain: 1504 };
const issuedAt = new Date(2026, 9, 26);

const options: QuoteOptions = {
  counter: 7,
  client: "  Romina  ",
  description: "Llavero con nombre",
  qty: 3,
  validDays: 7,
  notes: " Seña del 50%. ",
  contact: "@rona3darg",
  useRounded: true,
  showIncludes: true,
  extras: [
    { name: "Argolla", unitPrice: 50, qtyPerPiece: 1 },
    { name: "Cadena", unitPrice: 100, qtyPerPiece: 2 },
    { name: "", unitPrice: 1, qtyPerPiece: 1 },
    { name: "Imán", unitPrice: 1, qtyPerPiece: 0 },
  ],
  issuedAt,
};

describe("buildQuote", () => {
  it("arma el presupuesto con precio redondeado y total", () => {
    const q = buildQuote(sale, options);
    expect(q.number).toBe("N.º 0007");
    expect(q.client).toBe("Romina");
    expect(q.unitPrice).toBe(2300);
    expect(q.total).toBe(6900);
    expect(q.includes).toBe("Incluye argolla y 2 cadena.");
    expect(q.notes).toBe("Seña del 50%.");
    expect(q.validUntil.getDate()).toBe(2);
    expect(q.validUntil.getMonth()).toBe(10);
    expect(q.currency.code).toBe("ARS");
  });

  it("usa el precio exacto redondeado a la moneda cuando useRounded es false", () => {
    const ars = buildQuote(sale, { ...options, useRounded: false });
    expect(ars.unitPrice).toBe(2256);
    const usd = buildQuote(
      { price: 12.345, rounded: 13, gain: 1 },
      {
        ...options,
        useRounded: false,
        currency: CURRENCIES.USD,
      },
    );
    expect(usd.unitPrice).toBe(12.35);
    expect(usd.total).toBe(37.05);
  });

  it("aplica fallbacks cuando faltan datos", () => {
    const { issuedAt: _omit, ...withoutDate } = options;
    const q = buildQuote(sale, {
      ...withoutDate,
      client: "",
      description: "   ",
      qty: 0,
      validDays: 0,
      showIncludes: false,
    });
    expect(q.client).toBe(QUOTE_FALLBACKS.client);
    expect(q.description).toBe(QUOTE_FALLBACKS.description);
    expect(q.qty).toBe(1);
    expect(q.includes).toBe("");
    expect(q.validUntil.getTime() - q.issuedAt.getTime()).toBe(7 * 86_400_000);
  });

  it("nunca expone costos ni ganancia", () => {
    const q = buildQuote(sale, options) as unknown as Record<string, unknown>;
    expect(q).not.toHaveProperty("gain");
    expect(q).not.toHaveProperty("cost");
    expect(q).not.toHaveProperty("multiplier");
  });
});

describe("describeIncludes", () => {
  it("ignora extras sin nombre o sin cantidad", () => {
    expect(describeIncludes([], String)).toBe("");
    expect(describeIncludes([{ name: "Imán", unitPrice: 1, qtyPerPiece: 1 }], String)).toBe(
      "Incluye imán.",
    );
  });
});
