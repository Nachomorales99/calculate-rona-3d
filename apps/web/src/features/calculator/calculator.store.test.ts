import { beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY } from "./storage/CalculatorStorage";

async function freshStore() {
  // Cada test importa el módulo de cero para que lea localStorage limpio.
  vi.resetModules();
  const mod = await import("./calculator.store");
  return mod.useCalculator;
}

describe("calculator.store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("arranca con los defaults ARS y persiste cambios", async () => {
    const useCalculator = await freshStore();
    const st = useCalculator.getState();
    expect(st.grams).toBe(153);
    expect(st.currencyCode).toBe("ARS");
    expect(st.settings.kwhPrice).toBe(403.6);
    st.set("grams", 200);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).toContain('"grams":200');
    expect(raw).not.toContain("setSetting");
  });

  it("migra la configuración de la calculadora HTML vieja", async () => {
    window.localStorage.setItem(
      "calc3d-v2",
      JSON.stringify({
        kwh: 500,
        watts: 150,
        precios: { PLA: 25000, Madera: 1 },
        tipo: "PETG",
        mult: 2.5,
        extras: [{ name: "Argolla", price: 60, qty: 2 }],
        q: { contact: "@rona3darg", counter: 12 },
      }),
    );
    const useCalculator = await freshStore();
    const st = useCalculator.getState();
    expect(st.settings.kwhPrice).toBe(500);
    expect(st.settings.printerWatts).toBe(150);
    expect(st.filamentPrices.PLA).toBe(25000);
    expect(st.filamentType).toBe("PETG");
    expect(st.multiplier).toBe(2.5);
    expect(st.extras).toEqual([{ name: "Argolla", unitPrice: 60, qtyPerPiece: 2 }]);
    expect(st.quote.contact).toBe("@rona3darg");
    expect(st.quote.counter).toBe(12);
  });

  it("recuerda el precio de un extra por nombre", async () => {
    const useCalculator = await freshStore();
    const st = useCalculator.getState();
    st.addExtra("Cadena");
    st.updateExtra(0, { unitPrice: 120 });
    st.removeExtra(0);
    st.addExtra("cadena");
    expect(useCalculator.getState().extras[0]?.unitPrice).toBe(120);
  });

  it("aplica un kWh desde la factura y lo guarda en el historial sin duplicar período", async () => {
    const useCalculator = await freshStore();
    const st = useCalculator.getState();
    st.applyKwh({
      period: "2026-09/10",
      provider: "Edemsa",
      unitPrice: 100,
      kwhPrice: 136.56,
      source: "manual",
    });
    st.applyKwh({
      period: "2026-09/10",
      provider: "Edemsa",
      unitPrice: 110,
      kwhPrice: 150.2,
      source: "manual",
    });
    const after = useCalculator.getState();
    expect(after.settings.kwhPrice).toBe(150.2);
    expect(after.energyHistory).toHaveLength(1);
    expect(after.energyHistory[0]?.unitPrice).toBe(110);
  });
});
