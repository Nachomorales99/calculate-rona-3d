import { describe, expect, it } from "vitest";
import { addDays, formatDate } from "./date.js";
import { formatHours, formatQuoteNumber, joinList, toSafeFilename } from "./text.js";

describe("joinList", () => {
  it("une en castellano", () => {
    expect(joinList([])).toBe("");
    expect(joinList(["argolla"])).toBe("argolla");
    expect(joinList(["argolla", "cadena"])).toBe("argolla y cadena");
    expect(joinList(["a", "b", "c"])).toBe("a, b y c");
    expect(joinList(["a", "b"], "o")).toBe("a o b");
  });
});

describe("formatHours", () => {
  it("muestra horas y minutos", () => {
    expect(formatHours(9)).toBe("9 h");
    expect(formatHours(9.5)).toBe("9 h 30 min");
    expect(formatHours(0.999)).toBe("1 h");
    expect(formatHours(-3)).toBe("0 h");
    expect(formatHours(Number.NaN)).toBe("0 h");
  });
});

describe("formatQuoteNumber", () => {
  it("rellena con ceros y tolera basura", () => {
    expect(formatQuoteNumber(7)).toBe("N.º 0007");
    expect(formatQuoteNumber(12345)).toBe("N.º 12345");
    expect(formatQuoteNumber(0)).toBe("N.º 0001");
    expect(formatQuoteNumber(3.9, 3)).toBe("N.º 003");
  });
});

describe("toSafeFilename", () => {
  it("quita acentos y símbolos", () => {
    expect(toSafeFilename("Juan Pérez & Cía.")).toBe("Juan-Perez-Cia");
    expect(toSafeFilename("  Ñandú  ")).toBe("Nandu");
  });
});

describe("fechas", () => {
  it("formatea y suma días", () => {
    const d = new Date(2026, 9, 26);
    expect(formatDate(d)).toBe("26/10/2026");
    expect(formatDate(addDays(d, 7))).toBe("02/11/2026");
    expect(addDays(d, Number.NaN).getTime()).toBe(d.getTime());
    expect(d.getDate()).toBe(26);
  });
});
