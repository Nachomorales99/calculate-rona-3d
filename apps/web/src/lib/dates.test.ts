import { describe, expect, it } from "vitest";
import { formatShortDate } from "./dates";

describe("formatShortDate", () => {
  it("abrevia el mes en castellano", () => {
    expect(formatShortDate("2026-10-27")).toBe("27 oct 2026");
    expect(formatShortDate("2026-01-03")).toBe("03 ene 2026");
  });
  it("devuelve el texto si no es una fecha", () => {
    expect(formatShortDate("hoy")).toBe("hoy");
    expect(formatShortDate("2026-13-01")).toBe("2026-13-01");
  });
});
