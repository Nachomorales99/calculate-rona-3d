import { describe, expect, it } from "vitest";
import {
  costSettingsSchema,
  currencyCodeSchema,
  extraSchema,
  filamentTypeSchema,
  pricingOptionsSchema,
  printInputSchema,
  quoteOptionsSchema,
} from "./schemas.js";

describe("esquemas de la calculadora", () => {
  it("coercionan strings de inputs HTML", () => {
    const r = printInputSchema.parse({
      grams: "153",
      hours: "9",
      minutes: "0",
      pieces: "1",
      filamentPricePerKg: "22000",
      extras: [{ name: " Argolla ", unitPrice: "50", qtyPerPiece: "1" }],
    });
    expect(r.grams).toBe(153);
    expect(r.extras[0]?.name).toBe("Argolla");
  });

  it("rechazan valores fuera de rango", () => {
    expect(
      printInputSchema.safeParse({
        grams: -1,
        hours: 0,
        minutes: 0,
        pieces: 1,
        filamentPricePerKg: 0,
        extras: [],
      }).success,
    ).toBe(false);
    expect(
      printInputSchema.safeParse({
        grams: 1,
        hours: 0,
        minutes: 60,
        pieces: 1,
        filamentPricePerKg: 0,
        extras: [],
      }).success,
    ).toBe(false);
    expect(
      costSettingsSchema.safeParse({
        kwhPrice: 1,
        printerWatts: 1,
        printerPrice: 1,
        printerLifeHours: 0,
        repairsPct: 0,
        failuresPct: 0,
      }).success,
    ).toBe(false);
    expect(
      pricingOptionsSchema.safeParse({ multiplier: 0, multiplyExtras: true, roundingStep: 100 })
        .success,
    ).toBe(false);
    expect(extraSchema.safeParse({ name: "a", unitPrice: 1, qtyPerPiece: 1.5 }).success).toBe(
      false,
    );
  });

  it("validan enums y presupuesto", () => {
    expect(filamentTypeSchema.safeParse("PLA").success).toBe(true);
    expect(filamentTypeSchema.safeParse("Madera").success).toBe(false);
    expect(currencyCodeSchema.safeParse("ARS").success).toBe(true);
    expect(currencyCodeSchema.safeParse("XXX").success).toBe(false);
    expect(
      quoteOptionsSchema.safeParse({
        counter: 1,
        client: "",
        description: "",
        qty: 1,
        validDays: 7,
        notes: "",
        contact: "",
        useRounded: true,
        showIncludes: true,
        extras: [],
      }).success,
    ).toBe(true);
  });
});
