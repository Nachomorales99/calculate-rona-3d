import { FILAMENT_TYPES, formatMoney, getCurrency } from "@rona3d/shared";
import { Panel, Select } from "@/components/ui";
import { useCalculator } from "../calculator.store";
import { NumberField } from "./NumberField";

export function PrintSection() {
  const s = useCalculator();
  const currency = getCurrency(s.currencyCode);
  return (
    <>
      <Panel aria-labelledby="t-impresion" className="grid gap-4">
        <h2 id="t-impresion" className="text-[1.2rem]">
          La impresión
        </h2>
        <NumberField
          id="grams"
          label="Filamento usado"
          value={s.grams}
          onChange={(v) => s.set("grams", v)}
          suffix="g"
        />
        <div className="grid gap-1.5">
          <span className="text-sm font-semibold" id="l-tiempo">
            Tiempo de impresión
          </span>
          <div className="grid grid-cols-2 gap-3" role="group" aria-labelledby="l-tiempo">
            <NumberField
              id="hours"
              label={<span className="sr-only">Horas</span>}
              value={s.hours}
              onChange={(v) => s.set("hours", v)}
              suffix="h"
              integer
            />
            <NumberField
              id="minutes"
              label={<span className="sr-only">Minutos</span>}
              value={s.minutes}
              onChange={(v) => s.set("minutes", Math.min(59, v))}
              suffix="min"
              integer
              max={59}
            />
          </div>
        </div>
        <NumberField
          id="pieces"
          label="Piezas en esta impresión"
          value={s.pieces}
          onChange={(v) => s.set("pieces", Math.max(1, Math.round(v)))}
          suffix="u."
          integer
          min={1}
          hint="Si imprimís 10 llaveros en una misma cama, poné 10 y el costo se reparte entre todos."
        />
      </Panel>

      <Panel aria-labelledby="t-filamento" className="grid gap-4">
        <h2 id="t-filamento" className="text-[1.2rem]">
          Filamento
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="filamentType"
            label="Tipo"
            value={s.filamentType}
            onChange={(e) => s.setFilamentType(e.target.value as typeof s.filamentType)}
          >
            {FILAMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <NumberField
            id="pricePerKg"
            label="Precio por kg"
            value={s.filamentPrices[s.filamentType]}
            onChange={(v) => s.setFilamentPrice(v)}
            prefix={currency.code === "ARS" ? "$" : currency.code}
            hint={`Hoy: ${formatMoney(s.filamentPrices[s.filamentType], currency)} el kilo de ${s.filamentType}. Queda guardado.`}
          />
        </div>
      </Panel>
    </>
  );
}
