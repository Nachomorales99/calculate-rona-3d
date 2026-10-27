import { formatHours, formatMoney, formatNumber, MULTIPLIER_PRESETS } from "@rona3d/shared";
import { useState } from "react";
import { Checkbox, Plate } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useCalculator } from "../calculator.store";
import type { CalcResult } from "../selectors";

function Line({ label, detail, value }: { label: string; detail?: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-plate-muted">
      <span>
        {label}
        {detail ? <small className="block text-xs">{detail}</small> : null}
      </span>
      <strong className="tabular font-semibold whitespace-nowrap text-plate-ink">{value}</strong>
    </div>
  );
}

export function ResultPlate({ result }: { result: CalcResult }) {
  const { cost, sale, currency } = result;
  const s = useCalculator();
  const money = (v: number) => formatMoney(v, currency);
  const num = (v: number) => formatNumber(v, currency);
  const isPreset = (MULTIPLIER_PRESETS as readonly number[]).includes(s.multiplier);
  const [custom, setCustom] = useState(isPreset ? "" : String(s.multiplier));
  const m = s.multiplier > 0 ? s.multiplier : 1;
  const per = cost.pieces > 1 ? " por pieza" : "";

  return (
    <Plate aria-live="polite" aria-labelledby="t-resultado" className="md:sticky md:top-20">
      <h2 id="t-resultado" className="sr-only">
        Resultado
      </h2>
      <div className="grid gap-2">
        <Line
          label="Filamento"
          detail={`${num(s.grams)} g de ${s.filamentType}`}
          value={money(cost.filament)}
        />
        <Line
          label="Luz"
          detail={`${num(cost.kwhUsed)} kWh en ${formatHours(cost.totalHours)}`}
          value={money(cost.energy)}
        />
        <Line
          label="Desgaste de la impresora"
          detail={`${money(cost.wearPerHour)} por hora`}
          value={money(cost.wear)}
        />
        <Line
          label="Fallas"
          detail={`${num(s.settings.failuresPct)} % de filamento y luz`}
          value={money(cost.failures)}
        />
        <Line
          label="Extras"
          detail={
            s.extras.length
              ? `${money(cost.extrasPerPiece)} por pieza${cost.pieces > 1 ? ` × ${cost.pieces}` : ""}`
              : "Ninguno"
          }
          value={money(cost.extras)}
        />
        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-plate-edge pt-3 font-bold text-plate-ink">
          <span>{cost.pieces > 1 ? `Costo total (${cost.pieces} piezas)` : "Costo total"}</span>
          <strong className="tabular text-[1.12rem]">{money(cost.total)}</strong>
        </div>
        {cost.pieces > 1 ? <Line label="Costo por pieza" value={money(cost.perUnit)} /> : null}
      </div>

      <p id="l-mult" className="mt-5 mb-2 text-plate-muted">
        Multiplicar el costo por
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="l-mult">
        {MULTIPLIER_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={s.multiplier === p}
            onClick={() => {
              s.set("multiplier", p);
              setCustom("");
            }}
            className={cn(
              "min-w-[3.3rem] rounded-pill border-[1.5px] px-3.5 py-1.5 font-slab text-[1.1rem] text-plate-ink transition-colors",
              s.multiplier === p
                ? "border-accent bg-accent text-accent-ink"
                : "border-plate-edge hover:border-plate-ink",
            )}
          >
            ×{p}
          </button>
        ))}
        <label
          className={cn(
            "flex items-center overflow-hidden rounded-pill border-[1.5px] pl-3.5",
            !isPreset
              ? "border-accent shadow-[inset_0_0_0_1px_var(--color-accent)]"
              : "border-plate-edge",
          )}
        >
          <span className="font-slab text-[1.1rem] text-plate-muted">×</span>
          <input
            id="customMultiplier"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder="otro"
            aria-label="Otro multiplicador"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              const v = e.target.valueAsNumber;
              if (Number.isFinite(v) && v > 0) s.set("multiplier", v);
            }}
            className="w-[4.3rem] bg-transparent py-1.5 pr-2.5 pl-1 font-slab text-[1.1rem] text-plate-ink outline-none placeholder:font-sans placeholder:text-base placeholder:text-plate-muted"
          />
        </label>
      </div>
      <div className="mt-3 text-plate-muted">
        <Checkbox
          id="multiplyExtras"
          label="Multiplicar también los extras"
          checked={s.multiplyExtras}
          onChange={(e) => s.set("multiplyExtras", e.target.checked)}
        />
      </div>

      <div className="mt-5">
        <p className="font-medium text-plate-muted">
          {m === 1 ? "Costo total (×1)" : `Precio de venta (×${num(m)})`}
          {per}
        </p>
        <p className="tabular my-1 font-slab text-[clamp(2.6rem,10vw,3.9rem)] leading-none [overflow-wrap:anywhere]">
          {money(sale.price)}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-plate-muted">
          <span>
            Ganancia{" "}
            <strong className="tabular font-bold text-plate-ink">{money(sale.gain)}</strong>
          </span>
          <span>
            Redondeado{" "}
            <strong className="tabular font-bold text-plate-ink">{money(sale.rounded)}</strong>
          </span>
        </div>
      </div>
    </Plate>
  );
}
