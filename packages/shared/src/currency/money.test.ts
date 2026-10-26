import { describe, expect, it } from "vitest";
import { CURRENCIES, getCurrency, isCurrencyCode } from "./currencies.js";
import { formatMoney, formatNumber, roundToCurrency, roundUpTo } from "./money.js";

describe("roundUpTo", () => {
  it("redondea hacia arriba al múltiplo del paso", () => {
    expect(roundUpTo(1234, 100)).toBe(1300);
    expect(roundUpTo(1201, 100)).toBe(1300);
    expect(roundUpTo(12.01, 1)).toBe(13);
  });
  it("no sube cuando ya es múltiplo exacto (ni por error de punto flotante)", () => {
    expect(roundUpTo(1200, 100)).toBe(1200);
    expect(roundUpTo(0.1 + 0.2, 0.1)).toBeCloseTo(0.3);
    expect(roundUpTo(300.0000000001, 100)).toBe(300);
  });
  it("tolera pasos inválidos y valores no finitos", () => {
    expect(roundUpTo(1234, 0)).toBe(1234);
    expect(roundUpTo(1234, -5)).toBe(1234);
    expect(roundUpTo(Number.NaN, 100)).toBe(0);
    expect(roundUpTo(Number.POSITIVE_INFINITY, 100)).toBe(0);
  });
});

describe("roundToCurrency", () => {
  it("usa los decimales de la moneda", () => {
    expect(roundToCurrency(1234.56, CURRENCIES.ARS)).toBe(1235);
    expect(roundToCurrency(1234.567, CURRENCIES.USD)).toBe(1234.57);
    expect(roundToCurrency(Number.NaN)).toBe(0);
  });
});

describe("formatMoney", () => {
  it("formatea ARS sin decimales y USD con dos", () => {
    expect(formatMoney(1234.5, CURRENCIES.ARS)).toMatch(/1\.235/);
    expect(formatMoney(1234.5, CURRENCIES.USD)).toBe("$1,234.50");
  });
  it("usa ARS por defecto y tolera NaN", () => {
    expect(formatMoney(100)).toMatch(/100/);
    expect(formatMoney(Number.NaN)).toMatch(/0/);
  });
  it("formatNumber respeta el locale", () => {
    expect(formatNumber(1234.567, CURRENCIES.ARS)).toBe("1.234,57");
    expect(formatNumber(1234.567, CURRENCIES.USD, 1)).toBe("1,234.6");
    expect(formatNumber(Number.NaN)).toBe("0");
  });
});

describe("catálogo de monedas", () => {
  it("resuelve códigos válidos y cae en ARS si no existe", () => {
    expect(isCurrencyCode("USD")).toBe(true);
    expect(isCurrencyCode("XXX")).toBe(false);
    expect(isCurrencyCode(42)).toBe(false);
    expect(getCurrency("EUR").code).toBe("EUR");
    expect(getCurrency("nope").code).toBe("ARS");
    expect(getCurrency(undefined).code).toBe("ARS");
  });
});
