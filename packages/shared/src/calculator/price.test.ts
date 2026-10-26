import { describe, expect, it } from "vitest";
import { calcPrintCost } from "./cost.js";
import { DEFAULT_COST_SETTINGS_ARS, DEFAULT_PRICING } from "./defaults.js";
import { calcSalePrice } from "./price.js";

const cost = calcPrintCost(
  {
    grams: 100,
    hours: 2,
    minutes: 0,
    pieces: 4,
    filamentPricePerKg: 20000,
    extras: [{ name: "Argolla", unitPrice: 100, qtyPerPiece: 1 }],
  },
  { ...DEFAULT_COST_SETTINGS_ARS, kwhPrice: 400, printerWatts: 100, failuresPct: 0 },
);
// filamento 2000 · luz 0,2 kWh × 400 = 80 · desgaste 264 × 2 = 528 · base 2608 · extras 400 · total 3008 · perUnit 752

describe("calcSalePrice", () => {
  it("multiplica todo cuando multiplyExtras es true", () => {
    const s = calcSalePrice(cost, { ...DEFAULT_PRICING, multiplier: 3 });
    expect(s.price).toBeCloseTo(2256); // 752 × 3
    expect(s.rounded).toBe(2300);
    expect(s.gain).toBeCloseTo(1504);
  });

  it("deja los extras a precio de costo cuando multiplyExtras es false", () => {
    const s = calcSalePrice(cost, { multiplier: 3, multiplyExtras: false, roundingStep: 100 });
    expect(s.price).toBeCloseTo((2608 / 4) * 3 + 100); // 2056
    expect(s.rounded).toBe(2100);
    expect(s.gain).toBeCloseTo(2056 - 752);
  });

  it("×1 no deja ganancia", () => {
    const s = calcSalePrice(cost, { ...DEFAULT_PRICING, multiplier: 1 });
    expect(s.gain).toBeCloseTo(0);
  });

  it("multiplicadores inválidos valen ×1 y acepta decimales", () => {
    expect(calcSalePrice(cost, { ...DEFAULT_PRICING, multiplier: 0 }).price).toBeCloseTo(752);
    expect(calcSalePrice(cost, { ...DEFAULT_PRICING, multiplier: Number.NaN }).price).toBeCloseTo(
      752,
    );
    expect(calcSalePrice(cost, { ...DEFAULT_PRICING, multiplier: 2.5 }).price).toBeCloseTo(1880);
  });

  it("respeta el paso de redondeo de otras monedas", () => {
    const s = calcSalePrice(cost, { multiplier: 3, multiplyExtras: true, roundingStep: 1 });
    expect(s.rounded).toBe(2256);
  });

  it("no divide por cero si llega un breakdown con pieces inválido", () => {
    const s = calcSalePrice({ ...cost, pieces: 0 }, { ...DEFAULT_PRICING, multiplyExtras: false });
    expect(Number.isFinite(s.price)).toBe(true);
  });
});
