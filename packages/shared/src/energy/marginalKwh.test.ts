import { describe, expect, it } from "vitest";
import { EDEMSA_PARAMS, bimonthlyPeriod, calcMarginalKwh } from "./marginalKwh.js";

describe("calcMarginalKwh", () => {
  it("reproduce la fórmula de Edemsa", () => {
    // P = 100 → 100 × 1,0309 × 1,315 + 1 = 136,56335
    const r = calcMarginalKwh(100);
    expect(r.adjusted).toBeCloseTo(103.09);
    expect(r.taxesPct).toBeCloseTo(31.5);
    expect(r.taxesAmount).toBeCloseTo(32.47335);
    expect(r.flatAmount).toBe(1);
    expect(r.kwhPrice).toBeCloseTo(136.56335);
  });

  it("acepta impuestos editables", () => {
    const r = calcMarginalKwh(200, {
      adjustmentFactor: 1,
      taxes: [{ key: "iva", label: "IVA", pct: 21 }],
      flatPct: 0,
    });
    expect(r.kwhPrice).toBeCloseTo(242);
  });

  it("sanea entradas inválidas", () => {
    expect(calcMarginalKwh(-5).kwhPrice).toBe(0);
    const r = calcMarginalKwh(100, { adjustmentFactor: 0, taxes: [], flatPct: Number.NaN });
    expect(r.kwhPrice).toBe(100);
    expect(EDEMSA_PARAMS.taxes).toHaveLength(3);
  });
});

describe("bimonthlyPeriod", () => {
  it("agrupa de a dos meses", () => {
    expect(bimonthlyPeriod(new Date(2026, 0, 15))).toBe("2026-01/02");
    expect(bimonthlyPeriod(new Date(2026, 1, 15))).toBe("2026-01/02");
    expect(bimonthlyPeriod(new Date(2026, 9, 26))).toBe("2026-09/10");
    expect(bimonthlyPeriod(new Date(2026, 11, 1))).toBe("2026-11/12");
  });
});
