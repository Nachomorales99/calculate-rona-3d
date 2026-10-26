import { describe, expect, it } from "vitest";
import { calcPrintCost, extrasPerPiece, totalHours, wearPerHour } from "./cost.js";
import { DEFAULT_COST_SETTINGS_ARS } from "./defaults.js";
import type { PrintInput } from "./types.js";

/** El caso de ejemplo del HTML original: 153 g de PLA, 9 h, 1 pieza. */
const baseInput: PrintInput = {
  grams: 153,
  hours: 9,
  minutes: 0,
  pieces: 1,
  filamentPricePerKg: 22000,
  extras: [],
};

describe("calcPrintCost", () => {
  it("reproduce los números de la calculadora HTML", () => {
    const c = calcPrintCost(baseInput, DEFAULT_COST_SETTINGS_ARS);
    expect(c.filament).toBeCloseTo(3366); // 0,153 × 22000
    expect(c.kwhUsed).toBeCloseTo(1.17); // 0,13 × 9
    expect(c.energy).toBeCloseTo(472.212); // 1,17 × 403,6
    expect(c.wearPerHour).toBeCloseTo(264); // 1.100.000 × 1,2 / 5000
    expect(c.wear).toBeCloseTo(2376);
    expect(c.failures).toBeCloseTo(191.9106); // 5 % de (3366 + 472,212)
    expect(c.base).toBeCloseTo(6406.1226);
    expect(c.extras).toBe(0);
    expect(c.total).toBeCloseTo(6406.1226);
    expect(c.perUnit).toBeCloseTo(6406.1226);
    expect(c.pieces).toBe(1);
    expect(c.totalHours).toBe(9);
  });

  it("reparte el costo entre las piezas y multiplica los extras por pieza", () => {
    const c = calcPrintCost(
      {
        ...baseInput,
        pieces: 10,
        extras: [
          { name: "Argolla", unitPrice: 50, qtyPerPiece: 1 },
          { name: "Cadena", unitPrice: 120, qtyPerPiece: 2 },
        ],
      },
      DEFAULT_COST_SETTINGS_ARS,
    );
    expect(c.extrasPerPiece).toBe(290);
    expect(c.extras).toBe(2900);
    expect(c.total).toBeCloseTo(6406.1226 + 2900);
    expect(c.perUnit).toBeCloseTo((6406.1226 + 2900) / 10);
  });

  it("suma los minutos al tiempo", () => {
    const c = calcPrintCost({ ...baseInput, hours: 1, minutes: 30 }, DEFAULT_COST_SETTINGS_ARS);
    expect(c.totalHours).toBe(1.5);
    expect(c.kwhUsed).toBeCloseTo(0.195);
  });

  it("sanea entradas inválidas sin romper", () => {
    const c = calcPrintCost(
      {
        grams: -10,
        hours: Number.NaN,
        minutes: -5,
        pieces: 0,
        filamentPricePerKg: Number.POSITIVE_INFINITY,
        extras: [{ name: "x", unitPrice: -1, qtyPerPiece: Number.NaN }],
      },
      { ...DEFAULT_COST_SETTINGS_ARS, printerLifeHours: 0 },
    );
    expect(c.total).toBe(0);
    expect(c.pieces).toBe(1);
    expect(c.wearPerHour).toBe(0);
    expect(Number.isFinite(c.perUnit)).toBe(true);
  });

  it("piezas decimales se redondean a entero", () => {
    expect(calcPrintCost({ ...baseInput, pieces: 2.6 }, DEFAULT_COST_SETTINGS_ARS).pieces).toBe(3);
  });
});

describe("helpers", () => {
  it("extrasPerPiece, totalHours y wearPerHour", () => {
    expect(extrasPerPiece([])).toBe(0);
    expect(extrasPerPiece([{ name: "a", unitPrice: 10, qtyPerPiece: 3 }])).toBe(30);
    expect(totalHours(2, 45)).toBe(2.75);
    expect(wearPerHour({ ...DEFAULT_COST_SETTINGS_ARS, repairsPct: 0 })).toBe(220);
  });
});
