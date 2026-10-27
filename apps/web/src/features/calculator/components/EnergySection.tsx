import {
  bimonthlyPeriod,
  calcMarginalKwh,
  formatMoney,
  formatNumber,
  getCurrency,
} from "@rona3d/shared";
import { useState } from "react";
import { Button, Input, Panel } from "@/components/ui";
import { formatShortDate } from "@/lib/dates";
import { useCalculator } from "../calculator.store";
import { NumberField } from "./NumberField";

/**
 * "Actualizar luz desde la factura": cargás el precio unitario del cargo variable
 * y sale el kWh marginal con impuestos. Los impuestos son editables; el historial queda por período.
 */
export function EnergySection() {
  const s = useCalculator();
  const currency = getCurrency(s.currencyCode);
  const [unitPrice, setUnitPrice] = useState(0);
  const [period, setPeriod] = useState(() => bimonthlyPeriod(new Date()));
  const [provider, setProvider] = useState(s.energyProvider);
  const [showTaxes, setShowTaxes] = useState(false);
  const r = calcMarginalKwh(unitPrice, s.energyParams);
  const num = (v: number, d = 2) => formatNumber(v, currency, d);

  return (
    <Panel aria-labelledby="t-luz" className="grid gap-4">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between font-slab text-[1.2rem] [&::-webkit-details-marker]:hidden">
          <span id="t-luz">Actualizar luz desde la factura</span>
          <span className="font-sans text-2xl text-muted group-open:hidden">+</span>
          <span className="hidden font-sans text-2xl text-muted group-open:inline">−</span>
        </summary>
        <div className="mt-4 grid gap-4">
          <p className="text-sm text-muted">
            Buscá en la factura el <b className="text-ink">precio unitario del cargo variable</b>{" "}
            (lo que cobra la distribuidora por cada kWh antes de impuestos) y cargalo acá. Te
            devolvemos lo que cuesta de verdad un kWh más.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <NumberField
              id="energyUnitPrice"
              label="P. unitario del cargo variable"
              value={unitPrice}
              onChange={setUnitPrice}
              prefix="$"
              suffix="/ kWh"
            />
            <Input
              id="energyProvider"
              label="Distribuidora"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Edemsa"
            />
            <Input
              id="energyPeriod"
              label="Período"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              hint="Bimestral, como lo imprime la factura."
            />
          </div>

          <button
            type="button"
            className="justify-self-start text-sm text-accent underline underline-offset-2"
            onClick={() => setShowTaxes((v) => !v)}
          >
            {showTaxes ? "Ocultar impuestos" : "Ver o editar los impuestos"}
          </button>
          {showTaxes ? (
            <div className="grid gap-3 rounded-sm border border-line bg-paper p-3 sm:grid-cols-2">
              <NumberField
                id="energyFactor"
                label="Factor de ajuste de la distribuidora"
                value={s.energyParams.adjustmentFactor}
                onChange={(v) => s.setEnergyParams({ ...s.energyParams, adjustmentFactor: v })}
                hint="Edemsa aplica 1,0309 sobre el precio unitario."
              />
              <NumberField
                id="energyFlat"
                label="Cargo sobre P sin factor"
                value={s.energyParams.flatPct}
                onChange={(v) => s.setEnergyParams({ ...s.energyParams, flatPct: v })}
                suffix="%"
              />
              {s.energyParams.taxes.map((t, i) => (
                <NumberField
                  key={t.key}
                  id={`energyTax-${t.key}`}
                  label={t.label}
                  value={t.pct}
                  onChange={(v) =>
                    s.setEnergyParams({
                      ...s.energyParams,
                      taxes: s.energyParams.taxes.map((x, j) => (j === i ? { ...x, pct: v } : x)),
                    })
                  }
                  suffix="%"
                />
              ))}
            </div>
          ) : null}

          <div className="layers grid gap-1 rounded-sm border border-plate-edge bg-plate p-4 text-sm text-plate-muted">
            <p>
              {num(r.unitPrice, 4)} × {num(s.energyParams.adjustmentFactor, 4)} × (1 +{" "}
              {num(r.taxesPct / 100, 3)}) + {num(r.unitPrice, 4)} ×{" "}
              {num(s.energyParams.flatPct / 100, 3)}
            </p>
            <p className="mt-1 text-plate-ink">
              kWh marginal:{" "}
              <b className="tabular font-slab text-[1.4rem] font-normal">
                {formatMoney(r.kwhPrice, currency)}
              </b>
            </p>
            <p>Hoy la calculadora usa {formatMoney(s.settings.kwhPrice, currency)} por kWh.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="justify-self-start"
            disabled={r.kwhPrice <= 0}
            onClick={() => {
              s.applyKwh({
                period,
                provider: provider.trim() || "Distribuidora",
                unitPrice,
                kwhPrice: r.kwhPrice,
                source: "manual",
              });
            }}
          >
            Usar este valor en la calculadora
          </Button>

          {s.energyHistory.length > 0 ? (
            <div>
              <h3 className="mt-2 mb-2 border-t border-line pt-4 font-sans text-base font-bold">
                Historial
              </h3>
              <ul className="grid gap-1 text-sm">
                {s.energyHistory.map((h) => (
                  <li
                    key={h.period + h.createdAt}
                    className="grid grid-cols-[1fr_auto] gap-2 border-b border-line py-1.5 sm:grid-cols-[6rem_1fr_auto_auto]"
                  >
                    <span className="tabular text-muted">{h.period}</span>
                    <span>{h.provider}</span>
                    <span className="tabular text-muted">P {num(h.unitPrice, 4)}</span>
                    <span className="tabular font-semibold">
                      {formatMoney(h.kwhPrice, currency)} / kWh
                    </span>
                    <span className="sr-only">
                      cargado el {formatShortDate(h.createdAt.slice(0, 10))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </details>
    </Panel>
  );
}
