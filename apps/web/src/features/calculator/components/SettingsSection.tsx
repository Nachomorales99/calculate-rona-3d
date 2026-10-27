import { CURRENCIES, CURRENCY_CODES, formatMoney, getCurrency } from "@rona3d/shared";
import { Panel, Select } from "@/components/ui";
import { useCalculator } from "../calculator.store";
import { useCalcResult } from "../selectors";
import { NumberField } from "./NumberField";

export function SettingsSection() {
  const s = useCalculator();
  const { cost, currency } = useCalcResult();
  return (
    <Panel aria-labelledby="t-config" className="grid gap-4">
      <details className="group" open={false}>
        <summary className="flex cursor-pointer list-none items-center justify-between font-slab text-[1.2rem] [&::-webkit-details-marker]:hidden">
          <span id="t-config">Luz, impresora, fallas y moneda</span>
          <span className="font-sans text-2xl text-muted group-open:hidden">+</span>
          <span className="hidden font-sans text-2xl text-muted group-open:inline">−</span>
        </summary>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              id="kwhPrice"
              label="Costo del kWh"
              value={s.settings.kwhPrice}
              onChange={(v) => s.setSetting("kwhPrice", v)}
              prefix="$"
            />
            <NumberField
              id="printerWatts"
              label="Consumo promedio"
              value={s.settings.printerWatts}
              onChange={(v) => s.setSetting("printerWatts", v)}
              suffix="W"
            />
          </div>
          <p className="text-sm text-muted">
            El kWh es el costo marginal con impuestos de tu factura. Lo podés sacar de la sección
            “Luz desde la factura”. Los 130 W son el promedio estimado de una Creality SparkX i7 con
            PLA.
          </p>
          <h3 className="mt-2 border-t border-line pt-4 font-sans text-base font-bold">
            Desgaste de la impresora
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              id="printerPrice"
              label="Precio de la impresora"
              value={s.settings.printerPrice}
              onChange={(v) => s.setSetting("printerPrice", v)}
              prefix="$"
            />
            <NumberField
              id="printerLifeHours"
              label="Vida útil"
              value={s.settings.printerLifeHours}
              onChange={(v) => s.setSetting("printerLifeHours", v)}
              suffix="h"
            />
          </div>
          <NumberField
            id="repairsPct"
            label="Reparaciones y repuestos"
            value={s.settings.repairsPct}
            onChange={(v) => s.setSetting("repairsPct", v)}
            suffix="% del precio"
            hint={`Desgaste: ${formatMoney(cost.wearPerHour, currency)} por hora de impresión.`}
          />
          <h3 className="mt-2 border-t border-line pt-4 font-sans text-base font-bold">
            Impresiones fallidas
          </h3>
          <NumberField
            id="failuresPct"
            label="Margen por fallas"
            value={s.settings.failuresPct}
            onChange={(v) => s.setSetting("failuresPct", v)}
            suffix="% de filamento y luz"
          />
          <h3 className="mt-2 border-t border-line pt-4 font-sans text-base font-bold">Moneda</h3>
          <Select
            id="currency"
            label="Moneda de trabajo"
            value={s.currencyCode}
            onChange={(e) => s.set("currencyCode", e.target.value)}
          >
            {CURRENCY_CODES.map((c) => (
              <option key={c} value={c}>
                {c} · {CURRENCIES[c].name}
              </option>
            ))}
          </Select>
          <p className="text-sm text-muted">
            Todos los precios se cargan en {getCurrency(s.currencyCode).name.toLowerCase()}; no hay
            conversión. El precio de venta se redondea de a{" "}
            {formatMoney(getCurrency(s.currencyCode).roundingStep, getCurrency(s.currencyCode))}.
          </p>
          <button
            type="button"
            className="justify-self-start text-sm text-accent underline underline-offset-2"
            onClick={() => s.resetSettings()}
          >
            Volver a los valores iniciales
          </button>
        </div>
      </details>
    </Panel>
  );
}
